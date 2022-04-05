import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Field, Formik } from 'formik';
import { connect } from 'react-redux';

import {
  Button,
  InputFiled,
  ErrorText,
  HeaderNormal,
} from '@app/components/Common';
import translate from '@app/utils/i18n';
import { log } from '@app/utils/log';
import { IBasicScreenProps, IUserProps } from '@app/components/Types';
import { getUserData } from '@app/redux/user/selectors';
import { setUser } from '@app/redux/user/actions';
import { convertI18NText, getDataToLocal } from '@app/utils';

import { AuthApi } from '@shelter/core/dist/apis';

const KEYS = ['displayName', 'email'];

const validateProfileForm = (values) => {
  const errors: any = {};

  KEYS.map((key) => {
    if (!values[key]) {
      errors[key] = translate('REQUIRED_INPUT_CTA', {
        value: translate(key.toUpperCase()),
      });
    }
  });

  return errors;
};

interface IProfileProps extends IBasicScreenProps {
  userInfo: IUserProps;
  setUser: (info) => void;
}

const Profile: React.SFC<IProfileProps> = (props: IProfileProps) => {
  const [error, setError] = useState(null);
  const refFormik = useRef() as any;

  useEffect(() => {
    const blurListener = props.navigation.addListener('didBlur', () => {
      refFormik.current.resetForm();
    });

    return () => blurListener.remove();
  }, []);

  const handleOnSubmit = async (values, { setSubmitting }) => {
    try {
      const token = await getDataToLocal('@ShelterToken');
      const res = await AuthApi.updateUserProfile(values, token);
      if (res) {
        setSubmitting(false);
        setError(null);
        props.setUser(res);
        log.success(translate('UPDATE_PROFILE_SUCCESSFULLY'));
        props.navigation.navigate('Home');
      }
    } catch (error) {
      setSubmitting(false);
      setError(convertI18NText(error.message));
      throw new Error(`Can not update profile with error: ${error.message}`);
    }
  };

  const renderProfileForm = (args) => {
    const { handleSubmit, isSubmitting, setFieldValue } = args;
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
          name="displayName"
          component={InputFiled}
          placeholder="Ex: Hotel California"
          label={translate('COMMUNITY_SERVICE_NAME')}
        />
        <Field
          name="email"
          component={InputFiled}
          placeholder="mark@gmail.com"
          label={translate('EMAIL')}
          disabled={!!props.userInfo.email}
        />
        <Field
          name="phone"
          component={InputFiled}
          onValueChange={(value) => formatPhoneNumber(value)}
          placeholder="EX: 901234567"
          label={translate('PHONE')}
        />

        {error && <ErrorText text={error} />}
        <Button
          onPress={handleSubmit}
          containerStyle={styles.profileButton}
          title={translate('UPDATE_PROFILE')}
          loading={!!isSubmitting}
          disabled={!!isSubmitting}
        />
      </View>
    );
  };

  return (
    <>
      <HeaderNormal title="UPDATE_PROFILE" navigation={props.navigation} />
      <View style={styles.profileContainer}>
        <Formik
          ref={refFormik}
          initialValues={{
            displayName: props.userInfo.displayName || '',
            phone: props.userInfo.phone || '',
            email: props.userInfo.email || '',
          }}
          validate={validateProfileForm}
          onSubmit={handleOnSubmit}
          render={(args) => renderProfileForm(args)}
          enableReinitialize
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  profileButton: {
    marginTop: 32,
    width: '100%',
    height: 54,
  },
});

const mapStateToProps = (state) => ({
  userInfo: getUserData(state),
});

const mapDispatchToProps = {
  setUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
