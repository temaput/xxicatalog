import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router';

class BookPage extends React.Component {
  render() {
    const pageClass = classNames(
      'mdl-grid', 'main-content',
    )

    const book = this.props.catalog.bookNode;
    const renderAnnotation = () => {
      return {
        __html: book.bookDescription
      }
    };
    const breadcrumbs = book.categories.map(
      (category) => (
        <div key={category.id} className="book-page__breadcrumbs-row">
          <Link
            to={category.parent.hasBooks ? "/books/" + category.parent.id: "/"}
            className="mdl-typography--caption">
            {category.parent.title}&nbsp;&gt;&nbsp;
          </Link>
          <Link
            to={"/books/" + category.id}
            className="mdl-typography--caption">
            {category.title}
          </Link>
        </div>
      )
    );

    return (
      <div className={pageClass}>
        <div className="mdl-cell mdl-cell--12-col mdl-card mdl-shadow--4dp">
          <div className="book-page__breadcrumbs">
            {breadcrumbs}
          </div>
          <div className="mdl-grid mdl-cell--12-col">
            <header className="mdl-cell--2-col mdl-cell--2-col-tablet mdl-cell--4-col-phone book-list__header ">
              <img className="book-list__cover" src={book.bookCover} alt={book.title}/>
              <div className="mdl-card__title">
                <h1 className="mdl-typography--headline mdl-typography--text-center">
                  {book.price} руб.
                </h1>
                <RaisedButton 
                  fullWidth={true}
                  href={book.fullUrl}
                  target="_blank" 
                  label="Купить" primary={true}/>
              </div>
            </header>
            <div className="mdl-cell--10-col mdl-card__title book-list__title">
              <div className="mdl-typography--font-light mdl-typography--subhead">
                {book.author}
              </div>
              <div className="mdl-card__title-text book-list__title-text">{book.title}</div>
              <div className="mdl-card__subtitle-text mdl-typography--font-light">
                {book.subtitle}
              </div>
              <p>&nbsp;</p>

            <p className="mdl-typography--body-1-color-contrast mdl-typography--font-light">
              {book.bookFormat ? book.bookFormat: book.bookEdition}<br/>
              код {book.article}
            </p>
              <p>&nbsp;</p>
              <div 
                className="mdl-typography--body-1-color-contrast mdl-typography--font-light book-page__annotation rich-text__container"
                dangerouslySetInnerHTML={renderAnnotation()}
              >
              </div>
            </div>
          </div>
        </div>
      </div>


    )
  }
}

export default Relay.createContainer(BookPage, {

  initialVariables: {
    bookId: null,
  },

  fragments: {
    catalog: () => Relay.QL`
    fragment on Catalog {
      bookNode(id: $bookId)
    {
        id,
        bookCover,
        author,
        title,
        subtitle,
        bookTranslation,
        bookTranslator,
        bookEdition,
        bookFormat,
        bookDescription,
        price,
        article,
        fullUrl,

        folders {
            id,
            title,
            fullUrl
        }

        categories {
          id,
          title,
          hasBooks
          parent {
            id,
            title,
            hasBooks
          }
        }
      }
    }
    `,


  }
});
