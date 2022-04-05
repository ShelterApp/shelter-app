import React from 'react';
import { View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { IBasicComponentProps } from '@app/components/Types';

const DismissKeyboard: React.SFC<IBasicComponentProps> = (props: IBasicComponentProps) => (
  <TouchableWithoutFeedback
    onPress={Keyboard.dismiss}
    testID="without-feedback-id"
  >
    <View style={{ flex: 1 }}>
      {props.children}
    </View>
  </TouchableWithoutFeedback>
);

export { DismissKeyboard };
