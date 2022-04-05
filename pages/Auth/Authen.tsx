import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    View,
    Platform,
    // NativeModules,
} from 'react-native';
import { SocialIcon, ButtonGroup } from 'react-native-elements';
import { connect } from 'react-redux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import Config from 'react-native-config';

import {
    KeyboardAvoidingView,
    BackButton,
    Spinner,
} from '@app/components/Common';
import translate from '@app/utils/i18n';
import { IBasicScreenProps } from '@app/components/Types';

import { SignInForm, SignUpForm } from '@app/components/AuthForm';

import { setUser, getUser } from '@app/redux/user/actions';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import { log } from '@app/utils/log';
import { setDataToLocal } from '@app/utils';

import { AuthApi } from '@shelter/core/dist/apis';
import { VerifyAccessToken } from '@shelter/core/src/apis/auth/types';
import {
    checkPermission,
    createNotificationListeners,
} from '@app/utils/notification';

const TABS = ['SIGN_IN', 'SIGN_UP'];

const SocialEl = ({ title, type, onPress }) => (
    <SocialIcon
        light
        title={title}
        button
        type={type}
        style={styles.noBorder}
        Component={TouchableOpacity}
        onPress={onPress}
    />
);

interface IAuthenProps extends IBasicScreenProps {
  setUser?: (data) => void;
}
const Authen: React.SFC<IAuthenProps> = (props: IAuthenProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const instagramRef = useRef(null);

  useEffect(() => {
    setSelectedIndex(0);
    const focusListener = props.navigation.addListener('didFocus', () => {
        setSelectedIndex(0);
      });
    return () => focusListener.remove();
  }, []);

  const handleSetSelectedTab = (tab: number) => {
    setSelectedIndex(tab);
  };

  const handleLoginWithFB = async () => {
    setLoading(true);
        /* tslint:disable */
        try {
            LoginManager.logOut();
            const resFB = await LoginManager.logInWithPermissions([
                "public_profile",
                "email",
            ]);
            console.log("resFB", resFB);

            if (resFB) {
                if (resFB.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    // get accessToken from FB
                    const resAccessToken = await AccessToken.getCurrentAccessToken();
                    if (resAccessToken) {
                        const { accessToken, userID } = resAccessToken;
                        // fetch user profile from FB by using GRAPHQL
                        const resUser = await fetchUserFromFB(accessToken);
                        if (resUser) {
                            // verify token from owener server.
                            const { email, phone, name } = resUser;
                            const data: VerifyAccessToken = {
                                type: "FACEBOOK",
                                accessToken,
                                email:
                                    email ||
                                    `${userID || "shelter_user"}@facebook.com`,
                                displayName: name || "Shelter User",
                                phone: phone || undefined,
                            };

                            callAPIVerifyAccessToken(data);
                        }
                    }
                }
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.log("Can not sign in by FB with error", error);

            throw new Error(
                `Can not sign in by FB with error: ${error.message}`
            );
        }
    };

    const handleLoginWithGoogle = async () => {
        setLoading(true);
        try {
            GoogleSignin.configure();
            const userInfo = await GoogleSignin.signIn();
            const token = await GoogleSignin.getTokens();
            console.log("userInfo", userInfo);

            if (userInfo) {
                // verify token from owener server.
                const { email, id, name } = userInfo.user;
                const data: VerifyAccessToken = {
                    type: "GOOGLE",
                    accessToken: token.accessToken,
                    email: email || `${id || "shelter_user"}@google.com`,
                    displayName: name || "Shelter User",
                    phone: undefined,
                };

                callAPIVerifyAccessToken(data);
            }
            setLoading(false);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                console.log("cancelled");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
                console.log("in progress");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                console.log("play services not available or outdated");
            } else {
                // some other error happened
                log.danger(error.message);
                console.log("error", error);
            }
            setLoading(false);
        }
    };

    const fetchUserFromFB = async (token: string) => {
        const url = `https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=${token}`;
        try {
            const res = await fetch(url);
            const json = await res.json();
            return json;
        } catch (error) {
            throw new Error(error);
        }
    };

    const callAPIVerifyAccessToken = async (data) => {
        const { email } = data;
        try {
            const verifyToken = await AuthApi.verifyAccessToken(data);
            if (verifyToken && verifyToken.email) {
                setDataToLocal("isSocialAccount", JSON.stringify(true));
                if (verifyToken.token)
                    setDataToLocal("@ShelterToken", verifyToken.token);
                setLoading(false);
                log.success(
                    email
                        ? translate("WELCOME_BACK_WITH_USER", { value: email })
                        : translate("WELCOME_BACK")
                );
                await Promise.all([
                    props.setUser(verifyToken),
                    checkPermission(),
                    createNotificationListeners(),
                ]);
                props.navigation.navigate("Home");
            }
        } catch (error) {
            if (error.code && error.code == 400) {
                log.danger(error.message);
            } else console.log("can not save token", error);
        }
    };

    const renderContent = () => {
        return (
            <>
                <View style={styles.wrapTopTab}>
                    {!!selectedIndex ? (
                        <SignUpForm {...props} />
                    ) : (
                        <SignInForm {...props} />
                    )}
                </View>
                {Platform.OS == "android" && (
                    <View style={styles.wrapBottomTab}>
                        <Text style={styles.signInText}>
                            {translate("SIGN_IN_WITH")}
                        </Text>
                        <View style={styles.socials}>
                            <SocialEl
                                title="Facebook"
                                type="facebook"
                                onPress={handleLoginWithFB}
                            />
                            <SocialEl
                                title="Google"
                                type="google"
                                onPress={handleLoginWithGoogle}
                            />
                        </View>
                    </View>
                )}
            </>
        );
    };

    return (
        <KeyboardAvoidingView>
            <ScrollView style={styles.authenContainer}>
                <Spinner isLoading={isLoading} />
                <ButtonGroup
                    onPress={handleSetSelectedTab}
                    selectedIndex={selectedIndex}
                    buttons={TABS.map((b) => translate(b))}
                    containerStyle={styles.tabContainer}
                    selectedButtonStyle={styles.selectedButtonStyle}
                    buttonStyle={styles.buttonStyle}
                    innerBorderStyle={styles.innerBorderStyle}
                    textStyle={styles.textStyle}
                    selectedTextStyle={styles.textStyle}
                    activeOpacity={1}
                />
                {renderContent()}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

Authen.navigationOptions = ({ navigation }) => {
    return {
        headerTitle: translate("SERVICE_PROVIDER_LOGIN"),
        headerLeft: <BackButton onPress={() => navigation.navigate("Home")} />,
    };
};

const styles = StyleSheet.create({
    authenContainer: {
        paddingVertical: 8,
        paddingHorizontal: 8,
        marginTop: 8,
    },
    signInText: {
        marginBottom: 4,
    },
    socials: {
        flex: 1,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    noBorder: {
        borderRadius: 4,
        marginHorizontal: 0,
        padding: 12,
        justifyContent: "flex-start",
        width: "45%",
    },
    wrapTopTab: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: theme.LIGHT_COLOR,
        borderBottomRightRadius: 4,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    wrapBottomTab: {
        borderWidth: 1,
        borderColor: theme.LIGHT_COLOR,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginTop: 16,
        marginBottom: 32,
    },
    tabContainer: {
        height: 42,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
        borderColor: theme.LIGHT_COLOR,
    },
    selectedButtonStyle: {
        backgroundColor: theme.WHITE_COLOR,
        borderColor: theme.PRIMARY_COLOR,
        borderBottomWidth: 2,
    },
    buttonStyle: {
        backgroundColor: theme.LIGHT_COLOR,
    },
    textStyle: {
        ...common.text,
        color: theme.BLACK_COLOR,
    },
    innerBorderStyle: {
        width: 0,
    },
    spinnerTextStyle: {
        color: theme.WHITE_COLOR,
    },
});

const mapDispatchToProps = {
    setUser,
    getUser,
};

export default connect(
    null,
    mapDispatchToProps
)(Authen);
