import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { connect } from 'react-redux';
import { getUserData } from '@app/redux/user/selectors';
import { setToast } from '@app/redux/other/actions';

import { Container, BackButton } from '@app/components/Common';
import translate from '@app/utils/i18n';
import { IBasicScreenProps } from '@app/components/Types';
import { CreateServiceForm } from '@app/components/ServiceForm';

interface IUpdateServiceProps extends IBasicScreenProps {
  query: string;
}

const UpdateService: React.SFC<IUpdateServiceProps> = (
  props: IUpdateServiceProps,
) => {
  const [service, setService] = useState(undefined);

  useEffect(() => {
    const serviceData = props.navigation.getParam('serviceData') || undefined;
    setService(serviceData);
  }, [props.navigation]);

  return (
    <Container
      title={translate('UPDATE_SERVICE')}
      placeHolderSearch={translate('SEARCH_SERVICE')}
      renderLeftItem={
        <BackButton
          onPress={() => {
            const { params } = props.navigation.state;
            if (params.previousScreen) {
              props.navigation.navigate(params.previousScreen);
            } else {
              props.navigation.navigate('AdminServices');
            }
          }}
          styles={{ marginLeft: 0 }}
        />
      }
      renderRightItem={<></>}
    >
      <ScrollView style={styles.serviceContainer}>
        <CreateServiceForm
          {...props}
          initialValues={service}
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

// UpdateService.navigationOptions = ({ navigation }) => {
//   return {
//     headerTitle: translate('UPDATE_SERVICE'),
//     // headerRight: <CancelButton onPress={() => navigation.navigate('Home')} title="CANCEL" />,
//   };
// };

const mapStateToProps = (state) => ({
  userInfo: getUserData(state),
});

const mapDispatchToProps = {
  setToast,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateService);
