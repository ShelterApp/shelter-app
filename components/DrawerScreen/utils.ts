import { IDrawerScreenProps } from './DrawerScreen';
import { beforeLoginMenus, afterLogin } from './routers';

const logoutAction = async (logout, props) => {
    // if (Platform.OS === 'ios') {
    //   ActionSheetIOS.showActionSheetWithOptions(
    //     {
    //       options: [translate('CANCEL'), translate('LOGOUT')],
    //       destructiveButtonIndex: 1,
    //       cancelButtonIndex: 0,
    //       title: translate('LOGOUT_THIS_ACCOUNT'),
    //     },
    //     (buttonIndex) => {
    //       if (buttonIndex === 1) {
    //         logout();
    //       }
    //     },
    //   );
    //   return;
    // }

    // Alert.alert(
    //   translate('LOGOUT_THIS_ACCOUNT'),
    //   null,
    //   [
    //     {
    //       text: translate('CANCEL'),
    //       style: 'cancel',
    //     },
    //     {
    //       text: translate('OK'),
    //       onPress: async () => {
    //         const res = await logout();
    //         if (res) {
    //           return;
    //         }
    //       },
    //     },
    //   ],
    //   { cancelable: false },
    // );
  const res = await logout();
  if (res) {
    props.navigation.closeDrawer();
    return;
  }
};

const mergeCount = (orgs, countObj) => {
  if (!!countObj) {
    const convertArray = Object.keys(countObj);
    return orgs.reduce((prev, current, idx) => {
        const isFound = convertArray.find((f) => f === current.id);
        if (!!isFound) {
            orgs[idx].count = countObj[isFound];
            return orgs;
          }
        return prev;
      }, []);
  }
  return orgs;
};

const getMenus = (
    props: IDrawerScreenProps,
    isSocialAccount = false,
    countObj,
) => {
  const { userInfo, logout } = props;
  const { isLogin, isAdmin } = userInfo;

  if (isLogin) {
    if (isAdmin) {
        return [
            ...mergeCount(afterLogin.admin, countObj),
            {
              icon: 'ios-log-out',
              title: 'LOGOUT',
              onPress: () => logoutAction(logout, props),
            },
          ];
      }
    const users = isSocialAccount
            ? afterLogin.user.filter((u) => u.title !== 'CHANGE_PASSWORD')
            : afterLogin.user;
    return [
        ...mergeCount(users, countObj),
        {
          icon: 'ios-log-out',
          title: 'LOGOUT',
          onPress: () => logoutAction(logout, props),
        },
      ];
  }

  return beforeLoginMenus;
};

export { getMenus };
