'use strict';

import * as moment from 'moment';
import { createAction, Action } from 'redux-actions';
import * as Firebase from 'firebase';

import { Dispatcher, User, Todo, TabType, Weekday } from '../models/todos';
import * as ActionType from '../constants/ActionTypes';
import { FilterType } from '../constants/TodoFilters';

import { store } from '../main';

const dbRoot = new Firebase('https://checked-past.firebaseio.com/');

const handleAuth = (authData:FirebaseAuthData) => {
    if (!authData) return;
    const { displayName, profileImageURL } = authData[authData.provider];
    if (store) {
        store.dispatch({
            type: ActionType.Auth,
            payload: {
                userId: authData.uid,
                name: displayName,
                avatarUrl: profileImageURL
            }
        })
    }
    else {
        setTimeout(() => handleAuth(authData), 250);
    }
};

dbRoot.onAuth(handleAuth);

// redraw the list every minute so that the timestamps update
setInterval(() => {
    store.dispatch({
        type: ActionType.RefreshTimes,
        payload: void 0
    })
}, 60 * 1000);

export const addTodo = createAction<{ text: string, weekday?: Weekday }>(
    ActionType.AddTodo,
    (text: string, weekday?: Weekday) => ({ text: text.trim(), weekday })
);

export const deleteTodo = createAction<Todo>(
    ActionType.DeleteTodo,
    (todo: Todo) => todo
);

export const editTodo = createAction<{ todo: Todo, newText: string, newWeekday?: Weekday }>(
    ActionType.EditTodo,
    (todo: Todo, newText: string, weekday?: Weekday) => ({ todo, newText: newText.trim(), newWeekday: weekday })
);

export const completeTodo = createAction<Todo>(
    ActionType.ToggleTodo,
    (todo: Todo) => todo
)

export const toggleAll = createAction<void>(
    ActionType.ToggleAll,
    () => { }
)

export const clearCompleted = createAction<void>(
    ActionType.ClearCompleted,
    () => { }
);

export const changeTab = createAction<TabType>(
    ActionType.ChangeTab,
    (tab: TabType) => tab
);

export const setFilter = createAction<FilterType>(
    ActionType.SetFilter,
    (filter: FilterType) => filter
)

export const login = () =>
    (dispatch: Dispatcher<User>) => {
        dbRoot.authWithOAuthRedirect('google', (error) => {
            if (error) {
                console.error('Authenticaton Error', error);
            }
        });
    };
