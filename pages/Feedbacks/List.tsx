import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';

import { Container, BackButton, Spinner, NoData } from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import { connect } from 'react-redux';
import { setToast } from '@app/redux/other/actions';
import { getUserData } from '@app/redux/user/selectors';
import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';
import { SORT, DIRECTION, LIMIT, SKIP } from '@app/utils/constants';
import { getDataToLocal } from '@app/utils';
import { ItemInList } from './ItemInList';

import { FeedbacksApi } from '@shelter/core/dist/apis';
import { User } from '@shelter/core';

interface IFeedbacksProps extends IBasicScreenProps {
  userInfo: User;
  isAdmin: boolean;
}

const commonQuery = {
  sort: SORT,
  direction: DIRECTION,
  limit: 50,
  skip: SKIP,
};

const Feedbacks: React.SFC<IFeedbacksProps> = (props: IFeedbacksProps) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [skip, setSkip] = useState(SKIP);
  const [count, setCount] = useState(0);

  const [isFetching, setFetching] = useState(true);
  const [isFetchingUp, setFetchingUp] = useState(false);
  const [isFetchingDown, setFetchingDown] = useState(false);
  const tabs = props.userInfo.isAdmin
    ? ['APP_FEEDBACK', 'SERVICE_FEEDBACK', 'ARCHIVE']
    : ['SERVICE_FEEDBACK', 'ARCHIVE'];

  useEffect(() => {
    init();

    const focusListener = props.navigation.addListener('didFocus', () => {
      init();
    });
    return () => focusListener.remove();
  }, [props.userInfo]);

  const init = () => {
    fetchFeedbacks();
    fetchCount();
  };

  const onRefresh = async () => {
    setFetchingUp(true);

    try {
      const token = await getDataToLocal('@ShelterToken');
      const res = (await FeedbacksApi.list(commonQuery, token)) as any[];
      if (res) {
        setFeedbacks(res);
        setFetchingUp(false);
      }
      setFetchingUp(false);
    } catch (error) {
      setFeedbacks([]);
      setFetchingUp(false);
      throw new Error(
        `Can not get feedbacks list with error: ${error.message}`,
      );
    }
  };

  const fetchCount = async () => {
    try {
      const token = await getDataToLocal('@ShelterToken');
      const res = await FeedbacksApi.count(commonQuery, token);
      if (res) {
        setCount(res);
      }
    } catch (error) {
      throw new Error(
        `Can not get count of feedback with error: ${error.message}`,
      );
    }
  };

  const fetchFeedbacks = async () => {
    setFetching(true);

    try {
      const token = await getDataToLocal('@ShelterToken');
      const res = (await FeedbacksApi.list(commonQuery, token)) as any[];

      if (res) {
        setFeedbacks(res);
        setFetching(false);
      }
      setFetching(false);
    } catch (error) {
      setFeedbacks([]);
      setFetching(false);
      throw new Error(
        `Can not get feedbacks list with error: ${error.message}`,
      );
    }
  };

  const handleSearchChange = async (query: string) => {
    try {
      const obj = {
        skip,
        ...commonQuery,
        q: query,
        search: 'subject, message',
      };
      const token = await getDataToLocal('@ShelterToken');
      const res = (await FeedbacksApi.list(obj, token)) as any[];
      if (res) {
        setFeedbacks(res);
        return;
      }
    } catch (error) {
      throw new Error(
        `Can not get feedbacks list with error: ${error.message}`,
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
        const token = await getDataToLocal('@ShelterToken');
        const res = await FeedbacksApi.list(obj, token);
        if (res) {
          setFetchingDown(false);
          setSkip(newSkip);
          setFeedbacks([...feedbacks, ...res]);
        }
      } catch (error) {
        setFetchingDown(false);
        throw new Error(
          `Can not get count feedback with error: ${error.message}`,
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getDataToLocal('@ShelterToken');
      const res = (await FeedbacksApi.del(id, token)) as any[];
      if (res) {
        props.setToast(translate('DELETED'));
        fetchFeedbacks();
      }
    } catch (error) {
      throw new Error(`Can not delete service with error: ${error.message}`);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const token = await getDataToLocal('@ShelterToken');
      const res = (await FeedbacksApi.archive(id, token)) as any[];
      if (res) {
        props.setToast(translate('ARCHIVED'));
        fetchFeedbacks();
      }
    } catch (error) {
      throw new Error(`Can not delete service with error: ${error.message}`);
    }
  };

  const updateFilter = (selected) => {
    setSelectedIndex(selected);
  };

  const tranformFeedbacks = () => {
    switch (selectedIndex) {
      case 0:
        if (props.userInfo.isAdmin) {
          return feedbacks.filter((f) => !f.isArchive && f.type === 'APP');
        }
        return feedbacks.filter((f) => !f.isArchive && f.type === 'SERVICE');
      case 1:
        if (props.userInfo.isAdmin) {
          return feedbacks.filter((f) => !f.isArchive && f.type === 'SERVICE');
        }
        return feedbacks.filter((f) => f.isArchive === true);
      case 2:
        return feedbacks.filter((f) => f.isArchive === true);
    }
  };

  const renderList = () => {
    const temp = tranformFeedbacks();

    if (isFetching) {
      return <Spinner isLoading={isFetching} />;
    }

    if (temp.length === 0) {
      return <NoData text={'NO_FEEDBACKS'} />;
    }

    return (
      <FlatList
        data={temp}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={isFetchingUp} onRefresh={onRefresh} />
        }
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={renderFooter()}
        onEndReachedThreshold={0.4}
        onEndReached={handleLoadMore}
      />
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
            paddingBottom: 250,
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

  const renderItem = ({ item }) => {
    return (
      <ItemInList onDelete={handleDelete} onArchive={handleArchive} {...item} />
    );
  };

  const renderTab = () => {
    return (
      <ButtonGroup
        onPress={(selected) => updateFilter(selected)}
        selectedIndex={selectedIndex}
        buttons={tabs.map((b) => translate(b))}
        containerStyle={styles.filterContainer}
        selectedButtonStyle={styles.selectedButtonStyle}
        buttonStyle={styles.buttonStyle}
        innerBorderStyle={styles.innerBorderStyle}
        textStyle={[common.text, { color: theme.WHITE_COLOR }]}
        activeOpacity={1}
      />
    );
  };
  return (
    <Container
      onQuery={handleSearchChange}
      title={translate('MY_FEEDBACKS')}
      placeHolderSearch={translate('SEARCH_FEEDBACK')}
      renderLeftItem={
        <BackButton
          onPress={() => props.navigation.navigate('Home')}
          styles={{ marginLeft: 0 }}
        />
      }
      searchOnly
    >
      {renderTab()}
      {renderList()}
    </Container>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    height: 38,
    margin: 8,
    marginTop: 12,
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
const mapStateToProps = (state) => ({
  userInfo: getUserData(state),
});

const mapDispatchToProps = {
  setToast,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Feedbacks);
