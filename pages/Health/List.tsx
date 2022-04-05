import React from 'react';
import { IBasicScreenProps } from '@app/components/Types';

import { ServiceType, Service } from '@shelter/core';

import List from '../Services/Client/List';

const tabBottoms = ['Medical', 'All', 'Counseling'];

const Health: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {

  const goToDetail = (service: Service) => {
    if (service) {
      const serviceData = service;
      props.navigation.navigate('HealthDetails', {
        serviceData,
      });
    }
  };

  return(
    <List
      tabBottoms={tabBottoms}
      type={ServiceType.Health}
      {...props}
      goToDetail={goToDetail}
    />
  );
};

export default Health;
