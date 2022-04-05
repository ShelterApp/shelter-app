import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';

import { MenuItem } from './MenuItem';
import { OpenService } from './OpenService';
import { TopKudo } from './TopKudo';
import { MapView } from './MapView';
import { getMenus } from './utils';

import translate from '@app/utils/i18n';
import theme from '@app/styles/theme';
import common from '@app/styles/common';
import { getDataToLocal } from '@app/utils';
import { AuthApi } from '@shelter/core/dist/apis';

import { IUserProps, IBasicScreenProps } from '@app/components/Types';
import { IServiceProps } from '@app/redux/service/reducer';

const buttonsFirst = ['MEN', 'WOMEN', 'YOUTH_AND_KIDS', 'ALL'];
const buttonsSecond = ['SENIORS', 'DISABLED', 'FAMILIES', 'LGBT+'];

export interface IDrawerScreenProps extends IBasicScreenProps {
  userInfo?: IUserProps;
  logout?: () => void;
  getServices: (obj) => void;
  setOpenService: (open: boolean) => void;
  setTopKudo: (open: boolean) => void;
  setMapView: (mapview: boolean) => void;
  getCountService: (obj) => void;
  allQuery: IServiceProps;
  category: string;
  isOpen: boolean;
  isTopKudo: boolean;
  isMapView: boolean;
}

const tranformSelected = (selected) => {
  if (selected) {
    switch (selected) {
        case 'YOUTH_AND_KIDS':
          return 'KIDS';
        case 'LGBT+':
          return 'LGBT';
        default:
          return selected;
      }
  }
};

const DrawerScreen: React.SFC<IDrawerScreenProps> = (
    props: IDrawerScreenProps,
) => {
  const [selectedIndexFirst, setSelectedIndexFirst] = useState();
  const [selectedIndexSecond, setSelectedIndexSecond] = useState();
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    setSelectedIndexFirst(buttonsFirst.indexOf(props.category));
    init();
    const focusListener = props.navigation.addListener('didFocus', () => {
        const selected = tranformSelected(props.category);
        const isFirst = buttonsFirst.includes(selected);
        if (isFirst) {
            setSelectedIndexFirst(buttonsFirst.indexOf(props.category));
            return;
          }
        setSelectedIndexSecond(buttonsSecond.indexOf(props.category));
      });
    return () => focusListener.remove();
  }, [props.userInfo]);

  useEffect(() => {
    if (props.navigation.state.isDrawerOpen) init();
  }, [props.navigation.state.isDrawerOpen]);

  const init = async () => {
    const { userInfo } = props;
    let isSocialAccount = false;
    let countObj;
    if (userInfo && userInfo.isLogin) {
        try {
            const token = await getDataToLocal('@ShelterToken');
            const badgeCount = await AuthApi.reportNotifications(token);
            if (badgeCount) {
                countObj = { ...badgeCount };
              }
            countObj.addService =
                    userInfo.totalServices > badgeCount.countManagedServices
                        ? 1
                        : 0;
          } catch (error) {
            throw Error('Can not get report notification');
          }
      }

    const res = await getDataToLocal('isSocialAccount');
    if (res) {
        isSocialAccount = !!JSON.parse(res);
      }
    setMenus([...getMenus(props, isSocialAccount, countObj)]);
  };

  const updateFilter = (selected, isFirst) => {
    if (isFirst) {
        setSelectedIndexFirst(selected);
        setSelectedIndexSecond(null);
        fetchService(buttonsFirst[selected]);
        return;
      }
    setSelectedIndexSecond(selected);
    setSelectedIndexFirst(null);
    fetchService(buttonsSecond[selected]);
  };

  const fetchService = async (selected) => {
    props.navigation.closeDrawer();

    const lastSelected = tranformSelected(selected);
    const { allQuery } = props;
    const obj = {
        skip: 0,
        q: allQuery.q,
        category: lastSelected,
      };

    const res = await props.getServices(obj);

    if (res) {
        await props.getCountService(obj);
      }
  };

  const handleSwitchService = async (isOpenService) => {
    props.navigation.closeDrawer();

    await props.setOpenService(isOpenService);
    const obj = {
        skip: 0,
        isOpen: isOpenService,
      };
    try {
        const res = await props.getServices(obj);
        if (res) {
            await props.getCountService(obj);
          }
      } catch (error) {
        throw new Error(`error: ${error}`);
      }
  };

  const handleTopKudo = async (isTopKudo) => {
    props.navigation.closeDrawer();

    await props.setTopKudo(isTopKudo);
    const obj = {
        isTopKudo,
        skip: 0,
      };
    try {
        const res = await props.getServices(obj);
        if (res) {
            await props.getCountService(obj);
          }
      } catch (error) {
        throw new Error(`error: ${error}`);
      }
  };

  const handleMapView = async (isMapView) => {
    props.navigation.closeDrawer();

    await props.setMapView(isMapView);
        // const obj = {
        //   isMapView,
        //   skip: 0,
        //   limit: 500,
        // };
        // try {
        //   const res = await props.getServices(obj) as any;
        //   if (res) {
        //     await props.getCountService(obj);
        //   }
        // } catch (error) {
        //   throw new Error(`error: ${error}`);
        // }
  };

  const renderHeader = () => {
    const { userInfo } = props;
    const title =
            (userInfo && userInfo.email && `${userInfo.email}`) ||
            translate('OPTIONS');
    return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{title}</Text>
            </View>
      );
  };

  return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={theme.PRIMARY_COLOR}
            />
            {renderHeader()}
            <ScrollView style={styles.wrap}>
                <OpenService
                    onPress={handleSwitchService}
                    isOpen={props.isOpen}
                />
                <ButtonGroup
                    onPress={(selected) => updateFilter(selected, true)}
                    selectedIndex={selectedIndexFirst}
                    buttons={buttonsFirst.map((b) => translate(b))}
                    containerStyle={styles.filterContainer}
                    selectedButtonStyle={styles.selectedButtonStyle}
                    buttonStyle={styles.buttonStyle}
                    innerBorderStyle={styles.innerBorderStyle}
                    textStyle={[common.text, { color: theme.WHITE_COLOR }]}
                    activeOpacity={1}
                />
                <ButtonGroup
                    onPress={(selected) => updateFilter(selected, false)}
                    selectedIndex={selectedIndexSecond}
                    buttons={buttonsSecond.map((b) => translate(b))}
                    containerStyle={styles.filterContainer}
                    selectedButtonStyle={styles.selectedButtonStyle}
                    buttonStyle={styles.buttonStyle}
                    innerBorderStyle={styles.innerBorderStyle}
                    textStyle={[common.text, { color: theme.WHITE_COLOR }]}
                    activeOpacity={1}
                />
                <MapView onPress={handleMapView} isMapView={props.isMapView} />
                {props.userInfo.isAdmin && (
                    <TopKudo
                        onPress={handleTopKudo}
                        isTopKudo={props.isTopKudo}
                    />
                )}
                {menus.map((me, idx) => (
                    <MenuItem key={idx} {...props} {...me} />
                ))}
            </ScrollView>
        </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.PRIMARY_COLOR,
  },
  wrap: {
    flex: 1,
    backgroundColor: theme.WHITE_COLOR,
  },
  header: {
    height: 44,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    ...common.h1,
    color: theme.WHITE_COLOR,
  },
  filterContainer: {
    height: 32,
    marginRight: 4,
    marginLeft: 4,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 0,
  },
  selectedButtonStyle: {
    backgroundColor: theme.PRIMARY_COLOR,
  },
  buttonStyle: {
    backgroundColor: theme.PRIMARY_LIGHT_COLOR,
  },
  innerBorderStyle: {
    width: 0,
  },
});

export { DrawerScreen };
