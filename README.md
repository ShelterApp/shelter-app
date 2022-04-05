# shelter-app

Shield: [![CC BY 4.0][cc-by-shield]][cc-by]

This work is licensed under a
[Creative Commons Attribution 4.0 International License][cc-by].

[![CC BY 4.0][cc-by-image]][cc-by]

[cc-by]: http://creativecommons.org/licenses/by/4.0/
[cc-by-image]: https://i.creativecommons.org/l/by/4.0/88x31.png
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg

Looking the place with shelter on Android and iOS devices.

## Development

To set up your local development environment refer to the official doc:
https://facebook.github.io/react-native/docs/getting-started

This app is built with React Native version `0.59.9`.

### Environment Variables

There are two files `.env.production` and `.env.development`

See `.env.development` for development defaults.

| Variable             | Notes                                     |
| -------------------- | ----------------------------------------- |
| `NODE_ENV`           | Set this to env for development           |
| `API_URL`            | Set this to `dev.xxx.xxx` for development |
| `LANG_NAME`          | Set this to language name of the app      |
| `COOKIE_APP`         | Set this to cookie name of the app        |
| `GOOGLE_MAPS_APIKEY` | Set key display map                       |

Replace google-services.json, GoogleService-Info.plist from firebase your project.
Replace Facebook app ID in andoid/src/main/res/values/strings.xml
Replace Google API key in andoid/src/main/res/AndroidManifest.xml line 36

### Prerequisites

-   [NodeJS](htps://nodejs.org), version 10.16.3 (LTS) or better. (I use [`nvm`](https://github.com/creationix/nvm) to manage Node versions — `brew install nvm`.)
-   `react-native-cli` (version `0.59.9`, _not_ `0.60.x`)

    ```sh
    yarn global add react-native-cli@0.59.10
    ```

### Installing dependencies

```sh
yarn
```

Creating new .env file with the same root src and copy the content in file `.env.development` if you want to run the app with development environment.

### Running Tests

```sh
yarn test
```

### Running Linter

```sh
yarn lint
```

### Run Metro Builder

```sh
yarn start
```

### Run the app

Make sure you have Xcode and Android studio installed with appropriate SDK

####Test Users
#####Staging:

```
Comming soon
```

#### Run in Android Studio

Ref: [facebook.github.io/react-native/docs/getting-started#1-install-android-studio](https://facebook.github.io/react-native/docs/getting-started#1-install-android-studio)

```sh
yarn android
```

#### Run in the iOS Simulator

Ref: [facebook.github.io/react-native/docs/getting-started#xcode](https://facebook.github.io/react-native/docs/getting-started#xcode)

```
yarn ios
```

### TROUBLESHOOTING NOTE

If you are having trouble bundling the app for the first time on ios

```sh
yarn clean-ios
```

This will nuke your `build` folders and `node_modules` and reinstall everything from scratch.

### Devices

The Android emulator and iOS simulator are great for testing however features should be tested on physical devices prior to issuing a merge request.

_Someone to add instructions for deploying to actual devices_

### Redux dev tools

_Add details of how to access the app from within Chrome_

To view the state in the app install [the Redux dev tools Chrome plugin](https://chrome.google.com/webstore/detail/remotedev/faicmgpfiaijcedapokpbdejaodbelph/related).

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).

update with link bellow:
1.react-native-fbsdk
https://github.com/facebook/react-native-fbsdk/issues/493
