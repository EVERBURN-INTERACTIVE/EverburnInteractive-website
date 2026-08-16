'use client';

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

import { WebGLFallback } from './WebGLFallback';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  assetLoadError: boolean;
}

export class SceneErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, assetLoadError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const assetLoadError = /glb|gltf|could not load|404/i.test(error.message);
    return { hasError: true, assetLoadError };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('[SceneErrorBoundary] Scene crashed:', error, info);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <WebGLFallback assetLoadError={this.state.assetLoadError} />;
    }

    return this.props.children;
  }
}
