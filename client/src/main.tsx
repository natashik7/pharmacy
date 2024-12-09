import { createRoot } from 'react-dom/client';
import React from 'react';
import store from './store';
import { Provider } from 'react-redux';
import App from './App';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
} else {
  console.error('Root element not found');
}
