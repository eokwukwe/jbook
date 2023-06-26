import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import 'bulmaswatch/superhero/bulmaswatch.min.css';

import App from './App.tsx';
import store from './store';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
