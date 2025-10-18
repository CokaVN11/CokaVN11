'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error for debugging
    console.error('GameBoy Error Boundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // In development, you might want to report to an error service
    if (process.env.NODE_ENV === 'production') {
      // Placeholder for future error service integration (e.g., Sentry)
      // reportError(error, errorInfo);
      console.log('Error service integration available for production');
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorBoundaryContent 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

// Extracted to use hooks outside of class component
function ErrorBoundaryContent({ 
  error, 
  errorInfo, 
  onReset 
}: { 
  error: Error | null; 
  errorInfo: ErrorInfo | null; 
  onReset: () => void; 
}) {
  const { theme } = useTheme();

  const handleReload = () => {
    window.location.reload();
  };

  const handleReportIssue = () => {
    const body = `**Error:** ${error?.message}\n\n**Stack Trace:**\n\`\`\`\n${error?.stack}\n\`\`\`\n\n**Component Stack:**\n\`\`\`\n${errorInfo?.componentStack}\n\`\`\``;
    const url = `https://github.com/your-repo/issues/new?body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-pixel">
      <div className="max-w-md w-full">
        {/* Error Container */}
        <div className="pokemon-card gba-shadow-lg p-6 text-center">
          {/* Error Icon */}
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
              <AlertTriangle size={32} className="text-white" />
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-xl font-bold mb-2">Game Crash!</h1>
          <p className="text-sm opacity-80 mb-6">
            Something went wrong in the GameBoy. But don't worry, your progress is safe!
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded border-2 gba-shadow-sm bg-red-50 border-red-200">
              <p className="text-xs font-mono text-red-800">
                {error.message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onReset}
              className="w-full pokemon-button gba-shadow flex items-center justify-center space-x-2 px-4 py-3 text-white font-semibold"
            >
              <RefreshCw size={16} />
              <span>Try Again</span>
            </button>

            <button
              onClick={handleReload}
              className="w-full pokemon-button gba-shadow-sm flex items-center justify-center space-x-2 px-4 py-2 text-white font-semibold"
            >
              <RefreshCw size={14} />
              <span>Reload Page</span>
            </button>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-xs font-semibold mb-2">
                  Technical Details
                </summary>
                <div className="mt-2 p-2 rounded text-xs bg-gray-100 border border-gray-300 max-h-32 overflow-auto font-mono">
                  <div className="mb-2">
                    <strong>Error:</strong>
                    <pre className="whitespace-pre-wrap">{error?.stack}</pre>
                  </div>
                  {errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <button
              onClick={handleReportIssue}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs opacity-70 hover:opacity-100 transition-opacity"
            >
              <Bug size={12} />
              <span>Report Issue</span>
            </button>
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-4 text-center">
          <p className="text-xs opacity-70">
            Even the best games have bugs sometimes! 🐛
          </p>
          <p className="text-xs opacity-70 mt-1">
            Theme: {theme === 'fire' ? '🔥 Fire Red' : '🍃 Leaf Green'}
          </p>
        </div>
      </div>
    </div>
  );
}