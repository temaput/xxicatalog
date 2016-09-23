import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';
import {Link} from 'react-router';
import {withRouter} from 'react-router';
import {bookListSize} from '../utils/constants.js';
import typography from '../utils/typograpy.js';



class Book extends React.Component {

  renderBookNode(vertical=false) {
    const {
      bookCover, id, title, subtitle, author, price, article
    } = this.props.bookNode;

    const styles = {
      article: {
        display: 'flex',
        flexDirection: vertical ? 'column': 'row',
        flexWrap: 'nowrap',
      },
      coverImg: {
        width: '100%',
      },
      coverContainer: {
        margin: 'auto',
        width: 110,
        flexShrink: 0,
      },
      header: {
        paddingTop: 12,
        paddingLeft: vertical ? 'inherit': 12,
        paddingBottom: 12,
        flexGrow: 1,
      },
      author: {
        ...typography.styles.bookListAuthor,
      },
      title: {
        ...typography.styles.bookListTitle,
      },
      subtitle: {
        ...typography.styles.bookListSubtitle,
        paddingBottom: 12,
      },
      price: {
        ...typography.styles.bookListAuthor,
        paddingTop: 12,
        fontWeight: typography.fontWeightMedium,
      },
    };
    const coverPlaceholder = `http://placehold.it/150x220/?text=${title}`;
    const subtitleNode = (
      <div style={styles.subtitle}>
        {subtitle}
      </div>
    )
    return (
        <article className="mdl-cell mdl-cell--6-col mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-shadow--4dp" style={styles.article}>
          <div style={styles.coverContainer}>
            <Link 
              to={"/book-page/" + this.props.bookNode.id}
            >
              <img style={styles.coverImg}
                src={ bookCover ? bookCover: coverPlaceholder } 
                alt={this.props.bookNode.title}/>
            </Link>
          </div>
          <div style={styles.header}>
            <div>
              <Link 
                to={"/book-page/" + this.props.bookNode.id}
                style={styles.title}>
                {title}
              </Link>
            </div>
            {subtitle ? subtitleNode: ""}
            <div style={styles.author}>
              {this.props.bookNode.author}
            </div>
            <div style={styles.price}>{price} ₽ </div>
          </div>
        </article>
    );
  }

  render() {
    return this.renderBookNode()
  }
}

export const BookContainer = Relay.createContainer(Book, {
  fragments: {
    bookNode: () => Relay.QL`
      fragment on BookNode {
        id,
        bookCover,
        author,
        title,
        subtitle,
        price,
        article
      }
    `,
  },
});


export class BookListComponent extends React.Component {

  loadMoreItems() {
    const first = this.props.relay.variables.first + bookListSize;
    this.props.router.push({
      ...this.props.location,
      state : {first, ignoreScroll: true}
    });
  }

  renderList() {
    return this.props.catalog.allBooks.edges.map(
      (book) => (
        <BookContainer 
          bookNode={book.node} 
          key={book.node.id} 
          />
      )
    );
  }

  renderWaypoint() {
      return (
        <Waypoint
          onEnter={this.loadMoreItems.bind(this)}
          bottomOffset={-20}
        />
      )
  }

  render() {
    const bookListClass = classNames(
      'main-content', 'book-list', 'mdl-grid'
    );
    return (
      <div className={bookListClass}>
      {this.renderList()}
      {this.renderWaypoint()}
      </div>
    )
  }
}


export default Relay.createContainer(withRouter(BookListComponent), {
  initialVariables: {
    first: bookListSize,
    category: null,
  },
  fragments: {
    catalog: () => Relay.QL`
          fragment on Catalog {
        allBooks(first:$first, categories:$category) {
            edges {
                node {
                    id
                    ${BookContainer.getFragment('bookNode')}
                }
            }
            }
        }
        `,
  }
});
