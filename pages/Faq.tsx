import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Platform,
} from 'react-native';

import { BackButton } from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';
import HTML from 'react-native-render-html';
import { StaticPagesApi } from '@shelter/core/dist/apis';

/* tslint:disable */
const Faq: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {
  const [item, setItem] = useState("");
  useEffect(() => {
    getPage();
  }, []);
  const getPage = async () => {
    const res = (await StaticPagesApi.get("FAQ")) as any;
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
  },
  last: {
    backgroundColor: theme.PRIMARY_COLOR,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 4,
    display: "flex",
    flex: 1,
    height: 48,
    flexDirection: "row",
    marginBottom: 16,
  },
  item: {
    width: "20%",
    ...common.flexCenter,
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

Faq.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: translate("FAQ"),
    headerLeft: <BackButton onPress={() => navigation.navigate("ChatBox")} />,
  };
};

export { Faq };
