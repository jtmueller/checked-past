'use strict';

import * as React from 'react';
import * as classNames from 'classnames';

interface TodoTextInputProps {
    readonly onSave: Function;
    readonly text?: string;
    readonly placeholder?: string,
    readonly editing?: boolean;
    readonly newTodo?: boolean;
}

interface TodoTextInputState {
    readonly text: string;
}

class TodoTextInput extends React.Component<TodoTextInputProps, TodoTextInputState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: this.props.text || ''
        };
    }

    handleSubmit(e) {
        const text = e.target.value.trim();
        if (e.which === 13) {
            this.props.onSave(text);
            if (this.props.newTodo) {
                this.setState({ text: '' });
            }
        }
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    handleBlur(e) {
        if (!this.props.newTodo) {
            this.props.onSave(e.target.value);
        }
    }

    render() {
        return (
            <input className={classNames({
                    edit: this.props.editing,
                    'new-todo': this.props.newTodo
                })}
                type="text"
                placeholder={this.props.placeholder}
                autoFocus={true}
                value={this.state.text}
                onBlur={this.handleBlur.bind(this) }
                onChange={this.handleChange.bind(this) }
                onKeyDown={this.handleSubmit.bind(this) } />
        );
    }
}


export default TodoTextInput;