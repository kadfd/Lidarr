import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import queryString from 'query-string';
import { lookupArtist, lookupAlbum, clearAddArtist } from 'Store/Actions/addArtistActions';
import { fetchRootFolders } from 'Store/Actions/rootFolderActions';
import AddNewArtist from './AddNewArtist';

function createMapStateToProps() {
  return createSelector(
    (state) => state.addArtist,
    (state) => state.routing.location,
    (addArtist, location) => {
      const query = queryString.parse(location.search);

      return {
        term: query.term,
        ...addArtist
      };
    }
  );
}

const mapDispatchToProps = {
  lookupArtist,
  lookupAlbum,
  clearAddArtist,
  fetchRootFolders
};

class AddNewArtistConnector extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this._artistLookupTimeout = null;
  }

  componentDidMount() {
    this.props.fetchRootFolders();
  }

  componentWillUnmount() {
    if (this._artistLookupTimeout) {
      clearTimeout(this._artistLookupTimeout);
    }

    this.props.clearAddArtist();
  }

  //
  // Listeners

  onArtistLookupChange = (term) => {
    if (this._artistLookupTimeout) {
      clearTimeout(this._artistLookupTimeout);
    }

    if (term.trim() === '') {
      this.props.clearAddArtist();
    } else {
      this._artistLookupTimeout = setTimeout(() => {
        this.props.lookupArtist({ term });
      }, 300);
    }
  }

  onAlbumLookupChange = (term) => {
    if (this._artistLookupTimeout) {
      clearTimeout(this._artistLookupTimeout);
    }

    if (term.trim() === '') {
      this.props.clearAddArtist();
    } else {
      this._artistLookupTimeout = setTimeout(() => {
        this.props.lookupAlbum({ term });
      }, 300);
    }
  }

  onClearArtistLookup = () => {
    this.props.clearAddArtist();
  }

  //
  // Render

  render() {
    const {
      term,
      ...otherProps
    } = this.props;

    return (
      <AddNewArtist
        term={term}
        {...otherProps}
        onArtistLookupChange={this.onArtistLookupChange}
        onAlbumLookupChange={this.onAlbumLookupChange}
        onClearArtistLookup={this.onClearArtistLookup}
      />
    );
  }
}

AddNewArtistConnector.propTypes = {
  term: PropTypes.string,
  lookupArtist: PropTypes.func.isRequired,
  clearAddArtist: PropTypes.func.isRequired,
  lookupAlbum: PropTypes.func.isRequired,
  fetchRootFolders: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(AddNewArtistConnector);
