import React from 'react';
import { View, Text, StyleSheet, ImageStyle, Platform } from 'react-native';

import common from '@app/styles/common';
import theme from '@app/styles/theme';

interface ILogoProps {
  style?: ImageStyle;
}

const Logo: React.SFC<ILogoProps> = (props: ILogoProps) => (
  <View style={[styles.logoStyle, props.style]}>
    <Text
      style={[styles.textLogo, {
        fontFamily: Platform.OS === 'ios' ?
        'HarabaraMaisBlackItalic-HarabaraMaisBlackItalic' : 'Harabara',
      }]}
    >ShelterApp</Text>
  </View>
);

const styles = StyleSheet.create({
  logoStyle: {
    ...common.flexCenter,
    width: '100%',
    height: '100%',
    flex: 1,
  },
  textLogo: {
    fontSize: 30,
    color: theme.WHITE_COLOR,
  },
});

export { Logo };
