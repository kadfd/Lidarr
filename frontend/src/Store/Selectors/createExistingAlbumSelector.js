import _ from 'lodash';
import { createSelector } from 'reselect';
import createAllArtistSelector from './createAllArtistSelector';

function createExistingAlbumSelector() {
  return createSelector(
    (state, { artist }) => artist,
    createAllArtistSelector(),
    (artist, artists) => {
      const foreignArtistId = artist.foreignArtistId;
      return _.some(artists, { foreignArtistId } );
    }
  );
}

export default createExistingAlbumSelector;
