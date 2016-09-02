import 'babel-polyfill';
import App from './components/App';
import AppHomeRoute from './routes/AppHomeRoute';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import injectTapEventPlugin from 'react-tap-event-plugin';
import styles from '../styles/styles.scss';


import createHashHistory from 'history/lib/createHashHistory';
import useRouterHistory from 'react-router/lib/useRouterHistory';
import Router from 'react-router/lib/Router';
import { applyRouterMiddleware } from 'react-router';
import useRelay from 'react-router-relay';
import  routes from './routes/AppHomeRoute';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const history = useRouterHistory(createHashHistory)()

ReactDOM.render(
  <Router
    history={history}
    routes={routes}
    render={applyRouterMiddleware(useRelay)}
    environment={Relay.Store}
  />,
  document.getElementById('root')
);
