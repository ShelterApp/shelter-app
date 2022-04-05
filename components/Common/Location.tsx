import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    SafeAreaView,
    FlatList,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

import { Icon, LoadingInChild, NoData } from '@app/components/Common';

import common from '@app/styles/common';
import theme from '@app/styles/theme';
import translate from '@app/utils/i18n';

import { useDebounce } from '@app/utils/debounce';

import {
    getType,
    getQ,
    getCoords,
    getCurrentLocation,
    isCurrentLocation as getIsCurrentLocation,
} from '@app/redux/service/selectors';
import { getIsShowLocationModal } from '@app/redux/other/selectors';
import {
    setCoordinates,
    getServices,
    getServicesHeader,
    getCountService,
    setCurrentLocation,
    setCityAndZip,
} from '@app/redux/service/actions';
import { ICoords } from '@app/redux/service/reducer';
import { setLocationModal } from '@app/redux/other/actions';
import { ServicesApi } from '@shelter/core/dist/apis';
// import { GeolocationService } from '@app/utils/geolocation';

interface ILocationProps {
  getServices: (obj) => boolean;
  getServicesHeader: (obj) => [];
  getCountService: (obj) => boolean;
  setShowModal: (isShow: boolean) => void;
  onPress?: () => void;
  setCoordinates: (coords: { latitude: number; longitude: number }) => void;
  setCurrentLocation: (coords: ICoords) => void;
  setCityAndZip: any;
  type: string;
  q: string;
  isShowModal: boolean;
  isCurrentLocation: boolean;
  currentLocation: ICoords;
  coords: ICoords;
  query: string;
  isTyping: boolean;
  isFetching: boolean;
  results: any;
}

const WAIT_INTERVAL = 500;

const getLastNameOfCountry = (item) => {
  const { name, code, state } = item;
  const countryName = name || code;
  const withState =
        countryName && state ? [countryName, state].join(', ') : countryName;

  return withState;
};

const Item = (props) => {
  return (
        <TouchableOpacity onPress={props.onPress} style={styles.suggestionItem}>
            {!!props && (
                <Text style={styles.suggestionTitle}>
                    {getLastNameOfCountry(props)}
                </Text>
            )}
        </TouchableOpacity>
  );
};

const Location: React.SFC<ILocationProps> = (props: ILocationProps) => {
  const [query, setQuery] = useState(props.query);

  const [results, setResults] = useState(props.results);
  const [isTyping, setIsTyping] = useState(props.isTyping);
  const [isFetching, setFetching] = useState(props.isFetching);

  const debouncedSearchTerm = useDebounce(query, WAIT_INTERVAL);

  const searchEl = useRef() as any;

  useEffect(() => {
    if (!isTyping) {
        return;
      }
    searchCityOrZip();
  }, [debouncedSearchTerm]);

  const fetchService = async () => {
    try {
        const obj = {
            skip: 0,
            type: props.type,
            q: props.q,
          } as any;
            // console.log(obj);
        await props.getServices(obj);
        await props.getServicesHeader(obj);
        await props.getCountService(obj);
      } catch (error) {
        throw new Error(`Can not fetch service with error: ${error}`);
      }
  };

  const searchCityOrZip = async () => {
    if (!query) {
        onClearSearch();
        return;
      }
    setFetching(true);
    try {
        const res = (await ServicesApi.searchCityOrZip({
            keyword: query,
          })) as any;
        setResults([...res.cities, ...res.zips]);
        setFetching(false);
      } catch (error) {
        setResults([]);
        setFetching(false);
        throw new Error(
                `Can not search city  or zip with error: ${error.message}`,
            );
      }
  };

  const openLocation = () => {
    props.setShowModal(true);
  };

  const onSearchTextChanged = (searchValue) => {
    setIsTyping(true);
    setQuery(searchValue);
  };

  const onClearSearch = async () => {
    setIsTyping(false);
    setQuery('');
    setResults([]);
    await props.setCoordinates({ latitude: 0, longitude: 0 });
    await props.setCityAndZip({
        city: undefined,
        zip: undefined,
        state: undefined,
        coordinateOfCity: undefined,
      });
    await fetchService();
  };

  const pressCurrentLocation = async () => {
    const { longitude, latitude } = props.currentLocation;
    setIsTyping(false);
    setQuery('Current Location');

        // if (!longitude && !latitude) {
        //   getLocation();
        // }

    await props.setCoordinates({
        latitude,
        longitude,
      } as any);
    await props.setCityAndZip({
        city: undefined,
        zip: undefined,
        coordinateOfCity: { longitude, latitude },
      });
    props.setShowModal(false);
    await fetchService();
  };

  const pressOtherLocation = async (item) => {
    const { isCurrentLocation, currentLocation } = props;
    const { name, code, state, location } = item;
        // const { coordinates } = location;
    const { longitude, latitude } = currentLocation;

    setIsTyping(false);
    setQuery(name || code);
    if (isCurrentLocation) {
        const coords = { latitude, longitude };
        await props.setCoordinates(coords);
      }
    if (name) {
        await props.setCityAndZip({
            city: name,
            state,
            zip: undefined,
            coordinateOfCity: {
                longitude: location ? location.coordinates[0] : 0,
                latitude: location ? location.coordinates[1] : 0,
              },
          });
      }

    if (code) {
        await props.setCityAndZip({
            zip: code,
            state,
            city: undefined,
            coordinateOfCity: {
                longitude: location ? location.coordinates[0] : 0,
                latitude: location ? location.coordinates[1] : 0,
              },
          });
      }
    props.setShowModal(false);
    await fetchService();
  };

    // const getLocation = async () => {
    //   const geo = new GeolocationService();
    //   const hasLocationPermission = await geo.hasLocationPermission(() => {
    //     props.setShowModal(false);
    //   });

    //   if (!hasLocationPermission) return;

    //   geo.getCurrentPosition(
    //     position => {
    //       if (position) {
    //         const { latitude, longitude } = position.coords;
    //         props.setCoordinates({ latitude, longitude });
    //         props.setCurrentLocation({ latitude, longitude });
    //       }
    //     },
    //     error => console.log(error),
    //   );
    // };

  const renderItems = () => {
    if (isFetching) {
        return <LoadingInChild isFetching={isFetching} />;
      }

    if (isTyping && !results.length && !!query) {
        return <NoData text={'NO_MATCHING_RESULTS_FOUND'} />;
      }

    return (
            <FlatList
                data={results}
                renderItem={({ item }) => (
                    <Item onPress={() => pressOtherLocation(item)} {...item} />
                )}
                keyExtractor={(_, index) => index.toString()}
            />
      );
  };

  return (
        <View testID="location-id">
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={openLocation}
                testID="pin-button-id"
            >
                <Icon name="md-pin" size={26} color={theme.WHITE_COLOR} />
            </TouchableOpacity>
            <Modal
                isVisible={props.isShowModal}
                backdropColor="black"
                style={styles.modalFullScreen}
                avoidKeyboard={true}
                hasBackdrop={false}
                backdropOpacity={1}
            >
                <View style={styles.container}>
                    <SafeAreaView
                        style={{ backgroundColor: theme.PRIMARY_COLOR }}
                    >
                        <View style={styles.headerContainer}>
                            <TouchableOpacity
                                onPress={() => props.setShowModal(false)}
                                style={styles.closeStyle}
                                testID="close-button-id"
                            >
                                <Icon
                                    name="ios-close-circle"
                                    size={26}
                                    color={theme.WHITE_COLOR}
                                />
                            </TouchableOpacity>
                            <Text style={styles.title}>
                                {translate('CHOOSE_CITY_ZIP_FOR_SERVICES')}
                            </Text>
                        </View>
                        <View style={styles.contentContainer}>
                            <SearchBar
                                ref={searchEl}
                                placeholder={translate(
                                    'SEARCH_CITY_NAME_OR_ZIP_CODE',
                                )}
                                value={query}
                                searchIcon={
                                    <Icon
                                        name="ios-search"
                                        size={22}
                                        color={theme.GRAY_DARK_COLOR}
                                    />
                                }
                                containerStyle={styles.searchContainer}
                                inputContainerStyle={
                                    styles.inputSearchContainer
                                }
                                inputStyle={styles.inputSearch}
                                onChangeText={onSearchTextChanged}
                                onClear={onClearSearch}
                            />
                            {props.isCurrentLocation && (
                                <Item
                                    onPress={pressCurrentLocation}
                                    name={translate('CURRENT_LOCATION')}
                                />
                            )}
                            {renderItems()}
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
        </View>
  );
};

Location.defaultProps = {
  isTyping: false,
  isFetching: false,
  results: [],
  query: '',
};

export const styles = StyleSheet.create({
  iconContainer: {
    ...common.flexCenter,
    width: 38,
  },
  modalFullScreen: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  container: {
    backgroundColor: theme.PRIMARY_COLOR,
    height: '100%',
  },
  headerContainer: {
    backgroundColor: theme.PRIMARY_COLOR,
    height: 44,
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
    display: 'flex',
  },
  closeStyle: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    ...common.flexCenter,
  },
  title: {
    ...common.h1,
    fontWeight: '700',
    textAlign: 'center',
    color: theme.WHITE_COLOR,
  },
  contentContainer: {
    backgroundColor: theme.WHITE_COLOR,
    height: '100%',
  },
  searchContainer: {
    backgroundColor: theme.WHITE_COLOR,
    borderColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.LIGHT_COLOR,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  inputSearchContainer: {
    backgroundColor: theme.WHITE_COLOR,
    borderRadius: 4,
    marginLeft: 0,
    minHeight: 50,
    height: 50,
  },
  inputSearch: {
    color: theme.BLACK_COLOR,
    fontSize: theme.FONT_SIZE_SUPPER_LARGE,
    fontWeight: theme.FONT_WEIGHT_MEDIUM,
    display: 'flex',
    alignItems: 'center',
  },
  suggestionItem: {
        // height: 44,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.LIGHT_COLOR,
  },
  suggestionTitle: {
    ...common.h2,
    color: theme.PRIMARY_COLOR,
  },
  noContent: {
    ...common.text,
    marginTop: '20%',
    textAlign: 'center',
    color: theme.BLACK_COLOR,
    fontSize: 16,
  },
});

const mapStateToProps = (state) => ({
  type: getType(state),
  q: getQ(state),
  isShowModal: getIsShowLocationModal(state),
  coords: getCoords(state),
  currentLocation: getCurrentLocation(state),
  isCurrentLocation: getIsCurrentLocation(state),
});

const mapDispatchToProps = {
  setCoordinates,
  getServices,
  getServicesHeader,
  getCountService,
  setCurrentLocation,
  setCityAndZip,
  setShowModal: setLocationModal,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Location);
