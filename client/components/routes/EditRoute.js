import React, { Component } from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import _ from 'lodash';

import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';
import Toolbar from 'react-md/lib/Toolbars';
import Divider from 'react-md/lib/Dividers';

import { renderTextField, renderSelectField, phoneInput, styles } from '../reusables';

import { integerNormalizer, stripSpecialChars } from '../../constants/formFunctions';

class EditRoute extends Component {
    constructor() {
        super();

        this.state = {
            actionFields: [],
        };

        this.renderActionArray = this.renderActionArray.bind(this);
        this.renderAction = this.renderAction.bind(this);
        this.renderActionFields = this.renderActionFields.bind(this);
        this.forwardingArray = this.forwardingArray.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
    }

    renderActionArray({ fields }) {
        if (fields.length === 0) {
            fields.push({});
        }
        const rows = fields.map((action, index) => this.renderAction(fields, action, index));
        rows.push(
            <Button
                key="add"
                flat
                primary
                type="button"
                onClick={() => fields.push({})}
                label="Add action"
            >
                add_box
            </Button>
        );
        return (
            <div>
                {rows}
            </div>
        );
    }

    handleFieldChange(value, previous, index) {
        if (value !== previous) {
            console.log('works!', index, value);
            const actionFields = _.clone(this.state.actionFields);
            actionFields[index] = value;
            this.setState({
                actionFields,
            });
        }
        return value;
    }

    renderAction(array, action, index) {
        return (
            <div key={index} className="md-grid" style={{ borderBottom: '1px solid #ccc' }}>
                <Field
                    className="md-cell--3 md-cell--2-tablet md-cell--4-phone"
                    component={renderSelectField}
                    label="Action"
                    name={`${action}.action`}
                    id={`${action}.action`}
                    menuItems={[
                        '',
                        'directory',
                        'disconnect',
                        'forward',
                        'greeting',
                        'hold',
                        'menu',
                        'queue',
                    ]}
                    normalize={(value, previous) => this.handleFieldChange(value, previous, index)}
                    required
                />
                <div className="md-cell--6 md-cell--4-tablet md-cell--4-phone">
                    {this.renderActionFields(action, this.state.actionFields[index])}
                </div>
                <Button
                    className="md-cell--3 md-cell--2-tablet md-cell--middle"
                    flat
                    type="button"
                    onClick={() => array.remove(index)}
                    label="Remove"
                >
                    indeterminate_check_box
                </Button>
            </div>
        );
    }

    renderActionFields(action, actionType) {
        switch (actionType) {
            case 'forward':
                return (
                    <div>
                        <FieldArray
                            name={`${action}.items`}
                            id={`${action}.items`}
                            component={this.forwardingArray}
                        />
                        <Field
                            component={renderTextField}
                            type="number"
                            label="Timeout (5 to 90 seconds)"
                            name={`${action}.timeout`}
                            id={`${action}.timeout`}
                            min={5}
                            max={90}
                            normalize={integerNormalizer}
                        />
                        <Field
                            component={renderSelectField}
                            label="Hold music"
                            name={`${action}.hold_music`}
                            id={`${action}.hold_music`}
                            menuItems={_.filter(this.props.media, item => item.type === 'hold_music')}
                            itemLabel="name"
                            itemValue="id"
                        />
                    </div>
                );
            case 'greeting':
                return (
                    <Field
                        component={renderSelectField}
                        fullWidth
                        type="greeting"
                        label="Greeting: "
                        name={`${action}.greeting`}
                        id={`${action}.greeting`}
                        menuItems={_.filter(this.props.media, item => item.type !== 'hold_music')}
                        itemLabel="name"
                        itemValue="id"
                    />
                );
            case 'hold':
                return (
                    <div>
                        <Field
                            component={renderTextField}
                            fullWidth
                            type="number"
                            label="Duration (1 to 60 seconds)"
                            name={`${action}.duration`}
                            id={`${action}.duration`}
                            required
                            min={1}
                            max={60}
                            normalize={integerNormalizer}
                        />
                        <Field
                            component={renderSelectField}
                            fullWidth
                            type="hold_music"
                            label="Hold music"
                            name={`${action}.hold_music`}
                            id={`${action}.hold_music`}
                            menuItems={this.props.media}
                            itemLabel="name"
                            itemValue="id"
                            required
                        />
                    </div>
                );
            case 'menu':
                return (
                    <Field
                        component={renderSelectField}
                        fullWidth
                        type="menu"
                        label="Select menu"
                        name={`${action}.menu`}
                        id={`${action}.menu`}
                        menuItems={this.props.menus}
                        itemLabel="name"
                        itemValue="id"
                    />
                );
            case 'queue':
                return (
                    <Field
                        component={renderSelectField}
                        fullWidth
                        type="queue"
                        label="Select queue"
                        name={`${action}.queue`}
                        id={`${action}.queue`}
                        menuItems={this.props.queues}
                        itemLabel="name"
                        itemValue="id"
                    />
                );
            case 'directory':
            case 'disconnect':
            default:
                return null;
        }
    }

    forwardingArray({ fields }) {
        return (
            <div>
                <h4>Forwarding numbers</h4>
                {fields.map((item, index) => this.renderForwardingField(fields, item, index))}
                <Button flat type="button" onClick={() => fields.push({})} label="add number">add_box</Button>
            </div>
        );
    }

    renderForwardingField(array, item, index) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', height: '33px' }} key={index}>
                <Field
                    component={renderTextField}
                    label=""
                    name={`${item}.number`}
                    id={`${item}.number`}
                />
                <Button
                    icon
                    type="button"
                    onClick={() => array.remove(index)}
                >
                    remove
                </Button>
            </div>
        );
    }

    render() {
        const { handleSubmit, onHide } = this.props;
        const smallScreen = (document.documentElement.clientWidth <= 550);
        const closeButton = <Button icon type="button" onClick={onHide}>cancel</Button>;
        const submitButton = <Button flat primary label="submit" type="submit" />;
        const title = 'Add/edit route';
        return (
            <Dialog
                id="editRoute"
                fullPage={!!smallScreen}
                title={smallScreen ? title : undefined}
                aria-labelledby="dialogHeader"
                className="md-grid"
                dialogStyle={smallScreen ? styles.fullPageStyle : styles.dialogStyle}
                visible={this.props.visible}
                onHide={this.props.onHide}
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
                            label="Route name"
                            name="name"
                            id="name"
                            required
                            normalize={stripSpecialChars}
                        />
                        {/* !this.props.initialValues &&
                            <Field
                                component={renderTextField}
                                label="Extension"
                                name="extension"
                                id="extension"
                            />
                        */}
                        <FieldArray
                            name="actions"
                            id="actions"
                            component={this.renderActionArray}
                        />
                        <div style={{ float: 'right' }}>
                            <Button flat className="md-cell--right" label="cancel" type="button" onClick={onHide} />
                            <Button flat primary className="md-cell--right" label="submit" type="submit" />
                        </div>
                    </div>
                </form>
            </Dialog>
        );
    }
}

export default reduxForm({
    form: 'editRoute',
    enableReinitialize: true,
})(EditRoute);
