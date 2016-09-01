import React from 'react';
import Relay from 'react-relay';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import BookList from './BookList';
import BookPage from './BookPage';
import CategoriesTree from './CategoriesTree';

class App extends React.Component {
  state = {
    drawerOpen: false,
    category: null,
    openedBookId: null,
    bookListHidden: false,
    bookPageHidden: true,

  }
  handleDrawerToggle = () => {
    this.setState({drawerOpen: !this.state.drawerOpen})
  }
  handleDrawerChange = (open, reason) => {
    this.setState({drawerOpen: open})
  }
  handleCategoryPick = (categoryId, hasBooks) => {
    if (categoryId && hasBooks) {
      this.props.relay.setVariables({category: categoryId})
    } else {
      this.props.relay.setVariables({category: null})
    }

      this.showBookList();
  }

  showBookList() {
    this.setState({
      bookListHidden: false,
      bookPageHidden: true,
    })
    this.props.relay.setVariables({bookId: null})
  }

  handleBookOpen = (bookId) => {
    this.setState({
      bookListHidden: true,
      bookPageHidden: false,
    })
    this.props.relay.setVariables({bookId})
  }

  render() {
    const category = this.props.relay.variables.category;
    const bookPage = this.props.relay.variables.bookId ? (
      <BookPage 
        hidden={this.state.bookPageHidden}
        bookId={this.props.relay.variables.bookId}
        catalog={this.props.catalog}
        handleCategoryPick={this.handleCategoryPick}
      />
    ) : null;
    return (
      <MuiThemeProvider>
        <div className="material-ui">
          <AppBar
            title="Каталог"
            onLeftIconButtonTouchTap={this.handleDrawerToggle}
          />

        <CategoriesTree
          open={this.state.drawerOpen}
          onChange={this.handleDrawerChange}
          catalog={this.props.catalog}
          handleClick={this.handleCategoryPick}
        />


      {bookPage}
      <BookList hidden={this.state.bookListHidden} catalog={this.props.catalog} category={category} handleBookOpen={this.handleBookOpen}/>
    </div>
  </MuiThemeProvider>
    )
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    category: null,
    bookId: null,
  },

  fragments: {
    catalog: ({bookId, category}) => Relay.QL`
    fragment on Catalog {
      rootCategory { id }
      ${CategoriesTree.getFragment('catalog')}
      ${BookList.getFragment('catalog', {category})}
      ${BookPage.getFragment('catalog', {bookId})}
    }
    `,
  }
});

