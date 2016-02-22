'use strict';

export type ActionType =
    'ADD_TODO' | 'DELETE_TODO' | 'EDIT_TODO' | 'TOGGLE_TODO' |
    'TOGGLE_ALL' | 'CLEAR_COMPLETED' | 'REFRESH_TIMES' | 'CHANGE_TAB' |
    'SET_FILTER';

export const AddTodo: ActionType = 'ADD_TODO';
export const DeleteTodo: ActionType = 'DELETE_TODO';
export const EditTodo: ActionType = 'EDIT_TODO';
export const ToggleTodo: ActionType = 'TOGGLE_TODO';
export const ToggleAll: ActionType = 'TOGGLE_ALL';
export const ClearCompleted: ActionType = 'CLEAR_COMPLETED';
export const RefreshTimes: ActionType = 'REFRESH_TIMES';
export const ChangeTab: ActionType = 'CHANGE_TAB';
export const SetFilter: ActionType = 'SET_FILTER';
