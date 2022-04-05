import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BackButton, Container } from '@app/components/Common';
import translate from '@app/utils/i18n';
import { IBasicScreenProps } from '@app/components/Types';
import { CreateLineForm } from '@app/components/LineForm';

interface ICreateLinesProps extends IBasicScreenProps {
  query: string;
}

const CreateLines: React.SFC<ICreateLinesProps> = (props: ICreateLinesProps) => {
  const scrollEl = useRef(null) as any;

  useEffect(() => {
    const blurListener = props.navigation.addListener('didBlur', () => {
      onScrollToTop();
    });
    return () => blurListener.remove();
  });

  const onScrollToTop = () => {
    return scrollEl.current.scrollTo({ x: 0, y: 0, animated: false });
  };

  return (
    <Container
      title={translate('ADD_CRISIS_LINE')}
      renderLeftItem={
        <BackButton
          onPress={() => props.navigation.navigate('Lines')}
          styles={{ marginLeft: 0 }}
        />
      }
      renderRightItem={<></>}
    >
      <ScrollView
        style={styles.serviceContainer}
        ref={scrollEl}
      >
        <CreateLineForm
          {...props}
          onScrollToTop={onScrollToTop}
          isCreate
        />
        <View style={{ height: 100 }} />
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

export default CreateLines;
