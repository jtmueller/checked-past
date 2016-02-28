'use strict';

export type ActionType =
    'ADD_TODO' | 'DELETE_TODO' | 'EDIT_TODO' | 'REFRESH_TIMES' | 'CHANGE_TAB' |
    'SET_FILTER' | 'AUTH';

export const AddTodo: ActionType = 'ADD_TODO';
export const DeleteTodo: ActionType = 'DELETE_TODO';
export const EditTodo: ActionType = 'EDIT_TODO';
export const RefreshTimes: ActionType = 'REFRESH_TIMES';
export const ChangeTab: ActionType = 'CHANGE_TAB';
export const SetFilter: ActionType = 'SET_FILTER';
export const Auth: ActionType = 'AUTH';
