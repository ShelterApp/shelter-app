import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';

import { Icon } from '@app/components/Common';
import common from '@app/styles/common';
import theme from '@app/styles/theme';
import { IBasicScreenProps } from '../Types';

interface IMenuIconProps extends IBasicScreenProps {
  onPress?: () => void;
}

const MenuIcon: React.SFC<IMenuIconProps> = (props: IMenuIconProps) => {
  const handleOnPress = () => {
    props.navigation.toggleDrawer();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleOnPress}
    >
      <Icon
        size={28}
        name="md-menu"
        color={theme.WHITE_COLOR}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...common.flexCenter,
    width: 38,
  },
});

const WrapMenuIcon = withNavigation(MenuIcon);
export default WrapMenuIcon;
