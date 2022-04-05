import React from 'react';
import { IBasicScreenProps } from '@app/components/Types';

import Detail from '../Services/Client/Detail';

const ChatDetails: React.SFC<IBasicScreenProps> = (
  props: IBasicScreenProps,
) => {
  return <Detail {...props} />;
};

export default ChatDetails;
