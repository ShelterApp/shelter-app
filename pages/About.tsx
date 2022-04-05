import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';

import { BackButton, Icon } from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';
import HTML from 'react-native-render-html';
import IconFa from 'react-native-vector-icons/FontAwesome';
import { StaticPagesApi } from '@shelter/core/dist/apis';

/* tslint:disable */
const About: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {
  const [item, setItem] = useState("");
  useEffect(() => {
    getPage();
  }, []);
  const getPage = async () => {
    const res = (await StaticPagesApi.get("ABOUT")) as any;
    setItem(res.content);
  };
  return (
    <ScrollView style={styles.serviceContainer}>
      <HTML html={item} imagesMaxWidth={Dimensions.get("window").width} />
      <View style={styles.last}>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.shelterapp.org/")}
          style={styles.item}
        >
          <Icon name="md-globe" size={30} color={theme.WHITE_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            Linking.openURL(`mailto:shelterappinfo@gmail.com`);
          }}
        >
          <Icon name="md-mail" size={30} color={theme.WHITE_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://twitter.com/ShelterAppInfo")}
          style={styles.item}
        >
          <IconFa name="twitter" size={30} color={theme.WHITE_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://www.facebook.com/shelterappinfo")
          }
          style={styles.item}
        >
          <IconFa name="facebook" size={30} color={theme.WHITE_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://www.instagram.com/shelterappinfo/")
          }
          style={styles.item}
        >
          <IconFa name="instagram" size={30} color={theme.WHITE_COLOR} />
        </TouchableOpacity>
      </View>
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
});

About.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: translate("ABOUT_SHELTER"),
    headerLeft: <BackButton onPress={() => navigation.navigate("Home")} />,
  };
};

export { About };
