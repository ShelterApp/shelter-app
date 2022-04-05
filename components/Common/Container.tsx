import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Header } from '@app/components/Common';

interface IContainerProps {
  style?: ViewStyle;
  children?: React.ReactNode;
  onQuery?: any;
  title?: string;
  renderLeftItem?: React.ReactNode;
  searchOnly?: boolean;
  placeHolderSearch?: string;
  renderRightItem?: any;
  onPress?: any;
  onChatBox?: any;
}

const Container: React.SFC<IContainerProps> = (props: IContainerProps) => (
  <View testID="container-id">
    <Header
      title={props.title}
      onQuery={props.onQuery}
      onPress={props.onPress}
      onChatBox={props.onChatBox}
      renderLeftItem={props.renderLeftItem}
      searchOnly={props.searchOnly}
      placeHolderSearch={props.placeHolderSearch}
      renderRightItem={props.renderRightItem}
    />
    <View style={[styles.container, props.style]}>
      {props.children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    position: 'relative',
    paddingBottom: 58,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});

export { Container, styles };
