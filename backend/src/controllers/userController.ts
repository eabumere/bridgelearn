import { Request, Response } from 'express';
import { userService } from '../services/userService.js';
import type { CreateUserInput, UpdateUserInput } from '../models/User.js';

export class UserController {
  /**
   * GET /api/users - Get all users
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await userService.getAllUsers(limit, offset);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('❌ Error in getAllUsers:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch users',
      });
    }
  }

  /**
   * GET /api/users/:id - Get user by ID
   */
  async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID',
        });
      }

      const user = await userService.getUserById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      console.error('❌ Error in getUserById:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch user',
      });
    }
  }

  /**
   * POST /api/users - Create new user
   */
  async createUser(req: Request, res: Response) {
    try {
      const input: CreateUserInput = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        role: req.body.role || 'student',
        syncToMoodle: req.body.syncToMoodle !== false, // Default to true
      };

      // Validation
      if (!input.email || !input.username || !input.password || !input.name) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: email, username, password, name',
        });
      }

      // Validate role
      const validRoles = ['admin', 'student', 'tutor', 'parent'];
      if (!validRoles.includes(input.role)) {
        return res.status(400).json({
          success: false,
          error: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
        });
      }

      const user = await userService.createUser(input);

      res.status(201).json({
        success: true,
        data: user,
        message: input.syncToMoodle 
          ? 'User created and synced to Moodle successfully' 
          : 'User created successfully',
      });
    } catch (error: any) {
      console.error('❌ Error in createUser:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create user',
      });
    }
  }

  /**
   * PUT /api/users/:id - Update user
   */
  async updateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID',
        });
      }

      const input: UpdateUserInput = {
        email: req.body.email,
        username: req.body.username,
        name: req.body.name,
        role: req.body.role,
        is_active: req.body.is_active,
      };

      // Validate role if provided
      if (input.role) {
        const validRoles = ['admin', 'student', 'tutor', 'parent'];
        if (!validRoles.includes(input.role)) {
          return res.status(400).json({
            success: false,
            error: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
          });
        }
      }

      const user = await userService.updateUser(id, input);

      res.json({
        success: true,
        data: user,
        message: 'User updated successfully',
      });
    } catch (error: any) {
      console.error('❌ Error in updateUser:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update user',
      });
    }
  }

  /**
   * DELETE /api/users/:id - Delete user (soft delete)
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID',
        });
      }

      await userService.deleteUser(id);

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error: any) {
      console.error('❌ Error in deleteUser:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to delete user',
      });
    }
  }

  /**
   * POST /api/users/:id/sync - Manually sync user to Moodle
   */
  async syncUserToMoodle(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid user ID',
        });
      }

      const password = req.body.password; // Optional password for sync

      const user = await userService.syncUserToMoodle(id, password);

      res.json({
        success: true,
        data: user,
        message: 'User synced to Moodle successfully',
      });
    } catch (error: any) {
      console.error('❌ Error in syncUserToMoodle:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to sync user to Moodle',
      });
    }
  }
}

export const userController = new UserController();

