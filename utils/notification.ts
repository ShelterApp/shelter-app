import { Platform } from 'react-native';
import Config from 'react-native-config';
import firebase from 'react-native-firebase';
import { getUniqueId } from 'react-native-device-info';
import { setDataToLocal, getDataToLocal, clearDataFromLocal } from './index';
import { AuthApi } from '@shelter/core/dist/apis';

const { FCM_TOKEN } = Config;

/* tslint:disable */
const checkPermission = async () => {
  const enabled = await firebase.messaging().hasPermission();

  if (enabled) {
    getToken();
  } else {
    requestPermission();
  }
};

const registerDevice = async (token) => {
  try {
    const uniqueId = await getUniqueId();
    const obj = {
      token,
      platform: Platform.OS.toUpperCase(),
      deviceId: uniqueId.toString() || "NOT FOUND",
    };
    // console.log('registerDevice with obj', obj);
    const shelterToken = await getDataToLocal("@ShelterToken");
    const res = await AuthApi.registerDevice(obj, shelterToken);

    if (res) {
      // console.log("registerDevice with res", res);
      // console.log("FCM_TOKEN", FCM_TOKEN);
      setDataToLocal(FCM_TOKEN, JSON.stringify(token));
      return;
    }
  } catch (error) {
    const mess = `Can not register push notification with error: ${
      error.message
    }`;
    throw new Error(mess);
  }
};

const unRegisterDevice = async () => {
  try {
    const uniqueId = await getUniqueId();
    const token = await getDataToLocal(FCM_TOKEN);

    if (token) {
      const afterToken = JSON.parse(token);
      const obj = {
        token: afterToken,
        platform: Platform.OS.toUpperCase(),
        deviceId: uniqueId.toString(),
      };
      const shelterToken = await getDataToLocal("@ShelterToken");
      console.log("unRegisterDevice with obj", obj);
      const res = await AuthApi.delDevice(obj, shelterToken);

      if (res) {
        console.log("unRegisterDevice with res", res);
        console.log("FCM_TOKEN", FCM_TOKEN);
        clearDataFromLocal(FCM_TOKEN);
        return;
      }
    }
  } catch (error) {
    const mess = `Can not unregister push notification with error: ${
      error.message
    }`;
    throw new Error(mess);
  }
};

const getToken = async () => {
  let fcmToken = await firebase.messaging().getToken();
  if (fcmToken) {
    registerDevice(fcmToken);
  }
};

const requestPermission = async () => {
  try {
    await firebase.messaging().requestPermission();
    // User has authorised
    getToken();
  } catch (error) {
    // User has rejected permissions
    console.log("permission rejected");
  }
};

const createNotificationListeners = async () => {
  /*
   * Triggered when a particular notification has been received in foreground
   * */
  await firebase.notifications().onNotification((notification) => {
    const { title, body } = notification;
    console.log("onNotification", notification);

    showAlert(title, body);
  });

  /*
   * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
   * */
  await firebase.notifications().onNotificationOpened((notificationOpen) => {
    console.log("onNotificationOpened", notificationOpen);
    const { title, body } = notificationOpen.notification;
    showAlert(title, body);
  });

  /*
   * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
   * */
  const notificationOpen = await firebase
    .notifications()
    .getInitialNotification();
  if (notificationOpen) {
    const { title, body } = notificationOpen.notification;
    showAlert(title, body);
  }
  /*
   * Triggered for data only payload in foreground
   * */
  firebase.messaging().onMessage((message) => {
    if (Platform.OS === "android") {
      const localNotification = new firebase.notifications.Notification()
        .setNotificationId(message.messageId)
        .setTitle(JSON.parse(message.data.custom_notification).title)
        .setBody(JSON.parse(message.data.custom_notification).body)
        .android.setChannelId("fetchh-channel") // e.g. the id you chose above
        .android.setSmallIcon("R.mipmap.ic_notification") // create this icon in Android Studio
        .android.setColor("R.color.primary_dark") // create background color for notification
        .android.setPriority(firebase.notifications.Android.Priority.High);

      firebase
        .notifications()
        .displayNotification(localNotification)
        .catch((err) => console.error(err));
    }
    //process data message
    console.log(JSON.stringify(message));
  });
};

const showAlert = (title, body) => {
  // Alert.alert(
  //   title, body,
  //   [
  //       { text: 'OK', onPress: () => console.log('OK Pressed') },
  //   ],
  //   { cancelable: false },
  // );
  console.log("title", title);
  console.log("body", body);
};

export { checkPermission, createNotificationListeners, unRegisterDevice };
