import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-dark-800 rounded-xl p-8 text-center border border-dark-600">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-danger-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-danger-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-100 mb-2">
              Wystapil nieoczekiwany blad
            </h1>
            <p className="text-gray-400 mb-6">
              Przepraszamy, cos poszlo nie tak. Sprobuj odswiezyc strone.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Wroc do strony glownej
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
