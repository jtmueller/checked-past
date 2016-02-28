'use strict';

import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';
import * as classNames from 'classnames';
import * as moment from 'moment';

import { Todo, TabType, Weekday, User, ActionContext } from '../models/todos';
import TodoTextInput from './TodoTextInput';

interface TodoItemProps {
    readonly todo: Todo;
    readonly tab: TabType;
    readonly user: User;
    readonly editTodo: Function;
    readonly deleteTodo: Function;
    readonly toggleTodo: Function;
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

    private handleDoubleClick() {
        this.setState({ editing: true });
    }

    private handleSave(ctx: ActionContext, todo: Todo, text: string, day?: Weekday) {
        if (text.length === 0) {
            this.props.deleteTodo(ctx, todo);
        } else {
            this.props.editTodo(ctx, todo, text, day);
        }
        this.setState({ editing: false });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    render() {
        const { todo, toggleTodo, deleteTodo, tab, user } = this.props;
        const ctx = { user, tab };
        
        let element: JSX.Element;
        if (this.state.editing) {
            element = (
                <TodoTextInput text={todo.text}
                    editing={this.state.editing} 
                    weeklyTodo={tab === TabType.Weekly} selectedWeekday={todo.weekday}
                    onSave={(text, day) => this.handleSave(ctx, todo, text, day) }/>
            );
        } else {
            let lastModified = moment(todo.lastModified).local().fromNow();
            element = (
                <div className="view">
                    <input className="toggle"
                        type="checkbox"
                        checked={todo.completed}
                        onChange={ () => toggleTodo(ctx, todo) } />
                    <label onDoubleClick={ this.handleDoubleClick.bind(this) }>
                        {todo.text}
                        <span className="lastModified">{lastModified}</span>
                    </label>
                    <button className="destroy"
                        onClick={ () => deleteTodo(ctx, todo) }>
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
