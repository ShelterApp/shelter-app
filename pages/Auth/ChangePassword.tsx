import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Field, Formik } from 'formik';
import { connect } from 'react-redux';

import {
  Button,
  InputFiled,
  ErrorText,
  HeaderNormal,
  Icon,
} from '@app/components/Common';
import translate from '@app/utils/i18n';
import { log } from '@app/utils/log';
import { IBasicScreenProps } from '@app/components/Types';

import { convertI18NText, getDataToLocal } from '@app/utils';
import { MAX_LENGTH_PW } from '@app/utils/constants';

import { logout } from '@app/redux/user/actions';

import { AuthApi } from '@shelter/core/dist/apis';

const initialValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const KEYS = ['currentPassword', 'newPassword', 'confirmPassword'];

const validateChangePasswordForm = (values) => {
  const errors: any = {};

  KEYS.map((key) => {
    if (values[key] && values[key].length < MAX_LENGTH_PW) {
      errors[key] = translate('PASSWORD_MIN_LENGTH', { value: MAX_LENGTH_PW });
    }
  });

  if (!values.currentPassword) {
    errors.currentPassword = translate('REQUIRED_INPUT_CTA', {
      value: translate('CURRENT_PASSWORD'),
    });
  }
  if (!values.newPassword) {
    errors.newPassword = translate('REQUIRED_INPUT_CTA', {
      value: translate('NEW_PASSWORD'),
    });
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = translate('REQUIRED_INPUT_CTA', {
      value: translate('CONFIRM_PASSWORD'),
    });
  }

  if (
    values.newPassword &&
    values.confirmPassword &&
    values.newPassword !== values.confirmPassword
  ) {
    errors.confirmPassword = translate('PASSWORD_NOT_MATCH');
  }

  return errors;
};

interface IChangePasswordProps extends IBasicScreenProps {
  logout: () => boolean;
}

const ChangePassword: React.SFC<IChangePasswordProps> = (
  props: IChangePasswordProps,
) => {
  const [error, setError] = useState(null);
  const [isHideCurrentPassword, setHideCurrentPassword] = useState(true);
  const [isHideNewPassword, setHideNewPassword] = useState(true);
  const [isHideConfirmPassword, setHideConfirmPassword] = useState(true);

  const refFormik = useRef() as any;

  useEffect(() => {
    const blurListener = props.navigation.addListener('didBlur', () => {
      refFormik.current.resetForm();
    });

    return () => blurListener.remove();
  }, []);

  const handleOnSubmit = async (
    values,
    { setSubmitting, setValues, setErrors, setTouched },
  ) => {
    const obj = {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    try {
      const token = await getDataToLocal('@ShelterToken');
      const res = await AuthApi.updatePassword(obj, token);
      if (res) {
        setSubmitting(false);
        setError(null);
        setErrors({});
        setTouched({});
        setValues(initialValues);
        log.success(translate('CHANGE_PASSWORD_SUCCESS'));
        const isLogout = await props.logout();
        if (isLogout) {
          props.navigation.navigate('Authen');
          return;
        }
      }
    } catch (error) {
      setSubmitting(false);
      setError(convertI18NText(error.message));
      throw new Error(`Can not change password with error: ${error.message}`);
    }
  };

  const renderChangePasswordForm = (args) => {
    const { handleSubmit, isSubmitting, values } = args;

    return (
      <View style={{ width: '100%' }}>
        <Field
          name="currentPassword"
          component={InputFiled}
          secureTextEntry={isHideCurrentPassword}
          label={translate('CURRENT_PASSWORD')}
          placeholder="••••••"
          autoFocus={true}
          rightIcon={
            values.currentPassword ? (
              <TouchableOpacity
                onPress={() => setHideCurrentPassword(!isHideCurrentPassword)}
              >
                <Icon
                  name={isHideCurrentPassword ? 'ios-eye' : 'ios-eye-off'}
                  size={28}
                />
              </TouchableOpacity>
            ) : null
          }
        />
        <Field
          name="newPassword"
          component={InputFiled}
          secureTextEntry={isHideNewPassword}
          placeholder="••••••"
          label={translate('NEW_PASSWORD')}
          rightIcon={
            values.newPassword ? (
              <TouchableOpacity
                onPress={() => setHideNewPassword(!isHideNewPassword)}
              >
                <Icon
                  name={isHideNewPassword ? 'ios-eye' : 'ios-eye-off'}
                  size={28}
                />
              </TouchableOpacity>
            ) : null
          }
        />
        <Field
          name="confirmPassword"
          component={InputFiled}
          secureTextEntry={isHideConfirmPassword}
          placeholder="••••••"
          label={translate('CONFIRM_PASSWORD')}
          rightIcon={
            values.confirmPassword ? (
              <TouchableOpacity
                onPress={() => setHideConfirmPassword(!isHideConfirmPassword)}
              >
                <Icon
                  name={isHideConfirmPassword ? 'ios-eye' : 'ios-eye-off'}
                  size={28}
                />
              </TouchableOpacity>
            ) : null
          }
        />

        {error && <ErrorText text={error} />}
        <Button
          onPress={handleSubmit}
          containerStyle={styles.changePasswordButton}
          title={translate('CHANGE_PASSWORD')}
          loading={!!isSubmitting}
          disabled={!!isSubmitting}
        />
      </View>
    );
  };

  return (
    <View>
      <HeaderNormal title="CHANGE_PASSWORD" navigation={props.navigation} />
      <View style={styles.changePasswordContainer}>
        <Formik
          ref={refFormik}
          initialValues={initialValues}
          validate={validateChangePasswordForm}
          onSubmit={handleOnSubmit}
          render={(args) => renderChangePasswordForm(args)}
          enableReinitialize
        />
      </View>
    </View>
  );
};

// ChangePassword.navigationOptions = ({ navigation }) => {
//   return {
//     headerTitle: translate('CHANGE_PASSWORD'),
//     headerRight: <CancelButton onPress={() => navigation.navigate('Home')} title="CANCEL" />,
//   };
// };

const styles = StyleSheet.create({
  changePasswordContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  changePasswordButton: {
    marginTop: 32,
    width: '100%',
    height: 54,
  },
});

const mapDispatchToProps = {
  logout,
};

export default connect(
  null,
  mapDispatchToProps,
)(ChangePassword);
