import Config from 'react-native-config';
import Cookie from 'react-native-cookie';
import { setDataToLocal, getDataToLocal } from './index';

const { WWW_MOBILE_API_URL, COOKIE_APP } = Config;

const doSaveCookie = async () => {
  try {
    const resCookie = await Cookie.get(WWW_MOBILE_API_URL, COOKIE_APP);
    if (resCookie) {
      setDataToLocal(COOKIE_APP, JSON.stringify(resCookie));
    }
  } catch (error) {
    throw new Error('Can not set cookies');
  }
};

const doSetCookie = async () => {
  try {
    const cookieApp = await getDataToLocal(COOKIE_APP);

    if (cookieApp) {
      const afterParseCookie = JSON.parse(cookieApp);
      await Cookie.set(WWW_MOBILE_API_URL, COOKIE_APP, afterParseCookie);
    }
  } catch (error) {
    /* tslint:disable */
    console.log('can not get the cookie data from local', error);
  }
};

export {
  doSaveCookie,
  doSetCookie,
};
