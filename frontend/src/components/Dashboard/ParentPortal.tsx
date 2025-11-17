import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../store/hooks';
import { Users, TrendingUp, Calendar, FileText } from 'lucide-react';
import { cn } from '../../utils/cn';
import { progressApi } from '../../api/progress';

export default function ParentPortal() {
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    // Load children's progress
    const loadData = async () => {
      try {
        // TODO: Load children data based on parent ID
        const progress = await progressApi.getAllProgress();
        console.log('Children Progress:', progress);
      } catch (error) {
        console.error('Error loading children data:', error);
      }
    };
    loadData();
  }, []);

  const stats = [
    { label: 'Children', value: '2', icon: Users, color: 'blue' },
    { label: 'Average Progress', value: '87%', icon: TrendingUp, color: 'green' },
    { label: 'Classes This Week', value: '12', icon: Calendar, color: 'purple' },
    { label: 'Reports Available', value: '8', icon: FileText, color: 'yellow' },
  ];

  const children = [
    {
      id: '1',
      name: 'Sarah Johnson',
      grade: 'Grade 5',
      progress: 92,
      courses: 5,
      nextClass: 'Mathematics - Today at 10:00 AM',
    },
    {
      id: '2',
      name: 'Michael Johnson',
      grade: 'Grade 3',
      progress: 78,
      courses: 4,
      nextClass: 'Science - Tomorrow at 2:00 PM',
    },
  ];

  const recentReports = [
    { id: '1', child: 'Sarah Johnson', subject: 'Mathematics', score: 95, date: '2 days ago' },
    { id: '2', child: 'Michael Johnson', subject: 'Science', score: 88, date: '3 days ago' },
    { id: '3', child: 'Sarah Johnson', subject: 'English', score: 92, date: '5 days ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user?.name || 'Parent'}! 👨‍👩‍👧‍👦
        </h1>
        <p className="text-purple-100">Track your children's learning progress</p>
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
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
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
        {/* Children Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Children Overview
            </h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {children.map((child) => (
              <div
                key={child.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {child.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {child.grade} • {child.courses} courses
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {child.progress}%
                    </p>
                    <p className="text-xs text-gray-500">Progress</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${child.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Next: {child.nextClass}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Reports
            </h2>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {report.subject}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {report.child} • {report.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {report.score}%
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

