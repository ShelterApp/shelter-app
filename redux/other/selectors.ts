import { key } from '.';

export const getReducer = state => state[key];
export const getRoute = state => getReducer(state);
export const getToast = state => getReducer(state).toast || '';
export const getIsShowLocationModal = state => getReducer(state).isShowLocationModel;
