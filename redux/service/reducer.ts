import { IGenericStoreAction } from '../types';

import {
    SET_QUERY,
    SET_SERVICES,
    SET_HEADER_SERVICE,
    SET_COUNT_SERVICE,
    SET_OPEN_SERVICE,
    UPDATE_SERVICES,
    SET_TOP_KUDO,
    SET_COORDINATES,
    SET_MAP_VIEW,
    SET_CURRENT_LOCATION,
    SET_CITY_AND_ZIP,
} from './types';
import { Service, ServiceType } from '@shelter/core';

export const DEFAULT_TYPE = ServiceType.Food;
export const DEFAULT_SEARCH =
    'name, description, serviceSummary, address1, address2, phone, userEmail, contactEmail';
export const DEFAULT_DIRECTION = 'desc';
export const DEFAULT_SORT = 'likes';
export const DEFAULT_LIMIT = 50;
export const DEFAULT_SKIP = 0;
export const DEFAULT_FILTER = ['type', 'isApproved'];
export const DEFAULT_CATEGORY = 'ALL';
export const DEFAULT_QUERY = '';

export interface ICoords {
  latitude: number | string;
  longitude: number | string;
}

export interface IServiceProps {
  type: string;
  category: string;
  isOpen: boolean;
  isTopKudo: boolean;
  isMapView: boolean;
  filter: string[];
  direction: string;
  search: string;
  sort: string;
  skip: number;
  limit: number;
  q: string;
  count: number;
  list: Service[];
  currentLocation: ICoords;
  coords: ICoords;
  city: string;
  zip: string;
  state: string;
  isCriticalHeader: boolean;
  coordinateOfCity: ICoords;
}

export const initialState: IServiceProps = {
  type: '',
  category: DEFAULT_CATEGORY,
  isOpen: false,
  isTopKudo: false,
  isMapView: false,
  filter: DEFAULT_FILTER,
  direction: undefined,
  search: DEFAULT_SEARCH,
  sort: undefined,
  limit: DEFAULT_LIMIT,
  skip: DEFAULT_SKIP,
  q: undefined,
  city: undefined,
  zip: undefined,
  state: undefined,
  count: 0,
  list: [],
  currentLocation: {
    latitude: 0,
    longitude: 0,
  },
  coords: {
    latitude: 0,
    longitude: 0,
  },
  coordinateOfCity: {
    latitude: 0,
    longitude: 0,
  },
};

const reducer = (
    state: IServiceProps = initialState,
    action: IGenericStoreAction = { type: null },
) => {
  switch (action.type) {
    case SET_SERVICES:
      return { ...state, list: action.payload };
    case SET_HEADER_SERVICE:
      return { ...state, breakingNews: action.payload };
    case UPDATE_SERVICES:
      return { ...state, list: [...state.list, ...action.payload] };
    case SET_QUERY:
      return { ...state, ...action.payload };
    case SET_COUNT_SERVICE:
      return { ...state, count: action.payload };
    case SET_OPEN_SERVICE:
      return { ...state, isOpen: action.payload };
    case SET_TOP_KUDO:
      return { ...state, isTopKudo: action.payload };
    case SET_MAP_VIEW:
      return { ...state, isMapView: action.payload };
    case SET_COORDINATES:
      const { latitude, longitude } = action.payload;
      return { ...state, coords: { latitude, longitude } };
    case SET_CURRENT_LOCATION:
      return { ...state, ...action.payload };
    case SET_CITY_AND_ZIP:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
