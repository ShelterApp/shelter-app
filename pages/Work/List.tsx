import React from 'react';
import { IBasicScreenProps } from '@app/components/Types';

import { ServiceType, Service } from '@shelter/core';

import List from '../Services/Client/List';

const tabBottoms = ['Education', 'All', 'Employment'];

const Work: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {

  const goToDetail = (service: Service) => {
    if (service) {
      const serviceData = service;
      props.navigation.navigate('WorkDetails', {
        serviceData,
      });
    }
  };

  return(
    <List
      tabBottoms={tabBottoms}
      type={ServiceType.Work}
      {...props}
      goToDetail={goToDetail}
    />
  );
};

export default Work;
