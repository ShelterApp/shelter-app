import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { IconCustom } from './Icon';

import theme from '@app/styles/theme';
import common from '@app/styles/common';

interface IIconWithBadgeProps {
  color?: string;
  size?: number;
  name: string;
  style?: any;
  badgeCount?: number;
}

const IconWithBadge: React.SFC<IIconWithBadgeProps> = (props: IIconWithBadgeProps) => {
  const { name, badgeCount, color, size } = props;
  return(
    <View testID="icon-with-badge-test">
      <IconCustom name={name} size={size} color={color} />
      {badgeCount > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>
            {badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    right: -4,
    top: 0,
    backgroundColor: theme.RED_COLOR,
    borderRadius: 8,
    width: 16,
    height: 16,
    ...common.flexCenter,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export { IconWithBadge };
