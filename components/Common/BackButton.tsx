import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ViewStyle,
    Platform,
    Dimensions,
} from 'react-native';
import { Icon } from '@app/components/Common';

import common from '@app/styles/common';
import theme from '@app/styles/theme';

interface IBackButtonProps {
  icon?: {
    size: number;
    name: string;
    color: string;
  };
  styles?: ViewStyle;
  onPress?: () => void;
}

const BackButton: React.SFC<IBackButtonProps> = (props: IBackButtonProps) => {
  if (typeof props.onPress === 'function') {
    return (
            <TouchableOpacity
                style={[styles.container, props.styles]}
                onPress={props.onPress}
            >
                <Icon {...props.icon} />
            </TouchableOpacity>
      );
  }
  return (
        <View style={[styles.container, props.styles]}>
            <Icon {...props.icon} />
        </View>
  );
};

BackButton.defaultProps = {
  icon: {
    size: 24,
    name: 'md-arrow-back',
    color: theme.WHITE_COLOR,
  },
};
const height =
    Platform.OS == 'ios' && Dimensions.get('window').height > 812 ? 6 : 0;

const styles = StyleSheet.create({
  container: {
    ...common.flexCenter,
    width: 32,
    height: 24 + height,
        // marginLeft: 8,
  },
});

export { BackButton, styles };
