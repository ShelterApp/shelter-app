import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';

import { Container, BackButton, Spinner, NoData } from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import translate from '@app/utils/i18n';
import theme from '@app/styles/theme';
import common from '@app/styles/common';
import { SORT, DIRECTION, LIMIT, SKIP } from '@app/utils/constants';
import { getDataToLocal } from '@app/utils';
import { UsersApi } from '@shelter/core/dist/apis';
import { User, UserRole } from '@shelter/core';
import { SwipeListView } from 'react-native-swipe-list-view';
import { log } from '@app/utils/log';
const commonQuery = {
  sort: SORT,
  direction: DIRECTION,
  limit: LIMIT,
  skip: SKIP,
};

const Users: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {
  const [users, setUsers] = useState([]);

  const [skip, setSkip] = useState(SKIP);
  const [count, setCount] = useState(0);

  const [isFetching, setFetching] = useState(true);
  const [isFetchingUp, setFetchingUp] = useState(false);
  const [isFetchingDown, setFetchingDown] = useState(false);

  useEffect(() => {
    init();

    const focusListener = props.navigation.addListener('didFocus', () => {
        init();
      });
    return () => focusListener.remove();
  }, []);

  const init = () => {
    fetchUsers();
    fetchCount();
  };

  const onRefresh = async () => {
    setFetchingUp(true);

    try {
        const token = await getDataToLocal('@ShelterToken');
        const res = (await UsersApi.list(commonQuery, token)) as User[];
        if (res) {
            setUsers(res);
            setFetchingUp(false);
          }
        setFetchingUp(false);
      } catch (error) {
        setUsers([]);
        setFetchingUp(false);
        throw new Error(
                `Can not get events list with error: ${error.message}`,
            );
      }
  };

  const fetchCount = async () => {
    try {
        const token = await getDataToLocal('@ShelterToken');
        const res = await UsersApi.count(commonQuery, token);
        if (res) {
            setCount(res);
          }
      } catch (error) {
        throw new Error(
                `Can not get count of service with error: ${error.message}`,
            );
      }
  };

  const fetchUsers = async () => {
    setFetching(true);

    try {
        const token = await getDataToLocal('@ShelterToken');
        const res = (await UsersApi.list(commonQuery, token)) as User[];

        if (res) {
            setUsers(res);
            setFetching(false);
          }
        setFetching(false);
      } catch (error) {
        setUsers([]);
        setFetching(false);
        throw new Error(
                `Can not get events list with error: ${error.message}`,
            );
      }
  };

  const handleSearchChange = async (query: string) => {
    try {
        const obj = {
            skip,
            ...commonQuery,
            q: query,
            search: 'name, email, phone, displayName',
          };
        if (
                query.toLowerCase().includes('administrator') ||
                query.toLowerCase().includes('super user') ||
                query.toLowerCase().includes('auto user')
            ) {
            obj.search = 'roles';
          } else if (
                query.toLowerCase().includes('facebook') ||
                query.toLowerCase().includes('local') ||
                query.toLowerCase().includes('google') ||
                query.toLowerCase().includes('twitter')
            ) {
              obj.search = 'lastMethod';
            }

        obj.limit = 100;
        const token = await getDataToLocal('@ShelterToken');
        const resService = (await UsersApi.list(obj, token)) as User[];
        if (resService) {
            setUsers(resService);
            return;
          }
      } catch (error) {
        throw new Error(
                `Can not get events list with error: ${error.message}`,
            );
      }
  };

  const handleLoadMore = async () => {
    const newSkip = skip + LIMIT;

    if (newSkip < count) {
        setFetchingDown(true);
        try {
            const token = await getDataToLocal('@ShelterToken');
            const res = await UsersApi.list(
                {
                  ...commonQuery,
                  skip: newSkip,
                },
                    token,
                );
            if (res) {
                setFetchingDown(false);
                setSkip(newSkip);
                setUsers([...users, ...res]);
              }
          } catch (error) {
            setFetchingDown(false);
            throw new Error(
                    `Can not get count noti with error: ${error.message}`,
                );
          }
      }
  };

  const goToDetail = (user: User) => {
    if (user) {
        props.navigation.navigate('UserDetails', {
            user,
          });
      }
  };

  const renderList = () => {
    if (isFetching) {
        return <Spinner isLoading={isFetching} />;
      }

    if (users.length === 0) {
        return <NoData text={'NO_USERS'} />;
      }

    return (
            <SwipeListView
                data={users.map((re, idx) => ({ ...re, key: idx }))}
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
                onEndReached={handleLoadMore}
            />
      );
  };

  const renderItem = ({ item }) => {
    const { displayName, email, phone, roles, lastMethod } = item;
    return (
            <View style={styles.itemContainer}>
                {!!displayName && (
                    <Text style={styles.title}>Name: {displayName}</Text>
                )}
                {!!phone && <Text style={styles.title}>Phone: {phone}</Text>}
                {!!email && <Text style={styles.title}>Email: {email}</Text>}
                <Text style={styles.title}>
                    Role:{' '}
                    {roles.includes('SUPER USER')
                        ? 'Super User'
                        : roles.includes('ADMINISTRATOR')
                        ? 'Admin'
                        : roles.includes('AUTO USER')
                        ? 'Auto User'
                        : 'User'}
                </Text>
                {!!lastMethod && (
                    <Text style={styles.title}>Login Method: {lastMethod}</Text>
                )}
            </View>
      );
  };

  const renderHiddenItem = ({ item }, rowMap) => {
    return (
            <View style={styles.rowBack}>
                <TouchableOpacity
                    style={[styles.backRightBtn, styles.backRightBtnEdit]}
                    onPress={() => goToDetail(item)}
                >
                    <Text style={styles.backTextWhite}>
                        {translate('EDIT')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.backRightBtn, styles.backRightBtnDelete]}
                    onPress={() => handleDeleteUser(rowMap, item)}
                >
                    <Text style={styles.backTextWhite}>
                        {translate('DELETE')}
                    </Text>
                </TouchableOpacity>
            </View>
      );
  };
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
      }
  };

  const handleDeleteUser = (rowMap, item) => {
    Alert.alert(
            translate('DO_YOU_WANT_TO_DELETE_THIS', {
              value: `User ${item.email}`,
            }),
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
                        const res = (await UsersApi.del(
                                item.id,
                                token,
                            )) as User[];
                        if (res) {
                            closeRow(rowMap, item.key);
                            const newData = [...users];
                            const prevIndex = users.findIndex(
                                    (items) => items.id === item.id,
                                );
                            newData.splice(prevIndex, 1);
                            setUsers(newData);
                            log.success(translate('DELETED'));
                          }
                      } catch (error) {
                        log.danger(error.message);
                      }
                },
            },
        ],
            { cancelable: false },
        );
  };

  const renderFooter = () => {
    if (!isFetchingDown) {
        return (
                <View
                    style={{
                      backgroundColor: '#fff',
                      width: '100%',
                      padding: 16,
                      paddingBottom: 300,
                    }}
                />
          );
      }
    return (
            <View
                style={{
                  backgroundColor: '#fff',
                  width: '100%',
                }}
            >
                <ActivityIndicator color={'#000'} />
            </View>
      );
  };

  return (
        <>
            <Container
                onQuery={handleSearchChange}
                style={styles.containerStyle}
                title={translate('MANAGE_USERS')}
                placeHolderSearch={'SEARCH_USERS'}
                renderLeftItem={
                    <BackButton
                        onPress={() => props.navigation.navigate('Home')}
                        styles={{ marginLeft: 0 }}
                    />
                }
                searchOnly
            >
                {renderList()}
            </Container>
        </>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  scroll: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  itemContainer: {
    height: 130,
    borderWidth: 1,
    borderColor: theme.LIGHT_COLOR,
    backgroundColor: theme.WHITE_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 8,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: theme.WHITE_COLOR,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  title: {
    ...common.h2,
    color: theme.BLACK_COLOR,
    marginBottom: 4,
  },

  backRightBtn: {
    alignItems: 'center',
    bottom: 13,
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    top: -8,
    width: 75,
  },
  backRightBtnEdit: {
    backgroundColor: theme.GRAY_DARKER_COLOR,
    right: 65,
  },
  backRightBtnDelete: {
    backgroundColor: theme.RED_COLOR,
    right: -10,
  },
  backTextWhite: {
    color: theme.WHITE_COLOR,
  },
});

export { Users };
