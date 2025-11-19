# User Management Setup Guide

## Overview

The User Management feature has been implemented with full backend integration and Moodle synchronization. Users can be created, updated, and deleted through the admin dashboard, with automatic synchronization to Moodle LMS.

## Features

✅ **Backend as Source of Truth** - All user data is stored in PostgreSQL database
✅ **Moodle Integration** - Users are automatically synced to Moodle via REST API
✅ **Full CRUD Operations** - Create, Read, Update, Delete users
✅ **Role Management** - Support for admin, student, tutor, and parent roles
✅ **User Search** - Search users by name, email, username, or role
✅ **Status Management** - Activate/deactivate users
✅ **Moodle Sync Status** - Track which users are synced to Moodle

## Backend Implementation

### Database Schema

The `users` table includes:
- `id` - Primary key
- `email` - Unique email address
- `username` - Unique username
- `password_hash` - Hashed password (SHA-256)
- `name` - Full name
- `role` - User role (admin, student, tutor, parent)
- `moodle_user_id` - Moodle user ID (if synced)
- `moodle_username` - Moodle username
- `is_active` - Active status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### API Endpoints

All endpoints are under `/api/users`:

- `GET /api/users` - Get all users (with pagination)
  - Query params: `limit`, `offset`
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
  - Body: `{ email, username, password, name, role, syncToMoodle }`
- `PUT /api/users/:id` - Update user
  - Body: `{ email?, username?, name?, role?, is_active? }`
- `DELETE /api/users/:id` - Delete user (soft delete)

### Moodle Integration

The Moodle service (`backend/services/moodle/moodleService.ts`) uses Moodle's REST API to:
- Create users in Moodle
- Update users in Moodle
- Delete users from Moodle
- Get user information from Moodle

**Moodle REST API Functions Used:**
- `core_user_create_users` - Create user
- `core_user_update_users` - Update user
- `core_user_delete_users` - Delete user
- `core_user_get_users_by_field` - Get user by username
- `core_webservice_get_site_info` - Test connection

## Frontend Implementation

### User Management Page

Located at: `/admin/users`

**Features:**
- User list with search functionality
- Create user modal with Moodle sync option
- Edit user modal
- Delete user confirmation modal
- Statistics dashboard (Total, Active, Moodle Synced, Inactive)
- Role-based color coding
- Moodle sync status indicators

### Components

- `frontend/src/components/Admin/UserManagement.tsx` - Main user management component
- `frontend/src/api/users.ts` - API client for user operations

## Configuration

### Environment Variables

**Backend** (`.env` or `docker-compose.yml`):
```env
DB_HOST=bridge-db
DB_USER=bridgeuser
DB_PASS=bridgepass
DB_NAME=bridgelearn
MOODLE_URL=http://moodle-app:8080
MOODLE_TOKEN=your_moodle_webservice_token
PORT=5000
```

**Frontend** (already configured in `docker-compose.yml`):
```env
VITE_API_URL=http://localhost:5000
```

### Moodle Web Service Token Setup

To enable Moodle synchronization, you need to:

1. **Enable Web Services in Moodle:**
   - Go to Site administration → Advanced features
   - Enable "Enable web services"

2. **Create a Web Service:**
   - Go to Site administration → Server → Web services → Overview
   - Click "Add" to create a new service
   - Name it "BridgeLearn API"
   - Enable it

3. **Add Functions to Web Service:**
   - Go to Site administration → Server → Web services → External services
   - Edit your service
   - Add these functions:
     - `core_user_create_users`
     - `core_user_update_users`
     - `core_user_delete_users`
     - `core_user_get_users_by_field`
     - `core_webservice_get_site_info`

4. **Create a Token:**
   - Go to Site administration → Server → Web services → Manage tokens
   - Create a token for a user with appropriate permissions
   - Copy the token

5. **Add Token to Backend:**
   - Add `MOODLE_TOKEN=your_token_here` to your backend `.env` file
   - Or add it to `docker-compose.yml` under backend environment variables

## Usage

### Accessing User Management

1. Log in as an admin user (e.g., `aejakhegbe` / `P@ssword1234`)
2. Navigate to Admin Dashboard
3. Click on "User Management" in Quick Actions
4. Or navigate directly to `/admin/users`

### Creating a User

1. Click "Add User" button
2. Fill in the form:
   - Full Name (required)
   - Email (required, must be unique)
   - Username (required, must be unique)
   - Password (required)
   - Role (required: student, tutor, parent, or admin)
   - Sync to Moodle (checkbox, enabled by default)
3. Click "Save"
4. User will be created in the database
5. If "Sync to Moodle" is checked, user will also be created in Moodle
6. Moodle User ID will be stored in the database

### Editing a User

1. Click the edit icon (pencil) next to a user
2. Update the fields you want to change
3. Click "Save"
4. Changes will be synced to Moodle if the user was previously synced

### Deleting a User

1. Click the delete icon (trash) next to a user
2. Confirm the deletion
3. User will be soft-deleted (marked as inactive)
4. User will be removed from Moodle if previously synced

### Searching Users

Use the search bar to filter users by:
- Name
- Email
- Username
- Role

## Error Handling

- **Backend errors** are displayed in the UI
- **Moodle sync failures** are logged but don't prevent user creation
- **Validation errors** are shown in the form
- **Network errors** are handled gracefully

## Security Notes

⚠️ **Current Implementation:**
- Passwords are hashed using SHA-256 (simple implementation)
- **For production, use bcrypt or Argon2 for password hashing**
- JWT authentication should be implemented for API protection
- Role-based access control should be enforced on backend routes

## Next Steps

1. **Configure Moodle Token** - Add `MOODLE_TOKEN` to backend environment
2. **Test User Creation** - Create a test user with Moodle sync enabled
3. **Verify Moodle Sync** - Check Moodle to confirm user was created
4. **Implement Authentication** - Add JWT authentication to backend routes
5. **Improve Password Hashing** - Replace SHA-256 with bcrypt
6. **Add Validation** - Add email format validation, password strength requirements
7. **Add Pagination UI** - Implement pagination controls in the frontend
8. **Add Bulk Operations** - Support bulk user creation/update/delete

## Troubleshooting

### Users not syncing to Moodle

1. Check `MOODLE_TOKEN` is set correctly
2. Verify Moodle web services are enabled
3. Check Moodle logs for errors
4. Verify the token has permissions for required functions
5. Check backend logs for Moodle API errors

### Database connection errors

1. Verify database is running: `docker compose ps`
2. Check database credentials in environment variables
3. Verify database schema was initialized (check backend logs)

### Frontend not loading users

1. Check backend is running: `docker compose ps`
2. Verify `VITE_API_URL` is correct
3. Check browser console for errors
4. Verify CORS is enabled in backend

## Files Created/Modified

### Backend
- `backend/utils/db.ts` - Database connection and schema initialization
- `backend/models/User.ts` - User model and types
- `backend/services/moodle/moodleService.ts` - Moodle REST API integration
- `backend/services/userService.ts` - User business logic
- `backend/controllers/userController.ts` - User API controllers
- `backend/routes/userRoutes.ts` - User API routes
- `backend/src/index.ts` - Updated to register routes and initialize DB
- `backend/tsconfig.json` - Updated to include new directories

### Frontend
- `frontend/src/api/users.ts` - User API client
- `frontend/src/components/Admin/UserManagement.tsx` - User management UI
- `frontend/src/App.tsx` - Added `/admin/users` route

---

**Last Updated**: Current implementation
**Status**: ✅ Ready for testing

