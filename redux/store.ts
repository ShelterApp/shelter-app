import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import reduxThunk from 'redux-thunk';

import { reducerRegistry } from './reducer-registry';

import './user';
import './other';
import './service';

const configureStoreEnhancers = () => {
  let composeEnhancers = compose;
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || composeEnhancers;

  const enhancers = composeEnhancers(
    applyMiddleware(reduxThunk),
  );

  return enhancers;
};

const configureStore = (initialState?: object) => {

  const registeredReducers = reducerRegistry.getCombinedReducers(initialState);
  const reducers = combineReducers(registeredReducers);

  const enhancers = configureStoreEnhancers();

  const store = createStore(
    reducers,
    initialState,
    enhancers,
  );

  reducerRegistry.setChangeListener(() => {
    store.replaceReducer(
      combineReducers(reducerRegistry.getCombinedReducers()),
    );
  });

  return store;
};

export default configureStore;
