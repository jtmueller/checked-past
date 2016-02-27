'use strict';

import * as React from 'react';
import TodoTextInput from './TodoTextInput';
import { TabType, User } from '../models/todos';

interface HeaderProps {
    addTodo: Function;
    tab: TabType;
    curUser: User;
};

class Header extends React.Component<HeaderProps, void> {
    handleSave(text, day) {
        if (text.length !== 0) {
            const { tab, curUser, addTodo } = this.props;
            addTodo({ user: curUser, tab }, text, day);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.tab !== nextProps.tab;
    }

    render() {
        const { name } = this.props.curUser;
        let title = TabType[this.props.tab].toLowerCase();
        let slogan = `${name}'s Checked Past`
        return (
            <header className="header">
                <TodoTextInput
                    newTodo
                    weeklyTodo={this.props.tab === TabType.Weekly}
                    onSave={this.handleSave.bind(this)}
                    placeholder="What needs to be done?" />
                <div className="watermark">
                    <h2>{title}</h2>
                    <span>{slogan}</span>
                </div>
            </header>
        );
    }
}

export default Header;
