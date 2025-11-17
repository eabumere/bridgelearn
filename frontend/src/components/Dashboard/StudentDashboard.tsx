import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../store/hooks';
import { BookOpen, Award, Calendar, TrendingUp, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import { progressApi } from '../../api/progress';
import { moodleApi } from '../../api/moodle';

export default function StudentDashboard() {
  const { user } = useAppSelector((state) => state.user);
  const { totalPoints } = useAppSelector((state) => state.reaction);

  useEffect(() => {
    // Load student data
    const loadData = async () => {
      if (user?.id) {
        try {
          const progress = await progressApi.getStudentProgress(user.id);
          const courses = await moodleApi.getEnrolledCourses();
          console.log('Progress:', progress);
          console.log('Courses:', courses);
        } catch (error) {
          console.error('Error loading student data:', error);
        }
      }
    };
    loadData();
  }, [user]);

  const stats = [
    { label: 'Active Courses', value: '5', icon: BookOpen, color: 'blue' },
    { label: 'Total Points', value: totalPoints.toString(), icon: Award, color: 'yellow' },
    { label: 'Upcoming Classes', value: '3', icon: Calendar, color: 'green' },
    { label: 'Completion Rate', value: '85%', icon: TrendingUp, color: 'purple' },
  ];

  const upcomingClasses = [
    { id: '1', title: 'Mathematics - Algebra', time: '10:00 AM', date: 'Today' },
    { id: '2', title: 'Science - Physics', time: '2:00 PM', date: 'Tomorrow' },
    { id: '3', title: 'English - Literature', time: '4:00 PM', date: 'Tomorrow' },
  ];

  const recentAchievements = [
    { id: '1', title: 'Perfect Attendance', description: 'Attended all classes this week', icon: '🎯' },
    { id: '2', title: 'Top Performer', description: 'Scored highest in Math quiz', icon: '🏆' },
    { id: '3', title: 'Quick Learner', description: 'Completed 5 lessons in a day', icon: '⚡' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || 'Student'}! 👋
        </h1>
        <p className="text-blue-100">Ready to continue your learning journey?</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    stat.color === 'blue' && "bg-blue-100 dark:bg-blue-900",
                    stat.color === 'yellow' && "bg-yellow-100 dark:bg-yellow-900",
                    stat.color === 'green' && "bg-green-100 dark:bg-green-900",
                    stat.color === 'purple' && "bg-purple-100 dark:bg-purple-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6",
                      stat.color === 'blue' && "text-blue-600 dark:text-blue-400",
                      stat.color === 'yellow' && "text-yellow-600 dark:text-yellow-400",
                      stat.color === 'green' && "text-green-600 dark:text-green-400",
                      stat.color === 'purple' && "text-purple-600 dark:text-purple-400"
                    )}
                  />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upcoming Classes
            </h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {classItem.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{classItem.date} at {classItem.time}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                  Join
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Achievements
            </h2>
            <Award className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="text-4xl">{achievement.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {achievement.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

