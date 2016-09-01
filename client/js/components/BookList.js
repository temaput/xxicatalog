import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';
import ReactList from 'react-list';



class Book extends React.Component {
  openBook = (e) => {
    this.props.handleBookOpen(this.props.bookNode.id)
  }
  renderHorizontal2() {
    return (
        <article className="mdl-cell mdl-cell--6-col mdl-cell--4-col-phone mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing mdl-shadow--4dp">
          <header className="mdl-cell--3-col mdl-cell--2-col-tablet mdl-cell--4-col-phone book-list__header">
            <img className="book-list__cover" src={this.props.bookNode.bookCover} alt={this.props.bookNode.title}/>
          </header>
          <div className="mdl-card mdl-cell--9-col mdl-cell--6-col-tablet">
            <div className="mdl-card__title book-list__title">
              <div className="mdl-typography--font-light mdl-typography--subhead">
                {this.props.bookNode.author}
              </div>
              <div className="mdl-card__title-text book-list__title-text">{this.props.bookNode.title}</div>
              <div className="mdl-card__subtitle-text mdl-typography--font-light mdl-typography--subhead">
                {this.props.bookNode.subtitle}
              </div>
            </div>
            <div className="mdl-card__actions mdl-card--border">
              <a
               onTouchTap={this.openBook} 
                className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                Подробнее
              </a>
            </div>
          </div>
        </article>
    );
  }
  renderHorizontal() {
    return (
      <div className="mdl-cell mdl-cell--6-col mdl-cell--4-col-phone mdl-cell--8-col-tablet">

        <div className="horizontal-card mdl-shadow--4dp">

          <div className="horizontal-card__row">
            <div className="horizontal-card__media">
              <img src={this.props.bookNode.bookCover} alt={this.props.bookNode.title}/>
            </div>

            <div className="horizontal-card__title">
              <div className="mdl-typography--font-light mdl-typography--subhead">
                {this.props.bookNode.author}
              </div>
              <div className="horizontal-card__title-text">{this.props.bookNode.title}</div>
              <div className="mdl-typography--font-light mdl-typography--subhead">
                {this.props.bookNode.subtitle}
              </div>
          <div className="mdl-card__actions mdl-card--border">
            <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
              Подробнее
            </a>
          </div>
            </div>
          </div>

        </div>

      </div>
    );
  }

  renderVertical() {
    return (
      <div className="mdl-cell mdl-card mdl-shadow--4dp">
        <div className="mdl-card__media">
          <img src={this.props.bookNode.bookCover} alt={this.props.bookNode.title}/>
        </div>
        <div className="mdl-card__title">
          <div className="mdl-card__title-text">{this.props.bookNode.title}</div>
        </div>
      </div>
    );
  }
  render() {
    return this.renderHorizontal2()
  }
}

const BookContainer = Relay.createContainer(Book, {
  fragments: {
    bookNode: () => Relay.QL`
      fragment on BookNode {
        id,
        bookCover,
        author,
        title,
        subtitle,
        price
      }
    `,
  },
});

const bookListSize = 10;
class BookList extends React.Component {
  renderItem(index, key) {
    const books = this.props.catalog.allBooks.edges
    if (index === books.length-3) {
      this.props.relay.setVariables({
        first: books.length + bookListSize
      });
    }
    const bookNode = books[index].node;
    return <BookContainer bookNode={bookNode} key={bookNode.id} handleBookOpen={this.props.handleBookOpen}/>
  }

  render() {
    const bookListClass = classNames(
      'main-content', 'book-list',
      {visuallyhidden: this.props.hidden}
    );
    return (
      <div className={bookListClass}>
        <ReactList 
          itemRenderer={this.renderItem.bind(this)}
          length={this.props.catalog.allBooks.edges.length}
        />
      </div>
    )
  }
}


export default Relay.createContainer(BookList, {
  initialVariables: {
    first: bookListSize,
    category: null,
  },
  fragments: {
    catalog: () => Relay.QL`
          fragment on Catalog {
        allBooks(first:$first, category:$category) {
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
