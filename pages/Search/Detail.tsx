import React from 'react';
import { IBasicScreenProps } from '@app/components/Types';
// import { CancelButton } from '@app/components/Common';

import Detail from '../Services/Client/Detail';

const Details: React.SFC<IBasicScreenProps> = (props: IBasicScreenProps) => {

  return(
    <Detail {...props} isSearch={true} />
  );
};

export default Details;
