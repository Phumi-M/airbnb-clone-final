/**
 * Catches React render errors in the tree and shows a fallback UI with "Try again" and "Go to home".
 * Wraps the app in App.js so uncaught errors don't white-screen.
 */
import React from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error_boundary" role="alert">
          <h1 className="error_boundary_title">Something went wrong</h1>
          <p className="error_boundary_text">
            We ran into an unexpected error. You can try again or return to the home page.
          </p>
          <pre className="error_boundary_detail" aria-hidden="true">
            {this.state.error?.toString()}
          </pre>
          <div className="error_boundary_actions">
            <button
              type="button"
              className="error_boundary_btn"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
            <a href="/" className="error_boundary_link" onClick={() => this.setState({ hasError: false, error: null })}>
              Go to home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
