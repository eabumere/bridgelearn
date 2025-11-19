#!/bin/bash

echo "🔍 Verifying Moodle Installation..."
echo ""

# Check if Moodle container is running
echo "1. Checking Moodle container status..."
docker compose ps moodle-app
echo ""

# Check if Moodle files exist
echo "2. Checking Moodle files in container..."
docker exec bridgelearn-moodle ls -la /var/www/html/ 2>&1 | head -20
echo ""

# Check Apache is serving
echo "3. Testing Apache response..."
curl -I http://localhost:8080 2>&1 | head -5
echo ""

# Check if install.php exists
echo "4. Checking for install.php..."
docker exec bridgelearn-moodle test -f /var/www/html/install.php && echo "✅ install.php exists" || echo "❌ install.php not found"
echo ""

# Check Apache error log
echo "5. Recent Apache error log entries..."
docker exec bridgelearn-moodle tail -5 /var/log/apache2/error.log 2>&1 || echo "No error log found"
echo ""

echo "✅ Verification complete!"
echo ""
echo "Try accessing:"
echo "  - http://localhost:8080"
echo "  - http://localhost:8080/index.php"
echo "  - http://localhost:8080/install.php"

