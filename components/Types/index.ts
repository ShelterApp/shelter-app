import { NavigationScreenProps } from 'react-navigation';
import { User as UserProps } from '@shelter/core';
import { ICoords } from '@app/redux/service/reducer';
interface IBasicComponentProps {
  children?: any;
}

interface IUserProps extends UserProps {
  language?: string;
  isLogin: boolean;
}

interface IBasicScreenProps
  extends IBasicComponentProps,
    NavigationScreenProps {
  store?: {
    dispatch: (a: any) => any;
    getState: () => any;
    subscribe: (cb: () => any) => any;
  };
  setToast?: (toast: string) => void;
  setLocationModal: (isShow: boolean) => void;
  setCoordinates: (coords: { latitude: number; longitude: number }) => void;
  setCurrentLocation: (coords: ICoords) => void;
}

export { IBasicScreenProps, IBasicComponentProps, IUserProps };
