import React from 'react';
import { IBasicScreenProps } from '@app/components/Types';

import { ServiceType, Service } from '@shelter/core';

import List from '../Services/Client/List';

const tabBottoms = ['Emergency', 'All', 'Transitional'];

const Shelter: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {

  const goToDetail = (service: Service) => {
    if (service) {
      const serviceData = service;
      props.navigation.navigate('ShelterDetails', {
        serviceData,
      });
    }
  };

  return (
    <List
      tabBottoms={tabBottoms}
      type={ServiceType.Shelter}
      {...props}
      goToDetail={goToDetail}
    />
  );
};

export default Shelter;
