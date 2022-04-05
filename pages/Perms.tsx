import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import {
  Container,
  BackButton,
  Spinner,
  NoData,
  CheckBox,
} from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import translate from '@app/utils/i18n';
import theme from '@app/styles/theme';
import common from '@app/styles/common';
import { log } from '@app/utils/log';
import { getDataToLocal } from '@app/utils';
import { UsersApi } from '@shelter/core/dist/apis';
import { User, UserRole } from '@shelter/core';

import { getIndexOfItemById } from '@app/utils';
import { SORT, DIRECTION, LIMIT, SKIP } from '@app/utils/constants';
import user from '@app/redux/user';

const commonQuery = {
  sort: SORT,
  direction: DIRECTION,
  limit: LIMIT,
  skip: SKIP,
};

const afterTranform = (users: User[]) => {
  return users.map((u) => {
    const isAdmin = u.roles && u.roles.includes(UserRole.Administrator);
    return {
      ...u,
      isAdmin,
    };
  });
};

const Perms: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {
  const [users, setUsers] = useState([]);

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
        setUsers(afterTranform(res));
        setFetchingUp(false);
      }
      setFetchingUp(false);
    } catch (error) {
      setUsers([]);
      setFetchingUp(false);
      throw new Error(`Can not get events list with error: ${error.message}`);
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
        setUsers(afterTranform(res));
        setFetching(false);
      }
      setFetching(false);
    } catch (error) {
      setUsers([]);
      setFetching(false);
      throw new Error(`Can not get events list with error: ${error.message}`);
    }
  };

  const handleSearchChange = async (query: string) => {
    try {
      const obj = {
        skip,
        ...commonQuery,
        q: query,
        search: 'email',
      };
      const token = await getDataToLocal('@ShelterToken');
      const resService = (await UsersApi.list(obj, token)) as User[];
      if (resService) {
        setUsers(afterTranform(resService));
        return;
      }
    } catch (error) {
      throw new Error(`Can not get events list with error: ${error.message}`);
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
          setUsers(afterTranform([...users, ...res]));
        }
      } catch (error) {
        setFetchingDown(false);
        throw new Error(`Can not get count noti with error: ${error.message}`);
      }
    }
  };

  const onCheckAsAdmin = async (user: User) => {
    try {
      const token = await getDataToLocal('@ShelterToken');
      const res = (await UsersApi.togglePerm(user.id, token)) as User[];
      if (res) {
        const idx = getIndexOfItemById(users, user.id);
        let after = users;
        const newValue = {
          ...user,
          isAdmin: !user.isAdmin,
        };

        if (idx !== -1) {
          after = [...after.slice(0, idx), newValue, ...after.slice(idx + 1)];
        }
        setUsers(after);

        log.success(
          translate(
            !user.isAdmin
              ? 'APPROVED_USER_AS_ADMIN_SUCCESSFULLY'
              : 'REMOVED_USER_AS_ADMIN_SUCCESSFULLY',
            { value: user.email || '' },
          ),
        );
      }
    } catch (error) {
      throw new Error(`Can not toggle perm with error: ${error.message}`);
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
      <FlatList
        // style={{ marginBottom: Platform.OS === 'ios' ? 200 : 80 }}
        data={users}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={isFetchingUp} onRefresh={onRefresh} />
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
    const { email, isAdmin } = item;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onCheckAsAdmin(item)}
      >
        <CheckBox checked={isAdmin} containerStyle={styles.checkbox} />
        <Text style={styles.title}>{email}</Text>
      </TouchableOpacity>
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
            paddingBottom: 170,
          }}
        />
      );
    }
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

  return (
    <>
      <Container
        onQuery={handleSearchChange}
        style={styles.containerStyle}
        title={translate('MANAGE_ACCESS')}
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
const SuperUser: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {
  const [users, setUsers] = useState([]);

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
        setUsers(afterTranform(res));
        setFetchingUp(false);
      }
      setFetchingUp(false);
    } catch (error) {
      setUsers([]);
      setFetchingUp(false);
      throw new Error(`Can not get events list with error: ${error.message}`);
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
        setUsers(afterTranform(res));
        setFetching(false);
      }
      setFetching(false);
    } catch (error) {
      setUsers([]);
      setFetching(false);
      throw new Error(`Can not get events list with error: ${error.message}`);
    }
  };

  const handleSearchChange = async (query: string) => {
    try {
      const obj = {
        skip,
        ...commonQuery,
        q: query,
        search: 'email',
      };
      const token = await getDataToLocal('@ShelterToken');
      const resService = (await UsersApi.list(obj, token)) as User[];
      if (resService) {
        setUsers(afterTranform(resService));
        return;
      }
    } catch (error) {
      throw new Error(`Can not get events list with error: ${error.message}`);
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
          setUsers(afterTranform([...users, ...res]));
        }
      } catch (error) {
        setFetchingDown(false);
        throw new Error(`Can not get count noti with error: ${error.message}`);
      }
    }
  };

  const onCheckAsAdmin = async (user: User) => {
    try {
      const token = await getDataToLocal('@ShelterToken');
      const res = (await UsersApi.togglePerm(user.id, token)) as User[];
      if (res) {
        const idx = getIndexOfItemById(users, user.id);
        let after = users;
        const newValue = {
          ...user,
          isAdmin: !user.isAdmin,
        };

        if (idx !== -1) {
          after = [...after.slice(0, idx), newValue, ...after.slice(idx + 1)];
        }
        setUsers(after);

        log.success(
          translate(
            !user.isAdmin
              ? 'APPROVED_USER_AS_ADMIN_SUCCESSFULLY'
              : 'REMOVED_USER_AS_ADMIN_SUCCESSFULLY',
            { value: user.email || '' },
          ),
        );
      }
    } catch (error) {
      throw new Error(`Can not toggle perm with error: ${error.message}`);
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
      <FlatList
        // style={{ marginBottom: Platform.OS === 'ios' ? 200 : 80 }}
        data={users}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={isFetchingUp} onRefresh={onRefresh} />
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
    const { email, isAdmin } = item;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onCheckAsAdmin(item)}
      >
        <CheckBox checked={isAdmin} containerStyle={styles.checkbox} />
        <Text style={styles.title}>{email}</Text>
      </TouchableOpacity>
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
            paddingBottom: 170,
          }}
        />
      );
    }
    return (
      <View
        style={{
          backgroundColor: '#fff',
          width: '100%',
          padding: 16,
          paddingBottom: 170,
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
        title={translate('MANAGE_SUPPER')}
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
    borderWidth: 1,
    borderColor: theme.LIGHT_COLOR,
    backgroundColor: theme.WHITE_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 14,
    marginBottom: 4,
    ...common.flexCenter,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  title: {
    ...common.h2,
    color: theme.BLACK_COLOR,
    marginLeft: 8,
  },
  checkbox: {
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
  },
});

export { Perms, SuperUser };
