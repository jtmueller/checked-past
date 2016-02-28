'use strict';

import * as moment from 'moment';
import { createAction, Action } from 'redux-actions';
import * as Firebase from 'firebase';

import { Dispatcher, ActionContext, User, Todo, TabType, Weekday } from '../models/todos';
import * as ActionType from '../constants/ActionTypes';
import { FilterType } from '../constants/TodoFilters';

import { store } from '../main';

const handleAuth = (authData:FirebaseAuthData) => {
    if (!authData) return;
    const { displayName, profileImageURL } = authData[authData.provider];
    if (store) {
        const user: User = {
            userId: authData.uid,
            name: displayName,
            avatarUrl: profileImageURL
        };
        store.dispatch({
            type: ActionType.Auth,
            payload: user
        });
        setupEventHandlers(user);
    }
    else {
        setTimeout(() => handleAuth(authData), 250);
    }
};

const dbRoot = new Firebase('https://checked-past.firebaseio.com/');
dbRoot.onAuth(handleAuth);

const getTabProp = (tab: TabType) => {
    switch (tab) {
        case TabType.Monthly:
            return 'monthlyTasks';
        case TabType.Weekly:
            return 'weeklyTasks';
        case TabType.Todos:
            return 'todos';
        case TabType.Shopping:
            return 'shopping';
        default:
            throw new Error(`Unknown tab type: '${tab}' (${TabType[tab]}).`);
    }
};

const setupEventHandlers = (user:User) => {
    let disposeCalls: Function[] = [];
    
    for (let tab of [TabType.Weekly, TabType.Monthly, TabType.Todos, TabType.Shopping]) {
        let tabProp = getTabProp(tab);
        let todos = dbRoot.child(`${user.userId}/${tabProp}`);
        
        todos.on('child_added', (snapshot, prevId) => {
            store.dispatch({
                type: ActionType.AddTodo,
                payload: {
                    tab, todo: snapshot.val(), prevId
                }
            })
        });
        
        todos.on('child_changed', snapshot => {
            store.dispatch({
                type: ActionType.EditTodo,
                payload: {
                    tab, todo: snapshot.val()
                }
            })
        });
        
        todos.on('child_removed', snapshot => {
            store.dispatch({
               type: ActionType.DeleteTodo,
               payload: {
                   tab, deleteId: snapshot.key()
               } 
            });
        });
        
        disposeCalls.push(() => {
            todos.off('child_added');
            todos.off('child_changed');
            todos.off('child_removed');
        });
    }
    
    return {
        dispose: () => {
            for (let dc of disposeCalls) dc();
        }
    };
};

// redraw the list every minute so that the timestamps update
setInterval(() => {
    store.dispatch({
        type: ActionType.RefreshTimes,
        payload: void 0
    })
}, 60 * 1000);

export const addTodo = ({user, tab}: ActionContext, text: string, weekday?: Weekday) => (dispatch) => {
    if (!text) return;
    let tasks = dbRoot.child(`${user.userId}/${getTabProp(tab)}`);
    let newRef = tasks.push();
    
    const todo: Todo = {
        id: newRef.key(),
        text, weekday,
        completed: false,
        lastModified: new Date().getTime()
    };
    
    newRef.set(todo, error => {
        if (error) console.error(error);
    });
};

export const deleteTodo = ({user, tab}: ActionContext, todo:Todo) => (dispatch) => {
    let tasks = dbRoot.child(`${user.userId}/${getTabProp(tab)}`);
    tasks.child(todo.id).remove();
};

export const editTodo = ({user, tab}: ActionContext, todo: Todo, text: string, weekday?: Weekday) => (dispatch) => {
    if (weekday !== todo.weekday || (text && todo.text !== text)) {
        let tasks = dbRoot.child(`${user.userId}/${getTabProp(tab)}`);
        tasks.child(todo.id).update({ text, weekday, lastModified: new Date().getTime() }); 
    }  
};

export const toggleTodo = ({user, tab}: ActionContext, todo:Todo) => (dispatch) => {
    let tasks = dbRoot.child(`${user.userId}/${getTabProp(tab)}`);
    tasks.child(todo.id).update({ completed: !todo.completed, lastModified: new Date().getTime() });
};

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

export const login = () => {
    dbRoot.authWithOAuthRedirect('google', (error) => {
        if (error) {
            console.error('Authenticaton Error', error);
        }
    });
};
