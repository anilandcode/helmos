import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="max-w-lg w-full rounded-md border border-border bg-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-error" />
              <h1 className="text-lg font-semibold text-text-primary">Agent System Error</h1>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              An unexpected error occurred in the rendering layer.
            </p>
            <pre className="text-xs font-mono text-text-muted bg-background rounded-sm p-3 overflow-auto max-h-60">
              {this.state.error?.stack ?? this.state.error?.message}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
              className="mt-4 px-4 py-2 rounded-sm bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors duration-150"
            >
              Reload HelmOS
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
