import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
  Store,
  compose,
  createStore,
  bindActionCreators,
  combineReducers
} from 'redux';
import {
  connect,
  Provider
} from 'react-redux';
import { Action } from 'redux-actions';

import App from './containers/App.tsx';
import { rootReducer } from './reducers/rootReducer.ts';

const initialState = {
};

const store: Store = createStore(rootReducer, initialState);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);

