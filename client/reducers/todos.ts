'use strict';

import * as _ from 'lodash';
import * as moment from 'moment';
import { handleActions } from 'redux-actions';

import { Todo, AppState, TabType } from '../models/todos';
import * as ActionType from '../constants/ActionTypes';

interface Action<T> {
    type: string;
    payload?: T;
    error?: boolean;
    meta?: any;
}

const initialState: AppState = {
    monthlyTasks: [] as Todo[],
    weeklyTasks: [] as Todo[],
    todos: [] as Todo[],
    shopping: [] as Todo[],
    activeTab: TabType.Todos
};

export default handleActions<AppState>({
    [ActionType.ADD_TODO]: (state: AppState, action: Action<string>): AppState => {
        const newEntry: Todo = {
            id: _.reduce(state.todos, (maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
            completed: false,
            text: action.payload,
            lastModified: moment.utc().toDate()
        };
        const { monthlyTasks, weeklyTasks, shopping, activeTab } = state;
        return {
            todos: [newEntry, ...state.todos],
            monthlyTasks, weeklyTasks, shopping, activeTab
        };
    },

    [ActionType.DELETE_TODO]: (state: AppState, action: Action<Todo>): AppState => {
        const { monthlyTasks, weeklyTasks, shopping, activeTab } = state;
        return {
            todos: _.filter(state.todos, todo => todo.id !== action.payload.id),
            monthlyTasks, weeklyTasks, shopping, activeTab
        };
    },

    [ActionType.EDIT_TODO]: (state: AppState, {payload: {todo, newText}}: Action<{ todo: Todo, newText: string }>): AppState => {
        const { monthlyTasks, weeklyTasks, shopping, activeTab } = state;
        const { id, completed } = todo;
        return {
            todos: _.map(state.todos, cur => cur.id !== id ? cur :
                { id, completed, text: newText, lastModified: moment.utc().toDate() }
            ),
            monthlyTasks, weeklyTasks, shopping, activeTab
        };
    },

    [ActionType.TOGGLE_TODO]: (state: AppState, {payload: todo}: Action<Todo>): AppState => {
        const { monthlyTasks, weeklyTasks, shopping, activeTab } = state;
        const { id, text, completed } = todo;
        return {
            todos: _.map(state.todos, cur => cur.id !== id ? cur :
                { id, completed: !completed, text, lastModified: moment.utc().toDate() } 
            ),
            monthlyTasks, weeklyTasks, shopping, activeTab
        };
    },

    [ActionType.TOGGLE_ALL]: (state: AppState, action: Action<void>): AppState => {
        const { monthlyTasks, weeklyTasks, shopping, activeTab } = state;
        const areAllMarked = _.every(state.todos, todo => todo.completed);
        return {
            todos: _.map<Todo, Todo>(state.todos, todo => {
                return { 
                    id: todo.id, text: todo.text,
                    completed: !areAllMarked, 
                    lastModified: moment.utc().toDate() 
                };
            }),
            monthlyTasks, weeklyTasks, shopping, activeTab
        };
    },

    [ActionType.CLEAR_COMPLETED]: (state: AppState, action: Action<void>): AppState => {
        const { monthlyTasks, weeklyTasks, shopping, activeTab } = state;
        return {
            todos: _.filter(state.todos, todo => todo.completed === false),
            monthlyTasks, weeklyTasks, shopping, activeTab
        };
    },
    
    [ActionType.REFRESH_TIMES]: (state: AppState, action: Action<void>): AppState => {
        // this is just to get the UI to redraw the timestamps, so no changes, but we have to return
        // a different state instance or redux decides that nothing changed and does not re-render
        const { monthlyTasks, weeklyTasks, todos, shopping, activeTab } = state;
        return { monthlyTasks, weeklyTasks, todos, shopping, activeTab };
    },
    
    [ActionType.ChangeTab]: (state: AppState, action: Action<TabType>): AppState => {
        const { monthlyTasks, weeklyTasks, todos, shopping } = state;
        return { monthlyTasks, weeklyTasks, todos, shopping, activeTab: action.payload };
    }
}, initialState);
