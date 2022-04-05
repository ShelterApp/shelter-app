import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNPickerSelect, { PickerProps } from 'react-native-picker-select';
import { FieldProps } from 'formik';

import { Icon } from '@app/components/Common';
import common from '@app/styles/common';
import theme from '@app/styles/theme';

interface IPickerSelectProps extends PickerProps, FieldProps {
  style?: any;
  label?: string;
  labelStyles?: any;
  width?: number;
  selectContainerStyle?: any;
  onValueChange?: any;
}

const PickerSelect: React.SFC<IPickerSelectProps> = ({
  field, // { name, value, onChangeText, onBlur }
  form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: IPickerSelectProps) => {
  const { touched = {}, errors = {} } = form || {};
  return (
    <View
      testID="picker-select-id"
      style={[styles.selectContainerStyle, props.selectContainerStyle]}>
      <Text style={[common.label, props.labelStyles]}>{props.label}</Text>
      <RNPickerSelect
        onValueChange={(value) => props.onValueChange(value)}
        items={props.items}
        // placeholder={{ label: props.label }}
        value={props.value ? props.value : null}
        // {...props}
        {...field}
        style={{
          ...styles,
          inputIOS: {
            ...styles.inputIOS,
            width: props.width || '100%',
          },
          inputAndroid: {
            ...styles.inputAndroid,
            width: props.width || '100%',
          },
        }}
      />
      {touched[field.name] && errors[field.name] &&
        <Text style={styles.errorText}>{errors[field.name]}</Text>
      }
    </View>
  );
};

PickerSelect.defaultProps = {
  Icon: <Icon name="ios-arrow-down" />,
  // onValueChange: () => null,
  value: null,
  placeholder: {},
  items: [
    {
      label: 'select 1',
      value: 0,
    },
  ],
  label: 'PickerSelect',
};

const styles = StyleSheet.create({
  selectContainerStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  inputIOS: {
    ...common.pickerSelect,
  },
  inputAndroid: {
    ...common.pickerSelect,
  },
  iconContainer: {
    top: 14,
    right: 0,
  },
  errorText: {
    ...common.smallText,
    color: theme.RED_COLOR,
    marginTop: 8,
  },
});

export { PickerSelect };
