"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
          <p className="text-destructive text-sm">
            오류가 발생했습니다: {this.state.error.message}
          </p>
          <Button variant="outline" size="sm" onClick={this.reset}>
            다시 시도
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
