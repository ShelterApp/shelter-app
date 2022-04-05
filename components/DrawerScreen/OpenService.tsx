import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { Icon, Switch } from '@app/components/Common';
import translate from '@app/utils/i18n';

import { styles } from './MenuItem';

interface IOpenServiceProps {
  onPress: (isOpen: boolean) => void;
  isOpen: boolean;
}

const OpenService: React.SFC<IOpenServiceProps> = (props: IOpenServiceProps) => {

  const onSwitch = () => {
    props.onPress(!props.isOpen);
  };

  return(
    <TouchableOpacity
      onPress={onSwitch}
      style={styles.item}
    >
      <View style={styles.wrapIcon}><Icon name="ios-clock" size={20} /></View>
      <Text style={styles.itemText}>
        {translate('OPEN_SERVICES')}
      </Text>
      <View style={styles.wrapSwitch}>
        <Switch onValueChange={onSwitch} value={props.isOpen} />
      </View>
    </TouchableOpacity>
  );
};

export { OpenService };
