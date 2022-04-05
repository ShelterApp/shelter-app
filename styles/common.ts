import { StyleSheet, Dimensions, Platform } from 'react-native';
import theme from './theme';

export default StyleSheet.create({
  // heading
  h1: {
    fontSize: theme.FONT_SIZE_SUPPER_LARGE,
    fontWeight: theme.FONT_WEIGHT_MEDIUM,
    lineHeight: theme.LINE_HEIGHT_SUPPER_LARGE,
    color: theme.GRAY_DARKER_COLOR,
  },
  h2: {
    fontSize: theme.FONT_SIZE_LARGE,
    fontWeight: theme.FONT_WEIGHT_MEDIUM,
    lineHeight: theme.LINE_HEIGHT_LARGE,
    color: theme.GRAY_DARKER_COLOR,
  },
  text: {
    fontSize: theme.FONT_SIZE_MEDIUM,
    fontWeight: theme.FONT_WEIGHT_MEDIUM,
    lineHeight: theme.LINE_HEIGHT_SUPPER_LARGE,
    color: theme.GRAY_DARKER_COLOR,
  },
  smallText: {
    fontSize: 13,
    fontWeight: theme.FONT_WEIGHT_MEDIUM,
    lineHeight: theme.LINE_HEIGHT_MEDIUM,
    color: theme.GRAY_DARKER_COLOR,
  },
  errorText: {
    backgroundColor: theme.RED_BACKGROUND_COLOR,
  },
  link: {
    textDecorationLine: 'underline',
  },
  label: {
    fontSize: theme.FONT_SIZE_MEDIUM,
    fontWeight: theme.FONT_WEIGHT_MEDIUM,
    color: theme.GRAY_DARK_COLOR,
    lineHeight: theme.LINE_HEIGHT_MEDIUM,
    textTransform: 'uppercase',
  },
  noLabel: {
    opacity: 0,
  },
  input: {
    fontSize: theme.FONT_SIZE_SUPPER_LARGE,
    fontWeight: theme.FONT_WEIGHT_MEDIUM,
    lineHeight: theme.LINE_HEIGHT_LARGE,
    color: theme.BLACK_COLOR,
  },

  // button
  button: {
    borderRadius: theme.BTN_BORDER_RADIUS,
    paddingHorizontal: theme.BTN_PADDING_HORIZONTAL,
    paddingVertical: theme.BTN_PADDING_VERTICAL,
  },
  buttonTitle: {
    fontSize: theme.FONT_SIZE_LARGE,
    fontWeight: theme.FONT_WEIGHT_BOLD,
    lineHeight: theme.LINE_HEIGHT_LARGE,
  },

  // utils
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },

  // header
  headerCommon: {
    height: 44,
    backgroundColor: theme.PRIMARY_COLOR,
    borderBottomWidth: 0,
    // padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: theme.LINE_HEIGHT_SUPPER_LARGE,
    color: theme.WHITE_COLOR,
    fontWeight: theme.FONT_WEIGHT_BOLD,
  },
  headerTitleAndroid: {
    textAlign: 'center',
    flex: 1,
    color: theme.WHITE_COLOR,
  },
  imageEventStyle: {
    width: 36,
    height: 36,
    borderRadius: 6,
  },
  heightOfTransactionItem: {
    height: 62,
  },
  tabNavigator: {
    top: 8,
    height: 42,
    overflow: 'hidden',
    borderColor: theme.LIGHT_COLOR,
    borderWidth: 1,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },
  sceneStyle: {
    paddingBottom: 0,
  },
  tabStyle: {
    display: 'flex',
    justifyContent: 'center',
    borderColor: theme.PRIMARY_COLOR,
  },
  tabTitleStyle: {
    fontSize: theme.FONT_SIZE_MEDIUM,
    lineHeight: theme.LINE_HEIGHT_MEDIUM,
    color: '#656565',
    fontWeight: theme.FONT_WEIGHT_BOLD,
  },
  selectedTitleStyle: {
    color: theme.BLACK_COLOR,
  },
  noPadding: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  // // for select
  // dropdownStyle: {
  //   backgroundColor : '#fff',
  //   borderColor: 'transparent',
  //   shadowRadius: 12,
  //   shadowOffset:{  width: 2, height: 8 },
  //   shadowColor: theme.GRAY_DARK_COLOR,
  //   shadowOpacity: .2,
  //   elevation: 5,
  //   marginTop: 10,
  //   width: Dimensions.get('window').width - 32,
  //   height: 170,
  // },
  // dropdownListStyle: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingHorizontal: 8,
  //   marginVertical: 10,
  // },
  // select: {
  //   borderBottomWidth: 1,
  //   borderBottomColor: theme.LIGHT_COLOR,
  //   height: 40,
  //   display: 'flex',
  //   justifyContent: 'center',
  // },
  pickerSelect: {
    borderBottomWidth: 1,
    borderBottomColor: theme.LIGHT_COLOR,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    fontSize: theme.FONT_SIZE_SUPPER_LARGE,
    fontWeight: theme.FONT_WEIGHT_MEDIUM,
    lineHeight: theme.LINE_HEIGHT_LARGE,
    color: theme.BLACK_COLOR,
  },
  // selectText: {
  //   fontSize: theme.FONT_SIZE_LARGE,
  //   fontWeight: theme.FONT_WEIGHT_MEDIUM,
  //   lineHeight: theme.LINE_HEIGHT_LARGE,
  //   color: theme.GRAY_DARK_COLOR,
  // },

  // for search
  searchContainerStyle: {
    backgroundColor: theme.PRIMARY_COLOR,
    borderColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 8,
    paddingTop: 5,
    paddingBottom: 5,
  },
  inputSearchContainerStyle: {
    backgroundColor: theme.WHITE_COLOR,
    borderRadius: 4,
    marginLeft: 0,
    minHeight: 34,
    height: 34,
  },
  inputSearchStyle: {
    color: theme.BLACK_COLOR,
    fontSize: theme.FONT_SIZE_LARGE,
    fontWeight: theme.FONT_WEIGHT_MEDIUM,
    display: 'flex',
    alignItems: 'center',
  },
  buttonTextStyle: {
    color: theme.WHITE_COLOR,
    fontSize: theme.FONT_SIZE_LARGE,
  },
} as any);
