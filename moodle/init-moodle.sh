#!/bin/bash
# Don't use set -e - allow script to continue even if some steps fail
set +e

MOODLE_DIR="/var/www/html"
MOODLE_VERSION="${MOODLE_VERSION:-latest}"

echo "🔧 Initializing Moodle installation..."

# Check if Moodle is already installed
if [ -f "$MOODLE_DIR/config.php" ] || [ -f "$MOODLE_DIR/index.php" ]; then
    echo "✅ Moodle is already installed"
    exit 0
fi

# Check if directory is empty (only . and ..)
if [ "$(ls -A $MOODLE_DIR 2>/dev/null | grep -v '^\.$' | grep -v '^\.\.$')" ]; then
    echo "⚠️ Directory is not empty, checking if Moodle files exist..."
    if [ ! -f "$MOODLE_DIR/index.php" ]; then
        echo "⚠️ Directory has files but no Moodle installation detected"
        echo "📥 Proceeding with Moodle download..."
    else
        echo "✅ Moodle files detected, skipping download"
        exit 0
    fi
fi

echo "📥 Downloading Moodle ${MOODLE_VERSION}..."

# Download Moodle
cd /tmp
if [ "$MOODLE_VERSION" = "latest" ]; then
    # Get latest stable version (4.4)
    MOODLE_URL="https://download.moodle.org/download.php/direct/stable404/moodle-latest-404.tgz"
else
    MOODLE_URL="https://download.moodle.org/releases/${MOODLE_VERSION}/moodle-${MOODLE_VERSION}.tgz"
fi

echo "📥 Downloading from: $MOODLE_URL"

# Check if wget is available, if not try curl
if command -v wget >/dev/null 2>&1; then
    DOWNLOAD_CMD="wget --progress=bar:force -q"
elif command -v curl >/dev/null 2>&1; then
    DOWNLOAD_CMD="curl -L -s -o"
else
    echo "❌ Neither wget nor curl is available. Cannot download Moodle."
    echo "⚠️ Please install wget or curl in the container, or mount Moodle files manually."
    exit 0  # Don't fail container startup
fi

# Download Moodle
if [ "$DOWNLOAD_CMD" = "wget --progress=bar:force -q" ]; then
    $DOWNLOAD_CMD "$MOODLE_URL" -O moodle.tgz || {
        echo "❌ Failed to download Moodle from $MOODLE_URL"
        echo "🔄 Trying alternative download method..."
        # Try alternative URL
        MOODLE_URL="https://github.com/moodle/moodle/archive/refs/heads/main.tar.gz"
        $DOWNLOAD_CMD "$MOODLE_URL" -O moodle.tgz || {
            echo "❌ Failed to download Moodle from alternative source"
            echo "⚠️ Moodle will need to be installed manually"
            exit 0  # Don't fail container startup
        }
        echo "📦 Extracting Moodle from GitHub..."
        tar -xzf moodle.tgz -C "$MOODLE_DIR" --strip-components=1 2>/dev/null || {
            echo "❌ Failed to extract Moodle"
            exit 0
        }
        rm -f moodle.tgz
        chown -R www-data:www-data "$MOODLE_DIR" 2>/dev/null || true
        chmod -R 755 "$MOODLE_DIR" 2>/dev/null || true
        echo "✅ Moodle downloaded and extracted successfully"
        exit 0
    }
else
    # Using curl
    $DOWNLOAD_CMD moodle.tgz "$MOODLE_URL" || {
        echo "❌ Failed to download Moodle with curl"
        exit 0
    }
fi

echo "📦 Extracting Moodle..."
tar -xzf moodle.tgz -C "$MOODLE_DIR" --strip-components=1 2>/dev/null || {
    echo "❌ Failed to extract Moodle archive"
    rm -f moodle.tgz
    exit 0  # Don't fail container startup
}

# Set permissions (ignore errors if user doesn't exist)
chown -R www-data:www-data "$MOODLE_DIR" 2>/dev/null || true
find "$MOODLE_DIR" -type d -exec chmod 755 {} \; 2>/dev/null || true
find "$MOODLE_DIR" -type f -exec chmod 644 {} \; 2>/dev/null || true

# Cleanup
rm -f moodle.tgz

echo "✅ Moodle downloaded and extracted successfully"
echo "📁 Moodle files are in: $MOODLE_DIR"
FILE_COUNT=$(ls -1 "$MOODLE_DIR" 2>/dev/null | wc -l)
echo "📋 Files count: $FILE_COUNT"

if [ "$FILE_COUNT" -lt 10 ]; then
    echo "⚠️ Warning: Expected more Moodle files. Installation may be incomplete."
fi

