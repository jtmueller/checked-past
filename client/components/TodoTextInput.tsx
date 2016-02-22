'use strict';

import * as React from 'react';
import { Button, Glyphicon, Input } from 'react-bootstrap';

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

    private handleKey(e) {
        const text = e.target.value.trim();
        if (e.which === 13) { // enter
            this.props.onSave(text);
            if (this.props.newTodo) {
                this.setState({ text: '' });
            }
        }
    }

    private handleChange(e) {
        this.setState({ text: e.target.value });
    }
    
    private handleClick() {
        this.props.onSave(this.state.text);
        this.setState({ text: '' });
    }

    render() {
        let saveBtn = <Button onClick={this.handleClick.bind(this)}><Glyphicon glyph="chevron-right"/></Button>;
        return (
            <Input
                type="text"
                placeholder={this.props.placeholder}
                value={this.state.text}
                onChange={this.handleChange.bind(this)}
                onKeyDown={this.handleKey.bind(this)}
                buttonAfter={saveBtn} />
        );
    }
}


export default TodoTextInput;