import React from 'react';
import Relay from 'react-relay';
import {BookContainer, bookListSize, BookListComponent} from './BookList';

class SearchResults extends BookListComponent {
  renderList() {
    return this.props.catalog.searchResults.books.edges.map(
      (book) => (
        <BookContainer 
          bookNode={book.node} 
          key={book.node.id} 
          />
      )
    );
  }
}


export default Relay.createContainer(SearchResults, {
  initialVariables: {
    searchText: null,
    category: null,
    first: 300,
  },

  fragments: {
    catalog: (variables) => Relay.QL`
    fragment on Catalog {
      searchResults(searchText: $searchText, categories: $category) {
        books(first: $first) { edges { node {
          id
          ${BookContainer.getFragment('bookNode')}
          }}
        }
      }
    }
    `,
  }
});
