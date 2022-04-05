import { key } from './';
import { IUserProps } from '@app/components/Types';

export const getReducer = (state): IUserProps => state[key];
export const getUserData = (state): IUserProps => getReducer(state);
export const getCurrentLanguage = state => getReducer(state).language;
