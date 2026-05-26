@echo off
REM Setup script for TTS (Text-to-Speech) functionality
REM Installs Python dependencies for gTTS

echo 🔊 Setting up TTS (Text-to-Speech)...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed!
    echo Please install Python 3 from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo ✅ Python found
python --version
echo.

REM Check if pip is installed
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pip is not installed!
    echo Installing pip...
    python -m ensurepip --upgrade
)

echo ✅ pip found
pip --version
echo.

REM Install gTTS
echo 📦 Installing gTTS (Google Text-to-Speech)...
pip install gTTS

REM Verify installation
python -c "import gtts" 2>nul
if errorlevel 1 (
    echo ❌ gTTS installation failed!
    pause
    exit /b 1
)

echo ✅ gTTS installed successfully!
echo.

REM Create TTS cache directory
echo 📁 Creating TTS cache directory...
if not exist "..\storage\app\public\tts_cache" mkdir "..\storage\app\public\tts_cache"

REM Create symbolic link
echo 🔗 Creating storage symbolic link...
cd ..
php artisan storage:link
cd backend

echo.
echo ✅ TTS setup complete!
echo.
echo 📝 Next steps:
echo 1. Make sure Laravel storage is writable
echo 2. Test TTS endpoint: POST http://localhost:8000/api/tts
echo 3. Reload frontend to use new TTS system
echo.
echo 🎉 Ready to use!
echo.
pause
