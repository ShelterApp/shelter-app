import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

class GeolocationService {
  public hasLocationPermission = async (cb) => {
    if (
            Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)
        ) {
        return true;
      }

    const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (
            status === PermissionsAndroid.RESULTS.DENIED ||
            status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
        cb();
      }

    return false;
  }

  public getCurrentPosition = (cbPosition, cbError) => {
    if (Platform.OS === 'ios') Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
            (position) => cbPosition(position),
            (error) => cbError(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 50,
        },
        );
  }
}

export { GeolocationService };
