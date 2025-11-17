import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, lazy, Suspense, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setUser } from './store/userSlice';
import Layout from './components/Layout';
import { auth } from './utils/auth';

// Lazy load heavy components to improve initial page load (login page loads faster)
const StudentDashboard = lazy(() => import('./components/Dashboard/StudentDashboard'));
const TutorDashboard = lazy(() => import('./components/Dashboard/TutorDashboard'));
const ParentPortal = lazy(() => import('./components/Dashboard/ParentPortal'));
const AdminDashboard = lazy(() => import('./components/Dashboard/AdminDashboard'));
const ClassroomPage = lazy(() => import('./components/LiveClassroom/ClassroomPage'));

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50vh' 
  }}>
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      color: '#6b7280'
    }}>
      Loading...
    </div>
  </div>
);

function App() {
  console.log('📱 App component rendering...');
  
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.user);
  console.log('👤 User state:', { user, isAuthenticated });

  // Protected Route Component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    // Check both Redux state and localStorage for authentication
    const savedUser = auth.getCurrentUser();
    const routeAuth = useAppSelector((state) => state.user);
    const authenticated = routeAuth.isAuthenticated || !!savedUser;
    
    // Sync localStorage user to Redux if needed
    useEffect(() => {
      if (savedUser && !routeAuth.user) {
        dispatch(setUser(savedUser));
      }
    }, [savedUser, routeAuth.user, dispatch]);
    
    if (!authenticated) {
      console.log('🔒 User not authenticated, redirecting to login');
      return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
  };

  console.log('🌐 Setting up routes...');

  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard Routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminDashboard />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <StudentDashboard />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/tutor"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <TutorDashboard />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/parent"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                  <ParentPortal />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Classroom Route */}
        <Route
          path="/classroom/:sessionId"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <ClassroomPage />
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Default redirect based on user role */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user?.role === 'admin' ? (
                <Navigate to="/dashboard/admin" replace />
              ) : user?.role === 'tutor' ? (
                <Navigate to="/dashboard/tutor" replace />
              ) : user?.role === 'parent' ? (
                <Navigate to="/dashboard/parent" replace />
              ) : (
                <Navigate to="/dashboard/student" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login placeholder */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// Login Page
function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.user);
  const [email, setEmail] = useState('aejakhegbe');
  const [password, setPassword] = useState('P@ssword1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = 
        user.role === 'admin' ? '/dashboard/admin' :
        user.role === 'tutor' ? '/dashboard/tutor' :
        user.role === 'parent' ? '/dashboard/parent' :
        '/dashboard/student';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await auth.signIn(email, password);
      const loggedInUser = result.user;
      console.log('✅ Login successful, user:', loggedInUser);
      console.log('👤 User role:', loggedInUser.role);
      console.log('🔐 Is admin?', loggedInUser.role === 'admin');
      
      // Dispatch user to Redux store (this updates state synchronously)
      dispatch(setUser(loggedInUser));
      
      // Determine redirect path based on user role
      const redirectPath = 
        loggedInUser.role === 'admin' ? '/dashboard/admin' :
        loggedInUser.role === 'tutor' ? '/dashboard/tutor' :
        loggedInUser.role === 'parent' ? '/dashboard/parent' :
        '/dashboard/student';
      
      console.log('🚀 Redirecting to:', redirectPath);
      
      // Use window.location for reliable redirect (ensures fresh page load)
      // This is more reliable than navigate() when state might not be fully propagated
      window.location.href = redirectPath;
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #3b82f6, #a855f7)' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '2rem', width: '100%', maxWidth: '28rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1.5rem', color: '#111827' }}>
          BridgeLearn
        </h1>
        <p style={{ textAlign: 'center', color: '#4b5563', marginBottom: '2rem' }}>
          Welcome to your learning platform
        </p>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>
              Username or Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="aejakhegbe"
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Password"
            />
          </div>
          {error && (
            <div style={{ 
              padding: '0.75rem', 
              marginBottom: '1rem', 
              backgroundColor: '#fee2e2', 
              color: '#dc2626', 
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Demo: Use <strong>aejakhegbe</strong> / <strong>P@ssword1234</strong>
        </p>
      </div>
    </div>
  );
}

export default App;
