import {
    ScheduleType,
    ScheduleCategory,
    ServiceType,
    DayPeriod,
} from '@shelter/core';
import translate from '@app/utils/i18n';
import dayjs from 'dayjs';

export interface IScheduleProps {
  scheduleType?: string;
  period?: string;
  dayInWeek?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

const typeCheckboxs = Object.keys(ServiceType).map((type) => ({
  name: ServiceType[type],
  isCheck: false,
}));

const categoryCheckboxs = Object.keys(ScheduleCategory).map((type) => ({
  name: ScheduleCategory[type],
  isCheck: false,
}));

const sortName = {
  MONDAY: 'Mon',
  TUESDAY: 'Tue',
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thu',
  FRIDAY: 'Fri',
  SATURDAY: 'Sat',
  SUNDAY: 'Sun',
};

const dayInWeek = Object.keys(DayPeriod).map((day) => `${DayPeriod[day]}`);

export const weekInMonth = [
  {
    name: 'First',
    secondName: '1st',
  },
  {
    name: 'Second',
    secondName: '2nd',
  },
  {
    name: 'Third',
    secondName: '3rd',
  },
  {
    name: 'Fourth',
    secondName: '4th',
  },
  {
    name: 'Fifth',
    secondName: '5th',
  },
  {
    name: 'Last',
    secondName: 'Last',
  },
];

const tranformScheduleTypes = Object.keys(ScheduleType).map((type) => ({
  label:
        ScheduleType[type] === ScheduleType.FullDay
            ? translate('OPEN_24/7')
            : translate(ScheduleType[type]),
  value: ScheduleType[type],
}));

const tranformDayInWeek = dayInWeek.map((day) => ({
  label: translate(day),
  value: day,
}));

const tranformWeekInMonth = weekInMonth.map((week) => ({
  label: translate(week.name.toLocaleUpperCase()),
  value: week.name.toLocaleUpperCase(),
}));

const tranformType = (sche) => {
  const { type, day, period, startDate, endDate } = sche;
  switch (type) {
    case ScheduleType.Weekly:
      return day;
    case ScheduleType.Monthly:
      return `${
                weekInMonth.find(
                    (week) =>
                        week.name.toLocaleUpperCase() ===
                        period.toLocaleUpperCase(),
                ).secondName
            } ${sortName[day.toLocaleUpperCase()]}`;
    case ScheduleType.DateRange:
      return `${dayjs(startDate).format('MM/DD')} - ${dayjs(
                endDate,
            ).format('MM/DD')}`;
    case ScheduleType.FullDay:
      return translate('OPEN_24H');
    case ScheduleType.PermanentlyClosed:
      return translate('PERMANENTLY_CLOSED');
  }
};
const tranformSchedules = (schedules) => {
  if (schedules && schedules.length) {
    const order = schedules.sort((a, b) =>
            a.startTimeSeconds > b.startTimeSeconds ? 1 : -1,
        );
    const newArr = [];
    order.forEach((element) => {
        if (element.day == 'MONDAY' && element.type == 'WEEKLY') {
            newArr.push(element);
          }
      });
    order.forEach((element) => {
        if (element.day == 'TUESDAY' && element.type == 'WEEKLY') {
            newArr.push(element);
          }
      });
    order.forEach((element) => {
        if (element.day == 'WEDNESDAY' && element.type == 'WEEKLY') {
            newArr.push(element);
          }
      });
    order.forEach((element) => {
        if (element.day == 'THURSDAY' && element.type == 'WEEKLY') {
            newArr.push(element);
          }
      });
    order.forEach((element) => {
        if (element.day == 'FRIDAY' && element.type == 'WEEKLY') {
            newArr.push(element);
          }
      });
    order.forEach((element) => {
        if (element.day == 'SATURDAY' && element.type == 'WEEKLY') {
            newArr.push(element);
          }
      });
    order.forEach((element) => {
        if (element.day == 'SUNDAY' && element.type == 'WEEKLY') {
            newArr.push(element);
          }
      });
    order.forEach((element) => {
        if (element.type == 'MONTHLY' && element.period == 'FIRST') {
            newArr.push(element);
          }
      });
    order.forEach((element) => {
        if (element.type == 'MONTHLY' && element.period == 'SECOND') {
            newArr.push(element);
          }
      });
    order.forEach((element) => {
        if (element.type == 'MONTHLY' && element.period == 'THIRD') {
            newArr.push(element);
          }
      });
    order.forEach((element) => {
        if (element.type == 'MONTHLY' && element.period == 'FOURTH') {
            newArr.push(element);
          }
      });
    order.forEach((element) => {
        if (element.type == 'MONTHLY' && element.period == 'FIFTH') {
            newArr.push(element);
          }
      });
    order.forEach((element) => {
        if (element.type == 'MONTHLY' && element.period == 'LAST') {
            newArr.push(element);
          }
      });
    order.forEach((element) => {
        if (element.type == 'DATE_RANGE') newArr.push(element);
      });
    order.forEach((element) => {
        if (element.type == 'FULL_DAY') newArr.push(element);
      });
    order.forEach((element) => {
        if (element.type == 'PERMANENTLY_CLOSED') newArr.push(element);
      });

    return newArr.map((sche, idx) => ({
        key: idx,
        title: tranformType(sche),
        date:
                sche.type !== ScheduleType.FullDay
                    ? sche.startTime && sche.endTime
                        ? `${sche.startTime} - ${sche.endTime}`
                        : ''
                    : '',
      }));
  }
  return [];
};

const getIndexOfItemByName = (types, name: string) => {
  let i = 0;
  for (; i < types.length; i += 1) {
    if (name === types[i].name) {
        return i;
      }
  }

  return -1;
};

export {
    categoryCheckboxs,
    typeCheckboxs,
    tranformScheduleTypes,
    tranformDayInWeek,
    tranformWeekInMonth,
    tranformSchedules,
    getIndexOfItemByName,
};
