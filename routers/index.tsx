import * as React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createDrawerNavigator,
  createSwitchNavigator,
} from 'react-navigation';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';

import { Platform, View, Dimensions } from 'react-native';

import {
  Food as FoodSreen,
  FoodDetails as FoodDetailsSreen,
  Shelter as ShelterSreen,
  ShelterDetails as ShelterDetailsScreen,
  Health as HealthSreen,
  HealthDetails as HealthDetailsScreen,
  Resources as ResourcesScreen,
  ResourceDetails as ResourceDetailsScreen,
  Work as WorkScreen,
  WorkDetails as WorkDetailsScreen,
  AdminCreateService as AdminCreateServiceScreen,
  AdminServiceDetails as AdminServiceDetailsScreen,
  AdminServices as AdminServicesScreen,
  CreateLine as CreateLineScreen,
  LineDetails as LineDetailsScreen,
  Lines as LinesScreen,
  Authen as AuthenScreen,
  ForgotPassword as ForgotPasswordScreen,
  ResetPassword as ResetPasswordScreen,
  AuthLoading as AuthLoadingScreen,
  Profile as ProfileScreen,
  ChangePassword as ChangePasswordScreen,
  Favorites as FavoritesScreen,
  FavoritesDetails as FavoritesDetailsScreen,
  ListSearch as ListSearchScreen,
  SearchDetails as SearchDetailsScreen,
  Feedbacks as FeedbacksScreen,
  CreateFeedback as CreateFeedbackScreen,
  UpdateShelter as UpdateSheterScreen,
  ManageApproval as ManageApprovalScreen,
  About as AboutScreen,
  Faq as FaqScreen,
  ShowTutorial as ShowTutorialScreen,
  Terms as TermsScreen,
  Privacy as PrivacyScreen,
  Users as ManageUsersScreen,
  SuperUser as ManageSuperUsersScreen,
  UserDetails as UserDetailsScreen,
  Perms as ManagePermsScreen,
  Chat as ChatBoxScreen,
  ChatDetails as ChatDetailsScreen,
} from '@app/pages';

import { BackButton } from '@app/components/Common';
import { DrawerScreen } from '@app/components/DrawerScreen';

import { tabStyles } from './styles';
import { getTabBarIcon } from './utils';

import theme from '@app/styles/theme';
import common from '@app/styles/common';

const normalHeaderOptions = {
  headerStyle: common.headerCommon,
  headerBackImage: <BackButton />,
  headerRight: <></>,
  headerBackTitle: null,
  headerTitleStyle:
    Platform.OS === 'ios' ? common.headerTitle : common.headerTitleAndroid,
};

const noHeaderOptions = {
  header: null,
};

const FoodStacks = createStackNavigator(
  {
    Food: { screen: FoodSreen },
    FoodDetails: {
      screen: FoodDetailsSreen,
      navigationOptions: {
        headerBackTitle: null,
        headerLeft: null,
      },
    },
  },
  {
    defaultNavigationOptions: noHeaderOptions,
  },
);

const ShelterStacks = createStackNavigator(
  {
    Shelter: { screen: ShelterSreen },
    ShelterDetails: {
      screen: ShelterDetailsScreen,
      navigationOptions: {
        headerBackTitle: null,
        headerLeft: null,
      },
    },
  },
  {
    defaultNavigationOptions: noHeaderOptions,
  },
);

const UpdateShelterStacks = createStackNavigator(
  {
    UpdateShelter: { screen: UpdateSheterScreen },
  },
  {
    defaultNavigationOptions: noHeaderOptions,
  },
);

const HealthStacks = createStackNavigator(
  {
    Health: { screen: HealthSreen },
    HealthDetails: {
      screen: HealthDetailsScreen,
      navigationOptions: {
        headerBackTitle: null,
        headerLeft: null,
      },
    },
  },
  {
    defaultNavigationOptions: noHeaderOptions,
  },
);

const ResourcesStacks = createStackNavigator(
  {
    Resources: { screen: ResourcesScreen },
    ResourceDetails: {
      screen: ResourceDetailsScreen,
      navigationOptions: {
        headerBackTitle: null,
        headerLeft: null,
      },
    },
  },
  {
    defaultNavigationOptions: noHeaderOptions,
  },
);

const WorkStacks = createStackNavigator(
  {
    Work: { screen: WorkScreen },
    WorkDetails: {
      screen: WorkDetailsScreen,
      navigationOptions: {
        headerBackTitle: null,
        headerLeft: null,
      },
    },
  },
  {
    defaultNavigationOptions: noHeaderOptions,
  },
);

const UserStacks = createSwitchNavigator({
  Profile: {
    screen: ProfileScreen,
  },
  ChangePassword: {
    screen: ChangePasswordScreen,
  },
});

const FavoriteStacks = createStackNavigator(
  {
    Favorites: {
      screen: FavoritesScreen,
    },
    FavoriteDetails: {
      screen: FavoritesDetailsScreen,
    },
  },
  {
    defaultNavigationOptions: noHeaderOptions,
  },
);

const FeedBackStacks = createStackNavigator(
  {
    Feedbacks: {
      screen: FeedbacksScreen,
    },
    GiveFeedback: {
      screen: CreateFeedbackScreen,
    },
  },
  {
    defaultNavigationOptions: noHeaderOptions,
  },
);

const ManageApprovalStacks = createStackNavigator(
  {
    ManageApprovals: {
      screen: ManageApprovalScreen,
      navigationOptions: noHeaderOptions,
    },
    AdminServiceDetails: {
      screen: AdminServiceDetailsScreen,
      navigationOptions: noHeaderOptions,
    },
  },
  {
    defaultNavigationOptions: normalHeaderOptions,
  },
);

const AboutStacks = createStackNavigator(
  {
    AboutShelter: {
      screen: AboutScreen,
    },
  },
  {
    defaultNavigationOptions: normalHeaderOptions,
  },
);

const FaqStacks = createStackNavigator(
  {
    Faq: {
      screen: FaqScreen,
    },
  },
  {
    defaultNavigationOptions: normalHeaderOptions,
  },
);

const TermsStacks = createStackNavigator(
  {
    Terms: {
      screen: TermsScreen,
    },
  },
  {
    defaultNavigationOptions: normalHeaderOptions,
  },
);

const PrivaryStacks = createStackNavigator(
  {
    Privacy: {
      screen: PrivacyScreen,
    },
  },
  {
    defaultNavigationOptions: normalHeaderOptions,
  },
);

const ShowTutorialStacks = createStackNavigator(
  {
    ShowTutorial: {
      screen: ShowTutorialScreen,
    },
  },
  {
    defaultNavigationOptions: noHeaderOptions,
  },
);

const ManagePermsStacks = createStackNavigator(
  {
    ManagePerms: {
      screen: ManagePermsScreen,
    },
  },
  {
    defaultNavigationOptions: noHeaderOptions,
  },
);

const ManageUsersStacks = createStackNavigator(
  {
    ManageUsers: {
      screen: ManageUsersScreen,
      navigationOptions: noHeaderOptions,
    },
    ManageSuperUser: {
      screen: ManageSuperUsersScreen,
      navigationOptions: noHeaderOptions,
    },
    UserDetails: {
      screen: UserDetailsScreen,
    },
  },
  {
    defaultNavigationOptions: normalHeaderOptions,
  },
);

const SearchStacks = createStackNavigator(
  {
    ListSearch: {
      screen: ListSearchScreen,
    },
    SearchDetails: {
      screen: SearchDetailsScreen,
    },
  },
  {
    defaultNavigationOptions: noHeaderOptions,
  },
);

const ChatBoxStacks = createStackNavigator(
  {
    ChatBox: {
      screen: ChatBoxScreen,
    },
    ChatDetails: {
      screen: ChatDetailsScreen,
    },
  },
  {
    defaultNavigationOptions: noHeaderOptions,
  },
);

const AuthStacks = createStackNavigator(
  {
    Authen: { screen: AuthenScreen },
    ForgotPassword: { screen: ForgotPasswordScreen },
    ResetPassword: {
      screen: ResetPasswordScreen,
      path: 'ResetPassword',
    },
  },
  {
    defaultNavigationOptions: normalHeaderOptions,
  },
);

const BottomTabNavigator = createBottomTabNavigator(
  {
    Food: {
      screen: FoodStacks,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: navigation.state.index === 0,
        tabBarIcon: getTabBarIcon('md-restaurant'),
      }),
    },
    Shelter: {
      screen: ShelterStacks,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: navigation.state.index === 0,
        tabBarIcon: getTabBarIcon('md-home'),
      }),
    },
    Health: {
      screen: HealthStacks,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: navigation.state.index === 0,
        tabBarIcon: getTabBarIcon('heartbeat'),

        // tabBarIcon: ({ focused }) => (
        //   <View style={{ display: "flex" }}>
        //     <Icon
        //       name="heartbeat"
        //       size={32}
        //       color={focused ? theme.WHITE_COLOR : theme.WHITE_LIGHT_COLOR}
        //       style={{ width: "150%" }}
        //     />
        //   </View>
        // ),
      }),
    },
    Resources: {
      screen: ResourcesStacks,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: navigation.state.index === 0,
        tabBarIcon: getTabBarIcon('md-shirt'),
      }),
    },
    Work: {
      screen: WorkStacks,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: navigation.state.index === 0,
        tabBarIcon: getTabBarIcon('md-briefcase'),
      }),
    },
  },
  {
    initialRouteName: 'Shelter',
    tabBarOptions: {
      inactiveTintColor: theme.WHITE_LIGHT_COLOR,
      activeTintColor: theme.WHITE_COLOR,
      keyboardHidesTabBar: true,
      style: tabStyles.tabBar,
      labelStyle: {
        marginTop: Platform.OS === 'ios' ? 2 : 4,
        fontSize: theme.FONT_SIZE_TINY,
      },
    },
  },
);

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: BottomTabNavigator,
    },
    Auth: {
      screen: AuthStacks,
      path: 'Auth',
    },
    AdminCreateService: {
      screen: AdminCreateServiceScreen,
      navigationOptions: noHeaderOptions,
    },
    AdminServices: {
      screen: AdminServicesScreen,
      navigationOptions: noHeaderOptions,
    },
    AdminServiceDetails: {
      screen: AdminServiceDetailsScreen,
      navigationOptions: noHeaderOptions,
    },
    FavoritesRouter: {
      screen: FavoriteStacks,
    },
    FeedBacksRouter: {
      screen: FeedBackStacks,
    },
    ManageApprovalRouter: {
      screen: ManageApprovalStacks,
    },
    AboutRouter: {
      screen: AboutStacks,
    },
    FaqRouter: {
      screen: FaqStacks,
    },
    TermsRouter: {
      screen: TermsStacks,
    },
    PrivacyRouter: {
      screen: PrivaryStacks,
    },
    ShowTutorialRouter: {
      screen: ShowTutorialStacks,
    },
    ManagePermsRouter: {
      screen: ManagePermsStacks,
    },
    ManageUsersRouter: {
      screen: ManageUsersStacks,
    },
    ShelterRouter: {
      screen: UpdateShelterStacks,
    },
    CreateLine: {
      screen: CreateLineScreen,
      navigationOptions: noHeaderOptions,
    },
    Lines: {
      screen: LinesScreen,
      navigationOptions: noHeaderOptions,
    },
    LineDetails: {
      screen: LineDetailsScreen,
      navigationOptions: noHeaderOptions,
    },
    SearchRouter: {
      screen: SearchStacks,
    },
    ChatBoxRouter: {
      screen: ChatBoxStacks,
    },
    User: {
      screen: UserStacks,
    },
    AuthLoading: AuthLoadingScreen,
    ListSearch: {
      screen: ListSearchScreen,
    },
    // SearchDetails: {
    //   screen: SearchDetailsScreen,
    // },
  },
  {
    initialRouteName: 'AuthLoading',
    contentComponent: (props) => <DrawerScreen {...props} />,
    drawerWidth: 276,
    overlayColor: '#2121218c',
    drawerType: 'front',
  },
);

export default createAppContainer(DrawerNavigator);
