import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';
import {BookContainer, bookListSize, BookListComponent} from './BookList';
import {withRouter} from 'react-router';
import {
  Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn
} from 'material-ui/Table';
import Typography from '../utils/Typograpy.js';


class SearchResults extends React.Component {
  loadMoreItems() {
    const first = this.props.relay.variables.first + bookListSize;
    this.props.router.push({
      ...this.props.location,
      state : {first, ignoreScroll: true}
    });
  }
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
    return  (
      <div className="search-results">
        {bookList}
      </div>
    )
  }

  render() {
    const books = this.props.catalog.searchResults.books.edges;
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
        <h5>{this.props.relay.variables.searchText}</h5>
        <div className="mdl-typography--subhead">
          {books.length} изданий
        </div>

        <div className="search-results__facets">
          <Table
          >
            <TableBody
              displayRowCheckbox={false}
            >
              {facets}
            </TableBody>
          </Table>
        </div>

      </div>
    );
    const bookListClass = classNames(
      'main-content', 'book-list', 'mdl-grid'
    );
    return (
      <div className={bookListClass}>
        {header}
        {this.renderList()}
        <Waypoint
          onEnter={this.loadMoreItems.bind(this)}
          bottomOffset={-20}
        />
      </div>
    )
  }
}


export default Relay.createContainer(withRouter(SearchResults), {
  initialVariables: {
    searchText: null,
    category: null,
    first: 10,
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
