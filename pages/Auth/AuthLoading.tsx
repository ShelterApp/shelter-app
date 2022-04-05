import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    Text,
    View,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import Config from 'react-native-config';

import { IBasicScreenProps } from '@app/components/Types';

import common from '@app/styles/common';
import theme from '@app/styles/theme';
import translate, { setLocale } from '@app/utils/i18n';

import { getUser } from '@app/redux/user/actions';
import { getDataToLocal, setDataToLocal } from '@app/utils';

import {
    checkPermission,
    createNotificationListeners,
} from '@app/utils/notification';

const { LANG_NAME } = Config;

interface IAuthLoadingProps extends IBasicScreenProps {
  getUser: any;
}

const AuthLoading: React.SFC<IAuthLoadingProps> = (
    props: IAuthLoadingProps,
) => {
  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    const isFirst = await getDataToLocal('isFirstOpen');
    if (isFirst) {
        const afterRes = JSON.parse(isFirst);
        props.navigation.navigate(!!afterRes ? 'Home' : 'ShowTutorial');
      } else {
        setDataToLocal('isFirstOpen', JSON.stringify(false));
        props.navigation.navigate('ShowTutorial');
      }

        // have to get language from storegare
    await doLang();
    const token = await getDataToLocal('@ShelterToken');
    const resUser = await props.getUser(null, token);
    if (resUser) {
            // register push notification
        checkPermission();
        createNotificationListeners();
      }
  };

  const doLang = async () => {
    try {
        const lang = await getDataToLocal(LANG_NAME);

        if (lang) {
            const afterParseLang = JSON.parse(lang);
            setLocale(afterParseLang);
          }
      } catch (error) {
            /* tslint:disable */
            console.log("can not get lang data from local", error);
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <ActivityIndicator size="large" />
                <Text style={styles.textLoading}>{translate("LOADING")}</Text>
                <StatusBar barStyle="light-content" backgroundColor="#fff" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...common.flexCenter,
        flex: 1,
        opacity: 0.4,
        backgroundColor: "#333",
    },
    textLoading: {
        zIndex: 100,
        ...common.text,
        marginTop: 8,
        color: theme.WHITE_COLOR,
    },
});

// const mapStateToProps = (state) => ({
//   isLogin: getUserData(state).isLogin,
// })

const mapDispatchToProps = {
    getUser,
};

export default connect(
    null,
    mapDispatchToProps
)(AuthLoading);
