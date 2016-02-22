'use strict';
import { FilterType } from '../constants/TodoFilters';

export interface Todo {
    readonly id?: number;
    readonly text: string;
    readonly completed: boolean;
    readonly lastModified: Date;
    readonly resetDate?: Date;
}

export enum TabType {
    /** Montly tasks reset on the first of each month. */
    Monthly,
    /** Weekly tasks reset on the associated weekday (once per week). */
    Weekly, 
    /** General to-dos do not auto-reset. */
    Todos, 
    /** Shopping lists do not auto-reset. */
    Shopping
}

export interface AppState {
    readonly monthlyTasks: ReadonlyArray<Todo>;
    readonly weeklyTasks: ReadonlyArray<Todo>;
    readonly todos: ReadonlyArray<Todo>;
    readonly shopping: ReadonlyArray<Todo>;
    readonly activeTab: TabType;
    readonly filter: FilterType;
}
