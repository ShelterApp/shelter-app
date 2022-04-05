import React, { useState, useEffect, useRef, createRef } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Field, Formik } from 'formik';
import { getDataToLocal } from '@app/utils';

import {
  Button,
  InputFiled,
  PanelGroup,
  ErrorText,
} from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import { convertI18NText } from '@app/utils';

import translate from '@app/utils/i18n';
import { log } from '@app/utils/log';

import { CrisisLine as ICrisisLine } from '@shelter/core';
import { CrisisLinesApi } from '@shelter/core/dist/apis';
import AlertMessage from '@app/components/Item/Alert';

interface ICreateLineFormProps extends IBasicScreenProps {
  initialValues?: ICrisisLine;
  onScrollToTop?: any;
  isCreate: boolean;
}

const defaultValues: ICrisisLine = {
  name: '',
  description: '',
  phone: '',
  text: '',
  chatWebLink: '',
  time: '',
  area: '',
  website: '',
};

const prepareInitValues = (initialValues) => {
  if (!initialValues) {
    return defaultValues;
  }
  return initialValues;
};

const KEYS = ['name', 'description', 'phone', 'area', 'time'];

const validateCreateLineForm = (values) => {
  const errors: any = {};

  KEYS.map((key) => {
    if (!values[key]) {
      errors[key] = translate('REQUIRED_INPUT_CTA', {
        value: translate(key.toUpperCase()),
      });
    }
  });

  if (values.description && values.description.length > 1000) {
    errors.password = translate('DESC_LESS_THAN_VALUE', { value: 1000 });
  }

  return errors;
};

const CreateLineForm: React.SFC<ICreateLineFormProps> = (
  props: ICreateLineFormProps,
) => {
  const refFormik = useRef() as any;
  const [error, setError] = useState(null);
  const alert = createRef();

  useEffect(() => {
    const { navigation } = props;

    const blurListener = navigation.addListener('didBlur', () => {
      refFormik.current.resetForm();
    });

    return () => blurListener.remove();
  }, [props.initialValues, props.isCreate]);

  const handleOnSubmit = async (
    values,
    { setSubmitting, setValues, setTouched, setErrors },
  ) => {
    const obj = {
      ...values,
    };

    try {
      const token = await getDataToLocal('@ShelterToken');

      const res = props.isCreate
        ? await CrisisLinesApi.create(obj, token)
        : await CrisisLinesApi.update(obj, token);

      if (res) {
        setSubmitting(false);
        setError(null);
        if (props.isCreate) {
          alert.current.setText(
            translate(
              'ADDED_SUCCESSFULLY_AND_YOU_WANT_TO_CREATE_NEW_CRISLINES',
            ),
            'YES',
            'add',
          );
        }
        log.success(translate('UPDATE_LINE_SUCCESSFULLY'));
      }
    } catch (error) {
      setSubmitting(false);
      setError(convertI18NText(error.message));
      throw new Error(`Can not create line with error: ${error.message}`);
    }
  };
  const onPress = (type) => {
    if (type == 'add') {
      refFormik.current.setSubmitting(false);
      refFormik.current.setValues(defaultValues);
      refFormik.current.setTouched({});
      refFormik.current.setErrors({});
      props.onScrollToTop();
    } else if (type == 'button1') {
      props.navigation.navigate('Lines');
    }
  };

  const renderCreateLineFormForm = (args) => {
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
      <View style={{ paddingBottom: 150 }}>
        <PanelGroup title="NAME">
          <Field
            name="name"
            component={InputFiled}
            placeholder="Ex: Domestic Violence Hotline"
            label={translate('CRISIS_LINE_NAME')}
            autoFocus
          />
          <Field
            name="description"
            component={InputFiled}
            placeholder={translate('DESC_LESS_THAN_VALUE', { value: 1000 })}
            maxLength={1000}
            multiline
            inputContainerStyle={{ borderWidth: 1, borderRadius: 4 }}
            inputStyle={{ padding: 8, height: 100 }}
            containerStyle={{
              marginBottom: 0,
              marginTop: 10,
              paddingHorizontal: 0,
            }}
          />
        </PanelGroup>
        <PanelGroup title="CRISIS_LINE_INFORMATION">
          <View>
            <Field
              name="phone"
              keyboardType="phone-pad"
              component={InputFiled}
              placeholder="(303) 555-0100"
              onValueChange={(value) => formatPhoneNumber(value)}
              label={translate('PHONE')}
            />
            <Field
              name="text"
              component={InputFiled}
              placeholder="Text number"
              label={translate('TEXT')}
            />
            <Field
              name="chatWebLink"
              component={InputFiled}
              placeholder="www.abc.org/chatlink"
              label={translate('CHAT_WEB_LINK')}
            />
            <Field
              name="website"
              component={InputFiled}
              placeholder="www.abc.org"
              label={translate('WEBSITE')}
            />
            <Field
              name="area"
              component={InputFiled}
              placeholder="USA"
              label={translate('AREA')}
            />
            <Field
              name="time"
              component={InputFiled}
              placeholder="24/7"
              label={translate('HOURS')}
            />
          </View>
        </PanelGroup>

        {error && <ErrorText text={error} />}
        <Button
          onPress={handleSubmit}
          containerStyle={styles.createLineFormButton}
          title={translate(
            !props.isCreate ? 'UPDATE_CRISIS_LINE' : 'ADD_CRISIS_LINE',
          )}
          loading={!!isSubmitting}
          disabled={!!isSubmitting}
        />
      </View>
    );
  };

  return (
    <View>
      <Formik
        initialValues={prepareInitValues(props.initialValues)}
        validate={validateCreateLineForm}
        onSubmit={handleOnSubmit}
        render={(args) => renderCreateLineFormForm(args)}
        enableReinitialize
        ref={refFormik}
      />
      <AlertMessage ref={alert} onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  createLineFormButton: {
    marginTop: 24,
    marginBottom: 32,
    width: '100%',
    height: 54,
  },
  wrapCheckbox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: '100%',
    justifyContent: 'flex-start',
  },
  containerCheckbox: {
    width: '50%',
    flexBasis: '50%',
    marginRight: 0,
    paddingRight: 32,
    paddingBottom: 16,
    marginLeft: 0,
  },
  contactCheckbox: {
    marginLeft: 0,
  },
});

export { CreateLineForm };
