'use strict';
import * as React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

import { Todo, TabType } from '../models/todos';
import TodoItem from './TodoItem';
import Footer from './Footer';

import { ShowAll, ShowCompleted, ShowActive, FilterType } from '../constants/TodoFilters';

const TodoFilters = {
    [ShowAll]: () => true,
    [ShowActive]: (todo: Todo) => !todo.completed,
    [ShowCompleted]: (todo: Todo) => todo.completed
};

interface MainSectionProps {
    readonly todos: ReadonlyArray<Todo>;
    readonly tab: TabType;
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

    renderToggleAll(completedCount: number) {
        const { todos, actions } = this.props;
        if (todos.length > 0) {
            return (
                <ListGroupItem>
                <input className="toggle-all"
                    type="checkbox"
                    checked={completedCount === todos.length}
                    onChange={() => actions.toggleAll()} />
                </ListGroupItem>
            );
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    render() {
        const { todos, actions, filter, tab } = this.props;

        const filteredTodos = _.filter(todos, TodoFilters[filter]);
        const completedCount = _.reduce(todos, (count: number, todo:Todo) => 
            count + (todo.completed ? 1 : 0), 0);
        
        return (
            <section className="main">
                <ListGroup>
                    {_.map(filteredTodos, todo =>
                        <ListGroupItem key={todo.id}>
                            <TodoItem todo={todo} tab={tab} { ...actions }/>
                        </ListGroupItem>
                    )}
                </ListGroup>
            </section>
        );
    }
}

export default MainSection;
