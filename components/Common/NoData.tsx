import React from 'react';
import { Text, StyleSheet } from 'react-native';

import common from '@app/styles/common';
import translate from '@app/utils/i18n';
import theme from '@app/styles/theme';

interface IIconProps {
  text?: string;
  value?: string;
}

const NoData: React.SFC<IIconProps> = (props: IIconProps) =>
<Text style={styles.noContent}>
  {
    props.value ?
    translate(props.text, { value: props.value }) :
    translate(props.text)
  }</Text>;

const styles = StyleSheet.create({
  noContent: {
    ...common.text,
    marginTop: '50%',
    textAlign: 'center',
    color: theme.BLACK_COLOR,
    fontSize: 16,
    paddingHorizontal: 8,
    fontStyle: 'italic',
  },
});
export { NoData };
