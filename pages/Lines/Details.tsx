import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Container, BackButton } from '@app/components/Common';
import translate from '@app/utils/i18n';
import { IBasicScreenProps } from '@app/components/Types';
import { CreateLineForm } from '@app/components/LineForm';

import { ServicesApi } from '@shelter/core/dist/apis';

interface IUpdateLineProps extends IBasicScreenProps {
  query: string;
}

const UpdateLine: React.SFC<IUpdateLineProps> = (props: IUpdateLineProps) => {
  const [line, setLine] = useState(undefined);

  useEffect(() => {
    const LineData = props.navigation.getParam('lineData') || undefined;
    setLine(LineData);
  }, []);

  return(
    <Container
      title={translate('UPDATE_LINE')}
      renderLeftItem={
        <BackButton
          onPress={() => props.navigation.navigate('Lines')}
          styles={{ marginLeft: 0 }}
        />
      }
      renderRightItem={<></>}
    >
      <ScrollView style={styles.serviceContainer}>
        <CreateLineForm
          {...props}
          initialValues={line}
          isCreate={false}
        />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  serviceContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
});

export default UpdateLine;
