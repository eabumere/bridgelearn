import { motion } from 'framer-motion';
import { useAppSelector } from '../../store/hooks';
import { Users, BookOpen, Clock, TrendingUp, MessageSquare } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function TutorDashboard() {
  const { user } = useAppSelector((state) => state.user);

  const stats = [
    { label: 'Total Students', value: '24', icon: Users, color: 'blue' },
    { label: 'Active Classes', value: '8', icon: BookOpen, color: 'green' },
    { label: 'Hours This Week', value: '32', icon: Clock, color: 'purple' },
    { label: 'Student Satisfaction', value: '98%', icon: TrendingUp, color: 'yellow' },
  ];

  const upcomingSessions = [
    { id: '1', title: 'Mathematics - Algebra', students: 5, time: '10:00 AM', date: 'Today' },
    { id: '2', title: 'Science - Physics', students: 8, time: '2:00 PM', date: 'Today' },
    { id: '3', title: 'English - Literature', students: 6, time: '4:00 PM', date: 'Tomorrow' },
  ];

  const recentActivity = [
    { id: '1', type: 'message', message: 'New message from Sarah', time: '5 min ago' },
    { id: '2', type: 'assignment', message: 'John submitted Math homework', time: '1 hour ago' },
    { id: '3', type: 'enrollment', message: '3 new students enrolled', time: '2 hours ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {user?.name || 'Tutor'}! 📚
        </h1>
        <p className="text-green-100">Manage your classes and students</p>
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
        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Upcoming Sessions
            </h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {session.title}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <span>{session.students} students</span>
                    <span>{session.date} at {session.time}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                  Start
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.time}
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

