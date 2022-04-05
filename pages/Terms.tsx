import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';

import { BackButton } from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';
import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';
import { StaticPagesApi } from '@shelter/core/dist/apis';
import HTML from 'react-native-render-html';

/* tslint:disable */
const Terms: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {
  const [item, setItem] = useState("");
  useEffect(() => {
    getPage();
  }, []);
  const getPage = async () => {
    const res = (await StaticPagesApi.get("TERMS")) as any;
    setItem(res.content);
  };
  return (
    <ScrollView style={styles.serviceContainer}>
      <HTML html={item} imagesMaxWidth={Dimensions.get("window").width} />
      <View style={{ height: 50 }} />
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
  h1: {
    ...common.h1,
    color: theme.PRIMARY_COLOR,
    marginBottom: 10,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  h2: {
    ...common.h1,
    color: theme.PRIMARY_COLOR,
    marginBottom: 10,
    textDecorationLine: "underline",
  },
});

Terms.navigationOptions = ({ navigation }) => {
  const { params } = navigation.state;
  let isShowTutorial = false;
  if (params) {
    isShowTutorial = true;
  }

  return {
    headerTitle: translate("TERMS_OF_USE"),
    headerLeft: (
      <BackButton
        onPress={() =>
          navigation.navigate(isShowTutorial ? "ShowTutorial" : "Home")
        }
      />
    ),
  };
};

export { Terms };
