import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import { connect } from 'react-redux';
import { setToast } from '@app/redux/other/actions';
import { getUserData } from '@app/redux/user/selectors';

import { Container, BackButton, Spinner, NoData } from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import translate from '@app/utils/i18n';
import { SORT, DIRECTION, LIMIT, SKIP } from '@app/utils/constants';

import { ItemInList } from './ItemInList';
import { CrisisLinesApi } from '@shelter/core/dist/apis';
import { CrisisLine, User } from '@shelter/core';

interface ILinesProps extends IBasicScreenProps {
  query: string;
  userInfo: User;
}

const commonQuery = {
  sort: 'ranking',
  direction: DIRECTION,
  limit: LIMIT,
  skip: SKIP,
};

const Lines: React.SFC<ILinesProps> = (props: ILinesProps) => {
  const [lines, setLines] = useState([]);

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
    fetchLines();
    fetchCount();
  };

  const onRefresh = async () => {
    setFetchingUp(true);

    try {
      const res = (await CrisisLinesApi.list(commonQuery)) as CrisisLine[];
      if (res) {
        setLines(res);
        setFetchingUp(false);
      }
      setFetchingUp(false);
    } catch (error) {
      setLines([]);
      setFetchingUp(false);
      throw new Error(`Can not get events list with error: ${error.message}`);
    }
  };

  const fetchCount = async () => {
    try {
      const res = await CrisisLinesApi.count(commonQuery);
      if (res) {
        setCount(res);
      }
    } catch (error) {
      throw new Error(
        `Can not get count of service with error: ${error.message}`,
      );
    }
  };

  const fetchLines = async () => {
    setFetching(true);

    try {
      const res = (await CrisisLinesApi.list(commonQuery)) as CrisisLine[];
      if (res) {
        setLines(res);
        setFetching(false);
      }
      setFetching(false);
    } catch (error) {
      setLines([]);
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
        search: 'name',
      };
      const resService = (await CrisisLinesApi.list(obj)) as CrisisLine[];
      if (resService) {
        setLines(resService);
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
        const obj = {
          ...commonQuery,
          skip: newSkip,
        } as any;
        const res = await CrisisLinesApi.list(obj);
        if (res) {
          setFetchingDown(false);
          setSkip(newSkip);
          setLines([...lines, ...res]);
        }
      } catch (error) {
        setFetchingDown(false);
        throw new Error(`Can not get count noti with error: ${error.message}`);
      }
    }
  };

  const handleDelete = async (id: string, token: string) => {
    try {
      const res = (await CrisisLinesApi.del(id, token)) as CrisisLine[];
      if (res) {
        props.setToast(translate('DELETED'));
        fetchLines();
      }
    } catch (error) {
      throw new Error(`Can not delete service with error: ${error.message}`);
    }
  };

  const handleEdit = async (crisisLine: CrisisLine) => {
    if (crisisLine) {
      const lineData = crisisLine;
      props.navigation.navigate('LineDetails', {
        lineData,
      });
    }
  };

  const renderList = () => {
    if (isFetching) {
      return <Spinner isLoading={isFetching} />;
    }

    if (lines.length === 0) {
      return <NoData text={'NO_CRISIS_LINES'} />;
    }

    return (
      <FlatList
        // style={{ marginBottom: Platform.OS === 'ios' ? 200 : 80 }}
        data={lines}
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
    return (
      <ItemInList
        onEdit={handleEdit}
        onDelete={handleDelete}
        {...item}
        isAdmin={props.userInfo.isAdmin}
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

  return (
    <Container
      onQuery={handleSearchChange}
      title={translate('CRISIS_LINES')}
      placeHolderSearch={'SEARCH_LINES'}
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
  mapDispatchToProps,
)(Lines);
