/**
 * Web Speech API Wrapper (Fallback for AssemblyAI)
 * Works offline and supports Arabic/English
 */

export class SpeechRecognizer {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onResult = null;
    this.onError = null;
    this.onStart = null;
    this.onEnd = null;
  }

  isSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  init(language = 'en') {
    if (!this.isSupported()) {
      throw new Error('Speech recognition not supported in this browser');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    this.recognition.maxAlternatives = 3;

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('🎤 Speech recognition started:', this.recognition.lang);
      if (this.onStart) this.onStart();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;

      console.log('🎯 Recognized:', transcript, 'Confidence:', confidence);

      if (this.onResult) {
        this.onResult({
          transcript,
          confidence,
          language: language
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('❌ Speech recognition error:', event.error);
      this.isListening = false;

      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('⏹️ Speech recognition ended');
      if (this.onEnd) this.onEnd();
    };

    return this;
  }

  start(language = 'en') {
    if (!this.recognition) {
      this.init(language);
    }

    // Update language if changed
    const newLang = language === 'ar' ? 'ar-SA' : 'en-US';
    if (this.recognition.lang !== newLang) {
      this.recognition.lang = newLang;
      console.log('🌍 Language changed to:', newLang);
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('❌ Failed to start recognition:', error);
      return false;
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        return true;
      } catch (error) {
        console.error('❌ Failed to stop recognition:', error);
        return false;
      }
    }
    return false;
  }

  abort() {
    if (this.recognition) {
      try {
        this.recognition.abort();
        this.isListening = false;
      } catch (error) {
        console.error('❌ Failed to abort recognition:', error);
      }
    }
  }

  cleanup() {
    this.abort();
    this.recognition = null;
    this.onResult = null;
    this.onError = null;
    this.onStart = null;
    this.onEnd = null;
    console.log('🧹 Speech recognizer cleaned up');
  }
}

/**
 * Simple function to recognize speech
 */
export const recognizeSpeech = (language = 'en') => {
  return new Promise((resolve, reject) => {
    const recognizer = new SpeechRecognizer();

    if (!recognizer.isSupported()) {
      reject(new Error('Speech recognition not supported'));
      return;
    }

    recognizer.onResult = (result) => {
      recognizer.cleanup();
      resolve(result);
    };

    recognizer.onError = (error) => {
      recognizer.cleanup();
      reject(new Error(error));
    };

    recognizer.init(language);
    recognizer.start(language);

    // Timeout after 30 seconds
    setTimeout(() => {
      if (recognizer.isListening) {
        recognizer.cleanup();
        reject(new Error('Recognition timeout'));
      }
    }, 30000);
  });
};
