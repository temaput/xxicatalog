import React from 'react';
import Relay from 'react-relay';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import BookList from './BookList';
import BookPage from './BookPage';
import SearchBox from './SearchBox.js';
import CategoriesTree from './CategoriesTree';

import {mqlPhone, mqlTablet} from '../utils/mediaqueries.js';
import transitions from '../utils/transitions.js';
import {durations, timings} from '../utils/transitions.js';
import typography from '../utils/typograpy.js';

class App extends React.Component {
  state = {
    drawerOpen: mqlPhone.matches ? false: true,
    searchOpen: false,
  }
  handleDrawerToggle = () => {
    this.setState({drawerOpen: !this.state.drawerOpen})
  }
  handleDrawerChange = (open, reason) => {
    mqlPhone.matches && this.setState({drawerOpen: open})
  }
  handleSearchToggle = (isOpen) => {
    this.setState({searchOpen: isOpen})
  }
  getTitle() {
    const routes = this.props.routes;
    const namedRoute = routes.find(r => r.title !== undefined);
    if (namedRoute) {
      return namedRoute.title;
    }
    const currentCategoryId = this.props.params.category;
    const allCategories = this.props.catalog.allCategories;
    const currentCategory = currentCategoryId && allCategories.find(
      cat =>  cat.id === currentCategoryId
    )
    if (currentCategory) {
      return currentCategory.title
    }

    return "Каталог"

  }


  render() {
    const searchOpen = this.state.searchOpen;
    const drawerOpen = this.state.drawerOpen;
    const styles = {
      app: {
        style: {
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.26)',
          position: 'fixed',
        },
        iconStyleLeft: {
          marginLeft: !mqlPhone.matches && drawerOpen ? 240: -16,
        },
        iconStyleRight: {
          flexBasis: searchOpen ? '340px': '48px',
          transition: transitions(
            'flex', durations.searchBox, timings.fastOutSlowIn
          ),
        },
      },
      main: {
        paddingTop: 80,
        marginLeft: !mqlPhone.matches && drawerOpen ? 256: 0,
      },
    };
    const stylesPhone = {
      app: {...styles.app,
        titleStyle: {
          ...typography.styles.subheading,
          flexGrow: searchOpen ? '0': '1',
          opacity: searchOpen ? '0': '1',
          transition: transitions(
            ['flex', 'opacity'],
            durations.searchBox,
            timings.fastOutSlowIn
          ),
        },
      },
    };

    Object.assign(styles, 
      mqlPhone.matches ? stylesPhone: {},
    );

    const searchBox = (
      <SearchBox 
        catalog={this.props.catalog}
        onSearchToggle={this.handleSearchToggle}
      />
    );

    const title = this.getTitle();
    return (
      <MuiThemeProvider>
        <div className="material-ui">
          <AppBar
            title={title}
            onLeftIconButtonTouchTap={this.handleDrawerToggle}
            iconElementRight={searchBox}
            {...styles.app}
          />
          <CategoriesTree
            open={this.state.drawerOpen}
            onChange={this.handleDrawerChange}
            catalog={this.props.catalog}
          />
          <div style={styles.main}>{this.props.children}</div>
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
      allCategories { id title }
      ${CategoriesTree.getFragment('catalog')}
      ${BookList.getFragment('catalog')}
      ${BookPage.getFragment('catalog')}
    }
    `,
  }
});

