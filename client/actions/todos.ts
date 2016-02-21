'use strict';

import * as moment from 'moment';
import { createAction, Action } from 'redux-actions';

import { Todo } from '../models/todos';
import * as ActionType from '../constants/ActionTypes';

import { store } from '../main';

// redraw the list every minute so that the timestamps update
setInterval(() => {
    store.dispatch({
        type: ActionType.REFRESH_TIMES,
        payload: void 0
    })
}, 60 * 1000);

export const addTodo = createAction<string>(
    ActionType.ADD_TODO,
    (text: string) => text
);

export const deleteTodo = createAction<Todo>(
    ActionType.DELETE_TODO,
    (todo: Todo) => todo
);

export const editTodo = createAction<{ todo: Todo, newText: string }>(
    ActionType.EDIT_TODO,
    (todo: Todo, newText: string) => ({ todo, newText })
);

export const completeTodo = createAction<Todo>(
    ActionType.TOGGLE_TODO,
    (todo: Todo) => todo
)

export const completeAll = createAction<void>(
    ActionType.TOGGLE_ALL,
    () => { }
)

export const clearCompleted = createAction<void>(
    ActionType.CLEAR_COMPLETED,
    () => { }
);
