import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formValueSelector, destroy, focus } from 'redux-form';
import _ from 'lodash';

import Button from 'react-md/lib/Buttons';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardText from 'react-md/lib/Cards/CardText';

import { fetchRoutes, editRoutes, createRoutes, deleteRoutes, userLogout, setSnackbar } from '../../actions';

import Route from './Route';
import EditRoute from './EditRoutesNew';
import StatusMonitor from '../StatusMonitor';

class Routes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editForm: false,
            editRoute: {},
        };

        props.fetchRoutes();

        this.toggleOpenEdit = this.toggleOpenEdit.bind(this);
        this.getSubmitFunction = this.getSubmitFunction.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.apiMessage && !this.props.apiMessage) {
            console.log(newProps.apiMessage);
            this.setState({
                editForm: false,
                editRoute: {},
            });
            this.props.fetchRoutes();
        }
        if (newProps.error.status === 401) {
            newProps.userLogout();
        }
    }

    // parseRoute(route) {
    //     const parsedRoute = _.cloneDeep(route);
    //     _.forEach(route.rules[0].actions, item => {
    //         switch (item.action) {
    //         case 'greeting':
    //         case 'queue':
    //         case 'menu':
    //             item[item.action] = item[item.action].id;
    //             break;
    //         case 'hold':
    //             item.hold_music = item.hold_music.id;
    //         case 'disconnect':
    //         case 'directory':
    //         default:
    //             break;
    //         }
    //     });
    // }

    toggleOpenEdit(route) {
        if (this.state.editForm) {
            this.setState({
                editForm: false,
                editRoute: {},
            });
            this.props.resetForm('editRoute');
        } else {
            let editRoute = {};
            if (route) {
                editRoute = _.cloneDeep(route);
            }
            this.setState({
                editForm: true,
                editRoute,
            });
        }
    }

    mockSubmit(data) {
        console.log('Submitted data: ', data);
    }

    getSubmitFunction(route) {
        if (route) {
            return data => this.props.editRoutes(data);
        } else {
            return data => this.props.createRoutes(data);
        }
    }

    submit(route, edit) {
        if (edit) {
            this.props.editRoutes(route);
        } else {
            this.props.createRoutes(route);
        }
    }

    render() {
        return (
            <div className="md-grid">
                <Card style={{ maxWidth: '800px', margin: '0px auto' }} className="md-cell--12">
                    <CardTitle title="Routes" />
                    <StatusMonitor />
                    <CardText>
                        <Button raised onClick={() => this.toggleOpenEdit(null)} label="Add new route"  style={{ marginBottom: '10px' }}/>
                            {this.props.routes && this.props.routes.map((item) =>
                                <Route
                                    key={item.id}
                                    route={item}
                                    edit={() => this.toggleOpenEdit(item)}
                                    requestDelete={() => this.props.deleteRoutes(item.id)}
                                />
                            )}
                        <EditRoute
                            visible={this.state.editForm}
                            onHide={this.toggleOpenEdit}
                            submit={this.submit}
                            initialValues={this.state.editRoute/*}
                            queues={this.props.queues}
                            menus={this.props.menus}
                            media={this.props.media}
                            actionFields={this.props.actionFields}
                            focusField={this.props.focus*/}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

const select = formValueSelector('editRoute');

const mapStateToProps = state => ({
    error: state.routes.error,
    apiMessage: state.routes.message,
    loading: state.routes.loading,
    routes: state.routes.items,
    media: state.media.items,
    menus: state.menus.items,
    queues: state.queues.items,
    actionFields: select(state, 'actions'),
});

const mapDispatchToProps = {
    editRoutes: editRoutes.request,
    createRoutes: createRoutes.request,
    fetchRoutes: fetchRoutes.request,
    deleteRoutes: deleteRoutes.request,
    userLogout: userLogout,
    resetForm: destroy,
    setSnackbar,
    focus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
