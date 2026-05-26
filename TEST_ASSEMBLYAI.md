# Testing AssemblyAI Integration

## Quick Test Guide

### 1. Backend Test (Laravel)

#### Test with cURL:
```bash
# Test with sample audio URL
curl -X POST http://localhost:8000/api/voice/transcribe-url \
  -H "Content-Type: application/json" \
  -d '{
    "audio_url": "https://assembly.ai/wildfires.mp3",
    "language": "en"
  }'
```

Expected response:
```json
{
  "success": true,
  "transcript": "Smoke from hundreds of wildfires...",
  "confidence": 0.95,
  "language": "en"
}
```

#### Test with audio file:
```bash
# Record a test audio (or use existing file)
curl -X POST http://localhost:8000/api/voice/transcribe \
  -F "audio=@test.mp3" \
  -F "language=en"
```

### 2. Frontend Test (React)

#### Open Browser Console and run:
```javascript
// Import test function
import { testTranscription } from './utils/voiceTranscription';

// Run test
testTranscription().then(result => {
  console.log('✅ Test passed!');
  console.log('Transcript:', result.transcript);
}).catch(error => {
  console.error('❌ Test failed:', error);
});
```

### 3. Full Integration Test

#### Steps:
1. Start backend server:
   ```bash
   cd backend
   php artisan serve
   ```

2. Start frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Navigate to: http://localhost:3000/ai-interview

4. Click "Voice Mode"

5. Click "Tap to Speak" button

6. Speak in Arabic or English:
   - Arabic: "مرحبا، اسمي أحمد وأنا مطور برمجيات"
   - English: "Hello, my name is Ahmed and I'm a software developer"

7. Click button again to stop

8. Wait for transcription (5-20 seconds)

9. Verify transcript appears in chat

### 4. Language Test

#### Test Arabic:
```bash
curl -X POST http://localhost:8000/api/voice/transcribe-url \
  -H "Content-Type: application/json" \
  -d '{
    "audio_url": "YOUR_ARABIC_AUDIO_URL",
    "language": "ar"
  }'
```

#### Test English:
```bash
curl -X POST http://localhost:8000/api/voice/transcribe-url \
  -H "Content-Type: application/json" \
  -d '{
    "audio_url": "https://assembly.ai/wildfires.mp3",
    "language": "en"
  }'
```

### 5. Error Handling Test

#### Test invalid API key:
1. Change API key in `.env` to invalid value
2. Try transcription
3. Should see error message

#### Test missing audio:
```bash
curl -X POST http://localhost:8000/api/voice/transcribe \
  -F "language=en"
```
Expected: 422 validation error

#### Test large file:
```bash
# Create 15MB audio file (exceeds 10MB limit)
curl -X POST http://localhost:8000/api/voice/transcribe \
  -F "audio=@large_file.mp3" \
  -F "language=en"
```
Expected: 422 validation error

### 6. Performance Test

#### Measure transcription time:
```javascript
const start = Date.now();
const result = await transcribeAudio(audioBlob, 'en');
const duration = Date.now() - start;
console.log(`Transcription took ${duration}ms`);
```

Expected times:
- 10s audio: 5-10 seconds
- 30s audio: 10-20 seconds
- 60s audio: 20-40 seconds

### 7. Browser Compatibility Test

Test in different browsers:
- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Firefox
- ⚠️ Safari (may have issues)

### 8. Microphone Permission Test

1. First visit: Should ask for permission
2. Allow permission
3. Subsequent visits: Should remember permission
4. Deny permission: Should show error message

## Troubleshooting Tests

### Check API Key:
```bash
# In backend directory
grep ASSEMBLYAI_API_KEY .env
```
Should show: `ASSEMBLYAI_API_KEY=bc6d773b24f34363a4ed60cdd90448d5`

### Check Storage Permissions:
```bash
cd backend
ls -la storage/app
```
Should be writable (775 or 777)

### Check Laravel Logs:
```bash
tail -f backend/storage/logs/laravel.log
```
Watch for errors during transcription

### Check Browser Console:
Open DevTools (F12) and check for:
- ✅ "🎤 Recording started"
- ✅ "📦 Audio captured: X KB"
- ✅ "🔄 Transcribing with AssemblyAI..."
- ✅ "✅ Transcription: [text]"

## Success Criteria

✅ Backend endpoint returns 200 status
✅ Transcript text is not empty
✅ Confidence score > 0.7
✅ Arabic text displays correctly
✅ English text displays correctly
✅ Audio recording works in browser
✅ Transcription completes in < 30 seconds
✅ Error messages are clear and helpful
✅ UI shows loading state during transcription
✅ No console errors

## Common Issues

### Issue: "Transcription failed"
**Check**:
- API key is correct
- Internet connection is working
- Audio file is valid format
- File size < 10MB

### Issue: "Please allow microphone access"
**Solution**:
- Click allow in browser prompt
- Check browser settings
- Try different browser

### Issue: Transcription takes too long
**Check**:
- Audio file size
- Internet speed
- AssemblyAI service status

### Issue: Wrong language transcribed
**Solution**:
- Select correct language before recording
- Speak clearly
- Check audio quality

## Test Checklist

- [ ] Backend endpoint accessible
- [ ] API key configured
- [ ] Storage directory writable
- [ ] Frontend can record audio
- [ ] Microphone permission works
- [ ] Audio uploads successfully
- [ ] Transcription returns text
- [ ] Arabic language works
- [ ] English language works
- [ ] Error handling works
- [ ] Loading states display
- [ ] UI is responsive
- [ ] No console errors
- [ ] Performance is acceptable

## Next Steps

After successful testing:
1. ✅ Mark all checklist items
2. 📝 Document any issues found
3. 🔧 Fix any bugs
4. 🚀 Deploy to production
5. 📊 Monitor usage and performance

---

**Test Date**: _____________
**Tested By**: _____________
**Result**: ⬜ Pass ⬜ Fail
**Notes**: _____________
