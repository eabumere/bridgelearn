export interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'student' | 'tutor' | 'parent';
  moodle_user_id?: number | null;
  moodle_username?: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
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

export interface UserResponse {
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

