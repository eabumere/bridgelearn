import apiClient from '../utils/apiClient';

export interface ProgressReport {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  completion: number;
  grades: Array<{
    assignment: string;
    score: number;
    maxScore: number;
    date: string;
  }>;
  lastUpdated: string;
}

export const progressApi = {
  // Get student progress
  getStudentProgress: async (studentId: string): Promise<ProgressReport[]> => {
    const response = await apiClient.get(`/progress/student/${studentId}`);
    return response.data;
  },

  // Get course progress
  getCourseProgress: async (courseId: string): Promise<ProgressReport> => {
    const response = await apiClient.get(`/progress/course/${courseId}`);
    return response.data;
  },

  // Get all progress reports
  getAllProgress: async (): Promise<ProgressReport[]> => {
    const response = await apiClient.get('/progress');
    return response.data;
  },
};

