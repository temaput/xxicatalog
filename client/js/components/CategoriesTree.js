import React from 'react';
import Relay from 'react-relay';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import {withRouter} from 'react-router';
import {mqlPhone, mqlTablet} from '../utils/mediaqueries.js';

import {grey300} from '../utils/colors.js';



class CategoriesTree extends React.Component {

  handle(categoryId, hasBooks=true) {
    if (!hasBooks) {
      this.props.router.push('/');
    } else {
      this.props.router.push('/books/'+categoryId);
    }
    this.props.onChange(false);
  }
    
  renderList() {
    const renderListItem = (item) => {
      const nestedProps = item.children && item.children.length ? {
        nestedItems: item.children.map(renderListItem),
        primaryTogglesNestedList: true
      }: {}
      const actionProps = item.hasBooks ? {
          onTouchTap: this.handle.bind(this, item.id),
          onClick: this.handle.bind(this, item.id)
      }: {}
      return (
        <ListItem
          primaryText={item.title}
          key={item.id}
          {...nestedProps}
          {...actionProps}
          >
        </ListItem>
      )


    }
    return this.props.catalog.rootCategory.children.map(renderListItem)
}

  render() {
    const styles = {
      topMenuItem: {
        borderBottom: '1px solid',
        borderBottomColor: grey300,
        height: 64,
      },
    };

    const list = this.renderList();
    const handleRootClick = () => {
      this.handle(this.props.catalog.rootCategory.id, false);
    }
    return (
      <Drawer 
        docked={mqlPhone.matches ? false: true}
        open={this.props.open}
        onRequestChange={this.props.onChange}
      >
        <MenuItem style={styles.topMenuItem} 
          onTouchTap={handleRootClick}>Каталог</MenuItem>
        <List>
          {list}
        </List>
      </Drawer>
    )
  }
}


export default Relay.createContainer(withRouter(CategoriesTree), {
  fragments: {
    catalog: () => Relay.QL`
      fragment on Catalog {
 rootCategory {
    id
      children {
        id
        title
        hasBooks
        children {
    id
 title 
    hasBooks
        	children {
      id
            title
            hasBooks
          }
        }
      }
    }
  }
    `,
  }
});
        
