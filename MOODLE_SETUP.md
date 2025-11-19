# Moodle Setup and Verification Guide

## Problem: 403 Forbidden Error

If you're seeing "Forbidden" when accessing `http://localhost:8080`, follow these steps:

## Quick Diagnosis: Check Container Files

First, verify if Moodle files exist:

```bash
# Check if Moodle files are present
docker exec bridgelearn-moodle ls -la /var/www/html/

# Check specifically for install.php
docker exec bridgelearn-moodle test -f /var/www/html/install.php && echo "Files exist" || echo "Directory is empty"

# Check Apache error log
docker exec bridgelearn-moodle tail -20 /var/log/apache2/error.log
```

**If the directory is empty**, the image might need additional setup.

## Step 1: Verify Container Status

First, check if Moodle container is running:

```bash
docker compose ps moodle-app
```

Expected output should show the container as "Up" and healthy.

## Step 2: Check Moodle Logs

View Moodle container logs for errors:

```bash
docker compose logs moodle-app --tail=100
```

Look for:
- Permission errors
- Database connection errors
- Installation warnings

## Step 3: Fix Volume Configuration

The issue might be with volume permissions. Try this updated configuration:

### Option A: Minimal Volumes (Recommended for First Setup)

Update `docker-compose.yml` for Moodle service:

```yaml
moodle-app:
  image: moodlehq/moodle-php-apache:8.4
  container_name: bridgelearn-moodle
  environment:
    MOODLE_DBHOST: bridge-db
    MOODLE_DBNAME: bridgelearn
    MOODLE_DBUSER: bridgeuser
    MOODLE_DBPASS: bridgepass
    # Add these for proper permissions
    MOODLE_USER_ID: 33  # www-data user ID
    MOODLE_GROUP_ID: 33
  volumes:
    - moodle_data:/var/www/moodledata
  ports:
    - "8080:80"
  depends_on:
    - bridge-db
  networks:
    - bridgelearn-net
```

**Note**: Removed `moodle_html` volume - let Moodle use its default installation.

### Option B: Fix Permissions on Existing Volumes

If you keep the volumes, you may need to fix permissions:

```bash
# Stop Moodle container
docker compose stop moodle-app

# Remove the problematic volumes
docker compose down -v moodle-app

# Restart with new configuration
docker compose up -d --force-recreate moodle-app
```

## Step 4: Access Moodle Installation

After restarting, try these URLs:

1. **Main URL**: `http://localhost:8080`
2. **Install page**: `http://localhost:8080/install.php`
3. **Index**: `http://localhost:8080/index.php`

If you see a **403 Forbidden**:
- Wait 30-60 seconds for Moodle to initialize
- Try clearing browser cache
- Try incognito/private mode
- Check if you can access `http://localhost:8080/index.php` directly

## Step 5: Complete Moodle Installation

When you access Moodle successfully, you'll see the installation wizard. Use these settings:

### Database Configuration:
- **Database type**: `PostgreSQL`
- **Database host**: `bridge-db` (internal Docker network name)
- **Database name**: `bridgelearn`
- **Database user**: `bridgeuser`
- **Database password**: `bridgepass`
- **Database port**: `5432`
- **Unix socket**: (leave empty)
- **Database tables prefix**: `mdl_` (default)

### Paths Configuration:
- **Web address**: `http://localhost:8080`
- **Moodle directory**: `/var/www/html` (should be pre-filled, don't change)
- **Data directory**: `/var/www/moodledata` (should be pre-filled)

### Other Settings:
- **Database port**: `5432` (if asked separately)
- **Unicode**: Yes
- **Create database**: No (database already exists)

## Step 6: Create Admin Account

After database setup:
- **Username**: Choose your admin username
- **Password**: Choose a strong password
- **First name**: Your first name
- **Surname**: Your last name
- **Email**: Your email address

## Step 7: Verify Moodle Works

After installation:
1. You should be logged in as admin
2. Go to Dashboard
3. Check Site administration → Server → System paths
4. Everything should show green checks

## Step 8: Configure Web Services (For API Integration)

Once Moodle is working:

### 8.1 Enable Web Services
1. Go to **Site administration → Advanced features**
2. Check **Enable web services**
3. Check **Enable REST protocol**
4. Save changes

### 8.2 Create Web Service
1. Go to **Site administration → Server → Web services → External services**
2. Click **Add**
3. Name: `BridgeLearn API`
4. Short name: `bridgelearn_api`
5. Check **Enabled**
6. Save

### 8.3 Add Functions to Service
1. Edit your **BridgeLearn API** service
2. Click **Functions** tab
3. Add these functions:
   - `core_user_create_users`
   - `core_user_update_users`
   - `core_user_delete_users`
   - `core_user_get_users_by_field`
   - `core_webservice_get_site_info`
4. Save

### 8.4 Create Token
1. Go to **Site administration → Server → Web services → Manage tokens**
2. Click **Create token**
3. User: Select an admin user
4. Service: Select **BridgeLearn API**
5. IP restriction: (leave empty for development)
6. Valid until: (leave empty or set far future date)
7. Click **Save changes**
8. **Copy the generated token** - you'll need this!

### 8.5 Add Token to Backend

Add the token to `docker-compose.yml`:

```yaml
backend:
  environment:
    MOODLE_TOKEN: your_token_here  # Paste the token from step 8.4
```

Then restart backend:
```bash
docker compose up -d --build backend
```

### 8.6 Test Connection

Visit: `http://localhost:5000/api/health/moodle`

Expected response:
```json
{
  "success": true,
  "message": "Connected to Moodle successfully. Site: Your Site Name"
}
```

## Troubleshooting

### Still Getting 403 Forbidden?

1. **Check container logs**:
   ```bash
   docker compose logs moodle-app --tail=50
   ```

2. **Try accessing directly from container**:
   ```bash
   docker exec -it bridgelearn-moodle ls -la /var/www/html
   ```

3. **Check Apache is running**:
   ```bash
   docker exec -it bridgelearn-moodle ps aux | grep apache
   ```

4. **Check Apache error logs**:
   ```bash
   docker exec -it bridgelearn-moodle tail -f /var/log/apache2/error.log
   ```

5. **Remove volumes and start fresh**:
   ```bash
   docker compose down -v
   docker compose up -d moodle-app
   ```

### Database Connection Issues

If Moodle can't connect to database:
1. Verify database container is running: `docker compose ps bridge-db`
2. Test connection from Moodle container:
   ```bash
   docker exec -it bridgelearn-moodle psql -h bridge-db -U bridgeuser -d bridgelearn
   ```
3. Check if database exists:
   ```bash
   docker exec -it bridgelearn-db psql -U bridgeuser -d bridgelearn -c "\dt"
   ```

### Permission Issues

If you see permission errors in logs:
1. Check volume permissions:
   ```bash
   docker exec -it bridgelearn-moodle ls -la /var/www/
   ```

2. Fix permissions (run inside container):
   ```bash
   docker exec -it bridgelearn-moodle chown -R www-data:www-data /var/www/moodledata
   docker exec -it bridgelearn-moodle chmod -R 755 /var/www/moodledata
   ```

## Quick Fix Commands

If nothing works, try a complete reset:

```bash
# Stop all containers
docker compose down

# Remove Moodle volumes
docker volume rm bridgelearn_moodle_data bridgelearn_moodle_html 2>/dev/null || true

# Start fresh
docker compose up -d moodle-app

# Wait 60 seconds for initialization
sleep 60

# Check logs
docker compose logs moodle-app --tail=20

# Try accessing
curl http://localhost:8080
```

## Expected URLs After Installation

- **Main site**: `http://localhost:8080`
- **Admin panel**: `http://localhost:8080/admin`
- **API endpoint**: `http://localhost:8080/webservice/rest/server.php`
- **Health check** (from backend): `http://localhost:5000/api/health/moodle`

## Next Steps After Moodle is Working

1. ✅ Moodle is accessible at `http://localhost:8080`
2. ✅ You can log in as admin
3. ✅ Web services are enabled
4. ✅ REST token is created and added to backend
5. ✅ Health check endpoint works: `http://localhost:5000/api/health/moodle`
6. ✅ User sync works from User Management page

---

**Last Updated**: Current
**Status**: Troubleshooting Guide

