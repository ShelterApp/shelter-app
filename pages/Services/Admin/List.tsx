import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    FlatList,
    Alert,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';

import { Container, BackButton, Spinner } from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';
import { SORT, DIRECTION, LIMIT, SKIP } from '@app/utils/constants';
import { getDataToLocal } from '@app/utils';
import { connect } from 'react-redux';
import { getUserData } from '@app/redux/user/selectors';
import { setToast } from '@app/redux/other/actions';
import { log } from '@app/utils/log';
import { ItemInList } from './ItemInList';
import { ServicesApi } from '@shelter/core/dist/apis';
import { Service, User } from '@shelter/core';
import AlertMessage from '@app/components/Item/Alert';

interface IServicesProps extends IBasicScreenProps {
  query: string;
  userInfo: User;
}

const commonQuery = {
  sort: SORT,
  direction: DIRECTION,
  limit: LIMIT,
  skip: SKIP,
    // filter: 'isApproved',
    // isApproved: 'true | false',
};

const Services: React.SFC<IServicesProps> = (props: IServicesProps) => {
  const [services, setServices] = useState([]);
  const [querySearch, setQuerySearch] = useState('');

  const [skip, setSkip] = useState(SKIP);
  const [count, setCount] = useState(0);

  const [isFetching, setFetching] = useState(true);
  const [isFetchingUp, setFetchingUp] = useState(false);
  const [isFetchingDown, setFetchingDown] = useState(false);

  const listRef = useRef(null) as any;
  useEffect(() => {
    init();
    const focusListener = props.navigation.addListener('didFocus', () => {
        init();
      });
    return () => focusListener.remove();
  }, [props.userInfo]);

  const init = () => {
    fetchEvents();
    fetchCount();
  };

  const onRefresh = async () => {
    setFetchingUp(true);

    try {
        const obj = commonQuery as any;

        if (!props.userInfo.isAdmin) {
            obj.filter = `${obj.filter},user,isShowAll`;
            obj.user = props.userInfo.id;
            obj.isShowAll = true;
          } else {
            obj.filter = `${obj.filter},isShowAll`;
            obj.isShowAll = true;
          }
        const res = (await ServicesApi.list(obj)) as Service[];

        if (res) {
            setServices(res);
            setFetchingUp(false);
          }
        setFetchingUp(false);
      } catch (error) {
        setServices([]);
        setFetchingUp(false);
        throw new Error(
                `Can not get events list with error: ${error.message}`,
            );
      }
  };

  const fetchCount = async () => {
    const obj = commonQuery as any;

    if (!props.userInfo.isAdmin) {
        obj.filter = `${obj.filter},user,isShowAll`;
        obj.user = props.userInfo.id;
        obj.isShowAll = true;
      } else {
        obj.filter = `${obj.filter},isShowAll`;
        obj.isShowAll = true;
      }
    try {
        const res = await ServicesApi.count(obj);
        if (res) {
            setCount(res);
          }
      } catch (error) {
        throw new Error(
                `Can not get count of service with error: ${error.message}`,
            );
      }
  };

  const fetchEvents = async () => {
    setFetching(true);

    try {
        const obj = commonQuery as any;

        if (!props.userInfo.isAdmin) {
            obj.filter = 'user,isShowAll';
            obj.user = props.userInfo.id;
            obj.isShowAll = true;
          } else {
            obj.filter = 'isShowAll';
            obj.isShowAll = true;
          }

        const res = (await ServicesApi.list(obj)) as Service[];
        if (res) {
            setServices(res);
            setFetching(false);
          }
        setFetching(false);
      } catch (error) {
        setServices([]);
        setFetching(false);
        throw new Error(
                `Can not get events list with error: ${error.message}`,
            );
      }
  };

  const handleSearchChange = async (query: string) => {
    setQuerySearch(query);
    try {
        const obj = {
            skip,
            ...commonQuery,
            q: query,
            search: 'name',
          } as any;

        if (!props.userInfo.isAdmin) {
            obj.filter = `${obj.filter},user`;
            obj.user = props.userInfo.id;
          }

        const res = (await ServicesApi.list(obj)) as Service[];
        if (res) {
            setServices(res);
          }
      } catch (error) {
        throw new Error(
                `Can not search events list with error: ${error.message}`,
            );
      }
  };

  const handleLoadMore = async () => {
    const newSkip = skip + LIMIT;

    if (newSkip < count) {
        setFetchingDown(true);

        try {
            const obj = {
                ...commonQuery,
                skip: newSkip,
              } as any;
            const res = await ServicesApi.list(obj);
            if (res) {
                setFetchingDown(false);
                setSkip(newSkip);
                setServices([...services, ...res]);
              }
          } catch (error) {
            setFetchingDown(false);
            throw new Error(
                    `Can not get count noti with error: ${error.message}`,
                );
          }
      }
  };

  const handleDelete = async (id: string) => {
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
                                id,
                                token,
                            )) as Service[];
                        if (res) {
                            props.setToast(translate('DELETED'));
                            fetchEvents();
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

  const handleDeleteWithoutAlert = async (id: string) => {
    try {
        const token = await getDataToLocal('@ShelterToken');
        const res = (await ServicesApi.del(id, token)) as Service[];
        if (res) {
            log.success(translate('DELETED'));
            fetchEvents();
          }
      } catch (error) {
        throw new Error(
                `Can not delete service with error: ${error.message}`,
            );
      }
  };

  const handleEdit = async (service: Service) => {
    if (service) {
            /* tslint:disable */
            const temp = Object.assign({}, { ...service }) as any;
            delete temp.location;
            delete temp.onDelete;
            delete temp.onEdit;

            const serviceData = temp;
            props.navigation.navigate("AdminServiceDetails", {
                serviceData,
            });
            return;
        }
    };

    const renderList = () => {
        if (isFetching) {
            return <Spinner isLoading={isFetching} />;
        }

        if (services.length === 0) {
            return (
                <View
                    style={{
                        marginTop: "50%",
                        paddingHorizontal: 8,
                    }}
                >
                    <Text
                        style={{
                            ...common.text,
                            textAlign: "center",
                            color: theme.BLACK_COLOR,
                            fontSize: 16,
                            fontStyle: "italic",
                        }}
                    >
                        {!querySearch ? (
                            <>
                                No services added. Please click on
                                <Text
                                    onPress={() =>
                                        props.navigation.navigate(
                                            "AdminCreateService"
                                        )
                                    }
                                    style={{ textDecorationLine: "underline" }}
                                >
                                    {" "}
                                    Add Services{" "}
                                </Text>
                                in Side Menu.
                            </>
                        ) : (
                            <>No services found matching your search.</>
                        )}
                    </Text>
                </View>
            );
        }

        return (
            <FlatList
                // style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
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
                ref={listRef}
            />
        );
    };

    const renderItem = ({ item }) => {
        return (
            <ItemInList
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDeleteWithoutAlert={handleDeleteWithoutAlert}
                {...item}
            />
        );
    };

    const renderFooter = () => {
        if (!isFetchingDown) {
            return (
                <View
                    style={{
                        backgroundColor: "#fff",
                        width: "100%",
                        padding: 16,
                        paddingBottom: 150,
                    }}
                />
            );
        }
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

    return (
        <Container
            onQuery={handleSearchChange}
            title={translate("MANAGE_SERVICES")}
            placeHolderSearch={translate("SEARCH_SERVICE")}
            renderLeftItem={
                <BackButton
                    onPress={() => props.navigation.navigate("Home")}
                    styles={{ marginLeft: 0 }}
                />
            }
            searchOnly
        >
            {renderList()}
        </Container>
    );
};

const mapStateToProps = (state) => ({
    userInfo: getUserData(state),
});

const mapDispatchToProps = {
    setToast,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Services);
