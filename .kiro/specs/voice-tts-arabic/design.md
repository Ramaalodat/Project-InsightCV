# Design: Arabic Voice TTS Implementation

## Overview
استخدام Google Cloud Text-to-Speech API لتوفير صوت عربي عالي الجودة في Voice Mode.

## Architecture

### High-Level Flow
```
User speaks (Arabic/English)
    ↓
Speech Recognition detects language
    ↓
Gemini AI generates response
    ↓
Language Detection (Arabic/English)
    ↓
Google Cloud TTS (Arabic) OR Browser TTS (English)
    ↓
Audio plays → User hears response
```

## Components

### 1. Google Cloud TTS Service
```javascript
const generateGoogleTTS = async (text, language) => {
  const API_KEY = process.env.REACT_APP_GOOGLE_TTS_KEY;
  
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: language === 'ar' ? 'ar-XA' : 'en-US',
          name: language === 'ar' ? 'ar-XA-Wavenet-B' : 'en-US-Wavenet-D'
        },
        audioConfig: { audioEncoding: 'MP3' }
      })
    }
  );
  
  const data = await response.json();
  return data.audioContent; // Base64 audio
};
```

### 2. Audio Playback
```javascript
const playGoogleTTS = (base64Audio) => {
  const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
  audio.play();
};
```

### 3. Fallback Strategy
```javascript
const speakText = async (text, language) => {
  try {
    // Try Google Cloud TTS
    const audioContent = await generateGoogleTTS(text, language);
    playGoogleTTS(audioContent);
  } catch (error) {
    // Fallback to Browser TTS
    speakWithBrowserTTS(text, language);
  }
};
```

## Data Models

### TTS Request
```typescript
interface TTSRequest {
  input: { text: string };
  voice: {
    languageCode: string;  // 'ar-XA' or 'en-US'
    name: string;          // 'ar-XA-Wavenet-B'
  };
  audioConfig: {
    audioEncoding: string; // 'MP3'
  };
}
```

### TTS Response
```typescript
interface TTSResponse {
  audioContent: string;  // Base64 encoded audio
}
```

## Error Handling

### Scenarios
1. **API Key Missing**: Use Browser TTS
2. **Network Error**: Use Browser TTS
3. **Quota Exceeded**: Use Browser TTS
4. **Invalid Response**: Use Browser TTS

### Error Messages
```javascript
console.log('🌐 Using Google Cloud TTS');
console.log('⚠️ Google TTS failed, using Browser TTS');
console.log('✅ Audio playing...');
```

## Testing Strategy

### Unit Tests
- Test Google TTS API call
- Test Base64 audio decoding
- Test fallback mechanism

### Integration Tests
- Test full Voice Mode flow
- Test language switching
- Test error scenarios

### Manual Tests
1. Test Arabic voice quality
2. Test English voice quality
3. Test network failure
4. Test API key missing

## Performance Considerations

### Optimization
- Cache audio for repeated phrases
- Preload common responses
- Use streaming if available

### Limits
- Google Free Tier: 1M characters/month
- Max text length: 5000 characters
- Response time: < 2 seconds

## Security

### API Key Protection
- Store in `.env` file
- Never commit to Git
- Use environment variables only
- Rotate keys periodically

## Setup Instructions

### 1. Get Google Cloud API Key
1. Go to: https://console.cloud.google.com
2. Create new project
3. Enable Text-to-Speech API
4. Create API key
5. Copy key

### 2. Add to .env
```
REACT_APP_GOOGLE_TTS_KEY=your_api_key_here
```

### 3. Restart Frontend
```bash
cd frontend
npm start
```

## Alternative: ElevenLabs (If needed)

### Pros
- Better voice quality
- More natural Arabic
- 10K characters/month free

### Cons
- Requires account signup
- More complex setup

### Implementation
```javascript
const elevenLabsTTS = async (text) => {
  const response = await fetch(
    'https://api.elevenlabs.io/v1/text-to-speech/voice-id',
    {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    }
  );
  return response.blob();
};
```
