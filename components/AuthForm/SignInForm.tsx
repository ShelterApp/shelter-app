import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Field, Formik } from 'formik';

import { Button, InputFiled, Icon, ErrorText } from '@app/components/Common';
import translate from '@app/utils/i18n';
import { log } from '@app/utils/log';
import { IBasicScreenProps } from '@app/components/Types';
import { convertI18NText, getDataToLocal, setDataToLocal } from '@app/utils';

import { MAX_LENGTH_PW } from '@app/utils/constants';
// import { doSaveCookie } from '@app/utils/cookies';

import { AuthApi } from '@shelter/core/dist/apis';
import { checkPermission } from '@app/utils/notification';

interface ISignInFormProps extends IBasicScreenProps {
  setUser?: (data) => void;
}

const KEYS = ['email', 'password'];

const validateSignInForm = (values) => {
  const errors: any = {};

  KEYS.map((key) => {
      if (!values[key]) {
          errors[key] = translate('REQUIRED_INPUT_CTA', {
              value: translate(key.toUpperCase()),
            });
        }
    });

  if (values.password && values.password.length < MAX_LENGTH_PW) {
      errors.password = translate('PASSWORD_MIN_LENGTH', {
          value: MAX_LENGTH_PW,
        });
    }

  return errors;
};

const SignInForm: React.SFC<ISignInFormProps> = (props: ISignInFormProps) => {
  const [error, setError] = useState(null);
  const [isHidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState(null);

  useEffect(() => {
      init();
      const focusListener = props.navigation.addListener('didFocus', () => {
          init();
        });
      return () => focusListener.remove();
    }, []);

  const init = async () => {
      const res = await getDataToLocal('@email');
      const afterRes = JSON.parse(res);
      setEmail(afterRes.email);
    };

  const handleOnSubmit = async (values, { setSubmitting }) => {
      const obj = {
          email: values.email && values.email.toLowerCase(),
          password: values.password,
        };
      try {
          const res = await AuthApi.signIn(obj);
          if (res && res.email) {
              setError(null);
              setDataToLocal('isSocialAccount', JSON.stringify(false));
              setDataToLocal(
                    '@email',
                    JSON.stringify({ email: values.email }),
                );
              setDataToLocal('@ShelterToken', res.token);
              props.setUser(res);
              checkPermission();
              props.navigation.navigate('Home');
              setSubmitting(false);
              log.success(translate('WELCOME_BACK'));
            }
        } catch (error) {
          setSubmitting(false);
          setError(convertI18NText(error.message));
          throw new Error(`Can not sign in with error: ${error.message}`);
        }
    };

  const handleChangeHidePassword = () => {
      setHidePassword(!isHidePassword);
    };

  const goToForgotPassword = () => {
      props.navigation.navigate('ForgotPassword');
    };

  const renderSignInFormForm = (args) => {
      const { handleSubmit, isSubmitting, values } = args;
      return (
            <View>
                <Field
                    name="email"
                    component={InputFiled}
                    placeholder="name@your-nonprofit.org"
                    label={translate('EMAIL')}
                />
                <Field
                    name="password"
                    component={InputFiled}
                    secureTextEntry={isHidePassword}
                    placeholder="••••••"
                    label={translate('PASSWORD')}
                    rightIcon={
                        values.password ? (
                            <TouchableOpacity
                                onPress={handleChangeHidePassword}
                            >
                                <Icon
                                    name={
                                        isHidePassword
                                            ? 'ios-eye'
                                            : 'ios-eye-off'
                                    }
                                    size={28}
                                />
                            </TouchableOpacity>
                        ) : null
                    }
                />
                {error && <ErrorText text={error} />}
                <Button
                    onPress={handleSubmit}
                    containerStyle={styles.SignInFormButton}
                    title={translate('SIGN_IN')}
                    loading={!!isSubmitting}
                    disabled={!!isSubmitting}
                />
                <View style={styles.wrapForgotPassword}>
                    <Button
                        title={`${translate('FORGOT_PASSWORD')}?`}
                        type="clear"
                        onPress={goToForgotPassword}
                        titleStyle={{ textDecorationLine: 'none' }}
                    />
                </View>
            </View>
        );
    };

  return (
        <View>
            <Formik
                initialValues={{
                  email,
                  password: '',
                }}
                validate={validateSignInForm}
                onSubmit={handleOnSubmit}
                render={(args) => renderSignInFormForm(args)}
                enableReinitialize
            />
        </View>
    );
};

const styles = StyleSheet.create({
  SignInFormButton: {
      marginTop: 24,
      width: '100%',
      height: 54,
    },
  wrapForgotPassword: {
      display: 'flex',
      flex: 1,
      alignItems: 'flex-end',
      paddingVertical: 8,
      marginTop: 8,
    },
});

export { SignInForm };
