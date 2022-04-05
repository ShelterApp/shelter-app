import React from 'react';
import { View } from 'react-native';
import theme from '@app/styles/theme';

const SkeratonService = () => {
  return(
    <View style={styles.container}>
      <View style={[styles.item, { width: 126 }]}></View>
      <View style={[styles.item, { width: 296 }]}></View>
      <View style={[styles.item, { width: 254 }]}></View>
      <View style={[styles.item, { width: 212 }]}></View>
      <View style={[styles.item, { width: 170 }]}></View>
    </View>
  );
};

const styles = {
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: theme.WHITE_COLOR,
  },
  item: {
    borderRadius: 3,
    height: 18,
    backgroundColor: '#f3f3f3',
    marginVertical: 6,
  },
};

export { SkeratonService };
