import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';

interface IItemInProps {
  title: string;
  date: string;
  id: string;
  onDelete: () => void;
}

const ItemIn: React.SFC<IItemInProps> = (props: IItemInProps) => {

  return(
  <>
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[
          styles.backRightBtn,
          styles.backRightBtnRight,
        ]}
        onPress={props.onDelete}
      >
          <Text style={styles.backTextWhite}>
            {translate('DELETE')}
          </Text>
      </TouchableOpacity>
    </View>
    <View style={styles.rowFront}>
        <Text style={styles.text}>
            {props.title}
        </Text>
        <Text style={styles.text}>
            {props.date}
        </Text>
    </View>
  </>
  );
};

ItemIn.defaultProps = {
  title: 'Weekly',
  date: '2019-10-12',
};

const styles = StyleSheet.create({
  rowBack: {
    alignItems: 'center',
    backgroundColor: theme.GRAY_DARK_COLOR,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: theme.RED_COLOR,
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: theme.WHITE_COLOR,
    borderWidth: 1,
    borderColor: theme.LIGHT_COLOR,
    justifyContent: 'space-between',
    height: 48,
    flexDirection: 'row',
    display: 'flex',
    paddingHorizontal: 16,
  },
  text: {
    ...common.h2,
    color: theme.BLACK_COLOR,
  },
});
export { ItemIn };
