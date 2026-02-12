"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[neuroforge:error-boundary]", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <p>Something went wrong. Please refresh.</p>;
    }

    return this.props.children;
  }
}
