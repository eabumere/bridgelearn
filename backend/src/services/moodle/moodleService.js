import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
// Moodle REST API client
class MoodleService {
    client;
    baseUrl;
    token;
    constructor() {
        this.baseUrl = process.env.MOODLE_URL || 'http://moodle-app:8080';
        // In production, this should be stored securely
        // For now, using a default token - should be configured via env
        this.token = process.env.MOODLE_TOKEN || '';
        this.client = axios.create({
            baseURL: `${this.baseUrl}/webservice/rest/server.php`,
            timeout: 30000,
            params: {
                wstoken: this.token,
                moodlewsrestformat: 'json',
            },
        });
    }
    /**
     * Create a user in Moodle
     * @param userData User data to create in Moodle
     * @returns Moodle user ID
     */
    async createUser(userData) {
        try {
            const response = await this.client.post('', null, {
                params: {
                    wsfunction: 'core_user_create_users',
                    users: [
                        {
                            username: userData.username,
                            password: userData.password,
                            firstname: userData.firstname,
                            lastname: userData.lastname,
                            email: userData.email,
                            auth: 'manual', // Manual authentication
                        },
                    ],
                },
            });
            if (response.data && response.data.length > 0 && response.data[0].id) {
                return response.data[0].id;
            }
            // If user already exists, try to get existing user
            if (response.data.exception) {
                const existingUser = await this.getUserByUsername(userData.username);
                if (existingUser) {
                    return existingUser.id;
                }
                throw new Error(`Moodle error: ${response.data.message || 'Unknown error'}`);
            }
            throw new Error('Failed to create user in Moodle');
        }
        catch (error) {
            console.error('❌ Error creating user in Moodle:', error);
            if (error.response?.data) {
                throw new Error(`Moodle API error: ${JSON.stringify(error.response.data)}`);
            }
            throw error;
        }
    }
    /**
     * Get user by username from Moodle
     */
    async getUserByUsername(username) {
        try {
            const response = await this.client.post('', null, {
                params: {
                    wsfunction: 'core_user_get_users_by_field',
                    field: 'username',
                    values: [username],
                },
            });
            if (response.data && response.data.length > 0) {
                return {
                    id: response.data[0].id,
                    username: response.data[0].username,
                };
            }
            return null;
        }
        catch (error) {
            console.error('❌ Error getting user from Moodle:', error);
            return null;
        }
    }
    /**
     * Update user in Moodle
     */
    async updateUser(userId, userData) {
        try {
            const response = await this.client.post('', null, {
                params: {
                    wsfunction: 'core_user_update_users',
                    users: [
                        {
                            id: userId,
                            ...userData,
                        },
                    ],
                },
            });
            return !response.data.exception;
        }
        catch (error) {
            console.error('❌ Error updating user in Moodle:', error);
            return false;
        }
    }
    /**
     * Delete user from Moodle (soft delete - suspend)
     */
    async deleteUser(userId) {
        try {
            const response = await this.client.post('', null, {
                params: {
                    wsfunction: 'core_user_delete_users',
                    userids: [userId],
                },
            });
            return !response.data.exception;
        }
        catch (error) {
            console.error('❌ Error deleting user from Moodle:', error);
            return false;
        }
    }
    /**
     * Test Moodle connection
     */
    async testConnection() {
        try {
            const response = await this.client.post('', null, {
                params: {
                    wsfunction: 'core_webservice_get_site_info',
                },
            });
            return !!response.data;
        }
        catch (error) {
            console.error('❌ Moodle connection test failed:', error);
            return false;
        }
    }
}
export const moodleService = new MoodleService();
