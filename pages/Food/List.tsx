import React from 'react';
import { IBasicScreenProps } from '@app/components/Types';

import { ServiceType, Service } from '@shelter/core';

import List from '../Services/Client/List';

const tabBottoms = ['Meals', 'All', 'Food Pantries'];

const Foods: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {
  const goToDetail = (service: Service) => {
    if (service) {
      const serviceData = service;
      props.navigation.navigate('FoodDetails', {
        serviceData,
      });
    }
  };

  return (
    <List
      tabBottoms={tabBottoms}
      type={ServiceType.Food}
      {...props}
      goToDetail={goToDetail}
    />
  );
};

export default Foods;
