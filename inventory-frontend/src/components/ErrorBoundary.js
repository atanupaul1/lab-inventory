import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>Oops! Something went wrong.</h1>
            <p style={styles.message}>The lab system encountered an unexpected error. Don't worry, your data is safe.</p>
            <button 
              className="btn-primary" 
              onClick={() => window.location.reload()}
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--color-bg-primary)",
    padding: "20px",
  },
  card: {
    background: "var(--color-bg-secondary)",
    padding: "40px",
    borderRadius: "24px",
    textAlign: "center",
    maxWidth: "500px",
    border: "1px solid var(--color-border)",
  },
  title: {
    color: "var(--color-text-primary)",
    fontSize: "24px",
    marginBottom: "16px",
  },
  message: {
    color: "var(--color-text-secondary)",
    marginBottom: "32px",
    lineHeight: "1.6",
  }
};

export default ErrorBoundary;
