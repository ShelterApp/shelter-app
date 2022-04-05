import React from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { Header as HeaderCus } from 'react-native-elements';

import { BackButton } from '@app/components/Common';
import common from '@app/styles/common';
import theme from '@app/styles/theme';
import translate from '@app/utils/i18n';

interface IHeaderProps {
  title?: string;
  navigation: any;
}

const HeaderNormal: React.SFC<IHeaderProps> = (props: IHeaderProps) => {

  const goToHome = () => {
    props.navigation.navigate('Home');
  };

  return(
    <SafeAreaView
      testID="header-mormal-id"
      style={{ backgroundColor: theme.PRIMARY_COLOR }}
    >
      <View style={styles.headerContainer}>
        <HeaderCus
          centerComponent={
            <Text style={common.headerTitle}>{translate(props.title)}</Text>
          }
          leftComponent={
            <BackButton onPress={goToHome} />
          }
          containerStyle={styles.headerContainerStyle}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainerStyle: {
    backgroundColor: theme.PRIMARY_COLOR,
    height: 44,
    paddingTop: 0,
    justifyContent: 'space-around',
  },
  headerContainer: {
    position: 'relative',
  },
});

export { HeaderNormal, styles };
