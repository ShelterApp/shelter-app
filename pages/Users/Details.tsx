import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Field, Formik } from 'formik';
import theme from '@app/styles/theme';
import common from '@app/styles/common';
import dayjs from 'dayjs';
import {
    Button,
    InputFiled,
    ErrorText,
    BackButton,
    PickerSelect,
} from '@app/components/Common';
import translate from '@app/utils/i18n';
import { log } from '@app/utils/log';
import { IBasicScreenProps } from '@app/components/Types';

import { UsersApi } from '@shelter/core/dist/apis';
import { User } from '@shelter/core';
import { convertI18NText, getDataToLocal } from '@app/utils';
import { ScrollView } from 'react-native-gesture-handler';
const KEYS = ['displayName', 'email', 'phone'];

const validateProfileForm = (values) => {
  const errors: any = {};

  KEYS.map((key) => {
    if (!values[key] && key != 'phone') {
        errors[key] = translate('REQUIRED_INPUT_CTA', {
            value: translate(key.toUpperCase()),
          });
      }
  });

  return errors;
};

interface IUserDetailsProps extends IBasicScreenProps {
  user: User;
}

const UserDetails: React.SFC<IUserDetailsProps> = (
    props: IUserDetailsProps,
) => {
  const [user, setUser] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userProp = props.navigation.getParam('user') || undefined;
    setUser(userProp);
  }, []);

  const handleOnSubmit = async (values, { setSubmitting }) => {
    try {
        const token = await getDataToLocal('@ShelterToken');
        if (values.roles.includes('ADMINISTRATOR')) {
            delete values.totalServices;
          }
        const res = await UsersApi.update(
                { ...values, id: user.id },
                token,
            );

        if (res) {
            setSubmitting(false);
            setError(null);
            if (values.role) {
                await UsersApi.setPermission(
                        user.id,
                        { role: values.role },
                        token,
                    );
              }
            log.success(translate('UPDATE_USER_SUCCESSFULLY'));
            props.navigation.goBack();
          }
      } catch (error) {
        setSubmitting(false);
        setError(convertI18NText(error.message));
        throw new Error(
                `Can not update profile with error: ${error.message}`,
            );
      }
  };
  const roleItems = ['USER', 'AUTO USER', 'SUPER USER', 'ADMINISTRATOR'].map(
        (item) => ({
          value: item,
          label: item,
        }),
    );
  const renderProfileForm = (args, user) => {
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
        const role = values.roles.includes('ADMINISTRATOR')
                ? 'ADMINISTRATOR'
                : values.roles.includes('SUPER USER')
                ? 'SUPER USER'
                : values.roles.includes('AUTO USER')
                ? 'AUTO USER'
                : 'USER';
        setFieldValue('role', role);
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
                    name="phone"
                    keyboardType="phone-pad"
                    component={InputFiled}
                    placeholder="(303) 555-0100"
                    onValueChange={(value) => formatPhoneNumber(value)}
                    label={translate('PHONE')}
                />
                <Field
                    name="role"
                    component={PickerSelect}
                    onValueChange={(value) => setFieldValue('role', value)}
                    label={'ROLE'}
                    items={roleItems}
                />
                {user && !user.roles.includes('ADMINISTRATOR') && (
                    <Field
                        name="totalServices"
                        keyboardType="number-pad"
                        component={InputFiled}
                        label={'Total Services'}
                    />
                )}

                <Field
                    name="email"
                    component={InputFiled}
                    placeholder="mark@gmail.com"
                    label={translate('EMAIL')}
                    disabled={!!values.email}
                />
                <Field
                    name="createdAt"
                    component={InputFiled}
                    placeholder={translate('CREATED AT')}
                    label={translate('CREATED AT')}
                    disabled={!!values.createdAt}
                />
                <Field
                    name="lastMethod"
                    component={InputFiled}
                    placeholder={translate('LAST LOGIN METHOD')}
                    label={translate('LAST LOGIN METHOD')}
                    disabled={!!values.lastMethod}
                />
                <Field
                    name="lastSignedIn"
                    component={InputFiled}
                    placeholder={translate('LAST LOGIN AT')}
                    label={translate('LAST LOGIN AT')}
                    disabled={!!values.createdAt}
                />
                <Field
                    name="updatedAt"
                    component={InputFiled}
                    placeholder={translate('LAST UPDATED AT')}
                    label={translate('LAST UPDATED AT')}
                    disabled={!!values.createdAt}
                />
                {error && <ErrorText text={error} />}
                <Button
                    onPress={handleSubmit}
                    containerStyle={styles.profileButton}
                    title={translate('UPDATE')}
                    loading={!!isSubmitting}
                    disabled={!!isSubmitting}
                />
            </View>
      );
  };

  return (
        <>
            <ScrollView style={styles.profileContainer}>
                <Formik
                    initialValues={{
                      displayName: (user && user.displayName) || '',
                      phone: (user && user.phone) || '',
                      email: (user && user.email) || '',
                      roles: (user && user.roles) || '',
                      role: (user && user.roles[0]) || 'USER',
                      lastMethod: (user && user.lastMethod) || '',
                      totalServices: (user && user.totalServices) || 3,
                      lastSignedIn:
                            (user &&
                                dayjs(user.lastSignedIn).format(
                                    'MM/DD/YYYY hh:mm A',
                                )) ||
                            '',
                      createdAt:
                            (user &&
                                dayjs(user.createdAt).format(
                                    'MM/DD/YYYY hh:mm A',
                                )) ||
                            '',
                      updatedAt:
                            (user &&
                                dayjs(user.updatedAt).format(
                                    'MM/DD/YYYY hh:mm A',
                                )) ||
                            '',
                    }}
                    validate={validateProfileForm}
                    onSubmit={handleOnSubmit}
                    render={(args) => renderProfileForm(args, user)}
                    enableReinitialize
                />
                <View style={{ paddingBottom: 30 }} />
            </ScrollView>
        </>
  );
};

UserDetails.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: translate('USER_PROFILE'),
    headerLeft: <BackButton onPress={() => navigation.goBack()} />,
  };
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
  textItem: {
    ...common.h2,
    color: theme.BLACK_COLOR,
    marginVertical: 2,
    width: '100%',
  },
});

export { UserDetails };
