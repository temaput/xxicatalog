import React from 'react';
import Relay from 'react-relay';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import App from '../components/App';
import BookList from '../components/BookList';
import BookPage from '../components/BookPage';


const catalogQuery = {
  catalog: () => Relay.QL`
      query {
      catalog
      }
    `
};

export default (
  <Route
    path="/"
    component={App}
    queries={catalogQuery}
    >
    <Route
      path="/books/:category"
      component={BookList}
      queries={catalogQuery}
    />
    <Route
      path="/book-page/:bookId"
      component={BookPage}
      queries={catalogQuery}
    />
  </Route>
);
