import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';

import { Switch } from '@app/components/Common';
import translate from '@app/utils/i18n';

import { styles } from './MenuItem';
import theme from '@app/styles/theme';

interface IMapViewProps {
  onPress: (isOpen: boolean) => void;
  isMapView: boolean;
}

const MapView: React.SFC<IMapViewProps> = (props: IMapViewProps) => {

  const onSwitch = () => {
    props.onPress(!props.isMapView);
  };

  return(
    <TouchableOpacity
    onPress={onSwitch}
    style={styles.item}>
      <View style={styles.wrapIcon}>
        <Icon name="map" size={16} color={theme.PRIMARY_COLOR}/>
      </View>
      <Text style={styles.itemText}>{translate('MAP_VIEW')}</Text>
      <View style={styles.wrapSwitch}>
        <Switch onValueChange={onSwitch} value={props.isMapView} />
      </View>
    </TouchableOpacity>
  );
};

export { MapView };
