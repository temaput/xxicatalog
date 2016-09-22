import React from 'react';
import Relay from 'react-relay';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import AutoComplete from 'material-ui/AutoComplete';
import {withRouter} from 'react-router';
import FontIcon from 'material-ui/FontIcon';

import transitions from '../utils/transitions.js';
import {timings, durations} from '../utils/transitions.js';

class SearchBox extends React.Component {

  state = {
    isOpened: false
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
    this.props.router.push({
      pathname: '/book-search/',
      query: {search: chosenRequest}
    })
  }


  onInputClear(e) {
    this.field.setState({searchText: ""});
  }

  onSearchToggle(e) {
    e.preventDefault();
    const isOpened = !this.state.isOpened;
    this.setState({isOpened});
    this.field.focus();
    this.props.onSearchToggle(isOpened);
  }

  render() {
    const dataSource = this.prepareData();
    const isOpened = this.state.isOpened;
    const menuProps = {
      autoWidth: true,
    };
    const styles = {
      autoComplete: {
        underlineFocusStyle: {
          borderColor: 'white',
        },
        hintStyle: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        inputStyle: {
          color: 'white',
          width: '90%',
        },
      },
      inputContainer: {
        opacity: isOpened ? 1: 0,
        transition: transitions(
          'opacity',
          durations.searchBox,
          timings.fastOutSlowIn
        ),
        flexGrow: '1',
        position: 'relative',
      },
      searchBox: {
        display: 'flex',
        alignItems: 'center',

      },
      searchButton: {
        //transform: isOpened ? 'translateX(0)': 'translateX(160px)',
        padding: 12,
        lineHeight: 0,
        zIndex: 2,
      },
      closeButton: {
        position: 'absolute',
        right: 0,
        top: 11,
      },
    };
    return (
      <div style={styles.searchBox}>
              
        <a onClick={this.onSearchToggle.bind(this)} 
          href="#" style={styles.searchButton}>
          <FontIcon 
            className="material-icons"
            color="white"
          >
            search
          </FontIcon>
        </a>
        <div className="search-box__input" style={styles.inputContainer}>
          <AutoComplete
            fullWidth={true}
            ref={(el) => this.field = el}
            name="search"
            hintText="Поиск"
            filter={AutoComplete.noFilter}
            dataSource={dataSource}
            onNewRequest={this.onNewRequest.bind(this)}
            onUpdateInput={this.onUpdateInput.bind(this)} 
            menuProps={menuProps}
            {...styles.autoComplete}
          />
            <FontIcon 
              className="material-icons"
              color="white"
              onClick={this.onInputClear.bind(this)}
              style={styles.closeButton}
            >
              close
            </FontIcon>
        </div>
      </div>
    )
  }

}

export default Relay.createContainer(withRouter(SearchBox), {
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
