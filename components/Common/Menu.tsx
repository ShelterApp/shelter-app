import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import { Icon } from '@app/components/Common';
import common from '@app/styles/common';
import theme from '@app/styles/theme';

interface IMenuCusProps {
  data: IItemProps[];
  iconName?: string;
  iconSize?: number;
  animationDuration?: number;
  isClosed?: boolean;
  styleContainer?: any;
  iconStyle?: any;
}

interface IItemProps {
  name?: string;
  onClick?: () => void;
}

const MenuCus: React.SFC<IMenuCusProps> = (props: IMenuCusProps) => {
  let menu = useRef(null);

  const setMenuRef = ref => {
    menu = ref;
  };

  const hideMenu = () => {
    menu.hide();
  };

  const showMenu = () => {
    menu.show();
  };

  const onClick = (e: IItemProps) => {
    e.onClick();
    hideMenu();
  };

  const renderLabel = () => (
    <TouchableOpacity style={props.iconStyle} onPress={showMenu}>
      <Icon name={props.iconName} size={props.iconSize} color={ theme.GRAY_DARKER_COLOR } />
    </TouchableOpacity>
  );

  return(
    <View
      testID="menu-id"
      style={[props.styleContainer, styles.container]}
    >
      <Menu
        ref={setMenuRef}
        button={renderLabel()}
        animationDuration={props.animationDuration}
      >
        {props.data.map((d, idx) =>
          d.name ?
          <MenuItem style={StyleSheet.flatten([
            d.isClosed && styles.buttonDisable,
          ])} key={idx} onPress={() => onClick(d)}>{d.name}</MenuItem> :
          <MenuDivider key={idx} />,
        )}
      </Menu>
    </View>
  );
};

MenuCus.defaultProps = {
  animationDuration: 0,
  data: [],
  iconSize: 32,
  iconName: 'ios-more',
};

const styles = StyleSheet.create({
  container: {
    ...common.flexCenter,
    marginRight: 16,
  },
  buttonDisable: {
    opacity: .4,
  },
});

export { MenuCus };
