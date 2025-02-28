
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-destructive">Something went wrong</h2>
            <p className="mb-4 text-muted-foreground">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <pre className="mb-4 max-h-40 overflow-auto rounded bg-muted p-2 text-xs">
              {this.state.error?.stack}
            </pre>
            <button
              className="rounded bg-primary px-4 py-2 text-primary-foreground"
              onClick={() => window.location.reload()}
            >
              Refresh the page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
