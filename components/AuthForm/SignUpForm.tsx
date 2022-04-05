import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Field, Formik } from 'formik';

import {
  Button,
  InputFiled,
  ErrorText,
  Icon,
  CheckBox,
} from '@app/components/Common';
import translate from '@app/utils/i18n';
import { IBasicScreenProps } from '@app/components/Types';

import { convertI18NText, setDataToLocal } from '@app/utils';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import { log } from '@app/utils/log';
import { MAX_LENGTH_PW } from '@app/utils/constants';

import { AuthApi } from '@shelter/core/dist/apis';

interface ISignUpFormProps extends IBasicScreenProps {
  setUser?: (data) => void;
}

const KEYS = ['communityServiceName', 'email', 'password'];

const validateSignUpForm = (values) => {
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

const SignUpForm: React.SFC<ISignUpFormProps> = (props: ISignUpFormProps) => {
  const [error, setError] = useState(null);
  const [isHidePassword, setHidePassword] = useState(true);
  const [isTerms, setIsTerms] = useState(false);

  const handleOnSubmit = async (values, { setSubmitting }) => {
    setError(null);

    if (!isTerms) {
      setError('PLEASE_ACCEPT_TERMS');
      setSubmitting(false);
      return;
    }

    const obj = {
      email: values.email && values.email.toLowerCase(),
      displayName: values.communityServiceName,
      phone: values.phone,
      password: values.password,
    };

    try {
      const res = await AuthApi.signUp(obj);

      if (res && res.email) {
        setError(null);
        setDataToLocal('@email', JSON.stringify({ email: values.email }));
        props.setUser(res);
        setSubmitting(false);
        log.success(
          translate('WELCOME_BACK_WITH_USER', { value: values.email }),
        );
        props.navigation.navigate('Home');
      }
    } catch (error) {
      setSubmitting(false);
      setError(convertI18NText(error.message));
      throw new Error(`Can not sign up with error: ${error.message}`);
    }
  };

  const handleChangeHidePassword = () => {
    setHidePassword(!isHidePassword);
  };

  const goToTerm = () => {
    props.navigation.navigate('Terms');
  };

  const goToPrivacy = () => {
    props.navigation.navigate('Privacy');
  };

  const changeCheck = () => {
    setIsTerms(!isTerms);
  };

  const renderSignUpForm = (args) => {
    const { handleSubmit, isSubmitting, values, setFieldValue } = args;
    const formatPhoneNumber = (phone) => {
      let result = phone;
      if (result.length == 3) result = `(${phone}) `;
      else if (result.endsWith('-')) {
        result = result.slice(0, result.length - 1);
      } else if (result.endsWith(' ') || result.endsWith(')')) {
   result = result.slice(1, 4);
 } else if (result.length == 9) result = `${phone}-`;
      else if (result.length > 15) return;
      setFieldValue('phone', result);
    };
    return (
      <View style={{ width: '100%' }}>
        <Field
          name="communityServiceName"
          component={InputFiled}
          placeholder="Non-Profit Name"
          label={translate('DISPLAY_NAME_SIGNUP')}
        />
        <Field
          name="phone"
          keyboardType="phone-pad"
          component={InputFiled}
          placeholder="(303) 555-0100"
          onValueChange={(value) => formatPhoneNumber(value)}
          label={translate('PHONE')}
        />
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
          containerStyle={{
            paddingHorizontal: 0,
            marginTop: 24,
            marginBottom: 24,
          }}
          placeholder="••••••"
          label={translate('PASSWORD')}
          rightIcon={
            values.password ? (
              <TouchableOpacity onPress={handleChangeHidePassword}>
                <Icon
                  name={isHidePassword ? 'ios-eye' : 'ios-eye-off'}
                  size={28}
                />
              </TouchableOpacity>
            ) : null
          }
        />
        <CheckBox
          title={
            <Text>
              {translate('ACCEPT')}
              <Text onPress={goToTerm} style={styles.herfText}>
                {translate('TERMS_OF_USE')}
              </Text>
              <Text> & </Text>
              <Text style={styles.herfText} onPress={goToPrivacy}>
                {translate('PRIVACY_POLICY')}
              </Text>
            </Text>
          }
          checked={isTerms}
          onPress={changeCheck}
          containerStyle={styles.termsCheckbox}
        />
        {error && <ErrorText text={error} />}
        <Button
          onPress={handleSubmit}
          containerStyle={styles.signUpButton}
          title={translate('SIGN_UP')}
          loading={!!isSubmitting}
          disabled={!!isSubmitting}
        />
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.firstText}>
        Users need not Signup. This is for Service Providers only.
      </Text>
      <View>
        <Formik
          initialValues={{
            email: '',
            password: '',
            communityServiceName: '',
            phone: '',
          }}
          validate={validateSignUpForm}
          onSubmit={handleOnSubmit}
          render={(args) => renderSignUpForm(args)}
          enableReinitialize
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  firstText: {
    ...common.smallText,
    color: theme.RED_COLOR,
    marginTop: 12,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
  },
  footerContainer: {
    ...common.flexCenter,
    marginTop: 20,
    width: '100%',
  },
  dontHave: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  terms: {
    ...common.h2,
    marginRight: 4,
  },
  signUpButton: {
    marginTop: 32,
    width: '100%',
    height: 54,
  },
  termsCheckbox: {
    marginLeft: 0,
  },
  herfText: {
    textDecorationLine: 'underline',
  },
});

export { SignUpForm };
