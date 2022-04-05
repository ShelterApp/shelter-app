import {
    SET_QUERY,
    SET_SERVICES,
    SET_COUNT_SERVICE,
    SET_OPEN_SERVICE,
    UPDATE_SERVICES,
    SET_TOP_KUDO,
    SET_COORDINATES,
    SET_MAP_VIEW,
    SET_CURRENT_LOCATION,
    SET_CITY_AND_ZIP,
    SET_HEADER_SERVICE,
} from './types';
import {
    getReducer,
    getCategory,
    getSkip,
    getType,
    getCoords,
    getLimit,
} from './selectors';

import { Service as IServiceProps } from '@shelter/core';
import { ServicesApi } from '@shelter/core/dist/apis';
import { DEFAULT_SEARCH, DEFAULT_FILTER, ICoords } from './reducer';

const tranformFilter = (filter: string[]) => filter && filter.join(',').trim();

const getQuery = ({ type, skip, limit, q, category, search }, getState) => {
  const stateReducer = getState();
  const {
        filter,
        isOpen,
        isTopKudo,
        city,
        zip,
        state,
        currentLocation,
        isCriticalHeader,
        coordinateOfCity,
    } = getReducer(stateReducer);
  const coords = getCoords(stateReducer) as any;
  const { longitude, latitude } = coords;
  const isCoords = coords && !!longitude && !!latitude;
  const isLocation =
        currentLocation &&
        !!currentLocation.latitude &&
        !!currentLocation.longitude;

  const latstCategory = category || getCategory(stateReducer);
  const lstSkip = skip !== undefined ? skip : getSkip(stateReducer);
  const lstLimit = limit !== undefined ? limit : getLimit(stateReducer);
  const lstType = type || getType(stateReducer);
  const lstCity = !zip && city ? city : undefined;
  const lstZip = !city && zip ? zip : undefined;
  const lstCoordinateOfCity = coordinateOfCity ? coordinateOfCity : undefined;
  const lstState = state ? state : undefined;
  const lstSort = !isLocation || isTopKudo ? 'likes' : undefined;
  const filterWithCategory =
        latstCategory !== 'ALL'
            ? ['category', ...DEFAULT_FILTER]
            : DEFAULT_FILTER;
  const filterWithNear = isCoords
        ? [...filter, 'nearCoordinate']
        : DEFAULT_FILTER;
  const filterWithCity = city ? [...filter, 'city'] : [];
  const filterWithZip = zip ? [...filter, 'zip'] : [];
  const filterWithState = state ? [...filter, 'state'] : [];
  const filterWithOpen = isOpen ? [...filter, 'isOpen'] : [];
  const filterWithIsCriticalHeader = isCriticalHeader
        ? [...filter, 'isCriticalHeader']
        : [];

  const lstFilter = [
    ...(new Set([
        ...filterWithCategory,
        ...filterWithNear,
        ...filterWithCity,
        ...filterWithZip,
        ...filterWithOpen,
        ...filterWithState,
        ...filterWithIsCriticalHeader,
      ]) as any),
  ];
  const lstQ = q === 'All' ? undefined : q ? q : undefined;
  const lstSearch = search || DEFAULT_SEARCH;
  const lstCurrentCoordinate = isCoords
        ? [longitude, latitude].join('|')
        : undefined;
  const obj = {
    isOpen,
    filter,
    limit: lstLimit,
    city: lstCity,
    zip: lstZip,
    state: lstState,
    nearCoordinate: lstCurrentCoordinate,
    sort: lstSort,
    type: lstType,
    skip: lstSkip,
    search: lstSearch,
    category: latstCategory,
    q: lstQ,
    isApproved: true,
    filterTemp: tranformFilter(lstFilter),
    userTimezone: isOpen ? new Date().getTimezoneOffset() : undefined,
    isCriticalHeader,
  } as any;
  if (!!obj.sort) {
    obj.direction = 'desc';
  }
  if (obj.category === 'ALL') {
    obj.category = undefined;
  }
  return obj;
};
const getServices = (
    { type, skip, limit, q, category, search },
    currentCoordinate,
) => {
  return async (dispatch, getState) => {
    const query = getQuery(
        {
          type,
          skip,
          limit,
          q,
          category,
          search,
        },
            getState,
        );
    if (query.nearCoordinate && !query.currentCoordinate) {
        query.currentCoordinate = query.nearCoordinate;
        query.filterTemp += ',currentCoordinate';
      }
    if (currentCoordinate) {
        query.nearCoordinate = [
                currentCoordinate.longitude,
                currentCoordinate.latitude,
            ].join('|');
      }
    const tempQuery = {
        ...query,
        filter: query.filterTemp,
        filterTemp: undefined,
      };
    try {
        const res = (await ServicesApi.list(tempQuery)) as IServiceProps[];
        if (res) {
            dispatch({
                type: SET_SERVICES,
                payload: res,
              });
            dispatch({
                type: SET_QUERY,
                payload: query,
              });
            return true;
          }
      } catch (error) {
        throw new Error(
                `Can not fetch service with error: ${error.message}`,
            );
      }
  };
};
const getServicesHeader = ({
    type,
    skip,
    limit,
    q,
    category,
    search,
    currentCoordinate,
}) => {
  return async (dispatch, getState) => {
    const query = getQuery(
        {
          type,
          skip,
          limit,
          q,
          category,
          search,
        },
            getState,
        );
    if (query.nearCoordinate && !query.currentCoordinate) {
        query.currentCoordinate = query.nearCoordinate;
        query.filterTemp += ',currentCoordinate';
      }
    if (currentCoordinate) {
        query.nearCoordinate = [
                currentCoordinate.longitude,
                currentCoordinate.latitude,
            ].join('|');
      }
    const tempQuery = {
        ...query,
        limit: 20,
        isCriticalHeader: true,
        filter: query.filterTemp + ',isCriticalHeader',
        filterTemp: undefined,
      };
    try {
        const res = (await ServicesApi.list(tempQuery)) as IServiceProps[];
        if (res) {
            dispatch({
                type: SET_HEADER_SERVICE,
                payload: res,
              });
            return res;
          }
      } catch (error) {
        throw new Error(
                `Can not fetch service with error: ${error.message}`,
            );
      }
  };
};

const updateServices = ({ skip }) => {
  return async (dispatch, getState) => {
    const query = getQuery({ skip }, getState);
    if (query.nearCoordinate && !query.currentCoordinate) {
        query.currentCoordinate = query.nearCoordinate;
        query.filterTemp += ',currentCoordinate';
      }
    try {
        const res = (await ServicesApi.list({
            ...query,
            filter: query.filterTemp,
            filterTemp: undefined,
          })) as IServiceProps[];

        if (res) {
            dispatch({
                type: UPDATE_SERVICES,
                payload: res,
              });
            dispatch({
                type: SET_QUERY,
                payload: query,
              });
            return true;
          }
      } catch (error) {
        throw new Error(
                `Can not update service with error: ${error.message}`,
            );
      }
  };
};
const getCountService = ({ type, skip, q, category, search }) => {
  return async (dispatch, getState) => {
    const query = getQuery({ type, skip, q, category, search }, getState);
    try {
        const res = await ServicesApi.count({
            ...query,
            filter: query.filterTemp,
            filterTemp: undefined,
          });
        dispatch({
            type: SET_COUNT_SERVICE,
            payload: res,
          });
        return true;
      } catch (error) {
        throw new Error(
                `Can not count service with error: ${error.message}`,
            );
      }
  };
};

const setOpenService = (isOpen: boolean) => ({
  type: SET_OPEN_SERVICE,
  payload: isOpen,
});

const setHeaderService = (isCriticalHeader: boolean) => ({
  type: SET_HEADER_SERVICE,
  payload: isCriticalHeader,
});

const setTopKudo = (isTopKudo: boolean) => ({
  type: SET_TOP_KUDO,
  payload: isTopKudo,
});

const setMapView = (isMapView: boolean) => ({
  type: SET_MAP_VIEW,
  payload: isMapView,
});

const setCurrentLocation = (currentLocation: ICoords) => ({
  type: SET_CURRENT_LOCATION,
  payload: { currentLocation },
});

const setCoordinates = ({ latitude, longitude }) => ({
  type: SET_COORDINATES,
  payload: {
    latitude,
    longitude,
  },
});

const setCityAndZip = ({ city, zip, state, coordinateOfCity }) => ({
  type: SET_CITY_AND_ZIP,
  payload: {
    city,
    zip,
    state,
    coordinateOfCity,
  },
});

export {
    getServices,
    getServicesHeader,
    updateServices,
    getCountService,
    setOpenService,
    setTopKudo,
    setMapView,
    setCoordinates,
    setCurrentLocation,
    setCityAndZip,
    setHeaderService,
};
