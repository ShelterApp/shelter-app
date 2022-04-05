import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';

import common from '@app/styles/common';
import theme from '@app/styles/theme';

import { getDataToLocal, setDataToLocal } from '@app/utils';

import IconAn from 'react-native-vector-icons/AntDesign';

const Kudo = (props) => {
  const [like, countLike] = useState();

  useEffect(() => {
    countLike(props.kudo);
  }, [props.kudo]);

  const compareKudo = async () => {
    const res = await getDataToLocal('@kudo');
    if (!res) {
      setDataToLocal('@kudo', JSON.stringify([props.id]));
      countLike(like + 1);
      props.clickKudo(props.id);
      return;
    }
    const afterRes = JSON.parse(res);

    if (afterRes) {
      const isFound = afterRes.includes(props.id);
      if (isFound) return;

      setDataToLocal('@kudo', JSON.stringify([...afterRes, props.id]));
      countLike(like + 1);
      props.clickKudo(props.id);
    }
  };

  return (
    <TouchableOpacity onPress={compareKudo} style={{ alignItems: 'center' }}>
      <View style={styles.likeContainerIcon}>
        <IconAn name="like1" size={20} color={theme.PRIMARY_COLOR} />
      </View>
      {!!like && (
        <Text style={styles.likeTitle}>
          {like} {`${like > 0 ? 'Kudos' : 'Kudo'}`}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  likeContainerIcon: {
    width: 28,
    height: 28,
    ...common.flexCenter,
  },
  likeTitle: {
    ...common.h2,
    color: theme.PRIMARY_COLOR,
  },
});

export { Kudo };
