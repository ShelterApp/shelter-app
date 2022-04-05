import React, { useEffect } from 'react';
import FlashMessage from 'react-native-flash-message';
import Config from 'react-native-config';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-root-toast';

import { Provider, connect } from 'react-redux';
import configureStore from '@app/redux/store';

import { initApi } from '@shelter/core/dist/apis';

import Routes from './routers/index';

const store = configureStore();
const { WWW_MOBILE_API_URL, DEEP_LINKING_URI } = Config;

/* tslint:disable */
if (__DEV__) {
  import("./utils/reactotronConfig").then(() =>
    console.log("Reactotron Configured")
  );
}

initApi({ shelterApiUrl: WWW_MOBILE_API_URL });
console.disableYellowBox = true;

const App = (props) => {
  // const getCurrentRouteName = (navState) => {
  //   if (navState.hasOwnProperty('index')) {
  //       getCurrentRouteName(navState.routes[navState.index])
  //   } else {
  //      	// can then save this to the state (I used redux)
  //       store.dispatch(setRoute(navState))
  //   }
  // }

  return (
    <>
      <Routes
        // onNavigationStateChange={(prevState, newState) => {
        //   getCurrentRouteName(newState)
        // }}
        screenProps={props.user}
      />
      <FlashMessage titleStyle={{ marginRight: 5, marginLeft: 5 }} />
      <Toast
        visible={!!props.textToast}
        shadow={false}
        animation={true}
        hideOnPress={true}
      >
        {props.textToast}
      </Toast>
    </>
  );
};

const mapStateToProps = ({ user, other }) => ({
  user,
  textToast: other.toast,
});

const WrapApp = connect(
  mapStateToProps,
  null
)(App);

const AppContainer = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <WrapApp uriPrefix={DEEP_LINKING_URI} />
    </Provider>
  );
};

export default AppContainer;
