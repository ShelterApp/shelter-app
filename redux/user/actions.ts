import { SET_USER, CHANGE_LANGUAGE } from './types';
import { AuthApi } from '@shelter/core/dist/apis';
import Config from 'react-native-config';
import { log } from '@app/utils/log';

import { initialState } from './reducer';
import { IUserProps } from '@app/components/Types';

import translate, { setLocale } from '@app/utils/i18n';
import { getDataToLocal, setDataToLocal, clearDataFromLocal } from '@app/utils';
import { unRegisterDevice } from '@app/utils/notification';

const { COOKIE_APP, LANG_NAME } = Config;

const changeLanguage = (lang: string) => {
  return async (dispatch) => {
    setLocale(lang);
    setDataToLocal(LANG_NAME, JSON.stringify(lang));
    dispatch({
        type: CHANGE_LANGUAGE,
        payload: lang,
      });
  };
};

const setUser = (userInfo: IUserProps) => {
  return async (dispatch) => {
    dispatch({
        type: SET_USER,
        payload: {
            userInfo: { ...userInfo, isLogin: true },
          },
      });
  };
};

const updateUser = (userInfo: IUserProps) => {
  return async (dispatch, getState) => {
    const remainingUserInfo = getState().user.userInfo;
    dispatch({
        type: SET_USER,
        payload: {
            userInfo: { ...remainingUserInfo, ...userInfo },
          },
      });
  };
};

// const logout = () => {
//   return async (dispatch) => {
//     try {
//       await unRegisterDevice();
//       const shelterToken = await getDataToLocal('@ShelterToken');
//       const res = await AuthApi.signOut(shelterToken);
//       if (res && res.code === 204) {
//         log.success(translate('SIGNED_OUT_SUCCESSFULLY'));
//         dispatch({
//           type: SET_USER,
//           payload: {
//             userInfo : {
//               ...initialState,
//               isLogin: false,
//             },
//           },
//         });
//         return true;
//       }
//     } catch (error) {
//       return false;
//     }
//   };
// };
const logout = () => {
  return async (dispatch) => {
    try {
        await unRegisterDevice();
        log.success(translate('SIGNED_OUT_SUCCESSFULLY'));
        clearDataFromLocal('@ShelterToken');
        dispatch({
            type: SET_USER,
            payload: {
                userInfo: {
                    ...initialState,
                    isLogin: false,
                  },
              },
          });
        return true;
      } catch (error) {
        return false;
      }
  };
};

const getUser = () => {
  return async (dispatch) => {
    try {
        const token = await getDataToLocal('@ShelterToken');
        const res = await AuthApi.getUserProfile(null, token);
        if (res) {
            dispatch({
                type: SET_USER,
                payload: {
                    userInfo: { ...res, isLogin: true },
                  },
              });
            return true;
          }
      } catch (error) {
        dispatch({
            type: SET_USER,
            payload: {
                userInfo: { isLogin: false },
              },
          });
        return false;
      }
  };
};

export { setUser, updateUser, changeLanguage, getUser, logout };
