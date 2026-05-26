/**
 * Voice Transcription using AssemblyAI
 * Converts audio to text with support for Arabic and English
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Record audio from microphone
 * @param {number} maxDuration - Maximum recording duration in seconds
 * @returns {Promise<Blob>} Audio blob
 */
export const recordAudio = (maxDuration = 60) => {
  return new Promise((resolve, reject) => {
    let mediaRecorder;
    let audioChunks = [];
    let timeoutId;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop());
          clearTimeout(timeoutId);
          resolve(audioBlob);
        };

        mediaRecorder.onerror = (error) => {
          stream.getTracks().forEach(track => track.stop());
          clearTimeout(timeoutId);
          reject(error);
        };

        // Start recording
        mediaRecorder.start();

        // Auto-stop after maxDuration
        timeoutId = setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, maxDuration * 1000);

        // Return control object
        resolve({
          stop: () => {
            if (mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
            }
          },
          isRecording: () => mediaRecorder.state === 'recording'
        });
      })
      .catch(reject);
  });
};

/**
 * Transcribe audio file using AssemblyAI via backend
 * @param {Blob|File} audioBlob - Audio file to transcribe
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {Promise<Object>} Transcription result
 */
export const transcribeAudio = async (audioBlob, language = 'en') => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', language);

    console.log('🎤 Sending audio to backend for transcription...');
    console.log('📊 Audio size:', (audioBlob.size / 1024).toFixed(2), 'KB');
    console.log('🌍 Language:', language);

    const response = await fetch(`${API_BASE_URL}/voice/transcribe`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Transcription failed');
    }

    const result = await response.json();
    
    console.log('✅ Transcription successful!');
    console.log('📝 Text:', result.transcript);
    console.log('🎯 Confidence:', result.confidence);

    return result;
  } catch (error) {
    console.error('❌ Transcription error:', error);
    throw error;
  }
};

/**
 * Transcribe audio from URL
 * @param {string} audioUrl - URL of audio file
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {Promise<Object>} Transcription result
 */
export const transcribeFromUrl = async (audioUrl, language = 'en') => {
  try {
    console.log('🌐 Transcribing from URL:', audioUrl);

    const response = await fetch(`${API_BASE_URL}/voice/transcribe-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        language: language
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Transcription failed');
    }

    const result = await response.json();
    
    console.log('✅ Transcription successful!');
    console.log('📝 Text:', result.transcript);

    return result;
  } catch (error) {
    console.error('❌ Transcription error:', error);
    throw error;
  }
};

/**
 * Enhanced audio recorder with real-time feedback
 */
export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.isRecording = false;
  }

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder not supported in this browser');
      }

      // Try different mime types based on browser support
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.warn('⚠️ audio/webm;codecs=opus not supported, trying alternatives...');
        
        const alternatives = [
          'audio/webm',
          'audio/ogg;codecs=opus',
          'audio/mp4',
          'audio/mpeg'
        ];
        
        for (const type of alternatives) {
          if (MediaRecorder.isTypeSupported(type)) {
            mimeType = type;
            console.log('✅ Using mime type:', mimeType);
            break;
          }
        }
      }

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: mimeType
      });
      
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('❌ MediaRecorder error:', event.error);
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      this.isRecording = true;

      console.log('🎤 Recording started');
      return true;
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      this.cleanup();
      throw error;
    }
  }

  async stop() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('Not recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        try {
          if (this.audioChunks.length === 0) {
            reject(new Error('No audio data recorded'));
            return;
          }

          // Use the same mime type as the recorder
          const mimeType = this.mediaRecorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });
          
          if (audioBlob.size === 0) {
            reject(new Error('Audio blob is empty'));
            return;
          }

          console.log('⏹️ Recording stopped, size:', (audioBlob.size / 1024).toFixed(2), 'KB');
          
          // Don't cleanup yet, let the caller handle it
          const blob = audioBlob;
          this.audioChunks = [];
          
          resolve(blob);
        } catch (error) {
          console.error('❌ Error creating audio blob:', error);
          reject(error);
        }
      };

      try {
        this.mediaRecorder.stop();
        this.isRecording = false;
      } catch (error) {
        console.error('❌ Error stopping recorder:', error);
        reject(error);
      }
    });
  }

  cleanup() {
    try {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    } catch (e) {
      // Ignore errors when stopping
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          // Ignore errors
        }
      });
      this.stream = null;
    }
    
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    
    console.log('🧹 Recorder cleaned up');
  }

  cancel() {
    this.cleanup();
    this.isRecording = false;
    console.log('❌ Recording cancelled');
  }
}

/**
 * Test AssemblyAI transcription with a sample
 */
export const testTranscription = async () => {
  try {
    console.log('🧪 Testing AssemblyAI transcription...');
    
    // Test with AssemblyAI's sample audio
    const result = await transcribeFromUrl(
      'https://assembly.ai/wildfires.mp3',
      'en'
    );

    console.log('✅ Test successful!');
    console.log('📝 Sample transcription:', result.transcript.substring(0, 100) + '...');
    
    return result;
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
};
