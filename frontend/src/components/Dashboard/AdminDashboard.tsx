import { motion } from 'framer-motion';
import { useAppSelector } from '../../store/hooks';
import { Users, BookOpen, Clock, TrendingUp, Settings, Shield, BarChart3 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAppSelector((state) => state.user);

  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'blue', link: '/admin/users' },
    { label: 'Active Courses', value: '48', icon: BookOpen, color: 'green', link: '/admin/courses' },
    { label: 'Active Sessions', value: '12', icon: Clock, color: 'purple', link: '/admin/sessions' },
    { label: 'System Health', value: '99.9%', icon: TrendingUp, color: 'yellow', link: '/admin/health' },
  ];

  const quickActions = [
    { id: '1', title: 'User Management', description: 'Manage users, roles, and permissions', icon: Users, link: '/admin/users', color: 'blue' },
    { id: '2', title: 'Course Management', description: 'Manage courses and curriculum', icon: BookOpen, link: '/admin/courses', color: 'green' },
    { id: '3', title: 'System Settings', description: 'Configure system settings', icon: Settings, link: '/admin/settings', color: 'purple' },
    { id: '4', title: 'Analytics & Reports', description: 'View system analytics and reports', icon: BarChart3, link: '/admin/analytics', color: 'yellow' },
    { id: '5', title: 'Role Management', description: 'Manage user roles and permissions', icon: Shield, link: '/admin/roles', color: 'red' },
    { id: '6', title: 'Live Sessions', description: 'Monitor active classroom sessions', icon: Clock, link: '/admin/sessions', color: 'indigo' },
  ];

  const recentActivity = [
    { id: '1', type: 'user', message: 'New user registered: john.doe@example.com', time: '5 min ago' },
    { id: '2', type: 'course', message: 'Course "Mathematics 101" was updated', time: '1 hour ago' },
    { id: '3', type: 'session', message: 'New classroom session started', time: '2 hours ago' },
    { id: '4', type: 'system', message: 'System backup completed successfully', time: '3 hours ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {user?.name || 'Administrator'}! 🔐
            </h1>
            <p className="text-red-100">System Administration Dashboard</p>
          </div>
          <Shield className="w-16 h-16 opacity-80" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700",
                  "hover:shadow-md transition-shadow cursor-pointer"
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
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.id}
                  to={action.link}
                  className={cn(
                    "p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors",
                    "border border-gray-200 dark:border-gray-600"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        action.color === 'blue' && "bg-blue-100 dark:bg-blue-900",
                        action.color === 'green' && "bg-green-100 dark:bg-green-900",
                        action.color === 'purple' && "bg-purple-100 dark:bg-purple-900",
                        action.color === 'yellow' && "bg-yellow-100 dark:bg-yellow-900",
                        action.color === 'red' && "bg-red-100 dark:bg-red-900",
                        action.color === 'indigo' && "bg-indigo-100 dark:bg-indigo-900"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          action.color === 'blue' && "text-blue-600 dark:text-blue-400",
                          action.color === 'green' && "text-green-600 dark:text-green-400",
                          action.color === 'purple' && "text-purple-600 dark:text-purple-400",
                          action.color === 'yellow' && "text-yellow-600 dark:text-yellow-400",
                          action.color === 'red' && "text-red-600 dark:text-red-400",
                          action.color === 'indigo' && "text-indigo-600 dark:text-indigo-400"
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
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
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  activity.type === 'user' && "bg-blue-100 dark:bg-blue-900",
                  activity.type === 'course' && "bg-green-100 dark:bg-green-900",
                  activity.type === 'session' && "bg-purple-100 dark:bg-purple-900",
                  activity.type === 'system' && "bg-yellow-100 dark:bg-yellow-900"
                )}>
                  <Clock className={cn(
                    "w-4 h-4",
                    activity.type === 'user' && "text-blue-600 dark:text-blue-400",
                    activity.type === 'course' && "text-green-600 dark:text-green-400",
                    activity.type === 'session' && "text-purple-600 dark:text-purple-400",
                    activity.type === 'system' && "text-yellow-600 dark:text-yellow-400"
                  )} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* View All Dashboards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          View Other Dashboards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/student"
            className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors border border-blue-200 dark:border-blue-700"
          >
            <p className="font-medium text-blue-900 dark:text-blue-100">Student Dashboard</p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">View as student</p>
          </Link>
          <Link
            to="/dashboard/tutor"
            className="p-4 bg-green-50 dark:bg-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-800 transition-colors border border-green-200 dark:border-green-700"
          >
            <p className="font-medium text-green-900 dark:text-green-100">Tutor Dashboard</p>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">View as tutor</p>
          </Link>
          <Link
            to="/dashboard/parent"
            className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors border border-purple-200 dark:border-purple-700"
          >
            <p className="font-medium text-purple-900 dark:text-purple-100">Parent Portal</p>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">View as parent</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

