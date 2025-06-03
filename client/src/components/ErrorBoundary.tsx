import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error!} />;
      }

      return (
        <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
          <div className="bg-[#1C1F2B] border border-[#2A3441] rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-[#E0E1DD] mb-4">Something went wrong</h2>
            <p className="text-[#A0A3A8] mb-4">
              There was an error loading the application. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#F4A261] hover:bg-[#E76F51] text-[#0D1B2A] px-4 py-2 rounded font-medium transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}