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
        const { tab, curUser: {name} } = this.props;
        let title = TabType[tab].toLowerCase();
        let slogan = `${name}'s Checked Past`;
        let placeholder = tab === TabType.Shopping ? 'What needs to be bought?' : 'What needs to be done?';
        return (
            <header className="header">
                <TodoTextInput
                    newTodo
                    weeklyTodo={this.props.tab === TabType.Weekly}
                    onSave={this.handleSave.bind(this)}
                    placeholder={placeholder} />
                <div className="watermark">
                    <h2>{title}</h2>
                    <span>{slogan}</span>
                </div>
            </header>
        );
    }
}

export default Header;
