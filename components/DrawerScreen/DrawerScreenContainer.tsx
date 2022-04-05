import { connect } from 'react-redux';
import { DrawerScreen } from './DrawerScreen';

import { getUserData } from '@app/redux/user/selectors';
import { logout } from '@app/redux/user/actions';
import { getServices, setOpenService,
  getCountService, setTopKudo, setMapView } from '@app/redux/service/actions';
import { getReducer, getCategory,
  getOpenService, getTopKudo, getMapView } from '@app/redux/service/selectors';

const mapStateToProps = (state) => ({
  userInfo: getUserData(state),
  allQuery: getReducer(state),
  category: getCategory(state),
  isOpen: getOpenService(state),
  isTopKudo: getTopKudo(state),
  isMapView: getMapView(state),
});

const mapDispatchToProps = {
  logout,
  getServices,
  setOpenService,
  setTopKudo,
  setMapView,
  getCountService,
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerScreen);
