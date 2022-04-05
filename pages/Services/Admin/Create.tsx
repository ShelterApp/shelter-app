import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { BackButton, Container } from '@app/components/Common';
import translate from '@app/utils/i18n';
import { IBasicScreenProps } from '@app/components/Types';
import { CreateServiceForm } from '@app/components/ServiceForm';

import { connect } from 'react-redux';
import { getUserData } from '@app/redux/user/selectors';
import { setToast } from '@app/redux/other/actions';

interface ICreateServiceProps extends IBasicScreenProps {
  query: string;
}

const CreateService: React.SFC<ICreateServiceProps> = (props: ICreateServiceProps) => {
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
      title={translate('ADD_SERVICE')}
      placeHolderSearch={translate('SEARCH_SERVICE')}
      renderLeftItem={
        <BackButton
          onPress={() => props.navigation.navigate('Home')}
          styles={{ marginLeft: 0 }}
        />
      }
      renderRightItem={<></>}
    >
      <ScrollView
        style={styles.serviceContainer}
        ref={scrollEl}
      >
        <CreateServiceForm
          {...props}
          onScrollToTop={onScrollToTop}
          isCreate
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

const mapStateToProps = (state) => ({
  userInfo: getUserData(state),
});

const mapDispatchToProps = {
  setToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateService);
