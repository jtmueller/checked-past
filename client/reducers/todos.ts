'use strict';

import * as _ from 'lodash';
import * as moment from 'moment';
import { handleActions } from 'redux-actions';

import { Todo, AppState, TabType } from '../models/todos';
import * as ActionType from '../constants/ActionTypes';
import { ShowAll, ShowCompleted, FilterType } from '../constants/TodoFilters';

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
    activeTab: TabType.Weekly,
    filter: 'show_all'
};

function getTabProp(state:AppState) {
    switch (state.activeTab) {
        case TabType.Monthly: return state.monthlyTasks;
        case TabType.Weekly: return state.weeklyTasks;
        case TabType.Todos: return state.todos;
        case TabType.Shopping: return state.shopping;
        default:
            throw new Error(`Unknown tab type: '${state.activeTab}' (${TabType[state.activeTab]}).`);
    }
}

function updateTabProp(state: AppState, values: ReadonlyArray<Todo>): AppState {
    let { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter } = state;
    switch (state.activeTab) {
        case TabType.Monthly:
            monthlyTasks = values;
            break;
        case TabType.Weekly:
            weeklyTasks = values;
            break;
        case TabType.Todos:
            todos = values;
            break;
        case TabType.Shopping:
            shopping = values;
            break;
        default:
            throw new Error(`Unknown tab type: '${state.activeTab}' (${TabType[state.activeTab]}).`);
    }
    return { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter };
}

export default handleActions<AppState>({
    [ActionType.AddTodo]: (state: AppState, action: Action<string>): AppState => {
        const curValues = getTabProp(state);
        const newEntry: Todo = {
            id: _.reduce(curValues, (maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
            completed: false,
            text: action.payload,
            lastModified: moment.utc().toDate()
        };
        const values = [newEntry, ...curValues];
        return updateTabProp(state, values);
    },

    [ActionType.DeleteTodo]: (state: AppState, action: Action<Todo>): AppState => {
        const curValues = getTabProp(state);
        const values = _.filter(curValues, todo => todo.id !== action.payload.id);
        return updateTabProp(state, values);
    },

    [ActionType.EditTodo]: (state: AppState, {payload: {todo, newText}}: Action<{ todo: Todo, newText: string }>): AppState => {
        const { id, completed } = todo;
        const curValues = getTabProp(state);
        const values = _.map(curValues, cur => cur.id !== id ? cur :
            { id, completed, text: newText, lastModified: moment.utc().toDate() }
        );
        return updateTabProp(state, values);
    },

    [ActionType.ToggleTodo]: (state: AppState, {payload: todo}: Action<Todo>): AppState => {
        const { id, text, completed } = todo;
        const curValues = getTabProp(state);
        const values = _.map(curValues, cur => cur.id !== id ? cur :
            { id, completed: !completed, text, lastModified: moment.utc().toDate() } 
        );
        return updateTabProp(state, values);
    },

    [ActionType.ToggleAll]: (state: AppState, action: Action<void>): AppState => {
        const { monthlyTasks, weeklyTasks, shopping, activeTab } = state;
        const areAllMarked = _.every(state.todos, todo => todo.completed);
        const curValues = getTabProp(state);
        const values: Todo[] = _.map(curValues, todo => (
            { id: todo.id, text: todo.text, completed: !areAllMarked, lastModified: moment.utc().toDate() }
        ));
        return updateTabProp(state, values);
    },

    [ActionType.ClearCompleted]: (state: AppState, action: Action<void>): AppState => {
        const curValues = getTabProp(state);
        const values = _.filter(curValues, todo => todo.completed === false);
        const { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter } = updateTabProp(state, values);
        return { 
            filter: filter === ShowCompleted ? ShowAll : filter,
            monthlyTasks, weeklyTasks, todos, shopping, activeTab 
        };
    },
    
    [ActionType.RefreshTimes]: (state: AppState, action: Action<void>): AppState => {
        // this is just to get the UI to redraw the timestamps, so no changes, but we have to return
        // a different state instance or redux decides that nothing changed and does not re-render
        const { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter } = state;
        return { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter };
    },
    
    [ActionType.ChangeTab]: (state: AppState, action: Action<TabType>): AppState => {
        const { monthlyTasks, weeklyTasks, todos, shopping, filter } = state;
        return { monthlyTasks, weeklyTasks, todos, shopping, activeTab: action.payload, filter };
    },
    
    [ActionType.SetFilter]: (state: AppState, action: Action<FilterType>): AppState => {
        const { monthlyTasks, weeklyTasks, todos, shopping, activeTab } = state;
        return { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter: action.payload };
    }
}, initialState);
