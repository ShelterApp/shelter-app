import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Linking,
    PanResponder,
    Image,
} from 'react-native';
import dayjs from 'dayjs';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import IconCus from 'react-native-vector-icons/FontAwesome5';
import Config from 'react-native-config';
import MapViewDirections from 'react-native-maps-directions';

import { connect } from 'react-redux';
import { setToast } from '@app/redux/other/actions';
import { getCoords } from '@app/redux/service/selectors';

import {
    Container,
    Icon,
    BackButton,
    Button,
    Modal,
} from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';
// import { Button } from "react-native-elements";

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';

import { Service, ScheduleCategory, ScheduleType } from '@shelter/core';
import { tranformSchedules } from '@app/components/ServiceForm/utils';
import { getDataToLocal, setDataToLocal } from '@app/utils';
import { log } from '@app/utils/log';
import IconFa from 'react-native-vector-icons/FontAwesome';
const { GOOGLE_MAPS_APIKEY } = Config;
import FeedBackForm from '../../../components/Item/FeedBackForm';
import ReportForm from '../../../components/Item/ReportForm';

// const origin = {latitude: 37.3318456, longitude: -122.0296002};
// const destination = {latitude: 37.771707, longitude: -122.4053769};

const prefixFavorite = '@shelter_favorite';

const Website = (props) => {
  const { website, iconName, handleOpenWebsite } = props;
  return (
        <TouchableOpacity
            onPress={() => handleOpenWebsite(website)}
            style={[
              styles.itemInView,
              {
                borderWidth: 1,
                borderBottomWidth: 0,
                borderColor: theme.LIGHT_COLOR,
              },
            ]}
        >
            <View style={styles.iconCicle}>
                <IconCus name={iconName} size={20} color={theme.WHITE_COLOR} />
            </View>
            <Text style={styles.textNomal}>{website}</Text>
        </TouchableOpacity>
  );
};

interface IDetailServiceProps extends IBasicScreenProps {
  locationSelected: any;
  isSearch?: boolean;
}

const Details: React.SFC<IDetailServiceProps> = (
    props: IDetailServiceProps,
) => {
  const [service, setService] = useState(undefined);
  const [isFavorite, setFavorite] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [panHandlers, setPanHandlers] = useState({});
  const [isShowModal, setShowModal] = useState(false);

  useEffect(() => {
    const serviceData =
            props.navigation.getParam('serviceData') || undefined;
    setService(serviceData);
    init(serviceData);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderStart: (event, gesture) => {
            setScrollEnabled(gesture.numberActiveTouches === 2);
          },
      });
    setPanHandlers(panResponder.panHandlers);
  }, []);

  const init = async (serviceProps: Service) => {
    const res = await getDataToLocal(prefixFavorite);

    if (res) {
        const afterRes = JSON.parse(res);

        const isFound = afterRes.includes(serviceProps.id);
        setFavorite(isFound);
      }
  };

  const addToFavorite = async () => {
    const id = service.id;
    const res = await getDataToLocal(prefixFavorite);
    if (!res) {
        setDataToLocal(prefixFavorite, JSON.stringify([id]));
        setFavorite(true);
        return;
      }
    const afterRes = JSON.parse(res);

    if (afterRes) {
        const isFound = afterRes.includes(id);
        if (isFound) {
            setDataToLocal(
                    prefixFavorite,
                    JSON.stringify(afterRes.filter((fil) => fil !== id)),
                );
                // props.setToast(translate('REMOVED_TO_FAVORITE'));
            log.success(translate('REMOVED_TO_FAVORITE'));
            setFavorite(false);
            return;
          }
        setDataToLocal(prefixFavorite, JSON.stringify([...afterRes, id]));
        setFavorite(true);
        log.success(translate('ADDED_TO_FAVORITE'));
            // props.setToast(translate('ADDED_TO_FAVORITE'));
      }
  };

  const handleCallPhone = () => {
    if (service.phone) {
        Linking.openURL(`tel:${service.phone}`);
      }
  };

  const handleOpenMailBox = () => {
    if (service.contactEmail) {
        Linking.openURL(`mailto:${service.contactEmail}`);
      }
  };

  const handleOpenWebsite = (link: string) => {
    if (link) {
        Linking.openURL(link);
      }
  };

  const handleOpenMaps = (address) => {
    if (address) {
        Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${address}`,
            );
      }
  };

  const renderRightItem = () => {
    return (
            <TouchableOpacity
                onPress={addToFavorite}
                style={styles.iconContainer}
            >
                <Icon
                    name={`${isFavorite ? 'md-star' : 'md-star-outline'}`}
                    size={28}
                    color={theme.WHITE_COLOR}
                />
            </TouchableOpacity>
      );
  };

  const handleBackButton = () => {
    const { isSearch } = props;
    if (isSearch) {
        props.navigation.navigate('ListSearch');
        return;
      }
    props.navigation.goBack();
  };

  const renderLeftItem = () => {
    return (
            <BackButton onPress={handleBackButton} styles={{ marginLeft: 0 }} />
      );
  };

  const renderAddress = () => {
    const { address1, city, state, zip } = service;
    const address = { address1, city, state, zip };
    const lastAddress = Object.keys(address).map((ad) => `${address[ad]}`);

    return (
            <View>
                <TouchableOpacity
                    onPress={() => handleOpenMaps(lastAddress)}
                    // style={styles.itemInViewWithoutBorder}
                    style={[
                      styles.itemInViewWithoutBorder,
                      {
                        borderWidth: 1,
                        borderBottomWidth: 0,
                        borderColor: theme.LIGHT_COLOR,
                      },
                    ]}
                >
                    <View style={styles.iconCicle}>
                        <Icon
                            name="ios-pin"
                            size={20}
                            color={theme.WHITE_COLOR}
                        />
                    </View>
                    <Text style={styles.textNomal}>
                        {lastAddress.join(', ')}
                    </Text>
                </TouchableOpacity>
                {renderMaps()}
            </View>
      );
  };

  const renderSchedule = () => {
    const { schedules, isContact } = service;
    const lastSchedules = schedules && tranformSchedules(schedules);

    if (lastSchedules.length > 0) {
        return (
                <View style={styles.itemView}>
                    {lastSchedules.map((s, idx) => (
                        <View
                            key={idx}
                            style={[
                              styles.rowFront,
                              idx > 0 &&
                                lastSchedules[idx - 1].title ===
                                    lastSchedules[idx].title
                                    ? styles.itemInView2
                                    : idx === 0
                                    ? { borderTopWidth: 1 }
                                    : { borderTopWidth: 1 },
                              idx === lastSchedules.length - 1
                                    ? {
                                      borderBottomWidth: 1,
                                      borderBottomColor: theme.LIGHT_COLOR,
                                    }
                                    : null,
                            ]}
                        >
                            <Text
                                style={[
                                  styles.text,
                                    { marginRight: 48, width: '30%' },
                                ]}
                            >
                                {idx > 0 &&
                                lastSchedules[idx - 1].title ===
                                    lastSchedules[idx].title
                                    ? ''
                                    : translate(s.title)}
                            </Text>
                            <Text style={[styles.text, { width: '70%' }]}>
                                {s.date}
                            </Text>
                        </View>
                    ))}
                </View>
          );
      }

    if (isContact) {
        return (
                <View
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                    }}
                >
                    <Text style={styles.textNomal}>
                        {translate('IS_SHOW_CONTACT')}
                    </Text>
                </View>
          );
      }
    return <></>;
  };

  const renderCloseSchedule = () => {
    const { closeSchedules } = service;
    const lastCloseSchedules =
            closeSchedules && tranformSchedules(closeSchedules);
    if (lastCloseSchedules.length > 0) {
        return (
                <View>
                    {lastCloseSchedules.map((s, idx) => (
                        <View
                            key={idx}
                            style={[
                              styles.rowFront,
                              {
                                borderBottomWidth: 1,
                                borderTopWidth: idx === 0 ? 1 : 0,
                              },
                            ]}
                        >
                            <Text
                                style={[
                                  styles.text,
                                    { marginRight: 48, width: '30%' },
                                ]}
                            >
                                {translate(s.title)}
                            </Text>
                            <Text style={[styles.text, { width: '70%' }]}>
                                {s.date}
                            </Text>
                        </View>
                    ))}
                </View>
          );
      }
  };

  const renderCategory = () => {
    const { category, age } = service;
    const isYouthKid = category && category[0] === ScheduleCategory.Kids;
    const lastCategory =
            category.indexOf('ALL') !== -1
                ? ['Anyone']
                : category.map((a) => translate(a));
    const withAge = age ? [...lastCategory, age] : lastCategory;

    return (
            <View>
                <View style={[styles.itemInViewWithoutBorder]}>
                    <View style={styles.iconCicle}>
                        <IconFa
                            name={isYouthKid ? 'child' : 'group'}
                            size={16}
                            color={theme.WHITE_COLOR}
                        />
                    </View>
                    <Text style={styles.textNomal}>{withAge.join(' ')}</Text>
                </View>
            </View>
      );
  };
  const onMapDirectionDrawnDone = (result) => {
    if (result && result.coordinates) fitToCoordinates(result.coordinates);
  };
  const fitToCoordinates = (coors) => {
    const mapPadding = 80;
    if (this.map && coors.length > 1) {
        this.map.fitToCoordinates(coors, {
            edgePadding: {
                top: mapPadding,
                left: mapPadding,
                bottom: mapPadding,
                right: mapPadding,
              },
          });
      }
  };
  const renderMaps = () => {
    const { location, schedules } = service;
    const { locationSelected } = props;
    const isLocation = location && location.coordinates.length > 0;
    const is24Hour =
            schedules &&
            schedules[0] &&
            schedules[0].type === ScheduleType.FullDay;

    const latLongDetail = {
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

    const latLong = {
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      };

    if (isLocation) {
        return (
                <View
                    {...panHandlers}
                    style={{
                      borderWidth: 1,
                      borderTopWidth: 0,
                      borderColor: theme.LIGHT_COLOR,
                    }}
                >
                    <MapView
                        style={[styles.mapContainer]}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{ ...latLong, ...latLongDetail }}
                        ref={(r) => {
                          this.map = r;
                        }}
                        // showsUserLocation={true}
                        loadingEnabled={true}
                        pitchEnabled={false}
                        scrollEnabled={scrollEnabled}
                    >
                        <Marker
                            key={1}
                            coordinate={latLong}
                            pinColor={is24Hour ? theme.GREEN_COLOR : 'red'}
                        >
                            <Image
                                source={require('@app/assets/images/B.png')}
                                style={{ width: 28, height: 40 }}
                            />
                        </Marker>
                        {!!locationSelected && !!locationSelected.latitude && (
                            <>
                                <Marker
                                    key={2}
                                    coordinate={locationSelected}
                                    pinColor="blue"
                                >
                                    <Image
                                        source={require('@app/assets/images/A.png')}
                                        style={{ width: 28, height: 40 }}
                                    />
                                </Marker>
                                <MapViewDirections
                                    origin={latLong}
                                    destination={locationSelected}
                                    apikey={GOOGLE_MAPS_APIKEY}
                                    strokeWidth={3}
                                    showsScale
                                    strokeColor="hotpink"
                                    optimizeWaypoints={true}
                                    onReady={onMapDirectionDrawnDone}
                                    mode="TRANSIT"
                                />
                            </>
                        )}
                    </MapView>
                </View>
          );
      }
    return <></>;
  };

  return (
        <Container
            placeHolderSearch={'SEARCH_FOODS'}
            renderRightItem={renderRightItem()}
            renderLeftItem={renderLeftItem()}
        >
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
                style={styles.scrollContainer}
            >
                {service && (
                    <>
                        <View style={styles.itemViewWithoutBorder}>
                            <Text style={styles.title}>{service.name}</Text>
                            {service.isShowFlag && (
                                <Text style={styles.desc}>
                                    {service.description}
                                </Text>
                            )}
                        </View>
                        {!service.isShowFlag && (
                            <View
                                style={[
                                  styles.itemInViewWithoutBorder,
                                  {
                                    alignItems: 'flex-start',
                                    paddingTop: 0,
                                  },
                                ]}
                            >
                                <Text
                                    style={[
                                      styles.textNomal,
                                        { textAlign: 'center' },
                                    ]}
                                >
                                    <Icon
                                        style={{ marginRight: 10 }}
                                        name="ios-star"
                                        size={16}
                                    />{' '}
                                    {service.serviceSummary}
                                </Text>
                            </View>
                        )}
                        {!!service.availableBeds && (
                            <View
                                style={[
                                  styles.itemView,
                                  {
                                    marginBottom: 16,
                                    borderWidth: 1,
                                    borderColor: theme.LIGHT_COLOR,
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                  },
                                ]}
                            >
                                <View style={styles.itemInViewWithoutBorder}>
                                    <Text style={styles.textNomal}>
                                        Available/Total Beds:{' '}
                                        {service.availableBeds}/
                                        {service.totalBeds}
                                    </Text>
                                </View>
                            </View>
                        )}
                        <View style={[styles.itemView]}>
                            {!!service.phone && (
                                <TouchableOpacity
                                    onPress={handleCallPhone}
                                    style={[
                                      styles.itemInView,
                                      {
                                        borderWidth: 1,
                                        borderBottomWidth: 0,
                                        borderColor: theme.LIGHT_COLOR,
                                      },
                                    ]}
                                >
                                    <View style={styles.iconCicle}>
                                        <Icon
                                            name="ios-call"
                                            size={20}
                                            color={theme.WHITE_COLOR}
                                        />
                                    </View>
                                    <Text style={styles.textNomal}>
                                        {service.phone}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {!!service.contactEmail && (
                                <TouchableOpacity
                                    onPress={handleOpenMailBox}
                                    style={[
                                      styles.itemInView,
                                      {
                                        borderWidth: 1,
                                        borderBottomWidth: 0,
                                        borderColor: theme.LIGHT_COLOR,
                                      },
                                    ]}
                                >
                                    <View style={styles.iconCicle}>
                                        <Icon
                                            name="ios-mail"
                                            size={20}
                                            color={theme.WHITE_COLOR}
                                        />
                                    </View>
                                    <Text style={styles.textNomal}>
                                        {service.contactEmail}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {!!service.website && (
                                <Website
                                    style={[
                                      styles.itemInView,
                                      {
                                        borderWidth: 1,
                                        borderColor: theme.LIGHT_COLOR,
                                      },
                                    ]}
                                    website={service.website}
                                    handleOpenWebsite={handleOpenWebsite}
                                    iconName="globe-americas"
                                />
                            )}
                            {!!service.facebook && (
                                <Website
                                    style={[
                                      styles.itemInView,
                                      {
                                        borderWidth: 1,
                                        borderColor: theme.LIGHT_COLOR,
                                      },
                                    ]}
                                    website={service.facebook}
                                    handleOpenWebsite={handleOpenWebsite}
                                    iconName="facebook-f"
                                />
                            )}
                            {!!service.twitter && (
                                <Website
                                    website={service.twitter}
                                    handleOpenWebsite={handleOpenWebsite}
                                    iconName="twitter"
                                />
                            )}
                            {!!service.youtube && (
                                <Website
                                    website={service.youtube}
                                    handleOpenWebsite={handleOpenWebsite}
                                    iconName="youtube"
                                />
                            )}
                            {!!service.instagram && (
                                <Website
                                    website={service.instagram}
                                    handleOpenWebsite={handleOpenWebsite}
                                    iconName="instagram"
                                />
                            )}
                            {renderAddress()}
                            {service.isShowFlag && (
                                <View style={styles.itemInViewWithoutBorder}>
                                    <View style={styles.iconCicle}>
                                        <Icon
                                            name="ios-star"
                                            size={20}
                                            color={theme.WHITE_COLOR}
                                        />
                                    </View>
                                    <Text style={styles.textNomal}>
                                        {service.serviceSummary}
                                    </Text>
                                </View>
                            )}
                            <View>
                                <View style={[styles.itemInViewWithoutBorder]}>
                                    <View style={styles.iconCicle}>
                                        <Icon
                                            name="ios-calendar"
                                            size={20}
                                            color={theme.WHITE_COLOR}
                                        />
                                    </View>
                                    <Text style={styles.textNomal}>
                                        {translate('SCHEDULE')}
                                    </Text>
                                </View>
                                {renderSchedule()}
                            </View>

                            {!!service.closeSchedules &&
                                service.closeSchedules.length > 0 && (
                                    <View>
                                        <View
                                            style={[
                                              styles.itemInViewWithoutBorder,
                                            ]}
                                        >
                                            <View style={styles.iconCicle}>
                                                <Icon
                                                    name="ios-calendar"
                                                    size={20}
                                                    color={theme.WHITE_COLOR}
                                                />
                                            </View>
                                            <Text style={styles.textNomal}>
                                                {translate('CLOSED_DAYS')}
                                            </Text>
                                        </View>
                                        {renderCloseSchedule()}
                                    </View>
                                )}
                            {renderCategory()}
                        </View>
                        <Button
                            onPress={() => setShowModal(!isShowModal)}
                            containerStyle={[styles.actionButton]}
                            buttonStyle={styles.buttonStyle}
                            title={translate(
                                service.isShowFlag
                                    ? 'CONNECT_WITH_US'
                                    : 'REPORT_SERVICE_INFO',
                            )}
                        />

                        <Modal
                            isVisible={isShowModal}
                            backdropColor="black"
                            onBackdropPress={() => setShowModal(false)}
                        >
                            {service.isShowFlag ? (
                                <FeedBackForm
                                    closeModal={() => setShowModal(false)}
                                    {...service}
                                />
                            ) : (
                                <ReportForm
                                    closeModal={() => setShowModal(false)}
                                    {...service}
                                />
                            )}
                        </Modal>
                        {(service.updatedAt || service.createdAt) && (
                            <Text style={styles.textUpdateDate}>
                                {translate('LAST_UPDATE_ON')}:{' '}
                                {dayjs(
                                    service.updatedAt || service.createdAt,
                                ).format('MMMM DD, YYYY')}
                            </Text>
                        )}
                        <View style={{ paddingBottom: 10 }} />
                    </>
                )}
            </ScrollView>
        </Container>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    ...common.flexCenter,
    width: 38,
  },
  scrollContainer: {
    padding: 8,
  },
  itemViewWithoutBorder: {
    paddingHorizontal: 12,
    ...common.flexCenter,
  },
  itemView: {
    borderRadius: 2,
  },
  itemInView: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInView2: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomColor: theme.LIGHT_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInViewWithoutBorder: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textNomal: {
    ...common.h2,
    color: theme.PRIMARY_COLOR,
    flexWrap: 'wrap',
    flex: 1,
  },
  title: {
    ...common.h1,
    color: theme.PRIMARY_COLOR,
    fontWeight: '600',
    marginBottom: 8,
  },
  desc: {
    ...common.h2,
    color: theme.PRIMARY_COLOR,
    marginBottom: 8,
    padding: 6,
    textAlign: 'center',
  },
  iconCicle: {
    ...common.flexCenter,
    width: 32,
    height: 32,
    backgroundColor: theme.PRIMARY_COLOR,
    borderRadius: 50,
    marginRight: 10,
  },
  rowFront: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
    flexDirection: 'row',
    display: 'flex',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.LIGHT_COLOR,
  },
  text: {
    ...common.h2,
    color: theme.PRIMARY_COLOR,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  textUpdateDate: {
    ...common.h2,
    color: theme.PRIMARY_COLOR,
    paddingVertical: 12,
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonStyle: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  actionButton: {
        // flex: 1,
    marginTop: 20,
        // height: 58,
    width: '80%',
    alignSelf: 'center',
  },
  mapContainer: {
    height: 290,
    width: '100%',
    flex: 1,
  },
});

const mapStateToProps = (state) => ({
  locationSelected: getCoords(state),
});

const mapDispatchToProps = {
  setToast,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Details);
