'use strict';

import * as _ from 'lodash';
import * as moment from 'moment';
import { handleActions } from 'redux-actions';

import { Action, Todo, AppState, TabType, Weekday, User } from '../models/todos';
import * as ActionType from '../constants/ActionTypes';
import { ShowAll, ShowCompleted, FilterType } from '../constants/TodoFilters';

interface TodoUpdate {
    tab: TabType;
    todo: Todo;
    prevId?: string;
}

const initialState: AppState = {
    monthlyTasks: [] as Todo[],
    weeklyTasks: [] as Todo[],
    todos: [] as Todo[],
    shopping: [] as Todo[],
    activeTab: TabType.Weekly,
    filter: 'show_all',
    size: { width: window.innerWidth, height: window.innerHeight }
};

function getTabProp(state:AppState, tab?: TabType) {
    //console.log('getTabProp', TabType[tab || state.activeTab], state);
    switch (tab || state.activeTab) {
        case TabType.Weekly: return state.weeklyTasks;
        case TabType.Monthly: return state.monthlyTasks;
        case TabType.Todos: return state.todos;
        case TabType.Shopping: return state.shopping;
        default:
            throw new Error(`Unknown tab type: '${state.activeTab}' (${TabType[state.activeTab]}).`);
    }
}

function updateTabProp(state: AppState, values: ReadonlyArray<Todo>, tab?: TabType): AppState {
    //console.log('setTabProp', TabType[tab || state.activeTab], values);
    let { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter, curUser, size } = state;
    switch (tab || state.activeTab) {
        case TabType.Weekly:
            weeklyTasks = values;
            break;
        case TabType.Monthly:
            monthlyTasks = values;
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
    return { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter, curUser, size };
}

export default handleActions<AppState>({
    [ActionType.AddTodo]: (state: AppState, action: Action<TodoUpdate>): AppState => {
        const { tab, todo, prevId } = action.payload;
        //console.log('AddTodo', TabType[tab], todo);
        const curValues = getTabProp(state, tab);
        //const lastIndex = prevId ? _.findIndex(curValues, t => t.id === prevId) : -1;
        
        const values = [...curValues, todo];
        return updateTabProp(state, values, tab);
    },

    [ActionType.DeleteTodo]: (state: AppState, action: Action<{tab: TabType; deleteId: string}>): AppState => {
        const { tab, deleteId } = action.payload;
        const curValues = getTabProp(state, tab);
        const values = _.filter(curValues, t => t.id !== deleteId);
        return updateTabProp(state, values, tab);
    },

    [ActionType.EditTodo]: (state: AppState, action: Action<TodoUpdate>): AppState => {
        const { tab, todo } = action.payload;
        const curValues = getTabProp(state, tab);
        const values = _.map(curValues, cur => cur.id === todo.id ? todo : cur);
        return updateTabProp(state, values, tab);
    },
    
    [ActionType.RefreshTimes]: (state: AppState, action: Action<void>): AppState => {
        // this is just to get the UI to redraw the timestamps, so no changes, but we have to return
        // a different state instance or redux decides that nothing changed and does not re-render
        const { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter, curUser, size } = state;
        return { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter, curUser, size };
    },
    
    [ActionType.ChangeTab]: (state: AppState, action: Action<TabType>): AppState => {
        const { monthlyTasks, weeklyTasks, todos, shopping, filter, curUser, size } = state;
        return { monthlyTasks, weeklyTasks, todos, shopping, activeTab: action.payload, filter, curUser, size };
    },
    
    [ActionType.SetFilter]: (state: AppState, action: Action<FilterType>): AppState => {
        const { monthlyTasks, weeklyTasks, todos, shopping, activeTab, curUser, size } = state;
        return { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter: action.payload, curUser, size };
    },
    
    [ActionType.Auth]: (state: AppState, action: Action<User>): AppState => {
        const { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter, size } = state;
        return { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter, curUser: action.payload, size };
    },
    
    [ActionType.Resize]: (state: AppState, action: Action<{ width: number, height: number }>): AppState => {
        const { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter, curUser } = state;
        return { monthlyTasks, weeklyTasks, todos, shopping, activeTab, filter, curUser, size: action.payload };
    }
}, initialState);
