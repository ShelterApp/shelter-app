import React from 'react';
import { StyleSheet } from 'react-native';
import { Input, ThemeProvider } from 'react-native-elements';

import { FieldProps } from 'formik';

import theme from '@app/styles/theme';
import common from '@app/styles/common';

interface IInputProps extends FieldProps {
  maxLength?: number;
  minLength?: number;
  containerStyle?: any;
  onValueChange?: any;
}

const themeCommon = {
  Input: {
    inputStyle: {
      ...common.input,
    },
    inputContainerStyle: {
      borderColor: theme.LIGHT_COLOR,
    },
    labelStyle: {
      ...common.label,
      color: theme.GRAY_DARKER_COLOR,
    },
  },
};

const InputFiled: React.SFC<IInputProps> = ({
  field, // { name, value, onChangeText, onBlur }
  form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: IInputProps) => {
  const { touched = {}, errors = {} } = form || {};
  const isShowError = field && field.name;
  return (
    <ThemeProvider testID="input-id" theme={themeCommon}>
      <Input
        errorStyle={styles.errorText}
        errorMessage={
          isShowError &&
          touched[field.name] &&
          errors[field.name] &&
          `${errors[field.name]}`
        }
        onChangeText={
          field.name == 'phone'
            ? props.onValueChange
            : field.onChange(field.name)
        }
        containerStyle={[styles.containerStyle, props.containerStyle]}
        placeholderTextColor={'#a4a4a4'}
        {...field}
        {...props}
        value={field.value ? field.value.toString() : ''}
      />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  errorText: {
    ...common.smallText,
    color: theme.RED_COLOR,
    margin: 0,
    marginTop: 8,
  },
  containerStyle: {
    paddingHorizontal: 0,
    marginBottom: 10,
    marginTop: 10,
  },
});

export { InputFiled };
