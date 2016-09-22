import React from 'react';
import Relay from 'react-relay';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import App from '../components/App';
import BookList from '../components/BookList';
import BookPage from '../components/BookPage';
import SearchResults from '../components/SearchResults';


const catalogQuery = {
  catalog: () => Relay.QL`
      query {
      catalog
      }
    `
};

function prepareBookListParams(params, { location }) {
  return Object.assign(
    params,
    location.state && location.state.first 
      ? {first: location.state.first}: {}
  );
}

function prepareBookSearchParams(params, {location}) {
  return Object.assign(
    {},
    params, 
    location.search ? {searchText: location.query.search}: {},
    location.query.category ? {category: location.query.category}:
      {category: null}
  );
}


export default (
  <Route
    path="/"
    component={App}
    queries={catalogQuery}
  >
    <IndexRoute
      component={BookList}
      queries={catalogQuery}
      prepareParams={(params, props) => ({
        ...prepareBookListParams(params, props), 
        category: null
      })}
    />
    <Route
      path="/books/:category"
      component={BookList}
      queries={catalogQuery}
      prepareParams={prepareBookListParams}
    />
    <Route
      path="/book-page/:bookId"
      component={BookPage}
      queries={catalogQuery}
      scrollToTop={true}
    />
    <Route
      path="/book-search/"
      component={SearchResults}
      queries={catalogQuery}
      title="Поиск"
      prepareParams={
        (params, routerProps) => {
          return prepareBookSearchParams(
            prepareBookListParams(params, routerProps),
            routerProps
          )
        }
      }
    />
  </Route>
);
