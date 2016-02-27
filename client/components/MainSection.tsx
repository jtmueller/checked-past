'use strict';
import * as React from 'react';
import * as _ from 'lodash';

import { Todo, TabType, Weekday, User } from '../models/todos';
import { BasicItemList, WeekdayItemList } from './ItemLists';
import { ShowAll, ShowCompleted, ShowActive, FilterType } from '../constants/TodoFilters';

const TodoFilters = {
    [ShowAll]: () => true,
    [ShowActive]: (todo: Todo) => !todo.completed,
    [ShowCompleted]: (todo: Todo) => todo.completed
};

interface MainSectionProps {
    readonly todos: ReadonlyArray<Todo>;
    readonly tab: TabType;
    readonly user: User;
    readonly actions: any;
    readonly filter: FilterType;
}

class MainSection extends React.Component<MainSectionProps, void> {
    handleClearCompleted() {
        const atLeastOneCompleted = _.some(this.props.todos, todo => todo.completed);
        if (atLeastOneCompleted) {
            this.props.actions.clearCompleted();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    render() {
        const { todos, actions, filter, tab, user } = this.props;

        const filteredTodos = _.filter(todos, TodoFilters[filter]);
        const completedCount = _.reduce(todos, (count: number, todo:Todo) => 
            count + (todo.completed ? 1 : 0), 0);
        
        return (
            <section className="main">
                {tab === TabType.Weekly
                    ? <WeekdayItemList todos={filteredTodos} tab={tab} user={user} actions={actions} />
                    : <BasicItemList todos={filteredTodos} tab={tab} user={user} actions={actions} /> }
            </section>
        );
    }
}

export default MainSection;
