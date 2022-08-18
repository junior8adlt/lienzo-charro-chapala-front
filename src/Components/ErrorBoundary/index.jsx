import { Component } from 'react';
import * as Sentry from '@sentry/react';
import { ErrorScreen } from './errorScreen';

export default class ErrorBoundary extends Component {
  state = {
    error: null,
    detail: null,
  };

  componentDidCatch(error, detail) {
    const { onError } = this.props;
    this.setState({ error, detail }, () => {
      if (onError) onError(error, detail);
      Sentry.captureException(error);
    });
  }

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (fallback) {
        return fallback;
      } else {
        return <ErrorScreen />;
      }
    }

    return children;
  }
}
