import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import createExistingAlbumSelector from 'Store/Selectors/createExistingAlbumSelector';
import createDimensionsSelector from 'Store/Selectors/createDimensionsSelector';
import AddNewArtistAlbumSearchResult from './AddNewArtistAlbumSearchResult';

function createMapStateToProps() {
  return createSelector(
    createExistingAlbumSelector(),
    createDimensionsSelector(),
    (isExistingArtist, dimensions) => {
      return {
        isExistingArtist,
        isSmallScreen: dimensions.isSmallScreen
      };
    }
  );
}

export default connect(createMapStateToProps)(AddNewArtistAlbumSearchResult);
