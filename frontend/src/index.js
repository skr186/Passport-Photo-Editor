import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import 'bootswatch/dist/cosmo/bootstrap.min.css'; 
import './assets/styles/index.css';

import store from './redux/store';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);