// AWS Cognito integration for authentication
// This is a placeholder - implement with actual AWS Amplify/Cognito SDK

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'tutor' | 'parent' | 'admin';
  avatar?: string;
}

export const auth = {
  // Sign in user
  signIn: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // TODO: Implement AWS Cognito sign-in
    // For now, mock authentication with specific credentials
    const validCredentials = {
      'aejakhegbe': 'P@ssword1234',
      'admin': 'P@ssword1234',
      'admin@bridgelearn.com': 'P@ssword1234',
      'test@example.com': 'password',
    };
    
    // Check if credentials are valid
    const isValid = 
      (email === 'aejakhegbe' && password === 'P@ssword1234') ||
      (email === 'admin' && password === 'P@ssword1234') ||
      (email === 'admin@bridgelearn.com' && password === 'P@ssword1234') ||
      (validCredentials[email as keyof typeof validCredentials] === password);
    
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
    
    // Determine user role and name based on email
    let userRole: User['role'] = 'student';
    let userName = 'User';
    
    if (email === 'aejakhegbe') {
      userName = 'aejakhegbe';
      userRole = 'admin'; // Admin role - can see everything
    } else if (email === 'admin' || email === 'admin@bridgelearn.com') {
      userName = 'Administrator';
      userRole = 'admin';
    } else if (email.includes('tutor') || email.includes('teacher')) {
      userName = email.split('@')[0];
      userRole = 'tutor';
    } else if (email.includes('parent')) {
      userName = email.split('@')[0];
      userRole = 'parent';
    } else {
      userName = email.split('@')[0];
      userRole = 'student';
    }
    
    const mockUser: User = {
      id: '1',
      email: email.includes('@') ? email : `${email}@bridgelearn.com`,
      name: userName,
      role: userRole,
    };
    const token = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return { user: mockUser, token };
  },

  // Sign up new user
  signUp: async (email: string, _password: string, name: string, role: User['role']): Promise<User> => {
    // TODO: Implement AWS Cognito sign-up
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
    };
    return mockUser;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // TODO: Call Cognito sign-out
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<string> => {
    // TODO: Implement token refresh with Cognito
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token to refresh');
    return token;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};

