'use strict';

import { createAction, Action } from 'redux-actions';

import { Todo } from '../models/todos';
import * as ActionType from '../constants/ActionTypes';

export const addTodo = createAction<Todo>(
  ActionType.ADD_TODO,
  (text: string) => ({ text, completed: false })
);

export const deleteTodo = createAction<Todo>(
  ActionType.DELETE_TODO,
  (todo: Todo) => todo
);

export const editTodo = createAction<Todo>(
  ActionType.EDIT_TODO,
  (todo: Todo, newText: string) => ({ id: todo.id, completed: todo.completed, text: newText }) as Todo
);

export const completeTodo = createAction<Todo>(
  ActionType.COMPLETE_TODO,
  (todo: Todo) => todo
)

export const completeAll = createAction<void>(
  ActionType.COMPLETE_ALL,
  () => {}
)

export const clearCompleted = createAction<void>(
  ActionType.CLEAR_COMPLETED,
  () => {}
);

