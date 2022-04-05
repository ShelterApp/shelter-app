import React, { createRef } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Badge } from 'react-native-elements';

import { Icon, Switch } from '@app/components/Common';
import translate from '@app/utils/i18n';

import theme from '@app/styles/theme';
import common from '@app/styles/common';

import IconCus from 'react-native-vector-icons/MaterialCommunityIcons';
import AlertMessage from '@app/components/Item/Alert';

interface IMenuItemProps {
  icon: string;
  title: string;
  other?: any;
  router?: string;
  navigation?: any;
  onPress?: any;
  count: number;
}
const MenuItem: React.SFC<IMenuItemProps> = (props: IMenuItemProps) => {
  const { icon, title, other, router, navigation, count } = props;
  const alert = createRef();

  const onNavigate = () => {
    if (router) {
        navigation.navigate(router);
        return;
      }  if (title === 'ADD_SERVICE') {
          if (props.count) {
            navigation.navigate('AdminCreateService');
          } else {
            alert.current.setButton1(
                    translate('YOU_REACHED_LIMIT_SERVICE'),
                    'Close',
                );
          }
          return;
        }
    props.onPress();
  };

  return (
        <TouchableOpacity onPress={onNavigate}>
            <AlertMessage ref={alert} />

            <View style={styles.item}>
                {icon && (
                    <View style={styles.wrapIcon}>
                        {/(shield-account|shield-key)/.test(icon) ? (
                            <IconCus
                                name={icon}
                                size={20}
                                color={theme.PRIMARY_COLOR}
                            />
                        ) : (
                            <Icon name={icon} size={20} />
                        )}
                    </View>
                )}
                {title && (
                    <Text style={styles.itemText}>{translate(title)}</Text>
                )}
                {!!count && title !== 'ADD_SERVICE' && (
                    <Badge
                        badgeStyle={{
                          minWidth: 20,
                          height: 20,
                        }}
                        textStyle={{ fontWeight: 'bold' }}
                        value={count}
                        status="error"
                    />
                )}
                {other && (
                    <View style={styles.wrapSwitch}>
                        <Switch value={true} />
                    </View>
                )}
            </View>
        </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: theme.GRAY_DARK_COLOR,
        // paddingVertical: 12,
    minHeight: 46,
    paddingHorizontal: 8,
  },
  itemText: {
    marginLeft: 14,
    marginRight: 8,
    ...common.h2,
    color: theme.PRIMARY_COLOR,
  },
  wrapSwitch: {
    position: 'absolute',
    right: 0,
  },
  wrapIcon: {
    ...common.flexCenter,
    width: 20,
    height: 20,
  },
});

export { MenuItem, styles };
