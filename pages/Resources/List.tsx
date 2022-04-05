import React from 'react';
import { IBasicScreenProps } from '@app/components/Types';

import { ServiceType, Service } from '@shelter/core';

import List from '../Services/Client/List';

const tabBottoms = ['Clothes', 'Hygiene', 'All', 'Tech', 'Assistance'];

const Resources: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {

  const goToDetail = (service: Service) => {
    if (service) {
      const serviceData = service;
      props.navigation.navigate('ResourceDetails', {
        serviceData,
      });
    }
  };

  return (
    <List
      tabBottoms={tabBottoms}
      type={ServiceType.Resources}
      {...props}
      goToDetail={goToDetail}
    />
  );
};

export default Resources;
