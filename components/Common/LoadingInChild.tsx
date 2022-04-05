import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import theme from '@app/styles/theme';

import { IBasicComponentProps } from '@app/components/Types';

interface ILoadingInChildProps extends IBasicComponentProps {
  isFetching: boolean;
}

const LoadingInChild: React.SFC<ILoadingInChildProps> =
(props: ILoadingInChildProps) =>
  <View style={{ flex: 1 }}>
    <View style = {styles.container}>
      <ActivityIndicator
        size="large"
        animating = {props.isFetching}
        color={theme.BLACK_COLOR}
        />
    </View>
  </View>;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: '40%',
    opacity: 0.5,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { LoadingInChild };
