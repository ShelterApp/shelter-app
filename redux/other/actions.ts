import {
  SET_ROUTE,
  SET_TOAST,
  SET_LOCATION_MODAL,
} from './types';

const setRoute = (route) => ({
  payload: route,
  type: SET_ROUTE,
});

const setLocationModal = (isShowLocationModel: boolean) => ({
  payload: { isShowLocationModel },
  type: SET_LOCATION_MODAL,
});

const setToast = (toast: string) => {
  return async (dispath) => {
    dispath({
      payload: { toast },
      type: SET_TOAST,
    });
    setTimeout(() =>
      dispath({
        payload: { toast: '' },
        type: SET_TOAST,
      })
    , 2000);
  };
};

export {
  setRoute,
  setToast,
  setLocationModal,
};
