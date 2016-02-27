'use strict';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as React from 'react';
import { Grid, Row, Col, Panel, Button } from 'react-bootstrap';

import TodoTabs from '../components/TodoTabs';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/todos';
import { Todo, AppState } from '../models/todos';

const LoginPanel = ({ loginAction }) => (
    <Panel bsStyle="default" bsSize="md"
        header={<h3><small>Checked Past</small><br/><strong>Authentication</strong></h3>}>
        <span style={{ marginRight: 10 }}>Please sign in:</span>
        <Button bsStyle="danger" onClick={loginAction}>Google</Button>
    </Panel>
);

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
              <Col md={8} mdOffset={2} xs={12}>
                { state.curUser
                    ? <TodoTabs state={state} actions={actions} />
                    : <LoginPanel loginAction={actions.login} /> }
              </Col>
            </Row>
          </Grid>
        );
    }
}

const mapStateToProps = ({state: state}) => ({ state });

export default connect(mapStateToProps)(App);
