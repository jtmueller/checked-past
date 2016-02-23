'use strict';
import * as React from 'react';
import { ListGroup, ListGroupItem, PanelGroup, Panel, Badge } from 'react-bootstrap';
import * as moment from 'moment';

import { Todo, TabType, Weekday } from '../models/todos';
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

interface ItemListProps { todos: ReadonlyArray<Todo>, actions: any, tab: TabType };

const BasicItemList = ({todos, actions, tab}: ItemListProps) => (
    <ListGroup>
        {_.map(todos, todo =>
            <ListGroupItem key={todo.id}>
                <TodoItem todo={todo} tab={tab} { ...actions }/>
            </ListGroupItem>
        )}
    </ListGroup>
);

class WeekdayItemList extends React.Component<ItemListProps, { activeKey?: Weekday }> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            activeKey: moment().weekday()
        };
    }
    
    private handleSelect = (activeKey) => {
        this.setState({ activeKey });
    };
    
    render() {
        const { todos, actions, tab } = this.props;
        const grouped = _.groupBy(todos, t => Weekday[t.weekday]);
        const days = _.sortBy(_.keys(grouped), dayName => Weekday[dayName]);
        const activeKey = _.some(todos, todo => todo.weekday === this.state.activeKey)
            ? this.state.activeKey : Weekday[days[0]];
        
        return (
            <PanelGroup activeKey={activeKey} onSelect={this.handleSelect} accordion>
                {_.map(days, day => {
                    let todos = grouped[day];
                    let unfinished = _.filter(todos, t => !t.completed).length;
                    let header = unfinished === 0 ? <span>{day}</span> : <span><Badge>{unfinished}</Badge> {day}</span>;
                    let key = Weekday[day];
                    return (
                        <Panel header={header} key={key} eventKey={key}>
                            <ListGroup fill>
                                {_.map(grouped[day], todo =>
                                    <ListGroupItem key={todo.id}>
                                        <TodoItem todo={todo} tab={tab} { ...actions }/>
                                    </ListGroupItem>
                                )}
                            </ListGroup>
                        </Panel>
                    );
                })}
            </PanelGroup>
        );  
    }
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
                <input className="toggle-all"
                    type="checkbox"
                    checked={completedCount === todos.length}
                    onChange={() => actions.toggleAll()} />
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
                {tab === TabType.Weekly
                    ? <WeekdayItemList todos={filteredTodos} tab={tab} actions={actions} />
                    : <BasicItemList todos={filteredTodos} tab={tab} actions={actions} /> }
            </section>
        );
    }
}

export default MainSection;
