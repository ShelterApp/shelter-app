import { IGenericStoreAction } from '../types';
import { getCurrentLocale } from '@app/utils/i18n';
import {
  SET_USER,
  CHANGE_LANGUAGE,
} from './types';
import { IUserProps } from '@app/components/Types';
import { UserRole } from '@shelter/core';

export const initialState = {
  roles: [],
  favoriteServices: [],
  devices: [],
  email: undefined,
  displayName: undefined,
  phone: undefined,
  createdAt: undefined,
  id: undefined,
  language: getCurrentLocale(),
  isLogin: false,
  isAdmin: false,
};

const checkIsAdminOrNot = (userInfo: IUserProps) => {
  if (userInfo.roles && userInfo.roles.includes(UserRole.Administrator)) {
    return {
      ...userInfo,
      isAdmin: true,
    };
  }
  return userInfo;
};

const reducer = (
    state: IUserProps = initialState, action: IGenericStoreAction = { type: null },
  ) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, ...checkIsAdminOrNot(action.payload.userInfo) };
    case CHANGE_LANGUAGE:
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

export default reducer;
