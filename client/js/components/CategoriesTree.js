import React from 'react';
import Relay from 'react-relay';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';



class CategoriesTree extends React.Component {
  handle(categoryId, hasBooks=true) {
      this.props.handleClick(categoryId, hasBooks);
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
          {...actionProps}
          {...nestedProps}
        />
      )


    }
    return this.props.catalog.rootCategory.children.map(renderListItem)
}

  render() {
    const list = this.renderList();
    const handleRootClick = () => {
      this.props.handleClick(this.props.catalog.rootCategory.id, false);
      this.props.onChange(false);
    }
    return (
      <Drawer 
        docked={false}
        open={this.props.open}
        onRequestChange={this.props.onChange}
      >
        <MenuItem onTouchTap={handleRootClick}>Каталог</MenuItem>
        <List>
          {list}
        </List>
      </Drawer>
    )
  }
}


export default Relay.createContainer(CategoriesTree, {
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
        
