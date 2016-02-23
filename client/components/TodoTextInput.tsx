'use strict';

import * as React from 'react';
import { Button, Glyphicon, Input, DropdownButton, MenuItem } from 'react-bootstrap';
import { Weekday } from '../models/todos';

interface TodoTextInputProps {
    readonly onSave: Function;
    readonly text?: string;
    readonly placeholder?: string,
    readonly editing?: boolean;
    readonly newTodo?: boolean;
    readonly weeklyTodo?: boolean;
    readonly selectedWeekday?: Weekday;
}

interface TodoTextInputState {
    readonly text?: string;
    readonly day?: Weekday;
}

class TodoTextInput extends React.Component<TodoTextInputProps, TodoTextInputState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            text: this.props.text || '',
            day: this.props.selectedWeekday || Weekday.Monday
        };
    }

    private handleKey = (e) => {
        const text = e.target.value.trim();
        if (e.which === 13) { // enter
            this.props.onSave(text, this.state.day);
            if (this.props.newTodo) {
                this.setState({ text: '' });
            }
        }
    }

    private handleChange = (e) => {
        this.setState({ text: e.target.value });
    }
    
    private handleSaveClick = () => {
        const { text, day } = this.state;
        this.props.onSave(text, day);
        this.setState({ text: '' });
    }
    
    private handleDaySelect(day:Weekday) {
        this.setState({ day });
    }
    
    private renderWeekdayMenu() {
        if (this.props.weeklyTodo) {
            const selectedWeekday = this.state.day || this.props.selectedWeekday || Weekday.Monday;
            
            return (
                <DropdownButton title={Weekday[selectedWeekday]} id="weekday">
                    {_.map([Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday], day => (
                        <MenuItem key={day} onSelect={() => this.handleDaySelect(day)}>{Weekday[day]}</MenuItem>
                    ))}
                </DropdownButton>
            );
        }
    }

    render() {
        const saveBtn = <Button onClick={this.handleSaveClick}><Glyphicon glyph="chevron-right"/></Button>;
        const dayMenu = this.renderWeekdayMenu();
        
        return (
            <Input
                type="text"
                placeholder={this.props.placeholder}
                value={this.state.text}
                onChange={this.handleChange}
                onKeyDown={this.handleKey}
                buttonBefore={dayMenu}
                buttonAfter={saveBtn} />
        );
    }
}


export default TodoTextInput;