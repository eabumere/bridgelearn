import { pool } from '../utils/db.js';
import type { User, CreateUserInput, UpdateUserInput, UserResponse } from '../models/User.js';
import { moodleService } from './moodle/moodleService.js';
import crypto from 'crypto';

// Hash password (simple implementation - use bcrypt in production)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Convert database user to response format
function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    moodle_user_id: user.moodle_user_id,
    moodle_username: user.moodle_username,
    is_active: user.is_active,
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
  };
}

export class UserService {
  /**
   * Get all users
   */
  async getAllUsers(limit = 100, offset = 0): Promise<{ users: UserResponse[]; total: number }> {
    try {
      const countResult = await pool.query('SELECT COUNT(*) FROM users');
      const total = parseInt(countResult.rows[0].count);

      const result = await pool.query(
        'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );

      return {
        users: result.rows.map(toUserResponse),
        total,
      };
    } catch (error) {
      console.error('❌ Error getting users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<UserResponse | null> {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return toUserResponse(result.rows[0]);
    } catch (error) {
      console.error('❌ Error getting user by ID:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error('❌ Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(input: CreateUserInput): Promise<UserResponse> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Check if user already exists
      const existingUser = await this.getUserByEmail(input.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const passwordHash = hashPassword(input.password);

      // Split name into firstname and lastname for Moodle
      const nameParts = input.name.trim().split(' ');
      const firstname = nameParts[0] || input.name;
      const lastname = nameParts.slice(1).join(' ') || input.name;

      let moodleUserId: number | null = null;
      let moodleUsername: string | null = null;

      // Sync to Moodle if requested
      if (input.syncToMoodle) {
        try {
          moodleUserId = await moodleService.createUser({
            username: input.username,
            password: input.password,
            firstname,
            lastname,
            email: input.email,
          });
          moodleUsername = input.username;
          console.log(`✅ User synced to Moodle with ID: ${moodleUserId}`);
        } catch (error: any) {
          console.error('⚠️ Failed to sync user to Moodle:', error.message);
          // Continue with user creation even if Moodle sync fails
        }
      }

      // Insert user into database
      const result = await client.query(
        `INSERT INTO users (email, username, password_hash, name, role, moodle_user_id, moodle_username)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          input.email,
          input.username,
          passwordHash,
          input.name,
          input.role,
          moodleUserId,
          moodleUsername,
        ]
      );

      await client.query('COMMIT');

      return toUserResponse(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update user
   */
  async updateUser(id: number, input: UpdateUserInput): Promise<UserResponse> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get existing user
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      // Build update query dynamically
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (input.email !== undefined) {
        updates.push(`email = $${paramCount++}`);
        values.push(input.email);
      }
      if (input.username !== undefined) {
        updates.push(`username = $${paramCount++}`);
        values.push(input.username);
      }
      if (input.name !== undefined) {
        updates.push(`name = $${paramCount++}`);
        values.push(input.name);
      }
      if (input.role !== undefined) {
        updates.push(`role = $${paramCount++}`);
        values.push(input.role);
      }
      if (input.is_active !== undefined) {
        updates.push(`is_active = $${paramCount++}`);
        values.push(input.is_active);
      }

      if (updates.length === 0) {
        return existingUser;
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const result = await client.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      // Sync to Moodle if user has Moodle ID
      if (existingUser.moodle_user_id && (input.name || input.email)) {
        try {
          const nameParts = (input.name || existingUser.name).trim().split(' ');
          const firstname = nameParts[0] || existingUser.name;
          const lastname = nameParts.slice(1).join(' ') || existingUser.name;

          await moodleService.updateUser(existingUser.moodle_user_id, {
            firstname: input.name ? firstname : undefined,
            lastname: input.name ? lastname : undefined,
            email: input.email,
          });
          console.log(`✅ User updated in Moodle: ${existingUser.moodle_user_id}`);
        } catch (error: any) {
          console.error('⚠️ Failed to update user in Moodle:', error.message);
        }
      }

      await client.query('COMMIT');

      return toUserResponse(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete user (soft delete)
   */
  async deleteUser(id: number): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const user = await this.getUserById(id);
      if (!user) {
        throw new Error('User not found');
      }

      // Soft delete - set is_active to false
      await client.query('UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);

      // Delete from Moodle if synced
      if (user.moodle_user_id) {
        try {
          await moodleService.deleteUser(user.moodle_user_id);
          console.log(`✅ User deleted from Moodle: ${user.moodle_user_id}`);
        } catch (error: any) {
          console.error('⚠️ Failed to delete user from Moodle:', error.message);
        }
      }

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Sync user to Moodle (manual sync)
   */
  async syncUserToMoodle(id: number, password?: string): Promise<UserResponse> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get existing user
      const existingUser = await this.getUserById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      // Get full user data from database
      const dbUser = await this.getUserByEmail(existingUser.email);
      if (!dbUser) {
        throw new Error('User not found in database');
      }

      // Split name into firstname and lastname for Moodle
      const nameParts = dbUser.name.trim().split(' ');
      const firstname = nameParts[0] || dbUser.name;
      const lastname = nameParts.slice(1).join(' ') || dbUser.name;

      let moodleUserId: number | null = null;
      let moodleUsername: string | null = null;

      // If user already has a Moodle ID, try to update
      if (dbUser.moodle_user_id) {
        try {
          const updated = await moodleService.updateUser(dbUser.moodle_user_id, {
            firstname,
            lastname,
            email: dbUser.email,
          });
          if (updated) {
            moodleUserId = dbUser.moodle_user_id;
            moodleUsername = dbUser.moodle_username || dbUser.username;
            console.log(`✅ User updated in Moodle: ${moodleUserId}`);
          }
        } catch (error: any) {
          console.error('⚠️ Failed to update user in Moodle, trying to create:', error.message);
          // If update fails, try to create new user
        }
      }

      // If no Moodle ID or update failed, create new user in Moodle
      if (!moodleUserId) {
        try {
          // For sync, we need a password. If not provided, generate a temporary one
          // In production, you might want to require password or use a different approach
          const syncPassword = password || `TempPass${Date.now()}`;
          
          moodleUserId = await moodleService.createUser({
            username: dbUser.username,
            password: syncPassword,
            firstname,
            lastname,
            email: dbUser.email,
          });
          moodleUsername = dbUser.username;
          console.log(`✅ User synced to Moodle with ID: ${moodleUserId}`);
        } catch (error: any) {
          console.error('⚠️ Failed to sync user to Moodle:', error.message);
          throw new Error(`Failed to sync user to Moodle: ${error.message}`);
        }
      }

      // Update database with Moodle ID
      const result = await client.query(
        `UPDATE users SET moodle_user_id = $1, moodle_username = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
        [moodleUserId, moodleUsername, id]
      );

      await client.query('COMMIT');

      return toUserResponse(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export const userService = new UserService();

