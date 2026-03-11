'use client';

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

import { WebGLFallback } from './WebGLFallback';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SceneErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('[SceneErrorBoundary] WebGL scene crashed:', error, info);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <WebGLFallback />;
    }

    return this.props.children;
  }
}
