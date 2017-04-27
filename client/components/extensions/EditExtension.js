import React, { Component } from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';
import Toolbar from 'react-md/lib/Toolbars';

import { getRoutesById } from '../../reducers/routes';
import { editRoutes, createRoutes, fetchRoutes, setSnackbar } from '../../actions';
import { renderTextField, renderSelectField, renderCheckbox, styles } from '../reusables';
import timeZones from '../../constants/timeZones';
import { integerNormalizer } from '../../constants/formFunctions';

import EditRoute from '../routes/EditRoutesNew';

const title = 'Add/edit extension';

class EditExtension extends Component {
    constructor() {
        super();

        this.state = {
            routeDialog: false,
            editRoute: {},
        };

        this.toggleOpenRoute = this.toggleOpenRoute.bind(this);
        this.submitRoute = this.submitRoute.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.routesMessage !== newProps.routesMessage && newProps.routesMessage === 'success') {
            this.props.setSnackbar('Route updated successfully.');
            this.setState({
                routeDialog: false,
            });
        }
    }

    toggleOpenRoute(route = {}) {
        this.setState({
            editRoute: route,
            routeDialog: !this.state.routeDialog,
        });
    }

    submitRoute(route, edit) {
        if (!edit) {
            this.props.createRoutes({ ...route, next: {
                memo: 'memo',
                type: fetchRoutes.request,
                payload: {
                    next: {
                        type: 'change',
                        form: 'editExtension',
                        field: 'route.id',
                    },
                },
            } });
        } else {
            this.props.editRoutes({ ...route, next: {
                type: fetchRoutes.request,
                payload: {},
            } });
        }
    }

    displayProgress() {
        return <LinearProgress id="submitting-extension" />;
    }

    render() {
        const { handleSubmit, media, onHide, visible } = this.props;
        const smallScreen = (document.documentElement.clientWidth <= 550);
        const closeButton = <Button icon type="button" onClick={onHide}>cancel</Button>;
        const submitButton = <Button flat primary label="submit" type="submit" />;
        const routes = _.filter(this.props.routes, item => item.extension && item.extension.id === this.props.initialValues.id);
        return (
            <Dialog
                id="editExtension"
                fullPage={!!smallScreen}
                title={smallScreen ? title : undefined}
                aria-labelledby="dialogHeader"
                className="md-grid"
                dialogStyle={smallScreen ? styles.fullPageStyle : styles.dialogStyle}
                visible={visible}
                onHide={onHide}
                lastChild
            >
                <form onSubmit={handleSubmit}>
                    {smallScreen &&
                        <Toolbar
                            colored
                            nav={closeButton}
                            actions={[submitButton]}
                            title={title}
                            fixed
                        />
                    }
                    <div className={smallScreen ? 'md-toolbar-relative' : ''}>
                        {!smallScreen &&
                            <header>
                                <h2 id="dialogHeader">{title}</h2>
                            </header>
                        }
                        <Field
                            component={renderTextField}
                            className="md-cell--12"
                            type="text"
                            label="Extension Nickname"
                            id="name"
                            name="name"
                        />
                        <Field
                            component={renderTextField}
                            className="md-cell--12"
                            type="text"
                            label="Contact name"
                            id="full_name"
                            name="full_name"
                            required
                        />
                        <Field
                            component={renderTextField}
                            className="md-cell--12"
                            type="number"
                            label="Number"
                            id="extension"
                            name="extension"
                            normalize={integerNormalizer}
                        />
                        <Field
                            component={renderSelectField}
                            className="md-cell--12"
                            label="Recorded name"
                            id="name_greeting.id"
                            name="name_greeting.id"
                            menuItems={_.filter(media, item => item.type !== 'hold_music')}
                            itemLabel="name"
                            itemValue="id"
                        />
                        <Field
                            component={renderSelectField}
                            className="md-cell--12"
                            label="Time Zone"
                            id="timezone"
                            name="timezone"
                            menuItems={timeZones}
                            itemLabel="name"
                            itemValue="id"
                        />
                        <Field
                            component={renderTextField}
                            className="md-cell--12"
                            type="number"
                            label="Local Area Code (for outbound calls)"
                            id="local_area_code"
                            name="local_area_code"
                            max={3}
                            normalize={integerNormalizer}
                        />
                        {this.props.initialValues.id &&
                            <div>
                                {routes.length ?
                                    <Field
                                        component={renderSelectField}
                                        className="md-cell--12"
                                        label="Route"
                                        id="route.id"
                                        name="route.id"
                                        menuItems={routes}
                                        itemLabel="name"
                                        itemValue="id"
                                    /> :
                                    null
                                }
                                {this.props.formValues.route ?
                                    <Button
                                        flat
                                        primary
                                        onClick={() => this.toggleOpenRoute(this.props.routesById[this.props.formValues.route.id])}
                                        label="edit route"
                                    /> :
                                    null
                                }
                                <Button
                                    flat
                                    primary
                                    onClick={this.toggleOpenRoute}
                                    label="add route"
                                />
                            </div>
                        }
                        <Field
                            component={renderCheckbox}
                            className="md-cell--12"
                            label="Enable voicemail"
                            id="voicemail.enabled"
                            name="voicemail.enabled"
                            style={{ marginTop: '20px' }}
                        />
                        <Field
                            component={renderSelectField}
                            className="md-cell--12"
                            label="Voicemail greeting type"
                            id="voicemail.greeting.type"
                            name="voicemail.greeting.type"
                            menuItems={['name', 'standard']}
                        />
                        <Field
                            component={renderSelectField}
                            className="md-cell--12"
                            label="Standard Greeting"
                            id="voicemail.greeting.standard.id"
                            name="voicemail.greeting.standard.id"
                            menuItems={_.filter(media, item => item.type !== 'hold_music')}
                            itemLabel="name"
                            itemValue="id"
                        />
                        <Field
                            component={renderTextField}
                            className="md-cell--12"
                            type="number"
                            label="Voicemail password"
                            id="voicemail.password"
                            name="voicemail.password"
                            maxLength={6}
                            normalize={integerNormalizer}
                        />
                        {this.props.editing ?
                            this.displayProgress() : null
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
                    </div>
                </form>
                {this.props.initialValues.id ?
                    <EditRoute
                        visible={this.state.routeDialog}
                        onHide={this.toggleOpenRoute}
                        submit={this.submitRoute}
                        initialValues={this.state.editRoute.name ? this.state.editRoute : {
                            name: `Extension ${this.props.initialValues.extension} route`,
                            extension: {
                                id: this.props.initialValues.id,
                            },
                            rules: [{
                                actions: [
                                    {
                                        action: 'disconnect',
                                    },
                                ],
                            }],
                        }}
                        child
                        renderNode={smallScreen ? document.querySelector('.md-dialog--full-page') : document.body}
                    /> :
                    null
                }
            </Dialog>
        );
    }
}

const mapStateToProps = state => ({
    routes: state.routes.items,
    routesById: getRoutesById(state.routes.items),
    formValues: getFormValues('editExtension')(state),
    routesMessage: state.routes.message,
    editing: state.extensions.editing,
});

const mapDispatchToProps = {
    editRoutes: editRoutes.request,
    createRoutes: createRoutes.request,
    fetchRoutes: fetchRoutes.request,
    setSnackbar,
};

EditExtension = reduxForm({
    form: 'editExtension',
    enableReinitialize: true,
})(EditExtension);

export default connect(mapStateToProps, mapDispatchToProps)(EditExtension);
