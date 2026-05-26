#!/bin/bash

# Setup script for TTS (Text-to-Speech) functionality
# Installs Python dependencies for gTTS

echo "🔊 Setting up TTS (Text-to-Speech)..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed!"
    echo "Please install Python 3 first:"
    echo "  - Windows: https://www.python.org/downloads/"
    echo "  - Mac: brew install python3"
    echo "  - Linux: sudo apt-get install python3"
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed!"
    echo "Installing pip3..."
    python3 -m ensurepip --upgrade
fi

echo "✅ pip3 found: $(pip3 --version)"

# Install gTTS
echo "📦 Installing gTTS (Google Text-to-Speech)..."
pip3 install gTTS

# Verify installation
if python3 -c "import gtts" 2>/dev/null; then
    echo "✅ gTTS installed successfully!"
else
    echo "❌ gTTS installation failed!"
    exit 1
fi

# Create TTS cache directory
echo "📁 Creating TTS cache directory..."
mkdir -p ../storage/app/public/tts_cache

# Create symbolic link if not exists
if [ ! -L ../public/storage ]; then
    echo "🔗 Creating storage symbolic link..."
    cd ..
    php artisan storage:link
    cd -
fi

echo ""
echo "✅ TTS setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure Laravel storage is writable"
echo "2. Test TTS endpoint: POST http://localhost:8000/api/tts"
echo "3. Reload frontend to use new TTS system"
echo ""
echo "🎉 Ready to use!"
