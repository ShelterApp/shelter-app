import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { FieldProps } from 'formik';

interface IDatePickerCusProps extends FieldProps  {
  showIcon: boolean;
  format: string;
  mode: string;
  confirmBtnText: string;
  cancelBtnText: string;
  iconComponent: React.ReactNode;
  customStyles?: any;
  styles: ViewStyle;
  label?: string;
  labelStyles?: TextStyle;
  selectContainerStyle?: any;
}

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';
import { Icon } from '@app/components/Common';

const DatePickerCus: React.SFC<IDatePickerCusProps> = ({
  field, // { name, value, onChangeText, onBlur }
  form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: IDatePickerCusProps) => {
  const { touched = {} , errors = {} } = form || {};
  const isShowError = field && field.name;

  return(
    <View testID="date-picker-id" style={[styles.datePickerCus, props.styles]}>
      <Text style={[common.label, props.labelStyles]}>{props.label}</Text>
      <DatePicker
        {...props}
        style={styles.datePickerContainer}
      />
      {isShowError && touched[field.name] && errors[field.name] &&
        <Text style={styles.errorText}>{errors[field.name]}</Text>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    width: '100%',
    margin: 0,
  },
  iconStyle: {
    borderColor: theme.WHITE_COLOR,
    borderWidth: 1,
    borderBottomColor: theme.LIGHT_COLOR,
    height: 40,
    ...common.flexCenter,
    marginLeft: -16,
  },
  datePickerCus: {
    marginVertical: 10,
  },
  errorText: {
    ...common.smallText,
    color: theme.RED_COLOR,
    marginTop: 8,
  },
});

DatePickerCus.defaultProps = {
  showIcon: true,
  format: 'MM-DD-YYYY',
  mode: 'date',
  confirmBtnText: translate('CONFIRM'),
  cancelBtnText: translate('CANCEL'),
  iconComponent: <View style={styles.iconStyle}><Icon name="ios-calendar" size={22} /></View>,
  customStyles: {
    dateInput: {
      borderColor: 0,
      borderWidthBottom: 1,
      borderBottomColor: theme.LIGHT_COLOR,
      height: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    dateText: {
      ...common.input,
    },
    btnTextConfirm: {
      color: theme.PRIMARY_COLOR,
    },
    btnTextCancel: {
      color: theme.BLACK_COLOR,
    },
  },
};

export { DatePickerCus, styles };
