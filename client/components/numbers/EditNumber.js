import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';

import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Card from 'react-md/lib/Cards/Card';
import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';
import Toolbar from 'react-md/lib/Toolbars';
import Subheader from 'react-md/lib/Subheaders';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import ListItemControl from 'react-md/lib/Lists/ListItemControl';

import { createQueues, createRoutes, fetchRoutes, setSnackbar } from '../../actions';
import { renderTextField, renderSelectField, renderCheckbox, styles } from '../reusables';
import { stripSpecialChars, normalizeCallerId } from '../../constants/formFunctions';

import RoundRobinDialog from './RoundRobin';

const title = 'Edit number';

class EditNumbers extends Component {
    constructor() {
        super();

        this.state = {
            routeDialog: false,
        };

        this.toggleRoundRobin = this.toggleRoundRobin.bind(this);
        this.submitRoundRobin = this.submitRoundRobin.bind(this);
    }

    toggleRoundRobin() {
        this.setState({
            routeDialog: !this.state.routeDialog,
        });
    }

    submitRoundRobin(queue) {
        console.log(queue);
        this.props.createQueues({ ...queue, next: {
            responseType: 'queue',
            type: createRoutes.request,
            payload: {
                name: queue.name,
                rules: [{
                    actions: [{
                        action: 'queue',
                    }],
                }],
                next: {
                    memo: 'memo',
                    type: fetchRoutes.request,
                    payload: {
                        next: {
                            type: 'change',
                            form: 'editNumbers',
                            field: 'route',
                        },
                    },
                },
            },
        } });
    }

    render() {
        const { handleSubmit, onHide, visible } = this.props;
        const smallScreen = (document.documentElement.clientWidth <= 550);
        const closeButton = <Button icon type="button" onClick={onHide}>cancel</Button>;
        const submitButton = <Button flat primary label="submit" type="submit" />;
        return (
            <Dialog
                id="editNumber"
                fullPage={!!smallScreen}
                title={smallScreen ? title : undefined}
                aria-labelledby="dialogHeader"
                className="md-grid"
                dialogStyle={smallScreen ? styles.fullPageStyle : styles.dialogStyle}
                visible={visible}
                onHide={onHide}
                contentClassName="md-dialog-content--padded"
            >
                <form onSubmit={handleSubmit}>
                    {smallScreen &&
                        <Toolbar
                            colored
                            nav={closeButton}
                            actions={[submitButton]}
                            title={this.props.initialValues.phone_number}
                            fixed
                        />
                    }
                    <div className={smallScreen ? 'md-toolbar-relative' : ''}>
                        {!smallScreen &&
                            <header>
                                <h2 id="dialogHeader">{title}</h2>
                                <h3>Number: {this.props.initialValues.phone_number}</h3>
                            </header>
                        }
                        <Field
                            component={renderTextField}
                            className="md-cell--12"
                            name="name"
                            id="name"
                            label="Nickname"
                            required
                        />
                        <Field
                            component={renderSelectField}
                            className="md-cell--12"
                            name="route"
                            id="route"
                            label="Route"
                            menuItems={this.props.routes}
                            itemLabel="name"
                            itemValue="id"
                            required
                        />
                        <div style={{ textAlign: 'center' }}>
                            <Button
                                raised
                                onClick={this.toggleRoundRobin}
                                label="new round robin queue"
                                disabled={this.props.editing}
                            />
                        </div>
                        <Field
                            component={renderSelectField}
                            className="md-cell--12"
                            type="extension"
                            name="sms_forwarding"
                            id="sms_forwarding"
                            label="SMS forwarding extension"
                            menuItems={this.props.extensions}
                            itemLabel="name"
                            itemValue="id"
                        />
                        <Field
                            component={renderTextField}
                            className="md-cell--12"
                            name="caller_id_name"
                            id="caller_id_name"
                            label="Caller ID name"
                            maxLength={15}
                            normalize={normalizeCallerId}
                        />
                        <List
                            className="md-paper--1"
                            style={{ marginTop: '20px' }}
                        >
                            <Subheader primary primaryText="Call Blocking" />
                            <ListItemControl
                                primaryAction={
                                    <Field
                                        component={renderCheckbox}
                                        name="block_anonymous"
                                        id="block_anonymous"
                                        label="Block anonymous calls"
                                    />
                                }
                                tileStyle={{ padding: 0 }}
                            />
                            <ListItemControl
                                primaryAction={
                                    <Field
                                        component={renderCheckbox}
                                        name="block_incoming"
                                        id="block_incoming"
                                        label="Block all incoming calls"
                                    />
                                }
                                tileStyle={{ padding: 0 }}
                            />
                        </List>
                        <Card
                            style={{ margin: '20px auto'}}
                        >
                            <Subheader component="h4" primary primaryText="Call Notifications" />
                            <Field
                                style={{ padding: '0 16px' }}
                                component={renderTextField}
                                name="call_notifications_emails"
                                id="call_notifications_emails"
                                label="Email (separate multiple addresses with commas)"
                            />
                            <Field
                                style={{ padding: '0 16px' }}
                                component={renderTextField}
                                name="call_notifications_sms"
                                id="call_notifications_sms"
                                label="SMS (single phone number)"
                            />
                        </Card>
                    </div>
                    {this.props.editing &&
                        <LinearProgress id="submitting-edit" />
                    }
                    <div style={{ float: 'right' }}>
                        <Button
                            flat
                            className="md-cell--right"
                            label="cancel"
                            type="button"
                            onClick={onHide}
                            disabled={this.props.editing}
                        />
                        <Button
                            flat
                            primary
                            className="md-cell--right"
                            label="submit"
                            type="submit"
                            disabled={this.props.editing}
                        />
                    </div>
                </form>
                <RoundRobinDialog
                    visible={this.state.routeDialog}
                    onHide={this.toggleRoundRobin}
                    submit={this.submitRoundRobin}
                    initialValues={{
                        name: `${this.props.initialValues.name} round robin`,
                    }}
                />
            </Dialog>
        );
    }
}

const mapStateToProps = state => ({
    routeMessage: state.routes.message,
    submittingRoute: state.queues.editing || state.routes.editing,
    editing: state.numbers.editing,
});

const mapDispatchToProps = {
    createQueues: createQueues.request,
    createRoutes: createRoutes.request,
    setSnackbar,
};

EditNumbers = reduxForm({
    form: 'editNumbers',
    enableReinitialize: true,
})(EditNumbers);

export default connect(mapStateToProps, mapDispatchToProps)(EditNumbers);
