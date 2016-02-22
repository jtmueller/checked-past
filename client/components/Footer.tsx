'use strict';

import * as React from 'react';
import * as classNames from 'classnames';
import { Nav, NavItem, Button } from 'react-bootstrap';

import { Todo } from '../models/todos';
import { ShowAll, ShowCompleted, ShowActive, FilterType } from '../constants/TodoFilters';

const FilterTitles = {
    [ShowAll]: 'All',
    [ShowCompleted]: 'Completed',
    [ShowActive]: 'Active'
};

interface FooterProps {
    readonly todos: ReadonlyArray<Todo>;
    readonly filter: FilterType;
    readonly clearCompleted: Function;
    readonly setFilter: Function;
}

class Footer extends React.Component<FooterProps, void> {

    private renderClearButton(completedCount: number) {
        if (completedCount > 0) {
            return (
                <Button className="pull-right clear-button"
                    onClick={this.handleClearCompleted}>
                    Clear completed
                </Button>
            );
        }
    }
    
    private handleClearCompleted = () => {
        const atLeastOneCompleted = _.some(this.props.todos, todo => todo.completed);
        if (atLeastOneCompleted) {
            this.props.clearCompleted();
        }
    }
    
    private handleSelect = (selectedKey) => {
        this.props.setFilter(selectedKey);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.filter !== nextProps.filter
            || this.props.todos !== nextProps.todos;
    }

    render() {
        const { todos, filter } = this.props;
        const completedCount = _.reduce(todos, (count: number, todo:Todo) => 
            count + (todo.completed ? 1 : 0), 0);
        const activeCount = todos.length - completedCount;
        
        return (
            <footer className="clearfix">
                { this.renderClearButton(completedCount) }
                <Nav bsStyle="pills" activeKey={filter} onSelect={this.handleSelect}>
                    {[ShowAll, ShowActive, ShowCompleted].map(cur =>
                        <NavItem key={cur} eventKey={cur}>{FilterTitles[cur]}</NavItem>
                    )}
                </Nav>
            </footer>
        );
    }
}

export default Footer;
