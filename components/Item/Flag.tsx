import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { Modal } from '@app/components/Common';

import common from '@app/styles/common';
import theme from '@app/styles/theme';

import IconFa from 'react-native-vector-icons/FontAwesome';
import FeedBackForm from './FeedBackForm';

const Flag = (props) => {
  const [isShowModal, setShowModal] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowModal(!isShowModal)}
        style={styles.flagContainer}
      >
        <IconFa
          name="flag"
          size={20}
          color={theme.PRIMARY_COLOR}
        />
      </TouchableOpacity>
      <Modal
        isVisible={isShowModal}
        backdropColor="black"
        onBackdropPress={() => setShowModal(false)}
      >
        <FeedBackForm
          closeModal={() => setShowModal(false)}
          {...props}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  flagContainer: {
    width: 40,
    height: 40,
    ...common.flexCenter,
  },
});

export { Flag };
