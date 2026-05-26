# Implementation Plan: Arabic Voice TTS

## Tasks

- [x] 1. Setup Google Cloud TTS


  - Add API key to `.env` file
  - Update `.env.example` with instructions
  - _Requirements: 1.1, 2.1, 2.2, 2.3_





- [ ] 2. Implement Google TTS Service
  - [ ] 2.1 Create `generateGoogleTTS` function
    - Make API call to Google Cloud TTS

    - Handle Arabic (ar-XA-Wavenet-B) and English voices
    - Return Base64 audio content
    - _Requirements: 1.1, 3.1_
  
  - [x] 2.2 Create `playGoogleTTS` function

    - Decode Base64 audio
    - Create Audio element
    - Play audio with proper event handlers
    - _Requirements: 3.2, 5.1_

  
  - [-] 2.3 Add error handling



    - Try-catch for API calls
    - Fallback to Browser TTS on error

    - Console logging for debugging
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 3. Update `speakText` function
  - [x] 3.1 Add Google TTS as primary option

    - Check if API key exists
    - Call Google TTS for Arabic text
    - Use Browser TTS for English
    - _Requirements: 1.1, 1.2_

  

  - [ ] 3.2 Implement fallback logic
    - Catch Google TTS errors
    - Automatically use Browser TTS
    - Log which TTS is being used

    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 3.3 Add loading states
    - Set `isAISpeaking` to true

    - Show "AI Speaking..." indicator
    - Reset state when audio ends
    - _Requirements: 5.2_




- [ ] 4. Enhance Voice Mode flow
  - [ ] 4.1 Auto-play after AI response
    - Trigger TTS immediately after Gemini response
    - Wait for audio to finish
    - _Requirements: 5.1_

  
  - [ ] 4.2 Auto-listen after speech
    - Start listening when audio ends
    - Handle interruptions gracefully
    - _Requirements: 5.4_
  
  - [ ] 4.3 Add stop functionality
    - Stop audio when user starts speaking
    - Cancel ongoing TTS requests
    - _Requirements: 5.3_

- [ ] 5. Add configuration and documentation
  - [ ] 5.1 Create setup guide
    - Document Google Cloud setup steps
    - Add API key instructions
    - Include troubleshooting tips
    - _Requirements: 2.3_
  
  - [ ] 5.2 Update README
    - Add Voice Mode features
    - List supported languages
    - Explain free tier limits
    - _Requirements: 2.3_

- [ ] 6. Testing and validation
  - [ ] 6.1 Test Arabic voice
    - Verify voice quality
    - Test different text lengths
    - Check pronunciation
    - _Requirements: 3.1, 3.2_
  
  - [ ] 6.2 Test fallback mechanism
    - Remove API key and test
    - Simulate network error
    - Verify Browser TTS works
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 6.3 Test full Voice Mode flow
    - Complete 10-question interview
    - Switch between Arabic and English
    - Verify auto-listen works
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 7. Performance optimization
  - [ ] 7.1 Add audio caching (optional)
    - Cache common phrases
    - Reduce API calls
    - _Requirements: 3.2_
  
  - [ ] 7.2 Monitor API usage (optional)
    - Track character count
    - Warn when approaching limit
    - _Requirements: 1.3_
