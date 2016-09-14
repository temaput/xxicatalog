import React from 'react';
import Relay from 'react-relay';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import BookList from './BookList';
import BookPage from './BookPage';
import SearchBox from './SearchBox.js';
import CategoriesTree from './CategoriesTree';

class App extends React.Component {
  state = {
    drawerOpen: false,
  }
  handleDrawerToggle = () => {
    this.setState({drawerOpen: !this.state.drawerOpen})
  }
  handleDrawerChange = (open, reason) => {
    this.setState({drawerOpen: open})
  }


  render() {
    return (
      <MuiThemeProvider>
        <div className="material-ui">
          <AppBar
            title="Каталог"
            onLeftIconButtonTouchTap={this.handleDrawerToggle}
          >
            <SearchBox catalog={this.props.catalog}/>
          </AppBar>

        <CategoriesTree
          open={this.state.drawerOpen}
          onChange={this.handleDrawerChange}
          catalog={this.props.catalog}
        />

      {this.props.children}

    </div>
  </MuiThemeProvider>
    )
  }
}

export default Relay.createContainer(App, {

  fragments: {
    catalog: () => Relay.QL`
    fragment on Catalog {
      rootCategory { id }
      ${CategoriesTree.getFragment('catalog')}
      ${BookList.getFragment('catalog')}
      ${BookPage.getFragment('catalog')}
      ${SearchBox.getFragment('catalog')}
    }
    `,
  }
});

