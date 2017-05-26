import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import configureStore from '../common/store/configureStore';
import App from '../common/containers/App';
import {polyfill} from 'es6-promise';
import 'isomorphic-fetch';
polyfill();
const store = configureStore(window.__PRELOADED_STATE__);

render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
