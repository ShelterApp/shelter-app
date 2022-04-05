import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Platform,
} from 'react-native';
import { Divider } from 'react-native-elements';
import { Field, Formik } from 'formik';
import dayjs from 'dayjs';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import Reactotron from 'reactotron-react-native';

import {
    Button,
    PanelGroup,
    DatePicker,
    PickerSelect,
} from '@app/components/Common';
import translate from '@app/utils/i18n';

import common from '@app/styles/common';
import theme from '@app/styles/theme';

import {
    tranformScheduleTypes,
    tranformDayInWeek,
    tranformWeekInMonth,
    IScheduleProps,
} from './utils';
import { ItemIn } from './ItemIn';

import { ScheduleType, Service as IServiceProps } from '@shelter/core';

interface ISchedulePanelFormProps {
  setToast?: (toast: string) => void;
  addToSchedule?: (obj) => void;
  initialValues?: IServiceProps;
  schedules?: any;
  onDeleteSchedule?: (id, key) => void;
  close?: boolean;
  titlePannel: string;
  defaultValues: IScheduleProps;
}

const { Monthly, Weekly, DateRange, FullDay, PermanentlyClosed } = ScheduleType;

const validateSchedulePanelForm = ({ scheduleType, startDate, endDate }) => {
  const errors: any = {};
    // startDate = startDate.replaceAll("-", "/");
    // endDate = endDate.replaceAll("-", "/");
  const afterStartDate = startDate && dayjs(startDate).format('MM/DD/YYYY');
  const afterEndDate = endDate && dayjs(endDate).format('MM/DD/YYYY');
  const isNotEqualDate = afterStartDate !== afterEndDate;
  const isBeforeDate =
        scheduleType === DateRange &&
        dayjs(afterStartDate).isBefore(dayjs(afterEndDate));
  if (isNotEqualDate && !isBeforeDate) {
    errors.endDate = translate('END_DATE_SHOULD_BE_GREATER');
  }

  return errors;
};

const SchedulePanelForm: React.SFC<ISchedulePanelFormProps> = (
    props: ISchedulePanelFormProps,
) => {
  const handleOnAddToSchedule = async (
        values,
        { setSubmitting, setValues },
    ) => {
    const obj = {
        startTime: values.startTime,
        endTime: values.endTime,
        type: values.scheduleType,
      } as any;
    const start = new Date(Date.parse('11/24/2014 ' + obj.startTime)),
        end = new Date(Date.parse('11/24/2014 ' + obj.endTime));
    if (start > end) {
        props.setToast(translate('CHECK_TIME_START'));
        setSubmitting(false);
        return;
      }
    if (!values.scheduleType) {
        props.setToast('Something wrong, please try again');
        setSubmitting(false);
        return;
      }

    switch (values.scheduleType) {
        case Weekly:
          obj.day = values.dayInWeek;
          break;
        case Monthly:
          obj.period = values.period;
          obj.day = values.dayInWeek;
          break;
        case DateRange:
          obj.startDate = values.startDate;
          obj.endDate = values.endDate;
          break;
        default:
          delete obj.startTime;
          delete obj.endTime;
          break;
      }
        // console.log(obj, start > end);
        // all passed
    props.addToSchedule(obj);
    setSubmitting(false);
    setValues(props.defaultValues);
  };

  const renderItemIn = ({ item }, rowMap) => {
    return (
            <SwipeRow
                key={item.key}
                disableRightSwipe={true}
                leftOpenValue={0}
                rightOpenValue={-75}
                style={{ marginBottom: 16 }}
            >
                <View style={styles.rowBack}>
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnRight]}
                        onPress={() => props.onDeleteSchedule(rowMap, item.key)}
                    >
                        <Text style={styles.backTextWhite}>
                            {translate('DELETE')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.rowFront}>
                    <Text style={styles.text}>{item.title}</Text>
                    <Text style={styles.text}>{item.date}</Text>
                </View>
            </SwipeRow>
      );
  };

  const renderSchedulePanelForm = (args) => {
    const { handleSubmit, isSubmitting, values, setFieldValue } = args;

    const { scheduleType } = values;
    const isShowWeekly = scheduleType === Weekly;
    const isShowMonthly = scheduleType === Monthly;
    const isShowDateRange = scheduleType === DateRange;
    const isShowFullday =
            scheduleType === FullDay || scheduleType === PermanentlyClosed;
    const isClose = !isShowWeekly;
    const isNotClose = isShowWeekly || isShowMonthly || isShowDateRange;
        // const scheduleTypesClose = tranformScheduleTypes;
    const scheduleTypesClose = tranformScheduleTypes.filter(
            (ty) => ty.value !== FullDay,
        );
    const scheduleTypesOpen = tranformScheduleTypes.filter(
            (ty) => ty.value !== PermanentlyClosed,
        );
    const scheduleTypes = props.close
            ? scheduleTypesClose
            : scheduleTypesOpen;
    return (
            <View>
                <PanelGroup title={props.titlePannel}>
                    <Field
                        name="scheduleType"
                        component={PickerSelect}
                        onValueChange={(value) =>
                            setFieldValue('scheduleType', value)
                        }
                        label={translate('SCHEDULE_TYPE')}
                        items={scheduleTypes}
                    />
                    {!isShowFullday && (
                        <>
                            {isShowMonthly && (
                                <Field
                                    name="period"
                                    component={PickerSelect}
                                    onValueChange={(value) =>
                                        setFieldValue('period', value)
                                    }
                                    label={translate('SELECT_PERIOD')}
                                    items={tranformWeekInMonth}
                                />
                            )}
                            {(isShowMonthly || isShowWeekly) && (
                                <Field
                                    name="dayInWeek"
                                    component={PickerSelect}
                                    onValueChange={(value) =>
                                        setFieldValue('dayInWeek', value)
                                    }
                                    label={translate('SELECT_DAY')}
                                    items={tranformDayInWeek}
                                />
                            )}
                            {isShowDateRange && (
                                <View style={common.flexRow}>
                                    <Field
                                        name="startDate"
                                        component={DatePicker}
                                        label={translate('START_DATE')}
                                        onDateChange={(value) => {
                                          setFieldValue(
                                                'startDate',
                                                Platform.OS == 'android'
                                                    ? value
                                                    : value.replaceAll('-', '/'),
                                            );
                                        }}
                                        date={values.startDate}
                                        mode="date"
                                        minDate={new Date()}
                                        styles={{
                                          width: '50%',
                                          paddingRight: 16,
                                        }}
                                    />
                                    <Field
                                        name="endDate"
                                        component={DatePicker}
                                        label={translate('END_DATE')}
                                        onDateChange={(value) => {
                                          setFieldValue(
                                                'endDate',
                                                Platform.OS == 'android'
                                                    ? value
                                                    : value.replaceAll('-', '/'),
                                            );
                                        }}
                                        date={values.endDate}
                                        mode="date"
                                        minDate={new Date()}
                                        styles={{
                                          width: '50%',
                                          paddingLeft: 16,
                                        }}
                                    />
                                </View>
                            )}
                            <View style={common.flexRow}>
                                <Field
                                    name="startTime"
                                    component={DatePicker}
                                    label={translate('START_TIME')}
                                    onDateChange={(value) =>
                                        setFieldValue('startTime', value)
                                    }
                                    date={values.startTime}
                                    mode="time"
                                    format="hh:mm A"
                                    styles={{
                                      width: '50%',
                                      paddingRight: 16,
                                    }}
                                />
                                <Field
                                    name="endTime"
                                    component={DatePicker}
                                    label={translate('END_TIME')}
                                    onDateChange={(value) =>
                                        setFieldValue('endTime', value)
                                    }
                                    date={values.endTime}
                                    mode="time"
                                    format="hh:mm A"
                                    styles={{
                                      width: '50%',
                                      paddingLeft: 16,
                                    }}
                                />
                            </View>
                        </>
                    )}
                    <Button
                        type="outline"
                        onPress={handleSubmit}
                        containerStyle={styles.schedulePanelFormButton}
                        title={translate('ADD_TO_SCHEDULE')}
                        loading={!!isSubmitting}
                        disabled={!!isSubmitting}
                    />
                    {props.schedules && props.schedules.length > 0 && (
                        <>
                            <Divider style={styles.dividerStyle} />
                            <SwipeListView
                                useFlatList
                                data={props.schedules}
                                renderItem={renderItemIn}
                                keyExtractor={(_, index) => index.toString()}
                            />
                        </>
                    )}
                </PanelGroup>
            </View>
      );
  };

  return (
        <View>
            <Formik
                initialValues={props.defaultValues}
                validate={validateSchedulePanelForm}
                onSubmit={handleOnAddToSchedule}
                render={(args) => renderSchedulePanelForm(args)}
                enableReinitialize
            />
        </View>
  );
};

const styles = StyleSheet.create({
  schedulePanelFormButton: {
    marginTop: 16,
    width: '100%',
    height: 54,
  },
  dividerStyle: {
    marginVertical: 16,
    backgroundColor: theme.LIGHT_COLOR,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: theme.GRAY_DARK_COLOR,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: theme.RED_COLOR,
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: theme.WHITE_COLOR,
    borderWidth: 1,
    borderColor: theme.LIGHT_COLOR,
    justifyContent: 'space-between',
    height: 48,
    flexDirection: 'row',
    display: 'flex',
    paddingHorizontal: 16,
  },
  text: {
    ...common.h2,
    color: theme.BLACK_COLOR,
  },
});

export { SchedulePanelForm };
