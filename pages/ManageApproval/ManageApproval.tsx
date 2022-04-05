import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { setToast } from '@app/redux/other/actions';

import {
    Container,
    BackButton,
    Button,
    NoData,
    Spinner,
} from '@app/components/Common';
import { IBasicScreenProps } from '@app/components/Types';
import { ItemInList } from './ItemInList';

import translate from '@app/utils/i18n';

import { ServicesApi } from '@shelter/core/dist/apis';
import { Service, ServiceType } from '@shelter/core';
import { searchByName } from '@app/utils/search';
import { getIndexOfItemById, getDataToLocal } from '@app/utils';
import common from '@app/styles/common';
import theme from '@app/styles/theme';

interface IItemProps extends Service {
  approveSelected: (service: Service) => void;
  approveAll: (name: string) => void;
  deleteSelected: (service: Service) => void;
  handleEdit?: (service: Service) => void;
  handleDelete?: (id: string) => void;
  handleCheck: (service: Service) => void;
  name?: string;
  list?: Service[];
}

const tranformType = (res) => {
  return Object.keys(ServiceType).reduce((previ, currentValue) => {
    const found = res.filter(
            (re) => re.type && re.type.includes(ServiceType[currentValue]),
        );

    return {
        ...previ,
        [currentValue]: found,
      };
  }, {});
};

const ItemWrap = (props: IItemProps) => {
  const {
        name,
        handleEdit,
        handleDelete,
        list,
        // tslint:disable-next-line: align
        approveSelected,
        approveAll,
        deleteSelected,
        handleCheck,
    } = props;
  return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{name}</Text>
            <View style={{ display: 'flex' }}>
                {list.map((l, idx) => (
                    <ItemInList
                        key={idx}
                        onEdit={() => handleEdit(l)}
                        onDelete={() => handleDelete(l.id)}
                        onCheck={() => handleCheck(l)}
                        {...l}
                    />
                ))}
            </View>
            <View style={styles.itemAction}>
                <Button
                    onPress={approveSelected}
                    title={translate('APPROVE_SELECTED')}
                    containerStyle={styles.buttonContainer}
                    buttonStyle={styles.buttonStyle}
                    disabled={list.length === 0}
                    titleStyle={styles.titleStyle}
                />
                <Button
                    onPress={() => approveAll(name)}
                    title={translate('APPROVE_ALL')}
                    containerStyle={styles.buttonContainer}
                    buttonStyle={styles.buttonStyle}
                    disabled={list.length === 0}
                    titleStyle={styles.titleStyle}
                />
                <Button
                    onPress={deleteSelected}
                    title={translate('DELETE_SELECTED')}
                    containerStyle={styles.buttonContainer}
                    buttonStyle={styles.buttonStyle}
                    disabled={list.length === 0}
                    titleStyle={styles.titleStyle}
                />
            </View>
        </View>
  );
};

const ManageApproval: React.SFC<IBasicScreenProps> = (
    props: IBasicScreenProps,
) => {
  const [services, setServives] = useState({});
  const [servicesTemp, setServivesTemp] = useState([]);

  const [isFetching, setFetching] = useState(true);

  useEffect(() => {
    init();
    const focusListener = props.navigation.addListener('didFocus', () => {
        init();
      });
    return () => focusListener.remove();
  }, []);

  const init = () => {
    fetchServices();
  };

  const fetchServices = async () => {
    setFetching(true);
    try {
        const obj = {
            filter: 'isApproved,isShowAll',
            isApproved: false,
            isShowAll: true,
          };

        const res = (await ServicesApi.list(obj)) as Service[];

        if (res) {
            setServivesTemp(res);
            setServives(tranformType(res));
            setFetching(false);
          }
        setFetching(false);
      } catch (error) {
        setServivesTemp([]);
        setServives({});
        setFetching(false);
        throw new Error(
                `Can not get events list with error: ${error.message}`,
            );
      }
  };

  const handleSearchChange = (query: string) => {
    if (!query) {
        setServives(tranformType(servicesTemp));
        return;
      }
    setServives(tranformType(searchByName(query, servicesTemp)));
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
                props.setToast(translate('APPROVED_SUCCESSFULLY'));
                init();
                return;
              }
          } catch (error) {
            throw new Error(
                    `Can not Approve selected list with error: ${error.message}`,
                );
          }
      }
  };

  const removeServices = async (data) => {
    if (data.length) {
        try {
            const token = await getDataToLocal('@ShelterToken');
            const res = (await ServicesApi.removeServices(
                    { services: data },
                    token,
                )) as any;
            if (res && res.message === 'Removed all services') {
                props.setToast(translate('REMOVED_SUCCESSFULLY'));
                init();
                return;
              }
          } catch (error) {
            throw new Error(
                    `Can not Approve selected list with error: ${error.message}`,
                );
          }
      }
  };

  const approveSelected = async () => {
    const data = servicesTemp
            .filter((se) => se.isApproved)
            .map((se) => se.id);
    approveServices(data);
  };

  const approveAll = async (name) => {
    const data = services[name].map((se) => se.id);
    approveServices(data);
  };

  const deleteSelected = async () => {
    const data = servicesTemp
            .filter((se) => se.isApproved)
            .map((se) => se.id);
    removeServices(data);
  };

  const handleEdit = async (service: Service) => {
    if (service) {
        const serviceData = service;

        props.navigation.navigate('AdminServiceDetails', {
            serviceData,
            previousScreen: 'ManageApprovals',
          });
        return;
      }
  };

  const handleDelete = async (id: string) => {
    try {
        const token = await getDataToLocal('@ShelterToken');
        const res = (await ServicesApi.del(id, token)) as Service[];
        if (res) {
            props.setToast(translate('DELETED'));
            init();
          }
      } catch (error) {
        throw new Error(
                `Can not delete service with error: ${error.message}`,
            );
      }
  };

  const handleCheck = async (service: Service) => {
    const idx = getIndexOfItemById(servicesTemp, service.id);
    let after = servicesTemp;

    const newValue = {
        ...service,
        isApproved: !service.isApproved,
      };

    if (idx !== -1) {
        after = [...after.slice(0, idx), newValue, ...after.slice(idx + 1)];
        setServivesTemp(after);
        setServives(tranformType(after));
      }
  };

  const renderItem = ({ item, idx }) => {
    return (
            <ItemWrap
                key={idx}
                name={item}
                list={services[item]}
                approveSelected={approveSelected}
                approveAll={approveAll}
                deleteSelected={deleteSelected}
                handleCheck={handleCheck}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
      );
  };

  const renderList = () => {
    if (isFetching) {
        return <Spinner isLoading={isFetching} />;
      }

    if (Object.keys(services).length === 0) {
        return <NoData text={'NO_MANAGE_SERVICE'} />;
      }

    return (
            <FlatList
                data={Object.keys(services)}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                ListFooterComponent={renderFooter()}
            />
      );
  };
  const renderFooter = () => {
    return (
            <View
                style={{
                  backgroundColor: '#fff',
                  width: '100%',
                  padding: 16,
                  paddingBottom: 150,
                }}
            />
      );
  };

  return (
        <>
            <Container
                onQuery={handleSearchChange}
                title={translate('MANAGE_APPROVALS')}
                placeHolderSearch={'SEARCH_APPROVALS'}
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
  itemContainer: {
    padding: 8,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: theme.LIGHT_COLOR,
    marginTop: 16,
  },
  itemTitle: {
    ...common.h1,
    color: theme.PRIMARY_COLOR,
    fontWeight: '600',
  },
  itemAction: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  buttonContainer: {
    width: 'auto',
        // marginRight: 8,
  },
  buttonStyle: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  titleStyle: {
    fontSize: 13,
  },
});

const mapDispatchToProps = {
  setToast,
};

export default connect(
    null,
    mapDispatchToProps,
)(ManageApproval);
