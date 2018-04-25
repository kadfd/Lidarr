import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextTruncate from 'react-text-truncate';
import dimensions from 'Styles/Variables/dimensions';
import fonts from 'Styles/Variables/fonts';
import { icons, kinds, sizes } from 'Helpers/Props';
import HeartRating from 'Components/HeartRating';
import Icon from 'Components/Icon';
import Label from 'Components/Label';
import Link from 'Components/Link/Link';
import AlbumCover from 'Album/AlbumCover';
import AddNewArtistModal from '../AddNewArtistModal';
import styles from './AddNewArtistAlbumSearchResult.css';

const columnPadding = parseInt(dimensions.artistIndexColumnPadding);
const columnPaddingSmallScreen = parseInt(dimensions.artistIndexColumnPaddingSmallScreen);
const defaultFontSize = parseInt(fonts.defaultFontSize);
const lineHeight = parseFloat(fonts.lineHeight);

function calculateHeight(rowHeight, isSmallScreen) {
  let height = rowHeight - 45;

  if (isSmallScreen) {
    height -= columnPaddingSmallScreen;
  } else {
    height -= columnPadding;
  }

  return height;
}

class AddNewArtistAlbumSearchResult extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isNewAddArtistModalOpen: false
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isExistingArtist && this.props.isExistingArtist) {
      this.onAddArtistModalClose();
    }
  }

  //
  // Listeners

  onPress = () => {
    this.setState({ isNewAddArtistModalOpen: true });
  }

  onAddArtistModalClose = () => {
    this.setState({ isNewAddArtistModalOpen: false });
  }

  //
  // Render

  render() {
    const {
      foreignAlbumId,
      title,
      releaseDate,
      disambiguation,
      albumType,
      overview,
      ratings,
      images,
      artist,
      isExistingArtist,
      isSmallScreen
    } = this.props;

    const {
      isNewAddArtistModalOpen
    } = this.state;

    const linkProps = isExistingArtist ? { to: `/artist/${artist.foreignArtistId}` } : { onPress: this.onPress };

    const height = calculateHeight(230, isSmallScreen);

    return (
      <div>
        <Link
          className={styles.searchResult}
          {...linkProps}
        >
          {
            !isSmallScreen &&
            <AlbumCover
              className={styles.poster}
              images={images}
              size={250}
            />
          }

          <div>
            <div className={styles.name}>
              {title}

              {
                !!disambiguation &&
                <span className={styles.year}>({disambiguation})</span>
              }

              <span className={styles.artistName}> By: {artist.artistName}</span>

              {
                isExistingArtist &&
                  <Icon
                    className={styles.alreadyExistsIcon}
                    name={icons.CHECK_CIRCLE}
                    size={20}
                    title="Already in your library"
                  />
              }
            </div>

            <div>
              <Label size={sizes.LARGE}>
                <HeartRating
                  rating={ratings.value}
                  iconSize={13}
                />
              </Label>

              {
                !!releaseDate &&
                  <Label size={sizes.LARGE}>
                    {moment(releaseDate).format('YYYY')}
                  </Label>
              }

              {
                !!albumType &&
                  <Label size={sizes.LARGE}>
                    {albumType}
                  </Label>
              }

            </div>

            <div
              className={styles.overview}
              style={{
                maxHeight: `${height}px`
              }}
            >
              <TextTruncate
                truncateText="…"
                line={Math.floor(height / (defaultFontSize * lineHeight))}
                text={overview}
              />
            </div>
          </div>
        </Link>

        <AddNewArtistModal
          isOpen={isNewAddArtistModalOpen && !isExistingArtist}
          foreignArtistId={artist.foreignArtistId}
          artistName={artist.artistName}
          overview={artist.overview}
          images={artist.images}
          onModalClose={this.onAddArtistModalClose}
        />
      </div>
    );
  }
}

AddNewArtistAlbumSearchResult.propTypes = {
  foreignAlbumId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  releaseDate: PropTypes.string.isRequired,
  disambiguation: PropTypes.string,
  albumType: PropTypes.string,
  overview: PropTypes.string,
  ratings: PropTypes.object.isRequired,
  artist: PropTypes.object,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  isExistingArtist: PropTypes.bool.isRequired,
  isSmallScreen: PropTypes.bool.isRequired
};

export default AddNewArtistAlbumSearchResult;
