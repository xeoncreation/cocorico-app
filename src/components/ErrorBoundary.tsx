"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border rounded-lg bg-red-50 text-red-900">
          <h2 className="text-lg font-semibold mb-2">Lo sentimos, ha ocurrido un error</h2>
          <p className="text-sm mb-2">
            Intenta recargar la página. Si el problema persiste:
          </p>
          <ul className="text-sm list-disc list-inside mb-4">
            <li>Intenta usar el modo incógnito del navegador</li>
            <li>O usa un navegador sin la extensión MetaMask</li>
            <li>O desactiva temporalmente la extensión MetaMask</li>
          </ul>
          {this.state.error && (
            <div className="mt-4 p-2 bg-red-100 rounded text-sm font-mono overflow-auto">
              {this.state.error.message}
            </div>
          )}
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-red-100 text-red-900 rounded hover:bg-red-200"
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}