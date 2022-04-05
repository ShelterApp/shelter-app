import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Field, Formik } from 'formik';

import {
  Button, InputFiled,
  ErrorText, Container, BackButton,
} from '@app/components/Common';
import translate from '@app/utils/i18n';
import { IBasicScreenProps } from '@app/components/Types';
import { convertI18NText } from '@app/utils';
import { log } from '@app/utils/log';

import { Feedback } from '@shelter/core';
import { FeedbacksApi } from '@shelter/core/dist/apis';

const defaultValues: Feedback = {
  email: '',
  subject: '',
  message: '',
};

const KEYS = ['email', 'subject', 'message'];

const validateCreateForm = (values) => {
  const errors: any = {};

  KEYS.map(key => {
    if (!values[key]) {
      errors[key] = translate('REQUIRED_INPUT_CTA', { value: translate(key.toUpperCase()) });
    }
  });

  return errors;
};

const Create: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {
  const [error, setError] = useState(null);
  const refFormik = useRef() as any;

  useEffect(() => {
    const { navigation } = props;

    const blurListener = navigation.addListener('didBlur', () => {
      refFormik.current.resetForm();
    });

    return () => blurListener.remove();

  }, []);

  const handleOnSubmit = async (values, { setSubmitting, setValues, setTouched, setErrors }) => {

    const obj = {
      ...values,
      type: 'APP',
    };

    try {
      const res = await FeedbacksApi.createAppFeedback(obj);

      if (res) {
        setError(null);
        setSubmitting(false);
        log.success(translate('SENT_FEEDBACK_SUCCESSFULLY'));
        setValues(defaultValues);
        setTouched({});
        setErrors({});
        props.navigation.navigate('Home');
      }
    } catch (error) {
      setSubmitting(false);
      setError(convertI18NText(error.message));
      throw new Error(`Can notcreate feedback with error: ${error.message}`);
    }
  };

  const renderCreateForm = (args) => {
    const {
      handleSubmit,
      isSubmitting,
    } = args;

    return (
      <View>
        <Field
          name="email"
          component={InputFiled}
          placeholder="mark@gmail.com"
          label={translate('EMAIL')}
        />
        <Field
          name="subject"
          component={InputFiled}
          placeholder="Subject"
          label={translate('SUBJECT')}
        />

        <Field
          name="message"
          component={InputFiled}
          multiline
          inputContainerStyle={{ borderWidth: 1, borderRadius: 4, marginTop: 8 }}
          inputStyle={{ padding: 8, height: 100 }}
          containerStyle={{ marginBottom: 0, marginTop: 10, paddingHorizontal: 0 }}
          label={translate('MESSAGE')}
        />

        {error && <ErrorText text={error} />}
        <Button
          onPress={handleSubmit}
          containerStyle={styles.createFormButton}
          title={translate('SEND_FEEDBACK')}
          loading={!!isSubmitting}
          disabled={!!isSubmitting}
        />
      </View>
    );
  };

  return (
    <Container
      style={styles.containerStyle}
      title={translate('FEEDBACK')}
      renderLeftItem={
        <BackButton
          onPress={() => props.navigation.navigate('Home')}
          styles={{ marginLeft: 0 }}
        />
      }
      renderRightItem={<></>}
    >
      <ScrollView style={styles.serviceContainer}>
        <Formik
          initialValues={defaultValues}
          validate={validateCreateForm}
          onSubmit={handleOnSubmit}
          render={args => renderCreateForm(args)}
          enableReinitialize
          ref={refFormik}
        />
      </ScrollView>

    </Container>

  );
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  serviceContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  createFormButton: {
    marginTop: 24,
    marginBottom: 32,
    width: '100%',
    height: 54,
  },
});

export default Create;
