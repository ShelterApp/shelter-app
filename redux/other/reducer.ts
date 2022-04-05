import { IGenericStoreAction } from '../types';
import {
  SET_ROUTE,
  SET_TOAST,
  SET_LOCATION_MODAL,
} from './types';

interface IOtherState {
  currentRouterName: string;
  toast: string;
  isShowLocationModel: boolean;
}

export const initialState = {
  currentRouterName: '',
  toast: '',
  isShowLocationModel: false,
};

const reducer = (
    state: IOtherState = initialState, action: IGenericStoreAction = { type: null },
  ) => {
  switch (action.type) {
    case SET_ROUTE:
      return { ...state, ...action.payload };
    case SET_TOAST:
      return { ...state, ...action.payload };
    case SET_LOCATION_MODAL:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
