import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';
import {BookContainer} from './BookList';
import {withRouter} from 'react-router';
import typography from '../utils/typograpy.js';
import {grey100, grey200, grey300} from '../utils/colors.js';
import {bookListSize} from '../utils/constants.js';
import {Link} from 'react-router';


class SearchResults extends React.Component {
  loadMoreItems() {
    const first = this.props.relay.variables.first + bookListSize;
    this.props.router.push({
      ...this.props.location,
      state : {first, ignoreScroll: true}
    });
  }

  render() {

    const styles = {
      facet: {
        ...typography.styles.tablebody,
        height: 48,
        borderBottom: '1px solid',
        borderBottomColor: grey300,
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: typography.textDarkBlack,
        textDecoration: 'none',
      },
      activeFacetLink: {
        backgroundColor: grey200,
        cursor: 'default',
      },
    };

    const books = this.props.catalog.searchResults.books.edges;
    const facets = this.props.catalog.searchResults.facets;
    const searchIsFiltered = this.props.relay.variables.category !== null;
    const totalBooksCount = this.props.catalog.searchResults.totalBooksCount;

    const bookList = books.map(
      (book) => (
        <BookContainer 
          bookNode={book.node} 
          key={book.node.id} 
        />
      )
    ); 

    const facetList = (
      facets
        .sort((a, b) => b.booksCount - a.booksCount)
        .map(f => {        
          const newQuery = Object.assign(
            {}, this.props.location.query, {category: f.category.id}
          );
          return (
            <Link
              to={{...this.props.location, query: newQuery}}
              activeStyle={styles.activeFacetLink}
              key={f.category.id} 
              className="search-results__facet" 
              style={styles.facet}>
              <div>{f.category.title}</div>
              <div>{f.booksCount}</div>
            </Link>
          )
        })
    );

    if (searchIsFiltered) {
      const {search} = this.props.location.query;
      facetList.push(
        <Link
          key="all0"
          to={{...this.props.location, query: {search}}}
          className="search-results__facet" 
          style={styles.facet}>
          <div>Все</div>
          <div>{totalBooksCount}</div>
        </Link>
      );
    }

    return (
      <div className="mdl-grid main-content search-results">
        <div className="search-results__header mdl-cell--4-col">

          <h5>{this.props.relay.variables.searchText}</h5>
          <div className="mdl-typography--subhead">
            {totalBooksCount} изданий
          </div>

        </div>
          <div className="search-results__facets mdl-cell--8-col">
            {facetList}
          </div>
        <div className="mdl-grid book-list mdl-cell--12-col">
          {bookList}
          <Waypoint
            onEnter={this.loadMoreItems.bind(this)}
            bottomOffset={-20}
          />
        </div>
      </div>
    )
  }
}


export default Relay.createContainer(withRouter(SearchResults), {
  initialVariables: {
    searchText: null,
    category: null,
    first: bookListSize,
  },

  fragments: {
    catalog: (variables) => Relay.QL`
    fragment on Catalog {
      searchResults(searchText: $searchText, categories: $category) {
        totalBooksCount
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
