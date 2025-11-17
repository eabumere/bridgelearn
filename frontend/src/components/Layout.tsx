import { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSidebar, toggleDarkMode } from '../store/uiSlice';
import { logout } from '../store/userSlice';
import { auth } from '../utils/auth';
import { Menu, Moon, Sun, LogOut, Home, BookOpen, Users, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const { sidebarOpen, isDarkMode } = useAppSelector((state) => state.ui);

  const handleLogout = async () => {
    await auth.signOut();
    dispatch(logout());
    navigate('/login');
  };

  // Admin sees all dashboards, other users see only their own
  const allNavItems = [
    { path: '/dashboard/admin', label: 'Admin Dashboard', icon: Shield, roles: ['admin'] },
    { path: '/dashboard/student', label: 'Student Dashboard', icon: Home, roles: ['student', 'admin'] },
    { path: '/dashboard/tutor', label: 'Tutor Dashboard', icon: BookOpen, roles: ['tutor', 'admin'] },
    { path: '/dashboard/parent', label: 'Parent Portal', icon: Users, roles: ['parent', 'admin'] },
  ];

  const filteredNavItems = user?.role === 'admin' 
    ? allNavItems // Admin sees everything
    : allNavItems.filter(
        (item) => item.roles.includes(user?.role || '')
      );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              BridgeLearn
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? '256px' : '0px' }}
          className={cn(
            "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
            "overflow-hidden transition-all duration-300",
            !sidebarOpen && "border-r-0"
          )}
        >
          <nav className="p-4 space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg",
                    "hover:bg-gray-100 dark:hover:bg-gray-700",
                    "transition-colors text-gray-700 dark:text-gray-300"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

