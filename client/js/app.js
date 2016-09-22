import 'babel-polyfill';
import App from './components/App';
import AppHomeRoute from './routes/AppHomeRoute';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import injectTapEventPlugin from 'react-tap-event-plugin';
import styles from '../styles/styles.scss';
import extraStyles from '../styles/extra-styles.scss';


import Router from 'react-router/lib/Router';
import { applyRouterMiddleware, browserHistory} from 'react-router';
import useRelay from 'react-router-relay';
import  routes from './routes/AppHomeRoute';
import { useScroll } from 'react-router-scroll';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

function shouldUpdateScroll(prevRouter, currentRouter) {
  const {routes, location} = currentRouter;
  if (routes.some(route => route.scrollToTop)) {
    return [0, 0];
  } 
  if (routes.some(route => route.ignoreScroll)) {
    return false;
  } 
  if (
    prevRouter && location.pathname === prevRouter.location.pathname
      && location.state && location.state.ignoreScroll
  ) {
    return false;
  }

  return true;
}

ReactDOM.render(
  <Router
    history={browserHistory}
    routes={routes}
    render={applyRouterMiddleware(useRelay, useScroll(shouldUpdateScroll))}
    environment={Relay.Store}
  />,
  document.getElementById('root')
);
