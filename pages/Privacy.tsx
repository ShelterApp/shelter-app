import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Linking,
  View,
  Dimensions,
} from 'react-native';

import { BackButton } from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';
import { StaticPagesApi } from '@shelter/core/dist/apis';
import HTML from 'react-native-render-html';

const HrefTag = ({ url, text }: any) => {
  return (
    <Text
      onPress={() => Linking.openURL(url)}
      style={{
        textDecorationLine: 'underline',
      }}
    >
      {text || url}
    </Text>
  );
};

/* tslint:disable */
const Privacy: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {
  const [item, setItem] = useState("");
  useEffect(() => {
    getPage();
  }, []);
  const getPage = async () => {
    const res = (await StaticPagesApi.get("PRIVACY")) as any;
    setItem(res.content);
  };
  return (
    <ScrollView style={styles.serviceContainer}>
      <HTML html={item} imagesMaxWidth={Dimensions.get("window").width} />
      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  serviceContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  title: {
    ...common.h1,
    color: theme.PRIMARY_COLOR,
    marginBottom: 10,
  },
  title2: {
    ...common.h1,
    color: theme.PRIMARY_COLOR,
    marginBottom: 2,
  },
  h1: {
    ...common.h1,
    color: theme.PRIMARY_COLOR,
    marginBottom: 10,
    fontWeight: "600",
  },
  h2: {
    ...common.h1,
    color: theme.PRIMARY_COLOR,
    marginBottom: 10,
  },
});

Privacy.navigationOptions = ({ navigation }) => {
  const { params } = navigation.state;
  let isShowTutorial = false;
  if (params) {
    isShowTutorial = true;
  }

  return {
    headerTitle: translate("PRIVACY_POLICY"),
    headerLeft: (
      <BackButton
        onPress={() =>
          navigation.navigate(isShowTutorial ? "ShowTutorial" : "Home")
        }
      />
    ),
  };
};

export { Privacy };
