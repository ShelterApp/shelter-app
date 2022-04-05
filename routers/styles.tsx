import { StyleSheet, Platform, Dimensions } from 'react-native';

import common from '@app/styles/common';
import theme from '@app/styles/theme';
const height = Dimensions.get('window').height;
const tabStyles = StyleSheet.create({
  iconBack: {
    marginLeft: 16,
    ...common.flexCenter,
  },
  tabBar: {
    height: 54 + (Platform.OS === 'ios' && height >= 812 ? 20 : 0),
    paddingTop: 4,
    paddingBottom: 4 + (Platform.OS === 'ios' && height >= 812 ? 12 : 0),
    backgroundColor: theme.PRIMARY_COLOR,
  },
});

export { tabStyles };
