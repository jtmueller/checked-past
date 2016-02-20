'use strict';

import * as _ from 'lodash';
import { handleActions, Action } from 'redux-actions';

import { Todo } from '../models/todos';
import * as ActionType from '../constants/ActionTypes';

const initialState: ReadonlyArray<Todo> = [] as Todo[];

export default handleActions<ReadonlyArray<Todo>>({
  [ActionType.ADD_TODO]: (state: ReadonlyArray<Todo>, action: Action) : ReadonlyArray<Todo> => {
    let newRecord: Todo = {
      id: _.reduce(state, (maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
      completed: action.payload.completed,
      text: action.payload.text
    };
    return [newRecord, ...state];
  },
  
  [ActionType.DELETE_TODO]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
    return _.filter(state, todo => todo.id !== action.payload.id);
  },
  
  [ActionType.EDIT_TODO]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
    return _.map(state, todo =>
      todo.id === action.payload.id
        ? { id: todo.id, completed: todo.completed, text: action.payload.text }
        : todo
    );
  },
  
  [ActionType.COMPLETE_TODO]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
    return _.map(state, todo =>
      todo.id === action.payload.id
        ? { id: todo.id, completed: !todo.completed, text: todo.text }
        : todo
    );
  },
  
  [ActionType.COMPLETE_ALL]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
    const areAllMarked = _.every(state, todo => todo.completed);
    return _.map(state, todo => ({ id: todo.id, completed: !areAllMarked, text: todo.text }) as Todo);
  },

  [ActionType.CLEAR_COMPLETED]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
    return _.filter(state, todo => todo.completed === false);
  }
}, initialState);
