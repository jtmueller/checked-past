'use strict';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import Header from '../components/Header';
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
                <Header addTodo={actions.addTodo} />
                <MainSection todos={state.todos} actions={actions} />
              </Col>
            </Row>
          </Grid>
        );
    }
}

const mapStateToProps = ({state: state}) => ({ state });

export default connect(mapStateToProps)(App);
