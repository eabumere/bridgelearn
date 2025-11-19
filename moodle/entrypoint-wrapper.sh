#!/bin/bash
set +e  # Don't exit on errors

echo "🚀 Moodle Container Starting..."

# Run Moodle initialization script
if [ -f /docker-entrypoint.d/99-init-moodle.sh ]; then
    echo "📋 Running Moodle initialization..."
    chmod +x /docker-entrypoint.d/99-init-moodle.sh 2>/dev/null || true
    /docker-entrypoint.d/99-init-moodle.sh || {
        echo "⚠️ Moodle initialization had issues, but continuing..."
    }
fi

# Set PHP configuration to suppress deprecation warnings
echo "🔧 Configuring PHP to suppress deprecation warnings..."

# Create a PHP prepend file that runs before every PHP script
cat > /var/www/html/suppress-warnings.php << 'PHPEOF'
<?php
// Suppress PHP 8.4 deprecation warnings at the earliest possible point
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', '/var/log/apache2/php_errors.log');

// Set error handler to suppress deprecation warnings
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    // Suppress E_DEPRECATED and E_STRICT warnings
    if ($errno === E_DEPRECATED || $errno === E_STRICT || $errno === E_WARNING) {
        // Don't display, but still log
        error_log("Suppressed: [$errno] $errstr in $errfile on line $errline");
        return true; // Suppress the error
    }
    // Let other errors through (but they won't display due to display_errors = 0)
    return false;
}, E_ALL);

// Use output buffering to filter any remaining warnings that slip through
ob_start(function($buffer) {
    // Remove deprecation warnings from output (including multiline)
    $buffer = preg_replace('/Deprecated: .*? in .*? on line \d+.*?\n/i', '', $buffer);
    $buffer = preg_replace('/Deprecated: Constant E_STRICT.*?\n/i', '', $buffer);
    // Remove multiple consecutive newlines created by removing warnings
    $buffer = preg_replace('/\n{3,}/', "\n\n", $buffer);
    return $buffer;
}, 4096);

// Also redirect stderr to capture parse-time warnings
if (function_exists('stream_context_set_default')) {
    // This might not work for parse-time errors, but worth trying
}
PHPEOF

# Set auto_prepend_file in PHP configuration
echo "auto_prepend_file = /var/www/html/suppress-warnings.php" >> /usr/local/etc/php/conf.d/99-suppress-warnings.ini

# Also configure PHP ini directly
echo "display_errors = Off" >> /usr/local/etc/php/conf.d/99-suppress-warnings.ini
echo "display_startup_errors = Off" >> /usr/local/etc/php/conf.d/99-suppress-warnings.ini
echo "error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING & ~E_NOTICE" >> /usr/local/etc/php/conf.d/99-suppress-warnings.ini

# Also try via .htaccess (may not work if AllowOverride is disabled)
if [ -f /var/www/html/.htaccess ]; then
    if ! grep -q "php_flag display_errors Off" /var/www/html/.htaccess 2>/dev/null; then
        echo "" >> /var/www/html/.htaccess
        echo "# Suppress PHP 8.4 deprecation warnings" >> /var/www/html/.htaccess
        echo "php_flag display_errors Off" >> /var/www/html/.htaccess
        echo "php_value error_reporting \"E_ALL & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING & ~E_NOTICE\"" >> /var/www/html/.htaccess
    fi
else
    cat > /var/www/html/.htaccess << 'EOF'
# Suppress PHP 8.4 deprecation warnings
php_flag display_errors Off
php_value error_reporting "E_ALL & ~E_DEPRECATED & ~E_STRICT & ~E_WARNING & ~E_NOTICE"
php_flag log_errors On
php_value error_log /var/log/apache2/php_errors.log
EOF
fi

echo "✅ PHP configuration applied (via auto_prepend_file and .htaccess)"

# Patch Moodle files to avoid E_STRICT constant (most direct solution for parse-time warnings)
# These warnings occur during PHP parsing, before any runtime code runs
echo "🔧 Patching Moodle files to avoid E_STRICT deprecation warnings..."
if [ -f /var/www/html/install.php ]; then
    # Replace E_STRICT with 0 (disable strict checks) in install.php
    sed -i 's/\bE_STRICT\b/0/g' /var/www/html/install.php 2>/dev/null || true
    echo "  ✅ Patched install.php"
fi
if [ -f /var/www/html/lib/setuplib.php ]; then
    # Replace E_STRICT with 0 in setuplib.php
    sed -i 's/\bE_STRICT\b/0/g' /var/www/html/lib/setuplib.php 2>/dev/null || true
    echo "  ✅ Patched setuplib.php"
fi

# Verify Moodle files exist
if [ ! -f /var/www/html/index.php ]; then
    echo "⚠️ WARNING: Moodle index.php not found!"
    echo "📋 Directory contents:"
    ls -la /var/www/html/ | head -5
    echo ""
    echo "💡 Moodle may need to be downloaded manually or installation failed."
fi

# Run the original Moodle entrypoint
echo "🌐 Starting Apache..."
exec /usr/local/bin/moodle-docker-php-entrypoint apache2-foreground

