import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Moodle REST API client
class MoodleService {
  private client: AxiosInstance;
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = process.env.MOODLE_URL || 'http://moodle-app:80';
    // In production, this should be stored securely
    // For now, using a default token - should be configured via env
    this.token = process.env.MOODLE_TOKEN || '';
    
    const restEndpoint = `${this.baseUrl}/webservice/rest/server.php`;
    console.log(`🔗 Moodle REST API endpoint: ${restEndpoint}`);
    
    this.client = axios.create({
      baseURL: restEndpoint,
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
  async createUser(userData: {
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
  }): Promise<number> {
    try {
      // Check if token is configured
      if (!this.token) {
        throw new Error('Moodle web service token is not configured. Please set MOODLE_TOKEN environment variable.');
      }

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

      // Check for HTML response (404 or error page)
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE')) {
        throw new Error('Moodle REST API endpoint not found. Please ensure Moodle web services are enabled and the endpoint path is correct.');
      }

      // Check for exception in response
      if (response.data?.exception) {
        const errorMsg = response.data.message || response.data.errorcode || 'Unknown error';
        // If user already exists, try to get existing user
        if (errorMsg.includes('already exists') || errorMsg.includes('duplicate')) {
          const existingUser = await this.getUserByUsername(userData.username);
          if (existingUser) {
            return existingUser.id;
          }
        }
        throw new Error(`Moodle error: ${errorMsg}`);
      }

      if (response.data && Array.isArray(response.data) && response.data.length > 0 && response.data[0].id) {
        return response.data[0].id;
      }

      throw new Error('Failed to create user in Moodle: Invalid response format');
    } catch (error: any) {
      console.error('❌ Error creating user in Moodle:', error);
      
      // Handle HTTP errors
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 404) {
          throw new Error('Moodle REST API endpoint not found (404). Please ensure:\n1. Moodle web services are enabled\n2. REST protocol is enabled\n3. The endpoint path is correct');
        }
        
        if (status === 401 || status === 403) {
          throw new Error('Moodle authentication failed. Please check your MOODLE_TOKEN.');
        }
        
        if (typeof data === 'string' && data.includes('<!DOCTYPE')) {
          throw new Error('Moodle returned an HTML error page. The REST API endpoint may not be configured correctly.');
        }
        
        throw new Error(`Moodle API error (${status}): ${JSON.stringify(data)}`);
      }
      
      // Handle network errors
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Cannot connect to Moodle at ${this.baseUrl}. Please ensure Moodle is running and accessible.`);
      }
      
      // Re-throw if it's already a formatted error
      if (error.message) {
        throw error;
      }
      
      throw new Error(`Failed to create user in Moodle: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Get user by username from Moodle
   */
  async getUserByUsername(username: string): Promise<{ id: number; username: string } | null> {
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
    } catch (error) {
      console.error('❌ Error getting user from Moodle:', error);
      return null;
    }
  }

  /**
   * Update user in Moodle
   */
  async updateUser(userId: number, userData: {
    firstname?: string;
    lastname?: string;
    email?: string;
  }): Promise<boolean> {
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
    } catch (error) {
      console.error('❌ Error updating user in Moodle:', error);
      return false;
    }
  }

  /**
   * Delete user from Moodle (soft delete - suspend)
   */
  async deleteUser(userId: number): Promise<boolean> {
    try {
      const response = await this.client.post('', null, {
        params: {
          wsfunction: 'core_user_delete_users',
          userids: [userId],
        },
      });

      return !response.data.exception;
    } catch (error) {
      console.error('❌ Error deleting user from Moodle:', error);
      return false;
    }
  }

  /**
   * Test Moodle connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this.token) {
        return {
          success: false,
          message: 'Moodle web service token is not configured (MOODLE_TOKEN environment variable is missing)',
        };
      }

      const response = await this.client.post('', null, {
        params: {
          wsfunction: 'core_webservice_get_site_info',
        },
      });

      // Check for HTML response (404 or error page)
      if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE')) {
        return {
          success: false,
          message: 'Moodle REST API endpoint not found. Please ensure Moodle web services are enabled.',
        };
      }

      if (response.data?.exception) {
        return {
          success: false,
          message: `Moodle error: ${response.data.message || response.data.errorcode || 'Unknown error'}`,
        };
      }

      return {
        success: true,
        message: `Connected to Moodle successfully. Site: ${response.data?.sitename || 'Unknown'}`,
      };
    } catch (error: any) {
      console.error('❌ Moodle connection test failed:', error);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Moodle REST API endpoint not found (404). Please ensure Moodle web services are enabled and configured.',
        };
      }
      
      if (error.code === 'ECONNREFUSED') {
        return {
          success: false,
          message: `Cannot connect to Moodle at ${this.baseUrl}. Please ensure Moodle is running.`,
        };
      }
      
      return {
        success: false,
        message: `Connection test failed: ${error.message || 'Unknown error'}`,
      };
    }
  }
}

export const moodleService = new MoodleService();

