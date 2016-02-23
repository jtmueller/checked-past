'use strict';
import { FilterType } from '../constants/TodoFilters';

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

export enum Weekday {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}

export interface Todo {
    readonly id?: number;
    readonly text: string;
    readonly completed: boolean;
    readonly lastModified: Date;
    readonly weekday?: Weekday
}

export interface AppState {
    readonly monthlyTasks: ReadonlyArray<Todo>;
    readonly weeklyTasks: ReadonlyArray<Todo>;
    readonly todos: ReadonlyArray<Todo>;
    readonly shopping: ReadonlyArray<Todo>;
    readonly activeTab: TabType;
    readonly filter: FilterType;
}
