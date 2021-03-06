'use strict';
import { FilterType } from '../constants/TodoFilters';

export enum TabType {
    /** Montly tasks reset on the first of each month. */
    Monthly = 1,
    /** Weekly tasks reset on the associated weekday (once per week). */
    Weekly = 2, 
    /** General to-dos do not auto-reset. */
    Todos = 3, 
    /** Shopping lists do not auto-reset. */
    Shopping = 4
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
    readonly id?: string;
    readonly text: string;
    readonly completed: boolean;
    readonly lastModified: number;
    readonly weekday?: Weekday
}

export interface User {
    readonly userId: string;
    readonly name: string;
    readonly avatarUrl: string;
}

export interface AppState {
    readonly monthlyTasks: ReadonlyArray<Todo>;
    readonly weeklyTasks: ReadonlyArray<Todo>;
    readonly todos: ReadonlyArray<Todo>;
    readonly shopping: ReadonlyArray<Todo>;
    readonly activeTab: TabType;
    readonly filter: FilterType;
    readonly curUser?: User;
    readonly size: { readonly width: number, readonly height: number }
}

export interface Action<T> {
    readonly type: string;
    readonly payload?: T;
    readonly error?: boolean;
    readonly meta?: any;
}

export type Dispatcher<T> = (action:Action<T>) => void;

export interface ActionContext {
    readonly user: User;
    readonly tab: TabType;
}
