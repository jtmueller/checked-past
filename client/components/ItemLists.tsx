'use strict';
import * as React from 'react';
import { ListGroup, ListGroupItem, PanelGroup, Panel, Badge } from 'react-bootstrap';
import * as _ from 'lodash';
import * as moment from 'moment';

import { Todo, TabType, Weekday } from '../models/todos';
import TodoItem from './TodoItem';

interface ItemListProps { todos: ReadonlyArray<Todo>, actions: any, tab: TabType };

export const BasicItemList = ({todos, actions, tab}: ItemListProps) => (
    <ListGroup>
        {_.map(todos, todo =>
            <ListGroupItem key={todo.id}>
                <TodoItem todo={todo} tab={tab} { ...actions }/>
            </ListGroupItem>
        )}
    </ListGroup>
);

export class WeekdayItemList extends React.Component<ItemListProps, { activeKey?: Weekday }> {
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