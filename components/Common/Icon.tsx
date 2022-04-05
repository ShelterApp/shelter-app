import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIconsCus from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import theme from '@app/styles/theme';

const ICON_SIZE = 16;

export interface IIconProps {
  color?: string;
  size?: number;
  name: string;
  style?: any;
}

const IconCustom: React.SFC<IIconProps> = (props: IIconProps) => {
  if (props.name === 'charity') {
    return <MaterialCommunityIconsCus {...props} />;
  }  if (props.name === 'donate') {
      return <FontAwesome5 {...props} />;
    }  return <Icon {...props} />;
};

IconCustom.defaultProps = {
  color: theme.PRIMARY_COLOR,
  size: ICON_SIZE,
  name: 'ios-arrow-forward',
};

export { IconCustom };
