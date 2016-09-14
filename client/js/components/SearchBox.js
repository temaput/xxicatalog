import React from 'react';
import Relay from 'react-relay';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import AutoComplete from 'material-ui/AutoComplete';
import {hashHistory} from 'react-router';

class SearchBox extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object
  }

  prepareData() {

    const {
      suggestions, authors, categories, books
    } = this.props.catalog.searchSuggestion;

    return Array.prototype.concat(suggestions, authors)

  }

  onUpdateInput(searchText) {
    this.props.relay.setVariables(
      {searchText}
    );
  }

  onNewRequest(chosenRequest, index) {
    this.context.router.push(`/book-search/${chosenRequest}`)

  }

  render() {
    const dataSource = this.prepareData();
    return (
      <AutoComplete
        hintText="Поиск"
        id="search-box"
        filter={AutoComplete.noFilter}
        dataSource={dataSource}
        onNewRequest={this.onNewRequest.bind(this)}
        onUpdateInput={this.onUpdateInput.bind(this)} />
    )
  }

}

export default Relay.createContainer(SearchBox, {
  initialVariables: {
    searchText: "",
  },

  fragments: {
    catalog: () => Relay.QL`
    fragment on Catalog {
      searchSuggestion(searchText: $searchText) {
        suggestions
        authors
        categories {
          title
        }
        books {
          title subtitle author
        }
      }
    }
    `,
  },
});
