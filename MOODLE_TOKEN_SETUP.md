# Moodle Web Service Token Setup Guide

This guide will help you set up Moodle web services and get a token for the BridgeLearn backend.

## Step 1: Enable Web Services

1. Log in to Moodle as an administrator at `http://localhost:8080`
2. Go to **Site administration** → **Advanced features**
3. Check the box for **"Enable web services"**
4. Click **"Save changes"**

## Step 2: Enable REST Protocol

1. Go to **Site administration** → **Server** → **Web services** → **Overview**
2. Ensure **"Enable REST protocol"** is checked
3. If not, check it and click **"Save changes"**

## Step 3: Create a Web Service

1. Go to **Site administration** → **Server** → **Web services** → **External services**
2. Click **"Add"** button
3. Fill in:
   - **Name**: `BridgeLearn API`
   - **Short name**: `bridgelearn_api`
   - **Enable**: Check the box
4. Click **"Save changes"**

## Step 4: Add Functions to Web Service

1. Click on the service you just created (**BridgeLearn API**)
2. Scroll down to **"Functions"** section
3. Click **"Add functions"** button
4. Search for and add these functions (one by one):
   - `core_user_create_users`
   - `core_user_update_users`
   - `core_user_delete_users`
   - `core_user_get_users_by_field`
   - `core_webservice_get_site_info`
5. After adding each function, click **"Add functions"**
6. Click **"Save changes"** when done

## Step 5: Create a Token

1. Go to **Site administration** → **Server** → **Web services** → **Manage tokens**
2. Click **"Create token"**
3. Fill in:
   - **User**: Select your admin user (or create a dedicated service account)
   - **Service**: Select **BridgeLearn API** (the service you created)
   - **IP restriction**: Leave empty (or restrict to your Docker network if needed)
   - **Valid until**: Leave empty for no expiration, or set a future date
4. Click **"Save changes"**
5. **IMPORTANT**: Copy the token that is displayed (it will look like a long random string)
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`
   - **You won't be able to see this token again after you close the page!**

## Step 6: Update docker-compose.yml

1. Open `docker-compose.yml` in your editor
2. Find the `backend` service section
3. Locate the line: `MOODLE_TOKEN: your_token_here`
4. Replace `your_token_here` with the token you copied from Moodle
   ```yaml
   MOODLE_TOKEN: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
   ```
5. Save the file

## Step 7: Restart Backend

After updating the token, restart the backend container:

```bash
sudo docker compose restart backend
```

Or if you're in the docker group:
```bash
docker compose restart backend
```

## Step 8: Verify It Works

1. Go to your BridgeLearn frontend: `http://localhost:3000`
2. Log in as admin
3. Navigate to **Admin Dashboard** → **User Management**
4. Try to sync a user by clicking the sync icon (refresh icon) next to any user
5. It should now work without the token error!

## Alternative: Test via API

You can also test the connection directly:

```bash
curl http://localhost:5000/api/health/moodle
```

Expected response:
```json
{
  "success": true,
  "message": "Connected to Moodle successfully. Site: Your Site Name"
}
```

## Troubleshooting

### "Invalid token" error

- Make sure you copied the entire token (it's usually 32+ characters)
- Verify the token hasn't expired
- Check that the web service is enabled
- Ensure the user associated with the token has the necessary permissions

### "Web service not found" error

- Verify the service "BridgeLearn API" exists and is enabled
- Check that the token is associated with the correct service

### "Function not found" error

- Make sure all required functions are added to the web service
- Go back to Step 4 and verify all functions are present

### Token works but sync fails

- Check backend logs: `docker compose logs backend --tail=50`
- Verify MOODLE_URL is correct in docker-compose.yml
- Ensure Moodle is accessible from the backend container network

