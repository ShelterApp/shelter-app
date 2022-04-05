
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Field, Formik } from 'formik';
import { connect } from 'react-redux';

import {
  Button,
  InputFiled,
  CancelButton,
  ErrorText,
} from '@app/components/Common';
import translate from '@app/utils/i18n';
import { log } from '@app/utils/log';
import { IBasicScreenProps } from '@app/components/Types';

import { convertI18NText, setDataToLocal } from '@app/utils';

import { setUser, getUser } from '@app/redux/user/actions';

import { MAX_LENGTH_PW } from '@app/utils/constants';

import { AuthApi } from '@shelter/core/dist/apis';

const KEYS = ['password'];

const validateResetPasswordForm = (values) => {
  const errors: any = {};

  KEYS.map(key => {
    if (!values[key]) {
      errors[key] = translate('REQUIRED_INPUT_CTA', { value: translate(key.toUpperCase()) });
    }
  });

  if (values.password && values.password.length < MAX_LENGTH_PW) {
    errors.password = translate('PASSWORD_MIN_LENGTH', { value: MAX_LENGTH_PW });
  }

  return errors;
};

const ResetPassword: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {
  const [error, setError] = useState(null);

  const handleOnSubmit = async (values, { setSubmitting }) => {
    const { navigation } = props;
    const { email, token } = navigation && navigation.state && navigation.state.params;

    const obj = {
      email,
      token,
      password: values.password,
    };

    try {
      const res = await AuthApi.createPassword(obj) as any;

      if (res) {
        setSubmitting(false);
        setError(null);
        setDataToLocal('@email', JSON.stringify({ email: values.email }));
        log.success(translate('RESET_PASSWORD_SUCCESSFULLY'));
        props.navigation.navigate('Authen');
      }
    } catch (error) {
      setSubmitting(false);
      setError(convertI18NText(error.message));
      throw new Error(`Can not request reset password with error: ${error.message}`);
    }
  };

  const renderResetPasswordForm = (args) => {
    const {
      handleSubmit,
      isSubmitting,
    } = args;

    return(
      <View style={{ width: '100%' }}>
        <Field
          name="password"
          component={InputFiled}
          secureTextEntry={true}
          placeholder="••••••"
          label={translate('ENTER_NEW_PASSWORD')}
          autoFocus={true}
        />
        {error && <ErrorText text={error} />}
        <Button
          onPress={handleSubmit}
          containerStyle={styles.resetPasswordButton}
          title={translate('RESET_PASSWORD')}
          loading={!!isSubmitting}
          disabled={!!isSubmitting}
        />
      </View>
    );
  };

  return(
    <View style={styles.resetPasswordContainer}>
      <Formik
        initialValues={{
          password: '',
        }}
        validate={validateResetPasswordForm}
        onSubmit={handleOnSubmit}
        render={args => renderResetPasswordForm(args)}
        enableReinitialize
      />
    </View>
  );
};

ResetPassword.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: translate('RESET_PASSWORD'),
    headerLeft: <CancelButton onPress={() => navigation.navigate('Authen')} title="SIGN_IN" />,
    // headerRight: <CancelButton onPress={() => navigation.navigate('Home')} title="CANCEL" />,
  };
};

const styles = StyleSheet.create({
  resetPasswordContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  resetPasswordButton: {
    marginTop: 32,
    width: '100%',
    height: 54,
  },
});

const mapDispatchToProps = {
  setUser,
  getUser,
};

export default connect(null, mapDispatchToProps)(ResetPassword);
