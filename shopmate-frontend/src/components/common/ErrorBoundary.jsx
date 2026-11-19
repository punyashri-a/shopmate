import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-ivory-100 dark:bg-charcoal-900">
          <div className="card-warm p-8 max-w-lg w-full text-center space-y-4 bg-white dark:bg-charcoal-800 border-taupe-200 dark:border-charcoal-700 shadow-warm">
            <div className="w-14 h-14 rounded-2xl bg-terracotta-100 dark:bg-charcoal-800 text-terracotta-600 dark:text-terracotta-300 border border-terracotta-200/60 dark:border-charcoal-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-charcoal-800 dark:text-charcoal-100">
              Something went wrong
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed">
              An unexpected error occurred while rendering this view. You can reload the application to restore your session.
            </p>
            {this.state.error?.message && (
              <pre className="p-3 rounded-xl bg-ivory-50 dark:bg-charcoal-900 text-left text-[11px] font-mono text-terracotta-700 dark:text-terracotta-300 overflow-x-auto border border-taupe-200 dark:border-charcoal-700">
                {this.state.error.message}
              </pre>
            )}
            <div className="pt-2">
              <Button variant="primary" size="md" onClick={this.handleReset} icon={RotateCcw}>
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
