import React from 'react';
import Relay from 'react-relay';
import {BookContainer, bookListSize, BookListComponent} from './BookList';
import {
  Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn
} from 'material-ui/Table';


class SearchResults extends BookListComponent {
  renderList() {
    const books = this.props.catalog.searchResults.books.edges;
    const bookList = books.map(
      (book) => (
        <BookContainer 
          bookNode={book.node} 
          key={book.node.id} 
          />
      )
    ); 
    const facets = (this.props.catalog.searchResults.facets.map(
      (f) => (
        <TableRow key={f.category.id}>
          <TableRowColumn>{f.category.title}</TableRowColumn>
          <TableRowColumn>{f.booksCount}</TableRowColumn>
        </TableRow>
      )
    ));


    const header = (
      <div className="search-results__header">
        <h2>{this.props.relay.variables.searchText}</h2>
        <div className="mdl-typography--subhead">
          {books.length} изданий
        </div>
        
        <div className="search-results__facets">
          <Table><TableBody>{facets}</TableBody></Table>
        </div>

      </div>
    );
    return  (
      <div className="search-results">
        {header}
        {bookList}
      </div>
    )
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
        facets {
          booksCount
          category {
            id
            title
          }
        }
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
