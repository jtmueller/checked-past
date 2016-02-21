'use strict';
import * as React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

import { AppState, TabType } from '../models/todos';
import MainSection from './MainSection';
import Header from './Header';

interface TodoTabProps {
    readonly state: AppState;
    readonly actions: any;
}

class TodoTabs extends React.Component<TodoTabProps, void> {  
    private getSelectedTodos() {
        const state = this.props.state;
        switch (state.activeTab) {
            case TabType.Monthly:
                return state.monthlyTasks;
            case TabType.Weekly:
                return state.weeklyTasks;
            case TabType.Todos:
                return state.todos;
            case TabType.Shopping:
                return state.shopping;
            default:
                throw new Error(`Unknown tab type: '${state.activeTab}'.`);
        }
    }
    
    private handleSelect = (selectedKey) => {
        const { changeTab } = this.props.actions;
        changeTab(selectedKey);
    }
    
    render () {
        const todos = this.getSelectedTodos();
        const { actions, state: { activeTab }} = this.props;
        return (
            <div>
            <Nav bsStyle="tabs" activeKey={activeTab} onSelect={this.handleSelect}>
                <NavItem eventKey={TabType.Monthly}>Monthly</NavItem>
                <NavItem eventKey={TabType.Weekly}>Weekly</NavItem>
                <NavItem eventKey={TabType.Todos}>Todos</NavItem>
                <NavItem eventKey={TabType.Shopping}>Shopping</NavItem>
            </Nav>
            <Header addTodo={actions.addTodo} />
            <MainSection todos={todos} actions={actions} />
            </div>
        );
    }
}

export default TodoTabs;
