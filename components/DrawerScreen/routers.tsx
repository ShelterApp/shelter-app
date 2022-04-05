import { Linking, Alert } from 'react-native';
const beforeLoginMenus = [
  {
    icon: 'md-call',
    title: 'CRISIS_LINES',
    router: 'Lines',
  },
  {
    icon: 'md-star',
    title: 'MY_FAVORITES',
    router: 'Favorites',
  },
  {
    icon: 'md-information-circle',
    title: 'ABOUT_SHELTER',
    router: 'AboutShelter',
  },
  {
    icon: 'md-help-circle',
    title: 'SHOW_TUTORIAL',
    router: 'ShowTutorial',
  },
  {
    icon: 'ios-create',
    title: 'GIVE_FEEDBACK',
    router: 'GiveFeedback',
  },
  {
    icon: 'charity',
    title: 'VOLUNTEER',
    onPress: () => Linking.openURL('http://volunteer.shelterapp.org/'),
  },
  {
    icon: 'donate',
    title: 'DONATE',
    onPress: () =>
            Linking.openURL(
                'https://www.paypal.com/fundraiser/charity/3945196',
            ),
  },
  {
    icon: 'md-clipboard',
    title: 'TERMS_OF_USE',
    router: 'Terms',
  },
  {
    icon: 'shield-account',
    title: 'PRIVACY_POLICY',
    router: 'Privacy',
  },
  {
    icon: 'ios-log-in',
    title: 'LOGIN_AND_SIGNUP',
    router: 'Authen',
  },
];

const afterLogin = {
  admin: [
    {
      icon: 'md-call',
      title: 'CRISIS_LINES',
      router: 'Lines',
    },
    {
      icon: 'md-star',
      title: 'MY_FAVORITES',
      router: 'Favorites',
    },
    {
      icon: 'ios-add-circle',
      title: 'ADD_SERVICE',
      router: 'AdminCreateService',
    },
    {
      icon: 'ios-add-circle',
      title: 'ADD_CRISIS_LINE',
      router: 'CreateLine',
    },
    {
      icon: 'ios-keypad',
      title: 'MANAGE_SERVICES',
      router: 'AdminServices',
      count: 0,
      id: 'countManagedServices',
    },
    {
      icon: 'ios-happy',
      title: 'MANAGE_FEEDBACK',
      router: 'Feedbacks',
      count: 0,
      id: 'countUnReadFeedbacks',
    },
    {
      icon: 'md-checkmark-circle',
      title: 'UPDATE_SHELTER',
      router: 'UpdateShelter',
      count: 0,
      id: 'countManagedShelters',
    },
    {
      icon: 'md-unlock',
      title: 'MANAGE_APPROVALS',
      router: 'ManageApprovals',
      count: 0,
      id: 'countNotApprovedServices',
    },
        // {
        //   icon: "shield-key",
        //   title: "MANAGE_ACCESS",
        //   router: "ManagePerms",
        //   count: 0,
        //   id: "countAdminUsers",
        // },
        // {
        //   icon: "md-person-add",
        //   title: "MANAGE_SUPPER",
        //   router: "ManageSuperUser",
        //   count: 0,
        //   id: "countSupperUsers",
        // },
    {
      icon: 'md-person-add',
      title: 'MANAGE_USERS',
      router: 'ManageUsers',
      count: 0,
      id: 'countTotalUsers',
    },
    {
      icon: 'md-finger-print',
      title: 'CHANGE_PASSWORD',
      router: 'ChangePassword',
    },
  ],
  user: [
    {
      icon: 'md-call',
      title: 'CRISIS_LINES',
      router: 'Lines',
    },
    {
      icon: 'md-star',
      title: 'MY_FAVORITES',
      router: 'Favorites',
    },
    {
      icon: 'ios-add-circle',
      title: 'ADD_SERVICE',
      id: 'addService',
            // router: "AdminCreateService",
    },
    {
      icon: 'ios-keypad',
      title: 'MANAGE_SERVICES',
      router: 'AdminServices',
      count: 0,
      id: 'countManagedServices',
    },
    {
      icon: 'ios-happy',
      title: 'MANAGE_FEEDBACK',
      router: 'Feedbacks',
      count: 0,
      id: 'countUnReadFeedbacks',
    },
    {
      icon: 'md-checkmark-circle',
      title: 'UPDATE_SHELTER',
      router: 'UpdateShelter',
      count: 0,
      id: 'countManagedShelters',
    },
    {
      icon: 'md-contact',
      title: 'MANAGE_PROFILE',
      router: 'Profile',
    },
    {
      icon: 'md-finger-print',
      title: 'CHANGE_PASSWORD',
      router: 'ChangePassword',
    },
    {
      icon: 'md-information-circle',
      title: 'ABOUT_SHELTER',
      router: 'AboutShelter',
    },
    {
      icon: 'md-help-circle',
      title: 'SHOW_TUTORIAL',
      router: 'ShowTutorial',
    },
    {
      icon: 'ios-create',
      title: 'GIVE_FEEDBACK',
      router: 'GiveFeedback',
    },
    {
      icon: 'md-clipboard',
      title: 'TERMS_OF_USE',
      router: 'Terms',
    },
    {
      icon: 'shield-account',
      title: 'PRIVACY_POLICY',
      router: 'Privacy',
    },
  ],
};

export { beforeLoginMenus, afterLogin };
