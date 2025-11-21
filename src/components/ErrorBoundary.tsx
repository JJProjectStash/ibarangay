import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.icon}>⚠️</div>
            <h1 style={styles.title}>Oops! Something went wrong</h1>
            <p style={styles.message}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="btn btn-primary"
              style={styles.button}
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  content: {
    textAlign: "center",
    maxWidth: "600px",
    background: "white",
    padding: "3rem",
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },
  icon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "var(--text-primary)",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1.1rem",
    color: "var(--text-secondary)",
    marginBottom: "2rem",
  },
  details: {
    textAlign: "left",
    marginTop: "2rem",
    padding: "1rem",
    background: "var(--background)",
    borderRadius: "6px",
  },
  summary: {
    cursor: "pointer",
    fontWeight: "500",
    marginBottom: "0.5rem",
  },
  errorText: {
    fontSize: "0.85rem",
    color: "var(--error)",
    overflow: "auto",
  },
  button: {
    marginTop: "1rem",
  },
};

export default ErrorBoundary;
