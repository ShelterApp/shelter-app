import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { IBasicComponentProps } from '@app/components/Types';

import { DismissKeyboard } from './DismissKeyboard';

const KeyboardAvoidingViewCus: React.SFC<IBasicComponentProps> = (props: IBasicComponentProps) => (
  <KeyboardAvoidingView
    behavior={ Platform.OS === 'ios' ? 'padding' : null }
    style={{ flex: 1 }}
  >
    <DismissKeyboard>
      {props.children}
    </DismissKeyboard>
  </KeyboardAvoidingView>
);

export { KeyboardAvoidingViewCus };
