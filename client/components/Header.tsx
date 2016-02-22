'use strict';

import * as React from 'react';
import TodoTextInput from './TodoTextInput';
import { TabType } from '../models/todos';

interface HeaderProps {
    addTodo: Function;
    tab: TabType;
};

class Header extends React.Component<HeaderProps, any> {
    handleSave(text) {
        if (text.length !== 0) {
            this.props.addTodo(text);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.tab !== nextProps.tab;
    }

    render() {
        let title = TabType[this.props.tab].toLowerCase();
        return (
            <header className="header">
                <h2 className="tab-head">{title}</h2>
                <TodoTextInput
                    newTodo
                    onSave={this.handleSave.bind(this) }
                    placeholder="What needs to be done?" />
            </header>
        );
    }
}

export default Header;
