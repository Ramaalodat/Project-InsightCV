// Simple Browser-Based Text-to-Speech
// Uses browser's built-in voices with automatic language detection
// Works 100% offline, no server needed

// Detect if text contains Arabic characters
const isArabicText = (text) => {
  return /[\u0600-\u06FF]/.test(text);
};

// Main speak function with automatic language detection
export const speak = (text, onStart, onEnd, onError) => {
  if (!('speechSynthesis' in window)) {
    console.error('❌ Speech Synthesis not supported');
    if (onError) onError(new Error('Speech Synthesis not supported'));
    return;
  }

  const language = isArabicText(text) ? 'ar' : 'en';
  console.log(`🔊 Auto-detected language: ${language === 'ar' ? 'Arabic' : 'English'}`);

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Wait a bit for cancel to complete
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Function to setup and speak
    const setupAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      
      console.log('🔊 Total voices available:', voices.length);
      
      if (language === 'ar') {
        // Find Arabic voices
        const arabicVoices = voices.filter(v => 
          v.lang.startsWith('ar') || 
          v.name.toLowerCase().includes('arabic') ||
          v.name.includes('عربي')
        );

        console.log('🇸🇦 Arabic voices found:', arabicVoices.length);
        
        if (arabicVoices.length > 0) {
          arabicVoices.forEach((v, i) => {
            console.log(`  ${i + 1}. ${v.name} (${v.lang})`);
          });

          // Priority: Microsoft > Google > Any
          let selectedVoice = arabicVoices.find(v => v.name.includes('Microsoft'));
          if (!selectedVoice) selectedVoice = arabicVoices.find(v => v.name.includes('Google'));
          if (!selectedVoice) selectedVoice = arabicVoices[0];

          utterance.voice = selectedVoice;
          console.log('✅ Selected Arabic voice:', selectedVoice.name);
        } else {
          console.warn('⚠️ No Arabic voice found!');
          console.log('💡 Install Arabic language pack in Windows Settings for Arabic voice');
          console.log('📋 For now, will use default voice with Arabic lang code');
        }
      } else {
        // Find English voice
        const englishVoice = voices.find(v => 
          v.lang.startsWith('en') && 
          (v.name.includes('Microsoft') || v.name.includes('Google'))
        );
        
        if (englishVoice) {
          utterance.voice = englishVoice;
          console.log('✅ Selected English voice:', englishVoice.name);
        }
      }

      // Event handlers
      utterance.onstart = () => {
        console.log('🔊 Speaking:', text.substring(0, 50) + '...');
        if (onStart) onStart();
      };

      utterance.onerror = (event) => {
        console.error('❌ Speech error:', event.error);
        if (onError) onError(event);
      };

      utterance.onend = () => {
        console.log('✅ Speech ended');
        if (onEnd) onEnd();
      };

      // Speak
      console.log('▶️ Starting speech...');
      window.speechSynthesis.speak(utterance);
    };

    // Check if voices are loaded
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length === 0) {
      console.log('⏳ Waiting for voices to load...');
      window.speechSynthesis.onvoiceschanged = () => {
        console.log('✅ Voices loaded!');
        setupAndSpeak();
      };
    } else {
      setupAndSpeak();
    }
  }, 100);
};

// Legacy function - now uses unified speak()
export const speakArabic = (text, onStart, onEnd, onError) => {
  speak(text, onStart, onEnd, onError);
};

// Legacy function - now uses unified speak()
export const speakEnglish = (text, onStart, onEnd, onError) => {
  speak(text, onStart, onEnd, onError);
};

// Test function
export const testArabicVoice = () => {
  console.log('🧪 Testing Arabic voice...');
  speakArabic(
    'مرحباً، هذا اختبار للصوت العربي. أنا أتحدث العربية بوضوح.',
    () => console.log('✅ Test started'),
    () => console.log('✅ Test completed'),
    (error) => console.error('❌ Test failed:', error)
  );
};
