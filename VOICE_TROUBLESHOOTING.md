# 🔧 Voice Transcription Troubleshooting

## Common Errors & Solutions

### ❌ Error: "Failed to upload audio file"

**Possible Causes:**
1. API key is invalid or missing
2. Audio file is empty or corrupted
3. Network connection issue
4. AssemblyAI service is down

**Solutions:**
```bash
# 1. Check API key in backend/.env
grep ASSEMBLYAI_API_KEY backend/.env

# 2. Check Laravel logs
tail -f backend/storage/logs/laravel.log

# 3. Test API key manually
curl -X POST https://api.assemblyai.com/v2/upload \
  -H "authorization: bc6d773b24f34363a4ed60cdd90448d5" \
  -H "content-type: application/octet-stream" \
  --data-binary "@test.mp3"

# 4. Check storage permissions
chmod -R 775 backend/storage/app
```

### ❌ Error: "No audio data recorded"

**Possible Causes:**
1. Recording stopped too quickly
2. Microphone not working
3. Browser doesn't support MediaRecorder
4. Audio chunks not collected

**Solutions:**
1. Speak for at least 2-3 seconds before stopping
2. Check microphone in system settings
3. Use Chrome or Edge browser
4. Check browser console for MediaRecorder errors

### ❌ Error: "Please allow microphone access"

**Solutions:**
1. Click "Allow" when browser asks for permission
2. Check browser settings:
   - Chrome: Settings → Privacy → Site Settings → Microphone
   - Edge: Settings → Cookies and site permissions → Microphone
3. Make sure you're using HTTPS or localhost
4. Try different browser

### ❌ Error: "MediaRecorder not supported"

**Solutions:**
1. Update your browser to latest version
2. Use Chrome, Edge, or Firefox
3. Safari may have limited support
4. Check: https://caniuse.com/mediarecorder

### ❌ Error: "Transcription timeout"

**Possible Causes:**
1. Audio file too large (> 10MB)
2. Slow internet connection
3. AssemblyAI service overloaded

**Solutions:**
1. Keep recordings under 60 seconds
2. Check internet speed
3. Try again in a few minutes
4. Check AssemblyAI status: https://status.assemblyai.com/

### ❌ Error: "Internal Server Error (500)"

**Check Laravel Logs:**
```bash
tail -f backend/storage/logs/laravel.log
```

**Common Causes:**
1. Missing dependencies
2. Storage directory not writable
3. PHP memory limit exceeded
4. cURL not installed

**Solutions:**
```bash
# Install cURL
sudo apt-get install php-curl  # Ubuntu/Debian
brew install php-curl          # macOS

# Increase PHP memory limit
# Edit php.ini:
memory_limit = 256M
upload_max_filesize = 20M
post_max_size = 20M

# Restart PHP
sudo service php-fpm restart
```

## Browser Console Errors

### Check for these messages:

✅ **Good:**
```
🎤 Recording started
📦 Audio captured: 132.45 KB
🔄 Transcribing with AssemblyAI...
✅ Transcription: [your text]
```

❌ **Bad:**
```
❌ Failed to start recording
❌ No audio data captured
❌ Transcription error
❌ Failed to upload audio file
```

## Testing Steps

### 1. Test Microphone
```javascript
// In browser console
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    console.log('✅ Microphone works!');
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => console.error('❌ Microphone error:', err));
```

### 2. Test MediaRecorder
```javascript
// In browser console
console.log('MediaRecorder supported:', !!window.MediaRecorder);
console.log('Supported types:');
['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg', 'audio/mp4'].forEach(type => {
  console.log(type, ':', MediaRecorder.isTypeSupported(type));
});
```

### 3. Test Backend
```bash
# Test with sample audio
curl -X POST http://localhost:8000/api/voice/transcribe-url \
  -H "Content-Type: application/json" \
  -d '{"audio_url":"https://assembly.ai/wildfires.mp3","language":"en"}'
```

### 4. Test Full Flow
1. Open http://localhost:3000/ai-interview
2. Open DevTools (F12)
3. Select Voice Mode
4. Click "Tap to Speak"
5. Watch console for messages
6. Speak for 3-5 seconds
7. Click to stop
8. Wait for transcription

## Performance Issues

### Slow Transcription

**Check:**
1. Audio file size (should be < 1MB for fast processing)
2. Internet speed (need at least 1 Mbps upload)
3. AssemblyAI service status

**Optimize:**
```javascript
// Reduce audio quality for faster upload
const recorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus',
  audioBitsPerSecond: 16000  // Lower bitrate = smaller file
});
```

### High Memory Usage

**Solutions:**
1. Clean up recorder after each use
2. Limit recording duration to 60 seconds
3. Clear audio chunks after transcription

```javascript
// Proper cleanup
if (audioRecorder) {
  audioRecorder.cleanup();
  setAudioRecorder(null);
}
```

## Network Issues

### Check Backend Connectivity
```bash
# Test backend is running
curl http://localhost:8000/api/voice/transcribe-url

# Should return 422 (validation error) not 404
```

### Check AssemblyAI Connectivity
```bash
# Test AssemblyAI API
curl https://api.assemblyai.com/v2/transcript \
  -H "authorization: bc6d773b24f34363a4ed60cdd90448d5"

# Should return 400 (missing audio_url) not 401
```

## Browser Compatibility

### Recommended:
- ✅ Chrome 49+
- ✅ Edge 79+
- ✅ Firefox 25+

### Limited Support:
- ⚠️ Safari 14+ (may have issues)
- ⚠️ Opera 36+

### Not Supported:
- ❌ Internet Explorer
- ❌ Old mobile browsers

## Quick Fixes

### Reset Everything
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Clear Backend Cache
```bash
cd backend
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Restart Services
```bash
# Backend
cd backend
php artisan serve

# Frontend
cd frontend
npm start
```

## Still Having Issues?

1. ✅ Check all error messages in console
2. ✅ Check Laravel logs
3. ✅ Test with different browser
4. ✅ Test with different microphone
5. ✅ Check internet connection
6. ✅ Verify API key is correct
7. ✅ Try the test commands above

## Get Help

If nothing works:
1. Copy error messages from console
2. Copy relevant lines from Laravel logs
3. Note your browser and OS version
4. Describe exact steps to reproduce
5. Contact development team

---

**Last Updated**: October 22, 2025
