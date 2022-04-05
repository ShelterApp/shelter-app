import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    Alert,
} from 'react-native';
import { IBasicScreenProps, IUserProps } from '@app/components/Types';
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { getDataToLocal } from '@app/utils';
import { Service } from '@shelter/core';
import { ServicesApi } from '@shelter/core/dist/apis';
import { Item } from '@app/components/Item';
import { Icon, NoData, SkeratonService } from '@app/components/Common';
import common from '@app/styles/common';
import theme from '@app/styles/theme';
import translate from '@app/utils/i18n';
import { useDebounce } from '@app/utils/debounce';
import { getUserData } from '@app/redux/user/selectors';
import { getCoords, isCurrentLocation } from '@app/redux/service/selectors';
import { ICoords } from '@app/redux/service/reducer';
import { SwipeListView } from 'react-native-swipe-list-view';

const WAIT_INTERVAL = 500;

const LIMIT = 25;
const SKIP = 0;

const commonObj = {
  q: '',
  search: 'name,address1,address2,city,state,zip,serviceSummary,category,age',
  limit: LIMIT,
  skip: SKIP,
  isApproved: true,
  filter: 'isApproved',
};

interface IListSearchProps extends IBasicScreenProps {
  userInfo?: IUserProps;
  coords: ICoords;
  isCurrentLocation: boolean;
}

const ListSearch: React.SFC<IListSearchProps> = (props: IListSearchProps) => {
  const [skip, setSkip] = useState(SKIP);
  const [count, setCount] = useState(0);

  const [services, setServices] = useState([]);
  const [query, setQuery] = useState('');
  const debouncedSearchTerm = useDebounce(query, WAIT_INTERVAL);

  const [isFetching, setFetching] = useState(true);
  const [isFetchingUp, setFetchingUp] = useState(false);
  const [isFetchingDown, setFetchingDown] = useState(false);

  const searchEl = useRef() as any;

  useEffect(() => {
    onSearchPressed();
    init();
    const focusListener = props.navigation.addListener('didFocus', () => {
        onSearchPressed();
            // init();
      });

        // const blurListener = props.navigation.addListener('didBlur', () => {
        //   resetAll();
        // });

    return () => {
            // blurListener.remove();
        focusListener.remove();
      };
  }, [debouncedSearchTerm]);

  const init = () => {
    fetchServices();
    fetchCountServices();
  };

  const resetAll = () => {
    setQuery('');
    setSkip(SKIP);
    setCount(0);
    setServices([]);
  };

  const fetchServices = async () => {
    setFetching(true);
    try {
        const { longitude, latitude } = props.coords;
        const isCoords = props.coords && !!longitude && !!latitude;

        const obj = {
            ...commonObj,
            q: query,
          } as any;

        if (isCoords) {
            obj.currentCoordinate = [longitude, latitude].join('|');
            obj.filter = `${obj.filter},currentCoordinate`;
          }

        const resService = (await ServicesApi.list(obj)) as Service[];

        if (resService) {
            setServices(resService);
            setFetching(false);
          }
      } catch (error) {
        setServices([]);
        setFetching(false);
        throw new Error(
                `Can not fetch service with error: ${error.message}`,
            );
      }
  };

  const onRefresh = async () => {
    setSkip(SKIP);
    setFetchingUp(true);
    try {
        const obj = {
            ...commonObj,
            q: query,
          };
        const resService = (await ServicesApi.list(obj)) as Service[];
        if (resService) {
            setServices(resService);
            fetchCountServices();
            setFetchingUp(false);
          }
      } catch (error) {
        setServices([]);
        setFetchingUp(false);
        throw new Error(
                `Can not fetch service with error: ${error.message}`,
            );
      }
  };

  const fetchCountServices = async () => {
    try {
        const res = (await ServicesApi.count()) as number;
        if (res) {
            setCount(res);
          }
      } catch (error) {
        throw new Error(
                `Can not fetch count service with error: ${error.message}`,
            );
      }
  };

  const handleLoadMore = async () => {
    const newSkip = skip + LIMIT;
    if (newSkip < count) {
        setFetchingDown(true);
        try {
            const res = await ServicesApi.list({
                ...commonObj,
                skip: newSkip,
                q: query,
              });
            if (res) {
                setFetchingDown(false);
                    // TODO
                    // setSkip(newSkip);
                    // setServices([...services, ...res]);
              }
          } catch (error) {
            setFetchingDown(false);
            throw new Error(
                    `Can not get count noti with error: ${error.message}`,
                );
          }
      }
  };

  const onSearchPressed = () => {
    searchEl.current.focus();
  };

  const onSearchTextChanged = (searchValue) => {
    setQuery(searchValue);
  };

  const clickKudo = async (id: string) => {
    try {
        const res = await ServicesApi.likes(id);
        if (res) {
            return true;
          }
      } catch (error) {
        return false;
      }
  };
  const handleEditService = (rowMap, key, item) => {
    if (!props.userInfo.isAdmin) {
        return;
      }
    closeRow(rowMap, key);
    const serviceData = item;
    props.navigation.navigate('AdminServiceDetails', {
        serviceData,
        previousScreen: 'Home',
      });
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

    Alert.alert(
            translate('DO_YOU_WANT_TO_DELETE_THIS', { value: 'Service' }),
            null,
        [
            {
              text: translate('NO'),
              style: 'cancel',
            },
            {
              text: translate('YES'),
              onPress: async () => {
                  try {
                        const token = await getDataToLocal('@ShelterToken');
                        const res = (await ServicesApi.del(
                                item.id,
                                token,
                            )) as Service[];
                        if (res) {
                            closeRow(rowMap, item.key);
                            const newData = [...services];
                            const prevIndex = services.findIndex(
                                    (items) => items.id === item.id,
                                );
                            newData.splice(prevIndex, 1);
                            setServices(newData);
                          }
                      } catch (error) {
                        throw new Error(
                                `Can not delete service with error: ${
                                    error.message
                                }`,
                            );
                      }
                },
            },
        ],
            { cancelable: false },
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
                        {translate('EDIT')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.backRightBtn, styles.backRightBtnDelete]}
                    onPress={() => handleDeleteService(rowMap, item)}
                >
                    <Text style={styles.backTextWhite}>
                        {translate('DELETE')}
                    </Text>
                </TouchableOpacity>
            </View>
      );
  };

  const renderItem = ({ item }) => {
    return (
            <Item
                {...item}
                isCurrentLocation={props.isCurrentLocation}
                onClickKudo={clickKudo}
                onClickDetail={goToDetail}
                activeOpacity={props.userInfo.isAdmin ? 1 : 0}
            />
      );
  };

  const renderFooter = () => {
    if (!isFetchingDown) return null;
    return (
            <View
                style={{
                  backgroundColor: '#fff',
                  width: '100%',
                  padding: 16,
                }}
            >
                <ActivityIndicator color={'#000'} />
            </View>
      );
  };

  const goToDetail = (service: Service) => {
    if (service) {
        props.navigation.navigate('SearchDetails', {
            serviceData: service,
          });
      }
  };

  const renderList = () => {
    if (isFetching) {
        return [...Array(4)].map((_, idx) => <SkeratonService key={idx} />);
      }

    if (services.length === 0) {
        return <NoData text={'NO_DATA_SERVICES'} />;
      }  if (props.userInfo.isAdmin) {
          return (
                <SwipeListView
                    data={services.map((re, idx) => ({ ...re, key: idx }))}
                    style={{ marginBottom: 100, height: '100%' }}
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
                    // onEndReached={handleLoadMore} TODO
                />
          );
        }
    return (
            <FlatList
                data={services}
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
            />
      );
  };

  const onSearchClosed = () => {
    setQuery('');
    props.navigation.navigate('Home');
  };

  return (
        <View style={styles.containerStyle}>
            <SafeAreaView style={{ backgroundColor: theme.PRIMARY_COLOR }}>
                <View style={styles.headerContainerStyle}>
                    <SearchBar
                        ref={searchEl}
                        round={false}
                        showCancel={true}
                        showLoading={isFetching}
                        placeholder={translate('SEARCH_SERVICE')}
                        cancelButtonProps={{
                          buttonTextStyle: common.buttonTextStyle,
                        }}
                        platform="ios"
                        cancelButtonTitle={translate('CANCEL')}
                        value={query}
                        searchIcon={
                            <Icon
                                name="ios-search"
                                size={20}
                                color={theme.GRAY_DARK_COLOR}
                            />
                        }
                        containerStyle={common.searchContainerStyle}
                        inputContainerStyle={common.inputSearchContainerStyle}
                        inputStyle={common.inputSearchStyle}
                        onChangeText={onSearchTextChanged}
                        onCancel={onSearchClosed}
                    />
                </View>
            </SafeAreaView>
            {renderList()}
        </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: '100%',
  },
  headerContainerStyle: {
    backgroundColor: theme.PRIMARY_COLOR,
    height: 44,
    paddingTop: 0,
    justifyContent: 'space-around',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: theme.WHITE_COLOR,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: -8,
    justifyContent: 'center',
    position: 'absolute',
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
});

const mapStateToProps = (state) => ({
  userInfo: getUserData(state),
  coords: getCoords(state),
  isCurrentLocation: isCurrentLocation(state),
});

export default connect(
    mapStateToProps,
    null,
)(ListSearch);
