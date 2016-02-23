'use strict';

import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';
import * as classNames from 'classnames';
import * as moment from 'moment';

import { Todo, TabType, Weekday } from '../models/todos';
import TodoTextInput from './TodoTextInput';

interface TodoItemProps {
    readonly todo: Todo;
    readonly tab: TabType;
    readonly editTodo: Function;
    readonly deleteTodo: Function;
    readonly completeTodo: Function;
}

interface TodoItemState {
    readonly editing: boolean;
}

class TodoItem extends React.Component<TodoItemProps, TodoItemState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            editing: false
        };
    }

    handleDoubleClick() {
        this.setState({ editing: true });
    }

    handleSave(todo: Todo, text: string, day?: Weekday) {
        if (text.length === 0) {
            this.props.deleteTodo(todo);
        } else {
            this.props.editTodo(todo, text, day);
        }
        this.setState({ editing: false });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    render() {
        const { todo, completeTodo, deleteTodo, tab } = this.props;
        
        let element: JSX.Element;
        if (this.state.editing) {
            element = (
                <TodoTextInput text={todo.text}
                    editing={this.state.editing} 
                    weeklyTodo={tab === TabType.Weekly} selectedWeekday={todo.weekday}
                    onSave={(text, day) => this.handleSave(todo, text, day) }/>
            );
        } else {
            let lastModified = moment(todo.lastModified).local().fromNow();
            element = (
                <div className="view">
                    <input className="toggle"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={ () => completeTodo(todo) } />
                    <label onDoubleClick={ this.handleDoubleClick.bind(this) }>
                        {todo.text}
                        <span className="lastModified">{lastModified}</span>
                    </label>
                    <button className="destroy"
                        onClick={ () => deleteTodo(todo) }>
                        <Glyphicon glyph="remove-sign" />
                    </button>
                </div>
            );
        }

        return (
            <div className={
                classNames({
                    completed: todo.completed,
                    editing: this.state.editing
                })
            }>{element}</div>
        );
    }
}

export default TodoItem;
