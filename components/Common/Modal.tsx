import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';

import theme from '@app/styles/theme';
import common from '@app/styles/common';

const ModalCus: React.SFC<ModalProps> = (props: ModalProps) => (
  <View testID="modal-id" style={[styles.containerModal, props.style]}>
    <Modal {...props} avoidKeyboard={true}>
      <View style={styles.content}>{props.children}</View>
    </Modal>
  </View>
);

const styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    ...common.flexCenter,
    backgroundColor: theme.WHITE_COLOR,
  },
  content: {
    backgroundColor: theme.WHITE_COLOR,
    padding: 16,
    ...common.flexCenter,
    borderRadius: 4,
  },
});

ModalCus.defaultProps = {
  hideModalContentWhileAnimating: true,
};

export { ModalCus };
