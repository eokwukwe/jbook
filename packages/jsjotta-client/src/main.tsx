import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';

import 'bulmaswatch/superhero/bulmaswatch.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import App from './App.tsx';
import store from './store/index.ts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
