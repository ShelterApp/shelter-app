import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';

export interface IErrorTextProps {
  text?: string;
}

const ErrorText: React.SFC<IErrorTextProps> = (props: IErrorTextProps) =>
<View style={styles.errorContainer}>
  <Text style={[common.text, { color: theme.RED_COLOR }]}>
    {translate(props.text)}
  </Text>
</View>;

const styles = StyleSheet.create({
  errorContainer: {
    ...common.errorText,
    width: '100%',
    padding: 8,
    marginVertical: 16,
  },
});

export { ErrorText, styles };
