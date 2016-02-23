'use strict';
import * as React from 'react';
import { Nav, NavItem, Badge, Panel } from 'react-bootstrap';

import { AppState, TabType, Todo } from '../models/todos';
import MainSection from './MainSection';
import Header from './Header';
import Footer from './Footer';

interface TodoTabProps {
    readonly state: AppState;
    readonly actions: any;
}

const UndoneBadge = ({count}: {count:number}) => count > 0 ? <Badge>{count}</Badge> : <span/>;

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
    
    private countUndone(tasks: ReadonlyArray<Todo>) {
        return _.reduce(tasks, (acc, t) => acc + (t.completed ? 0 : 1), 0);
    }
    
    private renderFooter(todos: ReadonlyArray<Todo>) {
        const { state: {filter, activeTab}, actions: {clearCompleted, setFilter} } = this.props;
        return (
            <Footer tab={activeTab} {...{ todos, filter, clearCompleted, setFilter }} />
        );
    }
    
    private renderTabs(state:AppState) {
        let monthlyCount = this.countUndone(state.monthlyTasks);
        let weeklyCount = this.countUndone(state.weeklyTasks);
        let todoCount = this.countUndone(state.todos);
        let shoppingCount = this.countUndone(state.shopping);
        return (
            <Nav bsStyle="tabs" activeKey={state.activeTab} onSelect={this.handleSelect}>
                <NavItem key={0} eventKey={TabType.Weekly} title="Weekly tasks reset to incomplete every week at midnight on the specified day.">
                    Weekly <UndoneBadge count={weeklyCount} />
                </NavItem>
                <NavItem key={1} eventKey={TabType.Monthly} title="Monthly tasks reset to incomplete on the first of every month.">
                    Monthly <UndoneBadge count={monthlyCount} />
                </NavItem>
                <NavItem key={2} eventKey={TabType.Todos}>
                    Todos <UndoneBadge count={todoCount} />
                </NavItem>
                <NavItem key={3} eventKey={TabType.Shopping}>
                    Shopping <UndoneBadge count={shoppingCount} />
                </NavItem>
            </Nav>
        ); 
    }
    
    render () {
        const todos = this.getSelectedTodos();
        const { actions, state } = this.props;

        return (
            <div>
                {this.renderTabs(state)}
                <div className="tab-content">
                    <Panel className="todo-list tab-pane active"
                        footer={this.renderFooter(todos)}>
                        <Header addTodo={actions.addTodo} tab={state.activeTab} />
                        <MainSection todos={todos} tab={state.activeTab} actions={actions} filter={state.filter} />
                    </Panel>
                </div>
            </div>
        );
    }
}

export default TodoTabs;
