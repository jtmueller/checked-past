import * as _ from 'lodash';
import { handleActions, Action } from 'redux-actions';

import { Todo } from '../models/todos';
import {
  ADD_TODO,
  DELETE_TODO,
  EDIT_TODO,
  COMPLETE_TODO,
  COMPLETE_ALL,
  CLEAR_COMPLETED
} from '../constants/ActionTypes';

const initialState: ReadonlyArray<Todo> = [{
  text: 'Use Redux with TypeScript',
  completed: false,
  id: 0
} as Todo];

export default handleActions<ReadonlyArray<Todo>>({
  [ADD_TODO]: (state: ReadonlyArray<Todo>, action: Action) : ReadonlyArray<Todo> => {
    let newRecord: Todo = {
      id: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
      completed: action.payload.completed,
      text: action.payload.text
    };
    return [newRecord, ...state];
  },
  
  [DELETE_TODO]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
    return _.filter(state, todo => todo.id !== action.payload.id);
  },
  
  [EDIT_TODO]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
    return _.map(state, todo =>
      todo.id === action.payload.id
        ? { id: todo.id, completed: todo.completed, text: action.payload.text }
        : todo
    );
  },
  
  [COMPLETE_TODO]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
    return _.map(state, todo =>
      todo.id === action.payload.id
        ? { id: todo.id, completed: !todo.completed, text: todo.text }
        : todo
    );
  },
  
  [COMPLETE_ALL]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
    const areAllMarked = _.every(state, todo => todo.completed);
    return _.map(state, todo => ({ id: todo.id, completed: !areAllMarked, text: todo.text }) as Todo);
  },

  [CLEAR_COMPLETED]: (state: ReadonlyArray<Todo>, action: Action): ReadonlyArray<Todo> => {
    return _.filter(state, todo => todo.completed === false);
  }
}, initialState);
