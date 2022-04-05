import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import dayjs from 'dayjs';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';

import { Service as IServiceProps, ScheduleType } from '@shelter/core';
import { calculateTimeOpenCloseService } from '@shelter/core/dist/utils/services';
import { checkSpecificDays } from '@app/utils';
import { weekInMonth } from '@app/components/ServiceForm/utils';

const tranformSchedules = (props: any) => {
  const caculateSchedule = calculateTimeOpenCloseService(
        props.schedules,
        props.closeSchedules,
    );
  const { openSchedule, closedSchedule, nextOpenSchedule } = caculateSchedule;
  const today = new Date();
  const dayOfWeek = checkSpecificDays(dayjs(today).day());
  const nextDayOfWeek =
        dayjs(today).day() === 6
            ? checkSpecificDays(0)
            : checkSpecificDays(dayjs(today).day() + 1);
  const text = '';
  const isOpen = false;
  const fullDay =
        props.schedules &&
        props.schedules.length === 1 &&
        props.schedules[0].type === ScheduleType.FullDay;
  if (!!openSchedule && openSchedule.endTime && !fullDay) {
    const { endTime } = openSchedule;
    const lastEndTime = dayjs(endTime).format('h:mm A');
    return {
        text: `Open till ${lastEndTime}`,
        isOpen: true,
      };
  }  if (fullDay && !closedSchedule) {
      return {
        text: 'Open 24/7',
        isOpen: true,
      };
    }  if (fullDay && closedSchedule) {
      if (openSchedule) {
        const { day, startTime, endTime, period } = openSchedule;
        const isToday = dayOfWeek === day;
        const isTomorrow = nextDayOfWeek === day;
        const nextStartTime = dayjs(endTime).format('h:mm A');
        if (period) {
            const found = weekInMonth.find(
                    (w) => w.name.toUpperCase() === period,
                );
            return {
                text: `Closed until ${found.secondName} ${translate(
                        day,
                    )} ${nextStartTime}`,
                isOpen: false,
              };
          }
        if (isToday) {
            return {
                text: `Closed till  ${nextStartTime}`,
                isOpen: false,
              };
          }

        if (isTomorrow) {
            return {
                text: `Closed until ${nextStartTime} tomorrow`,
                isOpen: false,
              };
          }
        return {
            text: `Closed until ${translate(day)} ${nextStartTime}`,
            isOpen: false,
          };
      }  {
          const { startTime, day } = closedSchedule;
          const lastEndTime = dayjs(startTime).format('h:mm A');
          return {
            text: `Open till ${translate(day)} ${lastEndTime}`,
            isOpen: true,
          };
        }
    }
  if (nextOpenSchedule && !fullDay) {
    const { day, startTime, period } = nextOpenSchedule;
    const isToday = dayOfWeek === day;
    const isTomorrow = nextDayOfWeek === day;
    const nextStartTime = dayjs(startTime).format('h:mm A');
    if (period) {
        const found = weekInMonth.find(
                (w) => w.name.toUpperCase() === period,
            );
        return {
            text: `Closed until ${found.secondName} ${translate(
                    day,
                )} ${nextStartTime}`,
            isOpen: false,
          };
      }

    if (isToday) {
        const found = props.schedules.find(
                (item) => item.day == day && startTime > new Date(),
            );
        if (found) {
            return {
                text: `Closed till ${nextStartTime}`,
                isOpen: false,
              };
          }

        return {
            text: `Closed till next ${translate(day)} ${nextStartTime}`,
            isOpen: false,
          };
      }

    if (isTomorrow) {
        return {
            text: `Closed until ${nextStartTime} tomorrow`,
            isOpen: false,
          };
      }
    return {
        text: `Closed until ${translate(day)} ${nextStartTime}`,
        isOpen: false,
      };
  }

  return {
    text,
    isOpen,
  };
};

const Schedule: React.SFC<IServiceProps> = (props: IServiceProps) => {
  const {
        isContact,
        schedules,
        distance,
        isChatBox,
        isCurrentLocation,
    } = props;

  const fullDay =
        schedules &&
        schedules.length === 1 &&
        schedules[0].type === ScheduleType.FullDay;
  const afterTranform = tranformSchedules(props);
    // console.log(afterTranform, "afterTranform");
  const firstText = isContact
        ? translate('IS_SHOW_CONTACT')
        : afterTranform.text;
    // if (!firstText) console.log(schedules);
  if (isChatBox) {
    return (
            <Text>
                {firstText}.{' '}
                {isCurrentLocation && !!distance && `${distance} Miles`}
            </Text>
      );
  }

  return (
        <View testID="schedule-id" style={styles.scheduleContainer}>
            <Text
                style={StyleSheet.flatten([
                  styles.scheduleText,
                  distanceStyle.withSchedule({
                    fullDay,
                    ...props,
                    isOpen: afterTranform.isOpen,
                  }),
                ])}
            >
                {firstText}.
                {!!distance && (
                    <Text
                        style={StyleSheet.flatten([
                          styles.distance,
                          distanceStyle.withDistance({
                            fullDay,
                            ...props,
                            isOpen: afterTranform.isOpen,
                          }),
                        ])}
                    >
                        {' '}
                        {distance} Miles
                    </Text>
                )}
            </Text>
        </View>
  );
};

const distanceStyle = {
  withSchedule: ({ isContact, fullDay, isOpen }: any) => ({
    color: isContact
            ? theme.WARNING_COLOR
            : isOpen
            ? theme.GREEN_COLOR
            : theme.RED_COLOR,
  }),
  withDistance: ({ isContact, fullDay, isOpen }: any) => ({
    color: isContact
            ? theme.RED_COLOR
            : isOpen
            ? theme.GREEN_COLOR
            : theme.RED_COLOR,
  }),
};

const styles = StyleSheet.create({
  scheduleContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  scheduleText: {
    ...common.h2,
    fontSize: 12,
    display: 'flex',
  },
  distance: {
    ...common.h2,
    color: theme.RED_COLOR,
    fontSize: 12,
  },
});

export { Schedule, styles };
