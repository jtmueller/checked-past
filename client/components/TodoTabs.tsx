'use strict';
import * as React from 'react';
import { Nav, NavItem, Badge, Panel, PanelGroup } from 'react-bootstrap';
import * as _ from 'lodash';

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
    private getSelectedTodos(tab:TabType) {
        const state = this.props.state;
        switch (tab) {
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
        const { state: {filter, activeTab, curUser}, actions: {clearCompleted, setFilter, uncheckAll} } = this.props;
        return (
            <Footer tab={activeTab} user={curUser} {...{ todos, filter, clearCompleted, setFilter, uncheckAll }} />
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
                    <UndoneBadge count={weeklyCount} /> Weekly
                </NavItem>
                <NavItem key={1} eventKey={TabType.Monthly} title="Monthly tasks reset to incomplete on the first of every month.">
                    <UndoneBadge count={monthlyCount} /> Monthly
                </NavItem>
                <NavItem key={2} eventKey={TabType.Todos}>
                    <UndoneBadge count={todoCount} /> Todos
                </NavItem>
                <NavItem key={3} eventKey={TabType.Shopping}>
                    <UndoneBadge count={shoppingCount} /> Shopping
                </NavItem>
            </Nav>
        ); 
    }
    
    private renderContent(tab:TabType) {
        const { actions, state } = this.props;
        const todos = this.getSelectedTodos(tab);
        
        return [
            <Header key={0} addTodo={actions.addTodo} tab={tab} curUser={state.curUser} />,
            <MainSection key={1} todos={todos} tab={tab} user={state.curUser} actions={actions} filter={state.filter} />
        ]
    }
    
    private renderAccPanel(tab:TabType) {
        const { actions, state } = this.props;
        const todos = this.getSelectedTodos(tab);
        const count = this.countUndone(todos);
        return (
            <Panel key={tab} eventKey={tab} className="todo-list"
                header={<span><UndoneBadge count={count} /> {TabType[tab]}</span>}
                footer={tab === state.activeTab ? this.renderFooter(todos) : null}>
                {this.renderContent(tab)}
            </Panel>
        );   
    }
    
    private renderAccordion() {
        const { state } = this.props;
        return (
            <PanelGroup activeKey={state.activeTab} onSelect={this.handleSelect} accordion>
                { _.map([TabType.Weekly, TabType.Monthly, TabType.Todos, TabType.Shopping], t => this.renderAccPanel(t)) }
            </PanelGroup>
        );
    }
    
    render() {
        const { actions, state } = this.props;
        
        if (state.size.width < 480) {
            return this.renderAccordion();
        }

        const todos = this.getSelectedTodos(state.activeTab);

        return (
            <div>
                {this.renderTabs(state)}
                <div className="tab-content">
                    <Panel className="todo-list tab-pane active" footer={this.renderFooter(todos)}>
                        {this.renderContent(state.activeTab)}
                    </Panel>
                </div>
            </div>
        );
    }
}

export default TodoTabs;
