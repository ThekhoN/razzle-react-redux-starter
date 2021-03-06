import express from 'express';
import path from 'path';
import React from 'react';
import qs from 'qs';
import serialize from 'serialize-javascript';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import configureStore from '../common/store/configureStore';
import App from '../common/containers/App';
import { fetchCounter } from '../common/api/counter';
import { StaticRouter, matchPath } from 'react-router-dom';
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    fetchCounter(apiResult => {
      const context = {};
      // Read the counter from the request, if provided
      // console.log('apiResult: ', apiResult);
      const params = qs.parse(req.query);
      const counter = parseInt(params.counter, 10) || apiResult || 0;
      // Compile an initial state
      const preloadedState = { counter };
      // Create a new Redux store instance
      const store = configureStore(preloadedState);
      // Render the component to a string
      const markup = renderToString(
        <Provider store={store}>
          <StaticRouter context={context} location={req.url}>
            <App />
          </StaticRouter>
        </Provider>
      );
      // Grab the initial state from our Redux store
      const finalState = store.getState();
      res.send(`<!doctype html>
    <html lang="">
    <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Razzle Redux Example</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
        <script src="${assets.client.js}" defer></script>
    </head>
    <body>
        <div id="root">${markup}</div>
        <script>
          window.__PRELOADED_STATE__ = ${serialize(finalState)}
        </script>
    </body>
</html>`);
    });
  });

export default server;
