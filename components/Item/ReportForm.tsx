/* eslint-disable */

import React, { useState } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import { Field, Formik } from 'formik';
import { connect } from 'react-redux';
import { getCoords, getCurrentLocation } from '@app/redux/service/selectors';
import { ICoords } from '@app/redux/service/reducer';
import { Button, InputFiled, ErrorText } from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import { log } from '@app/utils/log';
import translate from '@app/utils/i18n';
import theme from '@app/styles/theme';
import common from '@app/styles/common';

import { convertI18NText } from '@app/utils';

import { FeedbacksApi } from '@shelter/core/dist/apis';

const KEYS = ['email', 'subject', 'message'];

const validateReportForm = (values) => {
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

interface IReportFormProps extends IBasicScreenProps {
  currentLocation: ICoords;
}

const ReportForm: React.SFC<IReportFormProps> = (props: IReportFormProps) => {
  const [error, setError] = useState(null);

  const handleOnSubmit = async (values, { setSubmitting }) => {
    const obj = {
      ...values,
      type: 'APP',
    };
    try {
      const res = await FeedbacksApi.createAppFeedback(obj);

      if (res) {
        setError(null);
        setSubmitting(false);
        props.closeModal();
        log.success(translate('SENT_REPORT_SUCCESSFULLY'));
      }
    } catch (error) {
      setSubmitting(false);
      setError(convertI18NText(error.message));
      throw new Error(`Can not create feedback with error: ${error.message}`);
    }
  };

  const renderReportForm = (args) => {
    const { handleSubmit, isSubmitting } = args;

    return (
      <>
        <View style={styles.contentContainer}>
          {/* <Field
            name="subject"
            component={InputFiled}
            placeholder="Subject"
            label={translate('SUBJECT')}
            style={{ backgroundColor: 'blue', paddingTop: 29 }}
          /> */}
          <Field
            name="email"
            component={InputFiled}
            placeholder="mark@gmail.com"
            label={translate('EMAIL')}
          />
          <Field
            name="message"
            component={InputFiled}
            multiline
            inputContainerStyle={{
              borderWidth: 1,
              borderRadius: 4,
              marginTop: 8,
            }}
            inputStyle={{ padding: 8, height: 100 }}
            containerStyle={{
              marginBottom: 0,
              marginTop: 10,
              paddingHorizontal: 0,
            }}
            label={translate('MESSAGE')}
          />
          {error && <ErrorText text={error} />}
        </View>
        <View style={styles.footerContainer}>
          <Button
            onPress={props.closeModal}
            containerStyle={[styles.actionButton, { marginRight: 4 }]}
            type="outline"
            title={translate('CANCEL')}
          />
          <Button
            onPress={handleSubmit}
            containerStyle={[styles.actionButton, { marginLeft: 4 }]}
            title={translate('SEND')}
            loading={!!isSubmitting}
            disabled={!!isSubmitting}
          />
        </View>
      </>
    );
  };

  return (
    <>
      <ScrollView style={{ width: '100%' }}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{translate('REPORT_TITLE')}</Text>
        </View>
        <Formik
          initialValues={{
            email: '',
            subject: props.name,
            message: '',
          }}
          validate={validateReportForm}
          onSubmit={handleOnSubmit}
          render={(args) => renderReportForm(args)}
          enableReinitialize
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.LIGHT_COLOR,
    display: 'flex',
    width: '100%',
  },
  contentContainer: {
    paddingVertical: 10,
    width: '100%',
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...common.h1,
    fontWeight: '600',
    color: theme.BLACK_COLOR,
    textAlign: 'center',
  },
  actionButton: {
    flex: 1,
    height: 50,
    borderRadius: 20,
  },
});

const mapStateToProps = (state) => ({
  coords: getCoords(state),
  currentLocation: getCurrentLocation(state),
});

export default connect(
  mapStateToProps,
  null,
)(ReportForm);
