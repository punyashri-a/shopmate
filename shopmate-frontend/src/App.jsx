import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { ShoppingProvider } from './context/ShoppingContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppLayout from './components/layout/AppLayout';

// Route-based code splitting with React.lazy
const Home = lazy(() => import('./pages/Home'));
const AIMode = lazy(() => import('./pages/AIMode'));

const PageLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
    <Loader2 className="w-7 h-7 text-sage-600 animate-spin" />
    <span className="text-xs font-semibold text-charcoal-400">
      Loading ShopMate...
    </span>
  </div>
);

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ShoppingProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route
                  index
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Home />
                    </Suspense>
                  }
                />
                <Route
                  path="ai"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <AIMode />
                    </Suspense>
                  }
                />
                {/* Compatibility redirects */}
                <Route path="assistant" element={<Navigate to="/ai" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ShoppingProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
