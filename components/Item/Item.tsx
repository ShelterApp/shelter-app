import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Linking,
} from 'react-native';
import dayjs from 'dayjs';
import moment from 'moment';
import calendar from 'dayjs/plugin/calendar';
dayjs.extend(calendar);

import { Schedule, Icon } from '@app/components/Common';
import common from '@app/styles/common';
import theme from '@app/styles/theme';
import translate from '@app/utils/i18n';

import { Service as IServiceProps, ScheduleCategory } from '@shelter/core';
import { Kudo } from './Kudo';
import { Flag } from './Flag';

import IconFa from 'react-native-vector-icons/FontAwesome';

const Desc = (props): any => {
  const { iconName, text, otherStyle, onPress, withOutFa } = props;
  const Component = (onPress ? TouchableOpacity : View) as any;
  const LstIcon = withOutFa ? Icon : IconFa;
  if (!text) {
    return <></>;
  }

  return (
        <Component onPress={onPress} style={[styles.descContainer, otherStyle]}>
            <View style={styles.iconContainer}>
                {
                    <LstIcon
                        name={iconName}
                        size={withOutFa ? 18 : 16}
                        color="gray"
                    />
                }
            </View>
            <Text style={styles.descText}>{text}</Text>
        </Component>
  );
};

const handleCallPhone = (phone: string) => {
  if (phone) {
    Linking.openURL(`tel:${phone}`);
  }
};

interface IItemProps extends IServiceProps {
  isMapView: any;
  onClickKudo?: (id: string) => void;
  onClickDetail?: (service: IServiceProps) => void;
  activeOpacity?: number;
  containerStyle?: any;
}

const Item: React.SFC<IItemProps> = React.memo((props: IItemProps) => {
  const {
        name,
        serviceSummary,
        category,
        // tslint:disable-next-line: align
        age,
        phone,
        id,
        likes,
        onClickKudo,
        // tslint:disable-next-line: align
        distance,
        isShowFlag,
        activeOpacity,
        // tslint:disable-next-line: align
        availableBeds,
        updatedAt,
        contactEmail,
    } = props;
  const isOnlyOne = category && category.length === 1;
  const isYouthKid = isOnlyOne && category[0] === ScheduleCategory.Kids;
  const isMen = isOnlyOne && category[0] === ScheduleCategory.Men;
  const isWomen = isOnlyOne && category[0] === ScheduleCategory.Women;
  const isLGBT = isOnlyOne && category[0] === ScheduleCategory.Lgbt;
  const isExpectedCate = isYouthKid || isMen || isWomen || isLGBT;

  const lastCategory = (category.indexOf('ALL') !== -1
        ? ['Anyone']
        : category.map((a) => translate(a))
    ).join(', ');
  const withAge = age ? `${lastCategory} ${age}` : lastCategory;

  return (
        <TouchableOpacity
            onPress={() => {
              props.onClickDetail(props);
            }}
            style={[styles.containerStyle, props.containerStyle]}
            activeOpacity={activeOpacity || 0.7}
        >
            <View
                style={[
                  styles.blockFirst,
                    // tslint:disable-next-line: ter-indent
                    props.isMapView ? { width: '100%' } : {},
                ]}
            >
                <Text style={styles.title}>{name}</Text>
                <Desc iconName="star" text={serviceSummary} />
                {!!isExpectedCate ? (
                    <>
                        {isYouthKid && (
                            <Desc
                                iconName="child"
                                text={withAge}
                                otherStyle={{ alignItems: 'flex-start' }}
                            />
                        )}
                        {isMen && (
                            <Desc
                                iconName="ios-man"
                                withOutFa
                                text={withAge}
                                otherStyle={{ alignItems: 'flex-start' }}
                            />
                        )}
                        {isWomen && (
                            <Desc
                                iconName="ios-woman"
                                withOutFa
                                text={withAge}
                                otherStyle={{ alignItems: 'flex-start' }}
                            />
                        )}
                        {isLGBT && (
                            <Desc
                                iconName="md-transgender"
                                withOutFa
                                text={withAge}
                                otherStyle={{ alignItems: 'flex-start' }}
                            />
                        )}
                    </>
                ) : (
                    <Desc iconName="group" text={withAge} />
                )}
                {phone ? (
                    <Desc
                        onPress={() => handleCallPhone(phone)}
                        iconName="phone"
                        text={phone}
                    />
                ) : (
                    <Desc iconName="envelope" text={contactEmail} />
                )}
                {!!availableBeds && (
                    <Text style={styles.availableBed}>
                        {availableBeds} Beds Available. Updated{' '}
                        {updatedAt && moment(updatedAt).fromNow()}
                    </Text>
                )}
                <View style={styles.lastItemContainer}>
                    <Schedule {...props} />
                </View>
            </View>
            <View
                style={[
                  styles.kudoAndFlag,
                  {
                    justifyContent: isShowFlag
                            ? 'space-between'
                            : 'flex-end',
                  },
                ]}
            >
                {isShowFlag && !props.isMapView && <Flag {...props} />}
                {distance && props.isMapView
                    ? // (
                      //   <Text style={[styles.serviceItemText]}>{distance} Miles</Text>
                      // )
                      null
                    : !props.isMapView && (
                          <Kudo id={id} kudo={likes} clickKudo={onClickKudo} />
                      )}
            </View>
        </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  containerStyle: {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: theme.WHITE_COLOR,
  },
  blockFirst: {
    width: '85%',
    display: 'flex',
  },
  title: {
    ...common.h1,
    fontWeight: '700',
    color: theme.PRIMARY_COLOR,

        // borderWidth: 1,
        // borderColor: 'red',
  },
  serviceItemText: {
    ...common.h2,
    color: theme.PRIMARY_COLOR,
    fontSize: 14,
  },
  descContainer: {
    display: 'flex',
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',

        // borderWidth: 1,
        // borderColor: 'red',
  },
  descText: {
    paddingLeft: 8,
    lineHeight: theme.LINE_HEIGHT_SUPPER_LARGE,
    color: theme.GRAY_COLOR,
        // textTransform: 'capitalize',
  },
  iconContainer: {
    width: 16,
    height: 16,
    ...common.flexCenter,
    marginTop: 2,
  },
  lastItemContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  lastText: {
    ...common.h2,
    flexWrap: 'wrap',
  },
  kudoAndFlag: {
    width: '20%',
    alignItems: 'center',
    display: 'flex',
  },
  availableBed: {
    color: theme.GREEN_COLOR,
    fontSize: 12,
    lineHeight: theme.LINE_HEIGHT_LARGE,
  },
});

export { Item };
