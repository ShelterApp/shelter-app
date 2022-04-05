
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Field, Formik } from 'formik';
import { connect } from 'react-redux';

import {
  Button,
  InputFiled,
  ErrorText,
} from '@app/components/Common';
import translate from '@app/utils/i18n';
import { log } from '@app/utils/log';
import { IBasicScreenProps } from '@app/components/Types';

import { convertI18NText } from '@app/utils';

import { setUser, getUser } from '@app/redux/user/actions';

import { AuthApi } from '@shelter/core/dist/apis';

interface IForgotPasswordProps extends IBasicScreenProps {
  initialValues: {
    email: string,
  };
}

const KEYS = ['email'];

const validateForgotPasswordForm = (values) => {
  const errors: any = {};

  KEYS.map(key => {
    if (!values[key]) {
      errors[key] = translate('REQUIRED_INPUT_CTA', { value: translate(key.toUpperCase()) });
    }
  });

  return errors;
};

const ForgotPassword: React.SFC<IForgotPasswordProps> = (props: IForgotPasswordProps) => {
  const [error, setError] = useState(null);

  const handleOnSubmit = async (values, { setSubmitting }) => {

    const obj = {
      email: values.email && values.email.toLowerCase(),
      type: 'MOBILE',
    };

    try {
      const res = await AuthApi.requestResetPassword(obj) as any;

      if (res && res.code === 200) {
        setSubmitting(false);
        setError(null);
        log.success(translate('REQUEST_RESET_PASSWORD_SUCCESSFULLY'));
        props.navigation.navigate('Authen');
      }
    } catch (error) {
      setSubmitting(false);
      setError(convertI18NText(error.message));
      throw new Error(`Can not request reset password with error: ${error.message}`);
    }
  };

  const renderForgotPasswordForm = (args) => {
    const {
      handleSubmit,
      isSubmitting,
    } = args;

    return(
      <View style={{ width: '100%' }}>
        <Field
          name="email"
          component={InputFiled}
          placeholder="mark@gmail.com"
          label={translate('EMAIL')}
          autoFocus={true}
        />

        { error && <ErrorText text={error} /> }
        <Button
          onPress={handleSubmit}
          containerStyle={styles.forgotPasswordButton}
          title={translate('RESET_PASSWORD')}
          loading={!!isSubmitting}
          disabled={!!isSubmitting}
        />
      </View>
    );
  };

  return(
    <View style={styles.forgotPasswordContainer}>
      <Formik
        initialValues={{
          email: '',
        }}
        validate={validateForgotPasswordForm}
        onSubmit={handleOnSubmit}
        render={args => renderForgotPasswordForm(args)}
        enableReinitialize
      />
    </View>
  );
};

ForgotPassword.navigationOptions = () => {
  return {
    headerTitle: translate('FORGOT_PASSWORD'),
    // headerRight: <CancelButton onPress={() => navigation.navigate('Authen')} title="CANCEL" />,
  };
};

const styles = StyleSheet.create({
  forgotPasswordContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  forgotPasswordButton: {
    marginTop: 32,
    width: '100%',
    height: 54,
  },
});

const mapDispatchToProps = {
  setUser,
  getUser,
};

export default connect(null, mapDispatchToProps)(ForgotPassword);
