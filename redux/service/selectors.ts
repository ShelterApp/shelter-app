import { key } from './';
import { IServiceProps, DEFAULT_CATEGORY, DEFAULT_SEARCH } from './reducer';
import { ServiceType } from '@shelter/core';

export const getReducer = (state): IServiceProps => state[key];
export const getList = (state): IServiceProps => state[key].list || [];
export const getBreakingNews = (state): IServiceProps =>
    state[key].breakingNews || [];

export const getCount = (state): IServiceProps => state[key].count || 0;
export const getSkip = (state): IServiceProps => state[key].skip || 0;
export const getLimit = (state): IServiceProps => state[key].limit || 30;
export const getType = (state): IServiceProps =>
    state[key].type || ServiceType.Food;
export const getCategory = (state): IServiceProps =>
    state[key].category || DEFAULT_CATEGORY;
export const getCoords = (state): IServiceProps =>
    state[key] && state[key].coords;
export const getOpenService = (state): IServiceProps =>
    state[key].isOpen || false;
export const getTopKudo = (state): IServiceProps =>
    state[key].isTopKudo || false;
export const getMapView = (state): IServiceProps => state[key].isMapView;
export const getQ = (state): IServiceProps => state[key].q || '';
export const getSearch = (state): IServiceProps =>
    state[key].search || DEFAULT_SEARCH;
export const getCurrentLocation = (state): IServiceProps =>
    state[key] && state[key].currentLocation;
export const isCurrentLocation = (state) => {
  const { currentLocation } = state[key];
  return (
        currentLocation &&
        !!currentLocation.latitude &&
        !!currentLocation.longitude
  );
};
