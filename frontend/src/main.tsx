import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { ErrorBoundary } from './components/ErrorBoundary'
import { setUser } from './store/userSlice'
import { auth } from './utils/auth'
import './index.css'
import App from './App.tsx'

console.log('🚀 BridgeLearn App Starting...');

// Initialize user from localStorage if exists
const savedUser = auth.getCurrentUser();
if (savedUser) {
  store.dispatch(setUser(savedUser));
  console.log('👤 Restored user from localStorage:', savedUser);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </StrictMode>,
  );
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ Error rendering app:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: Arial;">
      <h1>Error Loading App</h1>
      <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
      <pre>${error instanceof Error ? error.stack : JSON.stringify(error)}</pre>
    </div>
  `;
}
