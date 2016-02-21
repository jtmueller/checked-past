'use strict';

import * as React from 'react';
import * as classNames from 'classnames';

import {
    SHOW_ALL,
    SHOW_COMPLETED,
    SHOW_ACTIVE,
    TodoFilter
} from '../constants/TodoFilters';

const FILTER_TITLES = {
    [SHOW_ALL]: 'All',
    [SHOW_ACTIVE]: 'Active',
    [SHOW_COMPLETED]: 'Completed'
};


interface FooterProps {
    readonly completedCount: number;
    readonly activeCount: number;
    readonly filter: string;
    readonly onClearCompleted: Function;
    readonly onShow: Function;
}

const TodoCount = ({ activeCount }: { activeCount: number }) => {
    const itemWord = activeCount === 1 ? 'item' : 'items';

    return (
        <span className="todo-count">
            <strong>{activeCount || 'No'}</strong> {itemWord} left
        </span>
    );  
};

interface FilterLinkArgs {
    filter: string, isSelected: boolean, onShow: Function
}

const FilterLink = ({filter, isSelected, onShow}: FilterLinkArgs) => {
    const title = FILTER_TITLES[filter];
    return (
        <a className={classNames({ selected: isSelected }) }
            style={{ cursor: 'pointer' }}
            onClick={() => onShow(filter) }>
            {title}
        </a>
    );
};

class Footer extends React.Component<FooterProps, any> {

    renderClearButton() {
        const { completedCount, onClearCompleted } = this.props;
        if (completedCount > 0) {
            return (
                <button className="clear-completed"
                    onClick={() => onClearCompleted() }>
                    Clear completed
                </button>
            );
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.activeCount !== nextProps.activeCount
            || this.props.completedCount !== nextProps.completedCount
            || this.props.filter !== nextProps.filter;
    }

    render() {
        const { activeCount, filter, onShow } = this.props;
        return (
            <footer className="footer">
                <TodoCount activeCount={activeCount} />
                <ul className="filters">
                    {[SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED].map(cur =>
                        <li key={cur}>
                            <FilterLink filter={cur} isSelected={cur === filter} onShow={onShow} />
                        </li>
                    )}
                </ul>
                { this.renderClearButton() }
            </footer>
        );
    }
}

export default Footer;
