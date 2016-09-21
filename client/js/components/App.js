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

class App extends React.Component {
  state = {
    drawerOpen: false,
    title: this.getTitle(),
    searchOpen: false,
  }
  handleDrawerToggle = () => {
    this.setState({drawerOpen: !this.state.drawerOpen})
  }
  handleDrawerChange = (open, reason) => {
    this.setState({drawerOpen: open})
  }
  handleSearchToggle = (isOpen) => {
    this.setState({searchOpen: isOpen})
  }
  getTitle() {
    return "Каталог"
  }


  render() {
    const searchOpen = this.state.searchOpen;
    const styles = {
      app: {
        style: {
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.26)',
          position: 'fixed',
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
      },
    };
    const stylesPhone = {
      app: {...styles.app,
        titleStyle: {
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

    return (
      <MuiThemeProvider>
        <div className="material-ui">
          <AppBar
            title={this.state.title}
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
      ${CategoriesTree.getFragment('catalog')}
      ${BookList.getFragment('catalog')}
      ${BookPage.getFragment('catalog')}
      ${SearchBox.getFragment('catalog')}
    }
    `,
  }
});

