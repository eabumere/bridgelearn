import apiClient from '../utils/apiClient';

export interface MoodleCourse {
  id: string;
  name: string;
  shortname: string;
  summary: string;
  enrolled: boolean;
}

export interface MoodleGrade {
  id: string;
  courseId: string;
  assignment: string;
  score: number;
  maxScore: number;
  date: string;
}

export const moodleApi = {
  // Sync courses from Moodle
  syncCourses: async (): Promise<MoodleCourse[]> => {
    const response = await apiClient.post('/moodle/sync/courses');
    return response.data;
  },

  // Get enrolled courses
  getEnrolledCourses: async (): Promise<MoodleCourse[]> => {
    const response = await apiClient.get('/moodle/courses');
    return response.data;
  },

  // Get grades
  getGrades: async (courseId?: string): Promise<MoodleGrade[]> => {
    const url = courseId ? `/moodle/grades/${courseId}` : '/moodle/grades';
    const response = await apiClient.get(url);
    return response.data;
  },

  // Enroll in course
  enrollInCourse: async (courseId: string): Promise<void> => {
    await apiClient.post(`/moodle/courses/${courseId}/enroll`);
  },
};

