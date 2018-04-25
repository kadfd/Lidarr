import _ from 'lodash';
import $ from 'jquery';
import { createAction } from 'redux-actions';
import { batchActions } from 'redux-batched-actions';
import { createThunk, handleThunks } from 'Store/thunks';
import getSectionState from 'Utilities/State/getSectionState';
import updateSectionState from 'Utilities/State/updateSectionState';
import createAjaxRequest from 'Utilities/createAjaxRequest';
import getNewArtist from 'Utilities/Artist/getNewArtist';
import createSetSettingValueReducer from './Creators/Reducers/createSetSettingValueReducer';
import createHandleActions from './Creators/createHandleActions';
import { set, update, updateItem } from './baseActions';

//
// Variables

export const section = 'addArtist';
let abortCurrentRequest = null;

//
// State

export const defaultState = {
  isFetching: false,
  isPopulated: false,
  error: null,
  isAdding: false,
  isAdded: false,
  addError: null,
  searchType: 'artist',
  items: [],

  defaults: {
    rootFolderPath: '',
    monitor: 'allAlbums',
    qualityProfileId: 0,
    languageProfileId: 0,
    metadataProfileId: 0,
    albumFolder: true,
    tags: []
  }
};

export const persistState = [
  'addArtist.defaults'
];

//
// Actions Types

export const LOOKUP_ARTIST = 'addArtist/lookupArtist';
export const LOOKUP_ALBUM = 'addArtist/lookupAlbum';
export const ADD_ARTIST = 'addArtist/addArtist';
export const SET_ADD_ARTIST_VALUE = 'addArtist/setAddArtistValue';
export const CLEAR_ADD_ARTIST = 'addArtist/clearAddArtist';
export const SET_ADD_ARTIST_DEFAULT = 'addArtist/setAddArtistDefault';

//
// Action Creators

export const lookupArtist = createThunk(LOOKUP_ARTIST);
export const lookupAlbum = createThunk(LOOKUP_ALBUM);
export const addArtist = createThunk(ADD_ARTIST);
export const clearAddArtist = createAction(CLEAR_ADD_ARTIST);
export const setAddArtistDefault = createAction(SET_ADD_ARTIST_DEFAULT);

export const setAddArtistValue = createAction(SET_ADD_ARTIST_VALUE, (payload) => {
  return {
    section,
    ...payload
  };
});

//
// Action Handlers

export const actionHandlers = handleThunks({

  [LOOKUP_ARTIST]: function(getState, payload, dispatch) {
    dispatch(set({ section, isFetching: true }));
    dispatch(set({ section, searchType: 'artist' }));

    if (abortCurrentRequest) {
      abortCurrentRequest();
    }

    const { request, abortRequest } = createAjaxRequest({
      url: '/artist/lookup',
      data: {
        term: payload.term
      }
    });

    abortCurrentRequest = abortRequest;

    request.done((data) => {
      dispatch(batchActions([
        update({ section, data }),

        set({
          section,
          isFetching: false,
          isPopulated: true,
          error: null
        })
      ]));
    });

    request.fail((xhr) => {
      dispatch(set({
        section,
        isFetching: false,
        isPopulated: false,
        error: xhr.aborted ? null : xhr
      }));
    });
  },

  [LOOKUP_ALBUM]: function(getState, payload, dispatch) {
    dispatch(set({ section, isFetching: true }));
    dispatch(set({ section, searchType: 'album' }));

    if (abortCurrentRequest) {
      abortCurrentRequest();
    }

    const { request, abortRequest } = createAjaxRequest({
      url: '/album/lookup',
      data: {
        term: payload.term
      }
    });

    abortCurrentRequest = abortRequest;

    request.done((data) => {
      dispatch(batchActions([
        update({ section, data }),

        set({
          section,
          isFetching: false,
          isPopulated: true,
          error: null
        })
      ]));
    });

    request.fail((xhr) => {
      dispatch(set({
        section,
        isFetching: false,
        isPopulated: false,
        error: xhr.aborted ? null : xhr
      }));
    });
  },

  [ADD_ARTIST]: function(getState, payload, dispatch) {
    dispatch(set({ section, isAdding: true }));

    const foreignArtistId = payload.foreignArtistId;
    let items = getState().addArtist.items;

    if (getState().addArtist.searchType !== 'artist') {
      items = _.map(getState().addArtist.items, 'artist');
    }

    const newArtist = getNewArtist(_.cloneDeep(_.find(items, { foreignArtistId })), payload);

    const promise = $.ajax({
      url: '/artist',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newArtist)
    });

    promise.done((data) => {
      dispatch(batchActions([
        updateItem({ section: 'artist', ...data }),

        set({
          section,
          isAdding: false,
          isAdded: true,
          addError: null
        })
      ]));
    });

    promise.fail((xhr) => {
      dispatch(set({
        section,
        isAdding: false,
        isAdded: false,
        addError: xhr
      }));
    });
  }
});

//
// Reducers

export const reducers = createHandleActions({

  [SET_ADD_ARTIST_VALUE]: createSetSettingValueReducer(section),

  [SET_ADD_ARTIST_DEFAULT]: function(state, { payload }) {
    const newState = getSectionState(state, section);

    newState.defaults = {
      ...newState.defaults,
      ...payload
    };

    return updateSectionState(state, section, newState);
  },

  [CLEAR_ADD_ARTIST]: function(state) {
    const {
      defaults,
      ...otherDefaultState
    } = defaultState;

    return Object.assign({}, state, otherDefaultState);
  }

}, defaultState, section);
