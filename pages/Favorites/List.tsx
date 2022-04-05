import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import { connect } from 'react-redux';
import { setToast } from '@app/redux/other/actions';
import { getCoords } from '@app/redux/service/selectors';

import { Container, BackButton, Spinner, NoData, Schedule } from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import theme from '@app/styles/theme';
import common from '@app/styles/common';
import translate from '@app/utils/i18n';

import { searchByName } from '@app/utils/search';

import { ServicesApi } from '@shelter/core/dist/apis';
import { Service, User } from '@shelter/core';

import { getDataToLocal, setDataToLocal } from '@app/utils';

interface IFavoritesProps extends IBasicScreenProps {
  userInfo: User;
  coords: any;
}
const prefixFavorite = '@shelter_favorite';

const Favorites: React.SFC<IFavoritesProps> = (props: IFavoritesProps) => {
  const [favorites, setFavorites] = useState([]);
  const [favoritesTemp, setFavoritesTemp] = useState([]);

  const [isFetching, setFetching] = useState(true);

  useEffect(() => {
    fetchFavorites();
    const focusListener = props.navigation.addListener('didFocus', () => {
      fetchFavorites();
    });
    return () => focusListener.remove();
  }, []);

  const fetchFavorites = async () => {
    setFetching(true);
    const resData = await getDataToLocal(prefixFavorite);
    if (resData) {
      const afterRes = JSON.parse(resData);
      const { longitude, latitude } = props.coords;
      const isCoords = props.coords && !!longitude && !!latitude;

      try {
        const obj = {
          filter: '_id,isApproved',
          _id: afterRes.join(','),
          limit: 0,
          skip: 0,
          isApproved: true,
        } as any;

        if (isCoords) {
          obj.currentCoordinate = [longitude, latitude].join('|');
          obj.filter = `${obj.filter},currentCoordinate`;
        }

        const res = await ServicesApi.list(obj) as Service[];

        if (res) {
          setFavorites(res.map((re, idx) => ({ ...re, key: idx })));
          setFavoritesTemp(res.map((re, idx) => ({ ...re, key: idx })));
          setFetching(false);
          return;
        }
      } catch (error) {
        setFavorites([]);
        setFavoritesTemp([]);
        setFetching(false);
        throw new Error(`Can not get events list with error: ${error.message}`);
      }
    }
    setFavorites([]);
    setFavoritesTemp([]);
    setFetching(false);
  };

  const handleSearchChange = (query: string) => {
    if (!query) {
      setFavorites(favoritesTemp);
      return;
    }
    setFavorites(searchByName(query, favoritesTemp));
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const handleDelete = async (rowMap, key, id) => {

    closeRow(rowMap, key);
    const newData = [...favorites];
    const index = favorites.findIndex(fa => fa.key === key);
    newData.splice(index, 1);
    setFavorites(newData);
    setFavoritesTemp(newData);
    props.setToast(translate('DELETED'));

    const resData = await getDataToLocal(prefixFavorite);
    if (resData) {
      setDataToLocal(prefixFavorite, JSON.stringify(JSON.parse(resData).filter(fil => fil !== id)));
    }
  };

  const handleEdit = async (service: Service) => {

    if (service) {
      const serviceData = service;
      props.navigation.navigate('FavoriteDetails', {
        serviceData,
      });
      return;
    }
  };

  const renderList = () => {
    if (isFetching) {
      return(<Spinner isLoading={isFetching} />);
    }

    if (favorites.length === 0) {
      return <NoData text={'NO_FAVORITES'} />;
    }

    return(
      <SwipeListView
        data={favorites}
        style={{ marginBottom: 100, height: '100%' }}
        keyExtractor={(_, index) => index.toString()}
        leftOpenValue={0}
        rightOpenValue={-75}
        disableRightSwipe={true}
        renderItem={ ({ item }, rowMap) => (
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={styles.rowFront}
            activeOpacity={1}
          >
            <Text style={[styles.text, { color: theme.PRIMARY_COLOR }]}>{item.name}</Text>
            <Text style={styles.text}>{item.serviceSummary}</Text>
            <Schedule {...item} />
          </TouchableOpacity>
        )}
        renderHiddenItem={ ({ item }, rowMap) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              style={[
                styles.backRightBtn,
                styles.backRightBtnRight,
              ]}
              onPress={() => handleDelete(rowMap, item.key, item.id)}
            >
              <Text style={styles.backTextWhite}>
                {translate('DELETE')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    );
  };

  return(
    <Container
      onQuery={handleSearchChange}
      title={translate('MY_FAVORITES')}
      placeHolderSearch={'SEARCH_FAVORITES'}
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

const styles = StyleSheet.create({
  rowBack: {
    alignItems: 'center',
    backgroundColor: theme.GRAY_DARK_COLOR,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: theme.RED_COLOR,
    right: 0,
  },
  backTextWhite: {
    color: theme.WHITE_COLOR,
  },
  rowFront: {
    backgroundColor: theme.WHITE_COLOR,
    borderWidth: 1,
    borderColor: theme.LIGHT_COLOR,
    display: 'flex',
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  text: {
    ...common.h2,
    color: theme.GRAY_COLOR,
    marginBottom: 8,
  },
  lastText: {
    ...common.h2,
    flexWrap: 'wrap',
  },
});

const mapStateToProps = (state) => ({
  coords: getCoords(state),
});

const mapDispatchToProps = {
  setToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);
