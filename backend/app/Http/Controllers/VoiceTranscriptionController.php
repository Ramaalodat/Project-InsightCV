<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class VoiceTranscriptionController extends Controller
{
    private $apiKey;
    private $transcriptEndpoint = 'https://api.assemblyai.com/v2/transcript';

    public function __construct()
    {
        $this->apiKey = env('ASSEMBLYAI_API_KEY', 'bc6d773b24f34363a4ed60cdd90448d5');
    }

    /**
     * Upload audio file and get transcription
     */
    public function transcribeAudio(Request $request)
    {
        try {
            $request->validate([
                'audio' => 'required|file|mimes:mp3,wav,m4a,webm,ogg|max:10240', // 10MB max
                'language' => 'nullable|string|in:en,ar'
            ]);

            $audioFile = $request->file('audio');
            $language = $request->input('language', 'en');

            Log::info('Starting transcription', [
                'filename' => $audioFile->getClientOriginalName(),
                'size' => $audioFile->getSize(),
                'language' => $language
            ]);

            // Save audio file temporarily
            $path = $audioFile->store('temp_audio', 'local');
            $fullPath = storage_path('app/' . $path);

            // Upload to AssemblyAI
            $uploadUrl = $this->uploadFile($fullPath);
            
            if (!$uploadUrl) {
                throw new \Exception('Failed to upload audio file');
            }

            // Request transcription
            $transcriptId = $this->requestTranscription($uploadUrl, $language);
            
            if (!$transcriptId) {
                throw new \Exception('Failed to request transcription');
            }

            // Poll for completion
            $result = $this->pollTranscription($transcriptId);

            // Clean up temp file
            Storage::disk('local')->delete($path);

            return response()->json([
                'success' => true,
                'transcript' => $result['text'],
                'confidence' => $result['confidence'] ?? null,
                'language' => $language
            ]);

        } catch (\Exception $e) {
            Log::error('Transcription error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Transcribe from URL
     */
    public function transcribeFromUrl(Request $request)
    {
        try {
            $request->validate([
                'audio_url' => 'required|url',
                'language' => 'nullable|string|in:en,ar'
            ]);

            $audioUrl = $request->input('audio_url');
            $language = $request->input('language', 'en');

            Log::info('Transcribing from URL', ['url' => $audioUrl, 'language' => $language]);

            // Request transcription
            $transcriptId = $this->requestTranscription($audioUrl, $language);
            
            if (!$transcriptId) {
                throw new \Exception('Failed to request transcription');
            }

            // Poll for completion
            $result = $this->pollTranscription($transcriptId);

            return response()->json([
                'success' => true,
                'transcript' => $result['text'],
                'confidence' => $result['confidence'] ?? null,
                'language' => $language
            ]);

        } catch (\Exception $e) {
            Log::error('Transcription error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload file to AssemblyAI
     */
    private function uploadFile($filePath)
    {
        try {
            if (!file_exists($filePath)) {
                Log::error('File not found: ' . $filePath);
                return null;
            }

            $fileData = file_get_contents($filePath);
            
            if ($fileData === false || empty($fileData)) {
                Log::error('Failed to read file or file is empty');
                return null;
            }

            Log::info('Uploading file to AssemblyAI', [
                'size' => strlen($fileData),
                'path' => $filePath
            ]);

            $ch = curl_init('https://api.assemblyai.com/v2/upload');
            
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $fileData,
                CURLOPT_HTTPHEADER => [
                    'authorization: ' . $this->apiKey,
                    'content-type: application/octet-stream',
                    'transfer-encoding: chunked'
                ],
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 60,
                CURLOPT_CONNECTTIMEOUT => 30
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);

            if ($curlError) {
                Log::error('cURL error: ' . $curlError);
                return null;
            }

            if ($httpCode !== 200) {
                Log::error('Upload failed', [
                    'code' => $httpCode, 
                    'response' => $response
                ]);
                return null;
            }

            $data = json_decode($response, true);
            
            if (!isset($data['upload_url'])) {
                Log::error('No upload_url in response', ['response' => $response]);
                return null;
            }

            Log::info('File uploaded successfully', ['url' => $data['upload_url']]);
            return $data['upload_url'];

        } catch (\Exception $e) {
            Log::error('Upload exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Request transcription from AssemblyAI
     */
    private function requestTranscription($audioUrl, $language = 'en')
    {
        try {
            $data = [
                'audio_url' => $audioUrl,
                'language_code' => $language === 'ar' ? 'ar' : 'en'
            ];

            $ch = curl_init($this->transcriptEndpoint);
            
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($data),
                CURLOPT_HTTPHEADER => [
                    'authorization: ' . $this->apiKey,
                    'content-type: application/json'
                ],
                CURLOPT_RETURNTRANSFER => true
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode !== 200) {
                Log::error('Transcription request failed', ['code' => $httpCode, 'response' => $response]);
                return null;
            }

            $data = json_decode($response, true);
            return $data['id'] ?? null;

        } catch (\Exception $e) {
            Log::error('Transcription request exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Poll for transcription completion
     */
    private function pollTranscription($transcriptId, $maxAttempts = 60)
    {
        $pollingEndpoint = $this->transcriptEndpoint . '/' . $transcriptId;
        $attempts = 0;

        while ($attempts < $maxAttempts) {
            try {
                $ch = curl_init($pollingEndpoint);
                
                curl_setopt_array($ch, [
                    CURLOPT_HTTPHEADER => [
                        'authorization: ' . $this->apiKey
                    ],
                    CURLOPT_RETURNTRANSFER => true
                ]);

                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                if ($httpCode !== 200) {
                    throw new \Exception('Polling failed with code: ' . $httpCode);
                }

                $result = json_decode($response, true);

                if ($result['status'] === 'completed') {
                    Log::info('Transcription completed', ['id' => $transcriptId]);
                    return $result;
                } elseif ($result['status'] === 'error') {
                    throw new \Exception('Transcription failed: ' . ($result['error'] ?? 'Unknown error'));
                }

                // Wait 3 seconds before next poll
                sleep(3);
                $attempts++;

            } catch (\Exception $e) {
                Log::error('Polling exception: ' . $e->getMessage());
                throw $e;
            }
        }

        throw new \Exception('Transcription timeout after ' . ($maxAttempts * 3) . ' seconds');
    }
}
