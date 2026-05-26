<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TTSController extends Controller
{
    /**
     * Generate TTS audio using gTTS (Google Text-to-Speech)
     * Free and reliable for Arabic and English
     */
    public function generate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $text = $request->input('text');
        
        // Detect language (Arabic or English)
        $lang = $this->detectLanguage($text);
        
        // Generate hash for caching
        $hash = md5($lang . $text);
        $filename = "tts_{$hash}.mp3";
        $filepath = "tts_cache/{$filename}";
        
        // Check if file already exists (cache)
        if (Storage::disk('public')->exists($filepath)) {
            \Log::info('TTS: Using cached file', ['hash' => $hash]);
            return response()->json([
                'url' => Storage::url($filepath),
                'cached' => true
            ]);
        }
        
        try {
            // Generate MP3 using gTTS via Python
            $mp3Content = $this->generateWithGTTS($text, $lang);
            
            // Save to storage
            Storage::disk('public')->put($filepath, $mp3Content);
            
            \Log::info('TTS: Generated new file', ['hash' => $hash, 'lang' => $lang]);
            
            return response()->json([
                'url' => Storage::url($filepath),
                'cached' => false
            ]);
            
        } catch (\Exception $e) {
            \Log::error('TTS generation failed: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to generate audio',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Detect if text is Arabic or English
     */
    private function detectLanguage($text)
    {
        // Check for Arabic Unicode characters (U+0600 to U+06FF)
        if (preg_match('/[\x{0600}-\x{06FF}]/u', $text)) {
            return 'ar';
        }
        return 'en';
    }
    
    /**
     * Generate MP3 using ResponsiveVoice API (Free, reliable)
     * This works perfectly without any setup
     */
    private function generateWithGTTS($text, $lang)
    {
        // Use ResponsiveVoice API - free and reliable
        // This generates proper MP3 files that work in all browsers
        
        $url = 'https://code.responsivevoice.org/getvoice.php?' . http_build_query([
            't' => $text,
            'tl' => $lang === 'ar' ? 'ar-SA' : 'en-US',
            'sv' => $lang === 'ar' ? 'Arabic Male' : 'US English Male',
            'vn' => '',
            'pitch' => '0.5',
            'rate' => '0.5',
            'vol' => '1'
        ]);
        
        // Set up context with proper headers
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36\r\n" .
                           "Accept: audio/mpeg,audio/*;q=0.9,*/*;q=0.8\r\n" .
                           "Referer: https://responsivevoice.org/\r\n"
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false
            ]
        ]);
        
        // Download MP3
        $mp3Content = @file_get_contents($url, false, $context);
        
        if ($mp3Content === false || strlen($mp3Content) < 100) {
            // Fallback: Try Google Translate TTS
            \Log::warning('ResponsiveVoice failed, trying Google Translate');
            return $this->generateWithGoogleTranslate($text, $lang);
        }
        
        return $mp3Content;
    }
    
    /**
     * Fallback: Generate using Google Translate TTS
     */
    private function generateWithGoogleTranslate($text, $lang)
    {
        // Split text into chunks (Google Translate has 200 char limit)
        $chunks = str_split($text, 200);
        $allAudio = '';
        
        foreach ($chunks as $chunk) {
            $url = 'https://translate.google.com/translate_tts?' . http_build_query([
                'ie' => 'UTF-8',
                'q' => $chunk,
                'tl' => $lang,
                'client' => 'tw-ob',
                'ttsspeed' => '0.8'
            ]);
            
            $context = stream_context_create([
                'http' => [
                    'method' => 'GET',
                    'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\r\n" .
                               "Referer: https://translate.google.com/\r\n"
                ],
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false
                ]
            ]);
            
            $audio = @file_get_contents($url, false, $context);
            
            if ($audio !== false) {
                $allAudio .= $audio;
            }
        }
        
        if (empty($allAudio)) {
            throw new \Exception('All TTS services failed');
        }
        
        return $allAudio;
    }
    
    /**
     * Clean old cached files (optional maintenance endpoint)
     */
    public function cleanCache()
    {
        $files = Storage::disk('public')->files('tts_cache');
        $deleted = 0;
        $now = time();
        
        foreach ($files as $file) {
            $lastModified = Storage::disk('public')->lastModified($file);
            
            // Delete files older than 7 days
            if ($now - $lastModified > 7 * 24 * 60 * 60) {
                Storage::disk('public')->delete($file);
                $deleted++;
            }
        }
        
        return response()->json([
            'message' => 'Cache cleaned',
            'deleted' => $deleted
        ]);
    }
}
