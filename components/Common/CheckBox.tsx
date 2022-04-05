import React from 'react';
import { StyleSheet } from 'react-native';
import { CheckBox as CheckBoxCus, CheckBoxProps } from 'react-native-elements';

import theme from '@app/styles/theme';
import common from '@app/styles/common';

const CheckBox: React.SFC<CheckBoxProps> = (props: CheckBoxProps) =>
  <CheckBoxCus
    {...props}
    containerStyle={[styles.containerCheckbox, props.containerStyle]}
    textStyle={[styles.textStyle, props.textStyle]}
  />;

CheckBox.defaultProps = {
  // title: 'checkbox',
  size: 28,
  // checkedIcon: 'dot-circle-o',
  // uncheckedIcon: 'circle-o',
  checked: false,
  checkedColor: theme.PRIMARY_COLOR,
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: theme.WHITE_COLOR,
  },
  containerCheckbox: {
    margin: 0,
    marginLeft: 8,
    marginRight: 16,
    paddingLeft: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  textStyle: {
    ...common.h2,
    color: theme.BLACK_COLOR,
  },

});
export { CheckBox, styles };
