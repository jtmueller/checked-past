'use strict';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import TodoTabs from '../components/TodoTabs';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/todos';
import { Todo, AppState } from '../models/todos';

interface AppProps {
    state?: AppState;
    dispatch?: Redux.Dispatch;
}

class App extends React.Component<AppProps, any> {
    render() {
        const { state, dispatch } = this.props;
        const actions = bindActionCreators(TodoActions, dispatch);
        
        return (
          <Grid>
            <Row>
              <Col md={8} mdOffset={2} xs={10} xsOffset={1}>
                <TodoTabs state={state} actions={actions} />
              </Col>
            </Row>
          </Grid>
        );
    }
}

const mapStateToProps = ({state: state}) => ({ state });

export default connect(mapStateToProps)(App);
