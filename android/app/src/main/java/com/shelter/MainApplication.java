package org.strappd;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.airbnb.android.react.maps.MapsPackage;
import com.imagepicker.ImagePickerPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import im.shimo.react.cookie.CookieManagerPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.goldenowl.twittersignin.TwitterSigninPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativecommunity.geolocation.GeolocationPackage;


import java.util.Arrays;
import java.util.List;

import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import com.agontuk.RNFusedLocation.RNFusedLocationPackage;

public class MainApplication extends Application implements ReactApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(new MainReactPackage(), new SvgPackage(), new RNDeviceInfo(),
          new MapsPackage(), new ImagePickerPackage(), new RNGoogleSigninPackage(),
          new CookieManagerPackage(), new FBSDKPackage(), new SplashScreenReactPackage(), new RNGestureHandlerPackage(),
          new ReactNativeConfigPackage(), new RNI18nPackage(), new AsyncStoragePackage(), new ReanimatedPackage(),
          new VectorIconsPackage(), new RNFirebasePackage(), new RNFirebaseMessagingPackage(), new RNCWebViewPackage(),
          new  GeolocationPackage(),
          new RNFirebaseNotificationsPackage(),new TwitterSigninPackage(), new RNFusedLocationPackage());
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    AppEventsLogger.activateApp(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
