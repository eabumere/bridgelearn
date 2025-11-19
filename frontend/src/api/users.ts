import apiClient from '../utils/apiClient';

export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  role: 'admin' | 'student' | 'tutor' | 'parent';
  moodle_user_id?: number | null;
  moodle_username?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'student' | 'tutor' | 'parent';
  syncToMoodle?: boolean;
}

export interface UpdateUserInput {
  email?: string;
  username?: string;
  name?: string;
  role?: 'admin' | 'student' | 'tutor' | 'parent';
  is_active?: boolean;
}

export interface UsersResponse {
  users: User[];
  total: number;
}

export const usersApi = {
  // Get all users
  getAllUsers: async (limit = 100, offset = 0): Promise<UsersResponse> => {
    const response = await apiClient.get('/users', {
      params: { limit, offset },
    });
    return response.data.data;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data;
  },

  // Create user
  createUser: async (input: CreateUserInput): Promise<User> => {
    const response = await apiClient.post('/users', input);
    return response.data.data;
  },

  // Update user
  updateUser: async (id: number, input: UpdateUserInput): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, input);
    return response.data.data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Sync user to Moodle
  syncUserToMoodle: async (id: number, password?: string): Promise<User> => {
    const response = await apiClient.post(`/users/${id}/sync`, { password });
    return response.data.data;
  },
};

