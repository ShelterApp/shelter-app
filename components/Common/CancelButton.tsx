import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';

import theme from '@app/styles/theme';
import translate from '@app/utils/i18n';

interface ICancelButtonProps {
  title: string;
  style?: ViewStyle;
  onPress?: () => void;
}

const CancelButton: React.SFC<ICancelButtonProps> = (props: ICancelButtonProps) => {
  return(
    <TouchableOpacity
      activeOpacity={0}
      style={[styles.cancelButton, props.style]}
      onPress={props.onPress}
    >
      <Text style={{ color: theme.WHITE_COLOR }}>{translate(props.title)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    marginHorizontal: 16,
  },
});

export { CancelButton, styles };
