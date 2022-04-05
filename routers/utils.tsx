import React from 'react';

import { Icon } from '@app/components/Common';
import IconCus from 'react-native-vector-icons/FontAwesome5';
import { Dimensions, View } from 'react-native';
import theme from '@app/styles/theme';

const getTabBarIcon = (name) => ({ focused }) => {
  const Component =
    name === 'md-briefcase' || name == 'heartbeat' ? IconCus : Icon;
  const lastName = name === 'md-briefcase' ? 'briefcase' : name;
  const width = Dimensions.get('window').width;
  return (
    <View style={{ display: 'flex', paddingRight: width > 700 ? 13 : 0 }}>
      <Component
        style={{
          width: '100%',
        }}
        name={lastName}
        size={32}
        color={focused ? theme.WHITE_COLOR : theme.WHITE_LIGHT_COLOR}
      />
    </View>
  );
};

export { getTabBarIcon };
