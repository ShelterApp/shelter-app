import AsyncStorage from '@react-native-community/async-storage';

const convertI18NText = (text: string) => text && text.toUpperCase().replace(/\s/g, '_');

const checkEmailPattern = (email: string) =>
  email &&
  // tslint:disable-next-line:max-line-length
  /(?=^.{1,64}$)^[a-zA-Z0-9](?:[a-zA-Z0-9\._-]*[a-zA-Z0-9])?@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-z]{2,}))$/.test(
    email,
  );

const checkSpecificDays = (specificDays) => {
  switch (specificDays) {
    case 0: return 'SUNDAY';
    case 1: return 'MONDAY';
    case 2: return 'TUESDAY';
    case 3: return 'WEDNESDAY';
    case 4: return 'THURSDAY';
    case 5: return 'FRIDAY';
    case 6: return 'SATURDAY';
  }
};

const setDataToLocal = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    throw new Error(`Can not set item to localstore with error ${error}`);
  }
};

const getDataToLocal = async (key: string) => {
  if (!key) return;

  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    throw new Error(`Can not get item to localstore with error ${error}`);
  }
};

const getAllKeyLocal = async () => {
  try {
    const value = await AsyncStorage.getAllKeys();
    return value;
  } catch (error) {
    throw new Error(`Can not get item to localstore with error ${error}`);
  }
};

const clearDataFromLocal = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    throw new Error(`Can not remove item to localstore with error ${error}`);
  }
};

const getIndexOfItemById = (list: any, id: string) => {
  let i = 0;
  for (; i < list.length; i += 1) {
    if (id === list[i].id) {
      return i;
    }
  }

  return -1;
};

export {
  convertI18NText,
  getDataToLocal,
  setDataToLocal,
  clearDataFromLocal,
  getAllKeyLocal,
  checkEmailPattern,
  checkSpecificDays,
  getIndexOfItemById,
};
