import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as Btn, ThemeProvider } from 'react-native-elements';

import theme from '@app/styles/theme';
import common from '@app/styles/common';

const themeCommon = {
  colors: {
    primary: theme.PRIMARY_COLOR,
  },
  Button: {
    titleStyle: {
      ...common.buttonTitle,
    },
    buttonStyle: {
      ...common.button,
    },
  },
};

const Button = (props) => {
  const { disabled, type } = props;
  return (
    <ThemeProvider testID="button-id" theme={themeCommon}>
      <Btn
        {...props}
        buttonStyle={StyleSheet.flatten([
          styles.withBorder(type),
          type === 'clear' && styles.buttonClear,
          props.buttonStyle,
        ])}
        titleStyle={StyleSheet.flatten([
          type === 'clear' && styles.titleClear,
          props.titleStyle,
        ])}
        disabledStyle={StyleSheet.flatten([
          disabled && styles.buttonDisable,
        ])}
        disabledTitleStyle={StyleSheet.flatten([
          disabled && styles.titleDisable,
        ])}
      />
    </ThemeProvider>
  );
};

const styles = {
  withBorder: (type: string) => ({
    borderWidth: type === 'outline' ? theme.BTN_BORDER_WIDTH : 0,
  }),
  buttonClear: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  titleClear: {
    paddingTop: 0,
    paddingBottom: 0,
    ...common.link,
    ...common.h2,
    color: theme.PRIMARY_COLOR,
  },
  buttonDisable: {
    opacity: .5,
    backgroundColor: theme.PRIMARY_COLOR,
  },
  titleDisable: {
    color: theme.WHITE_COLOR,
  },
};

export { Button, styles };
