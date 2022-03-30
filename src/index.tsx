import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import App from './App';
import Global from './assets/style/global';
import { dark } from './assets/style/theme';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={dark}>

      <Global />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
