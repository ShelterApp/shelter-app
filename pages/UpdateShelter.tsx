import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Input } from 'react-native-elements';

import { connect } from 'react-redux';
import { setToast } from '@app/redux/other/actions';

import { Container, BackButton, Spinner, NoData } from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';

import translate from '@app/utils/i18n';

import { ServicesApi } from '@shelter/core/dist/apis';
import { Service } from '@shelter/core';
import { searchByName } from '@app/utils/search';

import common from '@app/styles/common';
import theme from '@app/styles/theme';
import { getDataToLocal } from '@app/utils';

import IconFa from 'react-native-vector-icons/FontAwesome';

interface IItemProps extends Service {
  count?: number;
  idx?: number | string;
  handleVolumeUp: (service: Service) => void;
  handleVolumeDown: (service: Service) => void;
  setToast?: (toast: string) => void;
}

interface IUpdateAvailable {
  id: string;
  total: number;
}

const Item = (props: IItemProps) => {
  const {
    name,
    availableBeds,
    idx,
    count,
    handleVolumeUp,
    handleVolumeDown,
  } = props;
  return (
    <View
      style={[
        styles.itemContainer,
        {
          borrderBottomWidth: count > 1 ? (idx === 0 ? 0 : 1) : 1,
          borderBottomColor:
            count > 1
              ? idx === 0
                ? 'transparent'
                : theme.LIGHT_COLOR
              : theme.LIGHT_COLOR,
        },
      ]}
    >
      <Text style={styles.itemTitle}>{name}</Text>
      <View style={styles.itemInputContainer}>
        <Input
          containerStyle={{ width: '80%' }}
          inputContainerStyle={{
            borderWidth: 1,
            borderColor: theme.PRIMARY_COLOR,
          }}
          keyboardType="numeric"
          textAlign="center"
          inputStyle={{ padding: 8 }}
          value={`${availableBeds}`}
          editable
        />
      </View>
      <View style={styles.itemAction}>
        <TouchableOpacity onPress={() => handleVolumeUp(props)}>
          <IconFa name="plus-circle" size={28} color={theme.PRIMARY_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleVolumeDown(props)}>
          <IconFa name="minus-circle" size={28} color={theme.PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const UpdateShelter: React.SFC<IBasicScreenProps> = (
  props: IBasicScreenProps,
) => {
  const [shelters, setShelters] = useState([]);
  const [sheltersTemp, setSheltersTemp] = useState([]);

  const [isFetching, setFetching] = useState(true);

  useEffect(() => {
    init();
    const focusListener = props.navigation.addListener('didFocus', () => {
      init();
    });
    return () => focusListener.remove();
  }, []);

  const init = () => {
    fetchShelters();
  };

  const fetchShelters = async () => {
    setFetching(true);

    try {
      const token = await getDataToLocal('@ShelterToken');
      const res = (await ServicesApi.listBeds(token)) as Service[];

      if (res) {
        setShelters(res);
        setSheltersTemp(res);
        setFetching(false);
      }
      setFetching(false);
    } catch (error) {
      setShelters([]);
      setSheltersTemp([]);
      setFetching(false);
      throw new Error(`Can not get events list with error: ${error.message}`);
    }
  };

  const handleSearchChange = (query: string) => {
    if (!query) {
      setShelters(sheltersTemp);
      return;
    }
    setShelters(searchByName(query, sheltersTemp));
  };

  const getIndexOfItemById = (lists, id: string) => {
    let i = 0;
    for (; i < lists.length; i += 1) {
      if (id === lists[i].id) {
        return i;
      }
    }

    return -1;
  };
  const approveServices = async (data) => {
    if (data.length) {
      try {
        const token = await getDataToLocal('@ShelterToken');
        const res = (await ServicesApi.approveServices(
          { services: data },
          token,
        )) as any;
        if (res && res.message === 'Approved all services') {
          // props.setToast(translate('APPROVED_SUCCESSFULLY'));
          // init();
          return;
        }
      } catch (error) {
        throw new Error(
          `Can not Approve selected list with error: ${error.message}`,
        );
      }
    }
  };

  const updateAvailableBeds = async (data, list) => {
    try {
      const obj = {
        services: data.map((d) => ({
          id: d.id,
          total: +d.availableBeds,
        })) as IUpdateAvailable,
      };
      const token = await getDataToLocal('@ShelterToken');
      const res = (await ServicesApi.updateAvailableBeds(obj, token)) as any;
      if (res && res.message === 'Updated available beds for all services') {
        setShelters(list);
        setSheltersTemp(list);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleVolumeUp = ({ id, availableBeds, totalBeds }: IItemProps) => {
    const idx = getIndexOfItemById(shelters, id);
    let temp = shelters;
    if (availableBeds >= totalBeds) {
      props.setToast(translate('AVAILABLE_BEDS_LESS_THAN'));
      return;
    }
    if (idx !== -1) {
      const newShelter = shelters.find((she) => id === she.id);
      newShelter.availableBeds = availableBeds + 1;
      temp = [...temp.slice(0, idx), { ...newShelter }, ...temp.slice(idx + 1)];
      approveServices([id]);
      updateAvailableBeds([newShelter], temp);
    }
  };

  const handleVolumeDown = ({ id, availableBeds }: IItemProps) => {
    const idx = getIndexOfItemById(shelters, id);
    let temp = shelters;
    if (!!availableBeds) {
      if (idx !== -1) {
        const newShelter = shelters.find((she) => id === she.id);
        newShelter.availableBeds = availableBeds - 1;
        temp = [
          ...temp.slice(0, idx),
          { ...newShelter },
          ...temp.slice(idx + 1),
        ];
        approveServices([id]);
        updateAvailableBeds([newShelter], temp);
      }
    }
  };

  const renderList = () => {
    if (isFetching) {
      return <Spinner isLoading={isFetching} />;
    }

    if (shelters.length === 0) {
      return <NoData text={'NO_SHELTER'} />;
    }
    // shelters = shelters.filter

    return (
      <View style={{ height: '100%', width: '100%' }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {shelters.map((sh, idx) => {
            return (
              <Item
                key={idx}
                {...sh}
                idx={idx}
                count={shelters.length}
                handleVolumeUp={handleVolumeUp}
                handleVolumeDown={handleVolumeDown}
              />
            );
          })}
          <View style={{ height: 200 }} />
        </ScrollView>
      </View>
    );
  };

  return (
    <>
      <Container
        onQuery={handleSearchChange}
        title={translate('AVAILABLE_BEDS')}
        placeHolderSearch={'SEARCH_SERVICES'}
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
  scroll: {
    // TODO
    height: '100%',
    width: '100%',
  },
  itemContainer: {
    padding: 10,
    flexDirection: 'row',
    ...common.flexCenter,
    borderWidth: 1,
    borderColor: theme.LIGHT_COLOR,
  },
  itemTitle: {
    width: '55%',
    ...common.h1,
    color: theme.PRIMARY_COLOR,
  },
  itemInputContainer: {
    width: '25%',
    justifyContent: 'flex-start',
  },
  itemAction: {
    width: '20%',
    display: 'flex',
    flexDirection: 'row',
    ...common.flexCenter,
    justifyContent: 'space-between',
  },
});

const mapDispatchToProps = {
  setToast,
};

export default connect(
  null,
  mapDispatchToProps,
)(UpdateShelter);
