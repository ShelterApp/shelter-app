import React from 'react';
import { StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import theme from '@app/styles/theme';

interface ISpinnerCusProps {
  isLoading?: boolean;
  textLoading?: string;
}

const SpinnerCus: React.SFC<ISpinnerCusProps> = (props: ISpinnerCusProps) =>
<Spinner
  visible={props.isLoading}
  textContent={props.textLoading}
  textStyle={styles.spinnerTextStyle}
/>;

SpinnerCus.defaultProps = {
  isLoading: false,
  textLoading: 'Loading...',
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: theme.WHITE_COLOR,
  },
});
export { SpinnerCus };
