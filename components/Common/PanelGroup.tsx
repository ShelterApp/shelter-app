import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';

interface IPanelGroupProps {
  title?: string;
  children: any;
}

const PanelGroup: React.SFC<IPanelGroupProps> = (props: IPanelGroupProps) =>
<View testID="panel-group-id" style={styles.panelContainer}>
  {props.title &&
    <View style={styles.panelTitleContainer}>
      <Text style={styles.pannelTitle}>{translate(props.title)}</Text>
    </View>
  }
  {props.children}
</View>;

const styles = StyleSheet.create({
  panelContainer: {
    marginVertical: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.LIGHT_COLOR,
    padding: 12,
    position: 'relative',
  },
  panelTitleContainer: {
    paddingHorizontal: 4,
    position: 'absolute',
    top: -12,
    left: 8,
    backgroundColor: theme.WHITE_COLOR,
  },
  pannelTitle: {
    ...common.h1,
    color: theme.PRIMARY_COLOR,
  },
});
export { PanelGroup };
