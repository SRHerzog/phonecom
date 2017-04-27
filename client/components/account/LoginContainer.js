import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardText from 'react-md/lib/Cards/CardText';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';

import { userLogin, createAccount } from '../../actions';

import Login from './Login';
import Register from './Register';

class LoginContainer extends Component {
    constructor() {
        super();

        this.state = {
            tab: 0,
        };

        this.handleTabChange = this.handleTabChange.bind(this);
    }

    handleTabChange(tab) {
        this.setState({ tab });
    }

    render() {
        return (
            <Card style={{ maxWidth: '360px', margin: '20px auto' }}>
                <CardTitle title={!this.state.tab ? 'Login' : 'Register account'} />
                <CardText>
                    <TabsContainer
                        onTabChange={this.handleTabChange}
                        visibleTabIndex={this.state.tab}
                        colored
                    >
                        <Tabs tabId="tab">
                            <Tab label="login">
                                <Login
                                    {...this.props}
                                />
                            </Tab>
                            <Tab label="register">
                                <Register
                                    {...this.props}
                                />
                            </Tab>
                        </Tabs>
                    </TabsContainer>
                </CardText>
            </Card>
        );
    }
}

const mapDispatchToProps = {
    userLogin: userLogin.request,
    createAccount: createAccount.request,
};

export default connect(null, mapDispatchToProps)(LoginContainer);
