'use strict';

import * as _ from 'lodash';
import * as moment from 'moment';
import { handleActions, Action } from 'redux-actions';

import { Todo } from '../models/todos';
import * as ActionType from '../constants/ActionTypes';

const initialState: ReadonlyArray<Todo> = [] as Todo[];

export default handleActions<ReadonlyArray<Todo>>({
    [ActionType.ADD_TODO]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
        const { completed, text, lastModified } = action.payload;
        let newRecord: Todo = {
            id: _.reduce(state, (maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
            completed, text, lastModified
        };
        return [newRecord, ...state];
    },

    [ActionType.DELETE_TODO]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
        return _.filter(state, todo => todo.id !== action.payload.id);
    },

    [ActionType.EDIT_TODO]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
        return _.map(state, todo => todo.id === action.payload.id ? action.payload : todo);
    },

    [ActionType.TOGGLE_TODO]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
        return _.map(state, todo => todo.id === action.payload.id ? action.payload : todo);
    },

    [ActionType.TOGGLE_ALL]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
        const areAllMarked = _.every(state, todo => todo.completed);
        return _.map(state, todo => ({ id: todo.id, completed: !areAllMarked, text: todo.text, lastModified: moment.utc().toDate() }) as Todo);
    },

    [ActionType.CLEAR_COMPLETED]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
        return _.filter(state, todo => todo.completed === false);
    },
    
    [ActionType.REFRESH_TIMES]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
        // this is just to get the UI to redraw the timestamps, so no changes, but we have to return
        // a different state instance - maybe put the array inside an object to avoid recreating the array?
        return [...state];
    }
}, initialState);
