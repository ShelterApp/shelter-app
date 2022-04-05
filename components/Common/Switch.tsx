import React from 'react';
import { StyleSheet, Switch as SwitchCus, Text, View, Platform  } from 'react-native';
import { FieldProps } from 'formik';

import theme from '@app/styles/theme';
import common from '@app/styles/common';

interface ISwitchWithLabelProps extends FieldProps {
  label?: string;
  style: any;
  name: string;
}

const Switch: React.SFC<any> = (props: any) => {
  const scale = Platform.OS === 'ios' ? .7 : 1;
  return(
    <SwitchCus
      {...props}
      thumbColor={theme.WHITE_COLOR }
      ios_backgroundColor={ theme.GRAY_COLOR }
      trackColor={{ true: theme.PRIMARY_COLOR, false: theme.GRAY_COLOR }}
      style={{ transform:
        [{ scaleX: scale }, { scaleY: scale }] }}
    />
  );
};
const SwitchWithLabel: React.SFC<ISwitchWithLabelProps> = ({
  field, // { name, value, onChangeText, onBlur }
  form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: ISwitchWithLabelProps) => {
  return(
    <View style={{ ...styles.container, ...props.style }}>
      <Text style={styles.label}>{props.label}</Text>
      <Switch
        {...field}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 44,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    ...common.text,
    opacity: .9,
  },
});

export {
  Switch,
  SwitchWithLabel,
};
