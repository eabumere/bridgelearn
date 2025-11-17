import apiClient from '../utils/apiClient';

export interface ClassroomSession {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  participants: Array<{
    id: string;
    name: string;
    role: 'teacher' | 'student' | 'support';
  }>;
}

export const classroomApi = {
  // Get active session
  getActiveSession: async (): Promise<ClassroomSession | null> => {
    try {
      const response = await apiClient.get('/classroom/active');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Start a new session
  startSession: async (sessionId: string): Promise<ClassroomSession> => {
    const response = await apiClient.post(`/classroom/${sessionId}/start`);
    return response.data;
  },

  // End session
  endSession: async (sessionId: string): Promise<void> => {
    await apiClient.post(`/classroom/${sessionId}/end`);
  },

  // Get session participants
  getParticipants: async (sessionId: string): Promise<any[]> => {
    const response = await apiClient.get(`/classroom/${sessionId}/participants`);
    return response.data;
  },

  // Join session
  joinSession: async (sessionId: string): Promise<ClassroomSession> => {
    const response = await apiClient.post(`/classroom/${sessionId}/join`);
    return response.data;
  },

  // Leave session
  leaveSession: async (sessionId: string): Promise<void> => {
    await apiClient.post(`/classroom/${sessionId}/leave`);
  },
};

