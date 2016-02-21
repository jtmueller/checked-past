'use strict';
import * as React from 'react';

import { Todo } from '../models/todos';
import TodoItem from './TodoItem';
import Footer from './Footer';

import {
    SHOW_ALL,
    SHOW_COMPLETED,
    SHOW_ACTIVE
} from '../constants/TodoFilters';

const TODO_FILTERS = {
    [SHOW_ALL]: () => true,
    [SHOW_ACTIVE]: (todo: Todo) => !todo.completed,
    [SHOW_COMPLETED]: (todo: Todo) => todo.completed
};

interface MainSectionProps {
    readonly todos: ReadonlyArray<Todo>;
    readonly actions: any;
}

interface MainSectionState {
    readonly filter: string;
}

class MainSection extends React.Component<MainSectionProps, MainSectionState> {
    constructor(props, context) {
        super(props, context);
        this.state = { filter: SHOW_ALL };
    }

    handleClearCompleted() {
        const atLeastOneCompleted = _.some(this.props.todos, todo => todo.completed);
        if (atLeastOneCompleted) {
            this.props.actions.clearCompleted();
        }
    }

    handleShow(filter) {
        this.setState({ filter });
    }

    renderToggleAll(completedCount: number) {
        const { todos, actions } = this.props;
        if (todos.length > 0) {
            return (
                <input className="toggle-all"
                    type="checkbox"
                    checked={completedCount === todos.length}
                    onChange={() => actions.completeAll() } />
            );
        }
    }

    renderFooter(completedCount: number) {
        const { todos } = this.props;
        const { filter } = this.state;
        const activeCount = todos.length - completedCount;

        if (todos.length) {
            return (
                <Footer completedCount={completedCount}
                    activeCount={activeCount}
                    filter={filter}
                    onClearCompleted={ this.handleClearCompleted.bind(this) }
                    onShow={ this.handleShow.bind(this) } />
            );
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    render() {
        const { todos, actions } = this.props;
        const { filter } = this.state;

        const filteredTodos = _.filter(todos, TODO_FILTERS[filter]);
        const completedCount = _.reduce(todos, (count: number, todo): number =>
            todo.completed ? count + 1 : count, 0
        );
        
        return (
            <section className="main">
                { this.renderToggleAll(completedCount) }
                <ul className="todo-list">
                    {_.map(filteredTodos, todo =>
                        <TodoItem key={todo.id} todo={todo} { ...actions }/>
                    )}
                </ul>
                { this.renderFooter(completedCount) }
            </section>
        );
    }
}

export default MainSection;
