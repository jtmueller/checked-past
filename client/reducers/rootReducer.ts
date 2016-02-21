'use strict';

import { combineReducers } from 'redux';

import reducers from './todos';

const rootReducer = combineReducers({
    state: reducers
});

export { rootReducer };
