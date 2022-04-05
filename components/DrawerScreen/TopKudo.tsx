import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import IconAn from 'react-native-vector-icons/AntDesign';

import { Switch } from '@app/components/Common';
import translate from '@app/utils/i18n';

import { styles } from './MenuItem';
import theme from '@app/styles/theme';

interface ITopKudoProps {
  onPress: (isOpen: boolean) => void;
  isTopKudo: boolean;
}

const TopKudo: React.SFC<ITopKudoProps> = (props: ITopKudoProps) => {

  const onSwitch = () => {
    props.onPress(!props.isTopKudo);
  };

  return(
    <TouchableOpacity
      onPress={onSwitch}
      style={styles.item}
    >
      <View style={styles.wrapIcon}>
        <IconAn name="like1" size={20} color={theme.PRIMARY_COLOR}/>
      </View>
      <Text style={styles.itemText}>{translate('TOP_KUDOS')}</Text>
      <View style={styles.wrapSwitch}>
        <Switch onValueChange={onSwitch} value={props.isTopKudo} />
      </View>
    </TouchableOpacity>
  );
};

export { TopKudo };
