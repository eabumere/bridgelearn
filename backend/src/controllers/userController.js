import { userService } from '../services/userService';
export class UserController {
    /**
     * GET /api/users - Get all users
     */
    async getAllUsers(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 100;
            const offset = parseInt(req.query.offset) || 0;
            const result = await userService.getAllUsers(limit, offset);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
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
    async getUserById(req, res) {
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
        }
        catch (error) {
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
    async createUser(req, res) {
        try {
            const input = {
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
        }
        catch (error) {
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
    async updateUser(req, res) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid user ID',
                });
            }
            const input = {
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
        }
        catch (error) {
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
    async deleteUser(req, res) {
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
        }
        catch (error) {
            console.error('❌ Error in deleteUser:', error);
            res.status(400).json({
                success: false,
                error: error.message || 'Failed to delete user',
            });
        }
    }
}
export const userController = new UserController();
