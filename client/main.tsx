'use strict';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
    Store,
    compose,
    createStore,
    bindActionCreators,
    combineReducers,
    applyMiddleware
} from 'redux';
import {
    connect,
    Provider
} from 'react-redux';
import { Action } from 'redux-actions';
import thunk from './actions/redux-thunk';

import App from './containers/App.tsx';
import { rootReducer } from './reducers/rootReducer.ts';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const initialState = {
};

export const store: Store = createStoreWithMiddleware(rootReducer, initialState);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);

