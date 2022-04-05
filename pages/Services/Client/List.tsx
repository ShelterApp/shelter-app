import React, { useState, useEffect, createRef } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Dimensions,
    ScrollView,
    Platform,
} from 'react-native';
import dayjs from 'dayjs';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import { getDataToLocal } from '@app/utils';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { SwipeListView } from 'react-native-swipe-list-view';
import IconCus from 'react-native-vector-icons/MaterialCommunityIcons';
import Carousel from 'react-native-snap-carousel';
import { Container, NoData, SkeratonService } from '@app/components/Common';
import { IBasicScreenProps, IUserProps } from '@app/components/Types';
import { Item } from '@app/components/Item';
import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';
import { GeolocationService } from '@app/utils/geolocation';
// import { useDebounce } from "@app/utils/debounce";
import { useDebounce } from 'use-debounce';
import {
    getServices,
    getServicesHeader,
    getCountService,
    updateServices,
    setCoordinates,
    setCurrentLocation,
} from '@app/redux/service/actions';
import { setLocationModal } from '@app/redux/other/actions';
import {
    getList,
    getBreakingNews,
    getLimit,
    getCount,
    getSkip,
    getCoords,
    getMapView,
    isCurrentLocation,
    getReducer,
} from '@app/redux/service/selectors';
// import { calculateTimeOpenCloseService } from "@shelter/core/dist/utils/services";
import { getUserData } from '@app/redux/user/selectors';
import AlertMessage from '@app/components/Item/Alert';

import {
    DEFAULT_SEARCH,
    ICoords,
    IServiceProps,
} from '@app/redux/service/reducer';
import { Service, ScheduleType } from '@shelter/core';
import { ServicesApi } from '@shelter/core/dist/apis';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const day = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];
const timeSecondOfWeek = [6, 0, 1, 2, 3, 4, 5];

interface IListProps extends IBasicScreenProps {
  userInfo?: IUserProps;
  getServices: (obj) => boolean;
  getServicesHeader: (obj) => [];
  updateServices: (obj) => boolean;
  getCountService: (obj) => void;
  onClickKudo?: (id: string) => void;
  goToDetail: (service: Service) => void;
  setCoordinates: (coords: { latitude: number; longitude: number }) => void;
  setLocationModal: (isShow: boolean) => void;
  setCurrentLocation: (coords: ICoords) => void;
  forceRerenderMaker: (obj) => void;
  services: Service[];
  breakingNews: Service[];
  limit: number;
  schedules: [];
  count: number;
  calculateTime: number;
  skip: number;
  type: string;
  coords: {
    latitude: number | string;
    longitude: number | string;
  };
  tabBottoms: string[];
  isMapView: boolean;
  isCurrentLocation: boolean;
  today: Date;
  getReducer: any;
}

const uppercaseTheFirtLetter = (text: string) =>
    text && text.toLocaleLowerCase().replace(/^\w/, (c) => c.toUpperCase());

/* tslint:disable */
const List: React.SFC<IListProps> = (props: IListProps) => {
    const WAIT_INTERVAL = 500;
    const [activeTab, setActiveTab] = useState("All");
    const [isFetching, setFetching] = useState(true);
    const [isFetchingUp, setFetchingUp] = useState(false);
    const [isFetchingDown, setFetchingDown] = useState(false);
    const [query, setQuery] = useState({});
    const [value] = useDebounce(query, 500);
    const [viewPort, setViewPort] = useState({
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    });

    const map = createRef();
    const alert = createRef();

    useEffect(() => {
        if (props.isMapView) handleRegionChange();
    }, [value]);
    useEffect(() => {
        if (
            props.isMapView &&
            // props.getReducer.city &&
            props.getReducer.coordinateOfCity
        )
            map.current.animateCamera({
                center: props.getReducer.coordinateOfCity,
                heading: 0,
                pitch: 90,
            });
    }, [props.getReducer.coordinateOfCity]);
    useEffect(() => {
        const { coords } = props;
        if (
            coords &&
            props.getReducer &&
            !coords.latitude &&
            !coords.longitude &&
            !props.getReducer.city &&
            !props.getReducer.zip
        ) {
            getLocation();
        }
        init();

        const focusListener = props.navigation.addListener(
            "didFocus",
            (callback) => {
                const { action } = callback;
                if (action && action.type === "Navigation/NAVIGATE") {
                    init();
                    setActiveTab("All");
                }
            }
        );
        return () => focusListener.remove();
    }, [props.isMapView]);

    const init = async () => {
        if (props.isMapView) {
            return;
        }

        setFetching(true);

        const obj = {
            skip: 0,
            type: props.type,
            q: activeTab,
        };
        // console.log(obj);
        const resService = await props.getServices(obj);
        await props.getServicesHeader(obj);
        //console.log(props);
        // if (resService2.length) setItemNews(resService2);

        if (resService) {
            setFetching(false);
            await props.getCountService(obj);
            return;
        }
    };
    const fitAllMarkers = () => {
        const dataMarker = props.services.map((item) => ({
            latitude: item.location.coordinates[1],
            longitude: item.location.coordinates[0],
        }));
        if (dataMarker.length > 13) dataMarker.length = 13;
        map.current.fitToCoordinates(dataMarker, {
            edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
        });
    };

    const getLocation = async () => {
        const geo = new GeolocationService();
        const hasLocationPermission = await geo.hasLocationPermission(() => {
            // props.setLocationModal(true);
        });
        if (!hasLocationPermission) return;
        geo.getCurrentPosition(
            async (position) => {
                if (position && position.coords) {
                    const { latitude, longitude } = position.coords;
                    await props.setCoordinates({ latitude, longitude });
                    await props.setCurrentLocation({ latitude, longitude });
                    await init();
                }
            },
            (error) => {
                console.log(error);
                if (error.PERMISSION_DENIED == 1) props.setLocationModal(true);
            }
        );
    };

    const onRefresh = async () => {
        setFetchingUp(true);
        const obj = {
            skip: 0,
            type: props.type,
            q: activeTab,
        };
        const resService = await props.getServices(obj);
        if (resService) {
            setFetchingUp(false);
            await props.getCountService(obj);
            return;
        }
    };

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const handleDeleteService = (rowMap, item) => {
        if (!props.userInfo.isAdmin) {
            return;
        }
        alert.current.setText(
            translate("DO_YOU_WANT_TO_DELETE_THIS", { value: "Service" }),
            "YES",
            "add"
        );
    };

    const handleEditService = (rowMap, key, item) => {
        if (!props.userInfo.isAdmin) {
            return;
        }
        closeRow(rowMap, key);
        const serviceData = item;
        props.navigation.navigate("AdminServiceDetails", {
            serviceData,
        });
    };

    const handleRegionChange = async () => {
        const { latitude, longitude } = query;
        if (latitude && longitude) {
            const obj = {
                skip: 0,
                limit: 100,
                type: props.type,
                q: activeTab,
            };
            await props.getServices(obj, query);
        }
    };

    const renderMarkers = () => {
        return props.services.map((ser, idx) => {
            const { location, schedules, id } = ser;
            let today = new Date(),
                isOpen = false;
            schedules.map((item) => {
                const calculateTime =
                    timeSecondOfWeek[today.getDay()] * 24 * 3600 +
                    today.getHours() * 3600 +
                    today.getMinutes() * 60;
                if (item.type == ScheduleType.FullDay) isOpen = true;
                else if (
                    item.type == "WEEKLY" &&
                    item.day === day[today.getDay()] &&
                    item.startTimeSeconds < calculateTime &&
                    item.endTimeSeconds > calculateTime
                )
                    isOpen = true;
            });
            return (
                <Marker
                    key={`${idx}-${!!isOpen ? "active" : "inactive"}`}
                    coordinate={{
                        latitude: location.coordinates[1],
                        longitude: location.coordinates[0],
                    }}
                    pinColor={!!isOpen ? "green" : "red"}
                >
                    <Callout
                        style={{
                            maxWidth: 500,
                            width: Dimensions.get("window").width * 0.9,
                        }}
                        onClickDetail={props.goToDetail}
                        onPress={() => {
                            props.goToDetail(ser);
                        }}
                    >
                        <ScrollView>
                            <Item
                                isMapView={true}
                                onClickKudo={clickKudo}
                                containerStyle={{
                                    padding: 4,
                                    borderBottomWidth: 0,
                                }}
                                {...ser}
                            />
                        </ScrollView>
                    </Callout>
                </Marker>
            );
        });
    };
    const _renderItem = ({ item, index }) => {
        return (
            <TouchableWithoutFeedback
                style={styles.breakingContainer}
                key={index}
                onPress={() =>
                    props.navigation.navigate("ShelterDetails", {
                        serviceData: item,
                    })
                }
            >
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <IconCus name="cards-diamond" size={20} color="white" />
                    <Text
                        style={[common.h1, styles.textBreak]}
                        numberOfLines={1}
                    >
                        {`${
                            item.criticalDescription
                                ? item.criticalDescription + " - "
                                : ""
                        }${item.name} ${
                            !item.isCriticalNeverExpire
                                ? "- Open till " +
                                  dayjs(item.criticalExpiredAt).format(
                                      "MM/DD/YYYY hh:mm A"
                                  )
                                : ""
                        }`}
                    </Text>
                    <IconCus name="cards-diamond" size={20} color="white" />
                </View>
            </TouchableWithoutFeedback>
        );
    };
    const renderBreakingNews = () => {
        return (
            <View
                onLayout={() =>
                    setViewPort({
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").height,
                    })
                }
                style={{ backgroundColor: "#565656" }}
            >
                <Carousel
                    data={props.breakingNews}
                    autoplay={true}
                    renderItem={_renderItem}
                    loop={true}
                    layout={"default"}
                    sliderWidth={viewPort.width}
                    itemWidth={viewPort.width}
                />
            </View>
        );
    };

    const renderHiddenItem = ({ item }, rowMap) => {
        return (
            <View style={styles.rowBack}>
                <TouchableOpacity
                    style={[styles.backRightBtn, styles.backRightBtnEdit]}
                    onPress={() => handleEditService(rowMap, item.key, item)}
                >
                    <Text style={styles.backTextWhite}>
                        {translate("EDIT")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.backRightBtn, styles.backRightBtnDelete]}
                    onPress={() => handleDeleteService(rowMap, item)}
                >
                    <Text style={styles.backTextWhite}>
                        {translate("DELETE")}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };
    const onMarkerPress = (event) => {
        if (!map.current || Platform.OS === "android") {
            return;
        }

        const { coordinate } = event.nativeEvent;
        map.current.animateCamera(
            {
                center: {
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                },
            },
            { duration: 200 }
        );
    };
    const renderList = () => {
        if (props.isMapView) {
            // const { services } = props;
            // const { location } = services && services[0];
            // const currentLatLong = {
            //     latitude: location.coordinates[1],
            //     longitude: location.coordinates[0],
            // };

            // const latLongDetail = {
            //     latitudeDelta: 4,
            //     longitudeDelta: 0.0421,
            // };
            return (
                <MapView
                    ref={map}
                    style={styles.mapContainer}
                    provider={PROVIDER_GOOGLE}
                    // region={{
                    //   ...currentLatLong,
                    //   ...latLongDetail,
                    // }}
                    showsMyLocationButton
                    showsUserLocation
                    onRegionChangeComplete={(region) => setQuery(region)}
                    loadingEnabled
                    edgePadding={{ top: 20, left: 20, bottom: 20, right: 20 }}
                    onMapReady={() => fitAllMarkers()}
                    // onMarkerPress={onMarkerPress}
                    // cacheEnabled
                >
                    {renderMarkers()}
                </MapView>
            );
        }

        if (isFetching) {
            // return(<Spinner isLoading={isFetching} />);
            return [...Array(4)].map((_, idx) => <SkeratonService key={idx} />);
        }

        if (props.services.length === 0) {
            return (
                <NoData
                    text={"NO_SERVICES_CLIENT"}
                    value={uppercaseTheFirtLetter(props.type)}
                />
            );
        }

        if (props.services.length) {
            if (props.userInfo.isAdmin) {
                return (
                    <SwipeListView
                        data={props.services.map((re, idx) => ({
                            ...re,
                            key: idx,
                        }))}
                        style={{ marginBottom: 100, height: "100%" }}
                        keyExtractor={(_, index) => index.toString()}
                        leftOpenValue={0}
                        rightOpenValue={-150}
                        disableRightSwipe={true}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        refreshControl={
                            <RefreshControl
                                refreshing={isFetchingUp}
                                onRefresh={onRefresh}
                            />
                        }
                        ListFooterComponent={renderFooter()}
                        onEndReachedThreshold={0.4}
                        onEndReached={handleLoadMore}
                    />
                );
            }

            return (
                <SafeAreaView>
                    <FlatList
                        data={props.services}
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl
                                refreshing={isFetchingUp}
                                onRefresh={onRefresh}
                            />
                        }
                        keyExtractor={(_, index) => index.toString()}
                        ListFooterComponent={renderFooter()}
                        onEndReachedThreshold={0.4}
                        onEndReached={handleLoadMore}
                        removeClippedSubviews
                    />
                </SafeAreaView>
            );
        }
    };

    const renderFooter = () => {
        if (!isFetchingDown)
            return <View style={{ height: Platform.OS == "ios" ? 130 : 62 }} />;
        return (
            <View
                style={{
                    backgroundColor: "#fff",
                    width: "100%",
                    padding: 16,
                }}
            >
                <ActivityIndicator color={"#000"} />
            </View>
        );
    };

    const handleLoadMore = async () => {
        const newSkip = props.skip + props.limit;

        if (!isFetchingDown) {
            if (newSkip < props.count) {
                //TODO
                setFetchingDown(true);
                const res = await props.updateServices({
                    skip: newSkip,
                    type: props.type,
                });
                if (res) {
                    setFetchingDown(false);
                    return;
                }
            }
        }
    };

    const handlePressTab = async (tab) => {
        setActiveTab(tab);
        // setFetching(true);
        const obj = {
            skip: 0,
            type: props.type,
            search: DEFAULT_SEARCH,
            q: tab,
        };
        const res = await props.getServices(obj);
        if (res) {
            // setFetching(false);
            await props.getCountService(obj);
            return;
        }
    };

    const clickKudo = async (id: string) => {
        try {
            const res = await ServicesApi.likes(id);
            if (res) {
                map.forceRerenderMaker();
                return true;
            }
        } catch (error) {
            return false;
        }
    };

    const renderItem = ({ item }) => {
        return (
            <Item
                {...item}
                isCurrentLocation={props.isCurrentLocation}
                onClickKudo={clickKudo}
                onClickDetail={props.goToDetail}
                activeOpacity={props.userInfo.isAdmin ? 1 : 0}
            />
        );
    };

    const goToSearch = () => {
        props.navigation.navigate("ListSearch");
        return;
    };

    const goToChatBox = () => {
        props.navigation.popToTop();
        props.navigation.navigate("ChatBox");
        return;
    };
    const onPress = async (type) => {
        if (!props.userInfo.isAdmin) {
            return;
        }

        if (type == "add") {
            try {
                const token = await getDataToLocal("@ShelterToken");
                const res = (await ServicesApi.del(
                    item.id,
                    token
                )) as Service[];
                if (res) {
                    closeRow(rowMap, item.key);
                    init();
                    props.setToast(translate("DELETED"));
                }
            } catch (error) {
                throw new Error(
                    `Can not delete service with error: ${error.message}`
                );
            }
        }
    };

    return (
        <>
            <Container
                // onQuery={handleSearchChange}
                placeHolderSearch={"SEARCH_FOODS"}
                onPress={goToSearch}
                onChatBox={goToChatBox}
            >
                {renderBreakingNews()}
                {renderList()}
                <AlertMessage ref={alert} onPress={onPress} />
            </Container>
            <View style={styles.filterBottomContainer}>
                {props.tabBottoms.map((tab, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={[
                            tab === "All"
                                ? styles.centerFilter
                                : styles.itemFilter,
                            shelterStyles.withBackground(activeTab === tab),
                        ]}
                        onPress={() => handlePressTab(tab)}
                    >
                        <Text
                            style={StyleSheet.flatten([
                                shelterStyles.withCondition(activeTab === tab),
                            ])}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );
};

const shelterStyles = {
    withCondition: (type: boolean) => ({
        color: type ? theme.WHITE_COLOR : theme.PRIMARY_COLOR,
    }),
    withBackground: (active: boolean) => ({
        backgroundColor: active ? theme.PRIMARY_COLOR : "transparent",
    }),
};

const styles = StyleSheet.create({
    filterBottomContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: 4,
        borderTopWidth: 1,
        borderColor: theme.GRAY_DARK_COLOR,
        backgroundColor: "#f6f3f3",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 44,
    },
    itemFilter: {
        ...common.flexCenter,
        borderColor: "#ccc",
        borderRadius: 20,
        borderWidth: 1,
        flex: 1,
        height: "100%",
    },
    centerFilter: {
        ...common.flexCenter,
        height: "100%",
        width: 34,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 100 / 2,
        marginHorizontal: 16,
    },
    mapContainer: {
        height: "100%",
        width: "100%",
        // flex: 1,
    },
    rowBack: {
        alignItems: "center",
        backgroundColor: theme.WHITE_COLOR,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 16,
        marginVertical: 8,
        marginHorizontal: 8,
    },
    backRightBtn: {
        alignItems: "center",
        bottom: -8,
        justifyContent: "center",
        position: "absolute",
        top: -8,
        width: 75,
    },
    backRightBtnEdit: {
        backgroundColor: theme.GRAY_DARKER_COLOR,
        right: 75,
    },
    backRightBtnDelete: {
        backgroundColor: theme.RED_COLOR,
        right: 0,
    },
    backTextWhite: {
        color: theme.WHITE_COLOR,
    },
    breakingContainer: {
        backgroundColor: "#565656",
        justifyContent: "center",
        flexDirection: "row",
        padding: 5,
        marginBottom: 5,
        marginTop: 5,
    },
    textBreak: {
        color: "white",
        width: "90%",
        textAlign: "center",
    },
});

const mapStateToProps = (state) => ({
    userInfo: getUserData(state),
    services: getList(state),
    breakingNews: getBreakingNews(state),
    limit: getLimit(state),
    count: getCount(state),
    skip: getSkip(state),
    coords: getCoords(state),
    isMapView: getMapView(state),
    isCurrentLocation: isCurrentLocation(state),
    getReducer: getReducer(state),
});

const mapDispatchToProps = {
    getServices,
    getServicesHeader,
    getCountService,
    updateServices,
    setCoordinates,
    setLocationModal,
    setCurrentLocation,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List);
