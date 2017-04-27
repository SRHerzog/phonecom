import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';
import Toolbar from 'react-md/lib/Toolbars';

import { styles } from '../reusables';

import { editRoutes, createRoutes } from '../../actions';

class EditRoute extends Component {
    constructor(props) {
        super(props);

        this.state = {
            route: props.initialValues.rules ? props.initialValues : {
                name: '',
                extension: null,
                rules: [{
                    actions: [
                        {
                            action: 'disconnect',
                        },
                    ],
                }],
            },
        };

        this.updateRouteName = this.updateRouteName.bind(this);
        this.addAction = this.addAction.bind(this);
        this.removeAction = this.removeAction.bind(this);
        this.changeActionType = this.changeActionType.bind(this);
        this.updateAction = this.updateAction.bind(this);
        this.updateActionField = this.updateActionField.bind(this);
        this.addForwardingNumber = this.addForwardingNumber.bind(this);
        this.removeForwardingNumber = this.removeForwardingNumber.bind(this);
        this.updateForwardingNumber = this.updateForwardingNumber.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.renderAction = this.renderAction.bind(this);
        this.renderActionFields = this.renderActionFields.bind(this);
        this.renderForwardingArray = this.renderForwardingArray.bind(this);
        this.renderForwardingField = this.renderForwardingField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.visible !== this.props.visible) {
            this.setState({
                route: newProps.initialValues.rules ? newProps.initialValues : {
                    name: '',
                    extension: null,
                    rules: [{
                        actions: [
                            {
                                action: 'disconnect',
                            },
                        ],
                    }],
                },
            });
        }
    }

    updateRouteName(name) {
        const route = _.cloneDeep(this.state.route);
        route.name = name;
        this.setState({
            route,
        });
    }

    addAction() {
        const route = _.cloneDeep(this.state.route);
        route.rules[0].actions.push({ action: 'disconnect' });
        this.setState({
            route,
        });
    }

    removeAction(removeIndex) {
        const route = _.cloneDeep(this.state.route);
        route.rules[0].actions = _.filter(rules[0].actions, (item, index) => index !== removeIndex);
        this.setState({
            route,
        });
    }

    changeActionType(action, index) {
        let emptyAction = {};
        switch (action) {
        case 'forward':
            emptyAction = {
                action,
                items: [{
                    type: 'phone_number',
                    number: '',
                    caller_id: 'called_number',
                }],
                timeout: 5,
                hold_music: {},
            };
            break;
        case 'greeting':
            emptyAction = {
                action,
                greeting: {},
            };
            break;
        case 'hold':
            emptyAction = {
                action,
                duration: 20,
                hold_music: {},
            };
            break;
        case 'menu':
            emptyAction = {
                action,
                menu: {},
            };
            break;
        case 'queue':
            emptyAction = {
                action,
                queue: {},
            };
            break;
        case 'disconnect':
        case 'directory':
        default:
            emptyAction = {
                action,
            };
            break;
        }
        this.updateAction(emptyAction, index);
    }

    updateAction(action, index) {
        const route = _.cloneDeep(this.state.route);
        route.rules[0].actions[index] = action;
        this.setState({
            route,
        });
    }

    updateActionField(fieldname, value, index) {
        const action = _.cloneDeep(this.state.route.rules[0].actions[index]);
        action[fieldname] = value;
        this.updateAction(action, index);
    }

    updateActionLookup(fieldname, value, index) {
        const action = _.cloneDeep(this.state.route.rules[0].actions[index]);
        action[fieldname].id = value;
        this.updateAction(action, index);
    }

    addForwardingNumber(index) {
        const action = _.cloneDeep(this.state.route.rules[0].actions[index]);
        action.items.push('');
        this.updateAction(action, index);
    }

    removeForwardingNumber(actionIndex, numberIndex) {
        const action = _.cloneDeep(this.state.route.rules[0].actions[actionIndex]);
        action.items = _.filter(action.items, (item, index) => index !== numberIndex);
        this.updateAction(action, actionIndex);
    }

    updateForwardingNumber(actionIndex, numberIndex, value) {
        const action = _.cloneDeep(this.state.route.rules[0].actions[actionIndex]);
        action.items[numberIndex].number = value;
        this.updateAction(action, actionIndex);
    }

    handleFieldChange(value, previous, index) {
        if (value !== previous) {
            const actionFields = _.clone(this.state.actionFields);
            actionFields[index] = value;
            this.setState({
                actionFields,
            });
        }
        return value;
    }

    renderAction(action, index) {
        return (
            <div key={index} className="md-grid" style={{ borderBottom: '1px solid #ccc' }}>
                <SelectField
                    className="md-cell--3 md-cell--2-tablet md-cell--4-phone"
                    label="Action"
                    name={`action${index}.action`}
                    id={`action${index}.action`}
                    menuItems={[
                        'directory',
                        'disconnect',
                        'forward',
                        'greeting',
                        'hold',
                        'menu',
                        'queue',
                    ]}
                    value={this.state.route.rules[0].actions[index].action}
                    onChange={type => this.changeActionType(type, index)}
                    required
                />
                <div className="md-cell--6 md-cell--4-tablet md-cell--4-phone">
                    {this.renderActionFields(action, index)}
                </div>
                {this.state.route.rules[0].actions.length > 1 &&
                    <Button
                        className="md-cell--3 md-cell--2-tablet md-cell--middle"
                        flat
                        type="button"
                        onClick={() => this.removeAction(index)}
                        label="Remove"
                    >
                        indeterminate_check_box
                    </Button>
                }
            </div>
        );
    }

    renderActionFields(action, index) {
        switch (action.action) {
            case 'forward':
                return (
                    <div>
                        {this.renderForwardingArray(action, index)}
                        <TextField
                            type="number"
                            label="Timeout (5 to 90 seconds)"
                            name={`action${index}.timeout`}
                            id={`action${index}.timeout`}
                            min={5}
                            max={90}
                            value={this.state.route.rules[0].actions[index].timeout}
                            onChange={value => this.updateActionField('timeout', value, index)}
                        />
                        <SelectField
                            fullWidth
                            label="Hold music"
                            name={`action${index}.hold_music`}
                            id={`action${index}.hold_music`}
                            menuItems={_.filter(this.props.media, item => item.type === 'hold_music')}
                            itemLabel="name"
                            itemValue="id"
                            value={this.state.route.rules[0].actions[index].hold_music.id}
                            onChange={value => this.updateActionLookup('hold_music', value, index)}
                        />
                    </div>
                );
            case 'greeting':
                return (
                    <SelectField
                        fullWidth
                        label="Greeting"
                        name={`action${index}.greeting`}
                        id={`action${index}.greeting`}
                        menuItems={_.filter(this.props.media, item => item.type !== 'hold_music')}
                        itemLabel="name"
                        itemValue="id"
                        value={this.state.route.rules[0].actions[index].greeting.id}
                        onChange={value => this.updateActionLookup('greeting', value, index)}
                    />
                );
            case 'hold':
                return (
                    <div>
                        <TextField
                            fullWidth
                            type="number"
                            label="Duration (1 to 60 seconds)"
                            name={`action${index}.duration`}
                            id={`action${index}.duration`}
                            required
                            min={1}
                            max={60}
                            value={this.state.route.rules[0].actions[index].duration}
                            onChange={value => this.updateActionField('duration', value, index)}
                        />
                        <SelectField
                            fullWidth
                            label="Hold music"
                            name={`action${index}.hold_music`}
                            id={`action${index}.hold_music`}
                            menuItems={_.filter(this.props.media, item => item.type === 'hold_music')}
                            itemLabel="name"
                            itemValue="id"
                            required
                            value={this.state.route.rules[0].actions[index].hold_music.id}
                            onChange={value => this.updateActionLookup('hold_music', value, index)}
                        />
                    </div>
                );
            case 'menu':
                return (
                    <SelectField
                        fullWidth
                        label="Select menu"
                        name={`action${index}.menu`}
                        id={`action${index}.menu`}
                        menuItems={this.props.menus}
                        itemLabel="name"
                        itemValue="id"
                        value={this.state.route.rules[0].actions[index].menu.id}
                        onChange={value => this.updateActionLookup('menu', value, index)}
                    />
                );
            case 'queue':
                return (
                    <SelectField
                        fullWidth
                        label="Select queue"
                        name={`action${index}.queue`}
                        id={`action${index}.queue`}
                        menuItems={this.props.queues}
                        itemLabel="name"
                        itemValue="id"
                        value={this.state.route.rules[0].actions[index].queue.id}
                        onChange={value => this.updateActionLookup('queue', value, index)}
                    />
                );
            case 'directory':
            case 'disconnect':
            default:
                return null;
        }
    }

    renderForwardingArray(action, index) {
        return (
            <div>
                <h4>Forwarding numbers</h4>
                {_.map(action.items, (item, numberIndex) => this.renderForwardingField(item, index, numberIndex))}
                <Button flat type="button" onClick={() => this.addForwardingNumber(index)} label="add number">add_box</Button>
            </div>
        );
    }

    renderForwardingField(item, actionIndex, numberIndex) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', height: '33px' }} key={`a${actionIndex}.${numberIndex}`}>
                <TextField
                    label=""
                    name={`action${actionIndex}.${numberIndex}.number`}
                    id={`action${actionIndex}.${numberIndex}.number`}
                    value={this.state.route.rules[0].actions[actionIndex].items[numberIndex].number}
                    onChange={value => this.updateForwardingNumber(actionIndex, numberIndex, value)}
                />
                <Button
                    icon
                    type="button"
                    onClick={() => this.removeForwardingNumber(actionIndex, numberIndex)}
                >
                    remove
                </Button>
            </div>
        );
    }

    handleSubmit() {
        if (this.state.route.id) {
            this.props.submit(this.state.route, true);
        } else {
            this.props.submit(this.state.route, false);
        }
    }

    render() {
        const { onHide } = this.props;
        const smallScreen = (document.documentElement.clientWidth <= 550);
        const closeButton = <Button icon type="button" onClick={onHide}>cancel</Button>;
        const submitButton = <Button flat primary label="submit" type="submit" />;
        const title = 'Add/edit route';
        const actionRows = _.map(this.state.route.rules[0].actions, (action, index) => this.renderAction(action, index));
        actionRows.push(
            <Button
                key="add"
                flat
                primary
                type="button"
                onClick={this.addAction}
                label="Add action"
            >
                add_box
            </Button>
        );
        return (
            <Dialog
                id="editRoute"
                fullPage={!!smallScreen}
                title={smallScreen ? title : undefined}
                aria-labelledby="dialogHeader"
                className="md-grid"
                lastChild={!smallScreen}
                renderNode={this.props.child ? this.props.renderNode : document.body}
                dialogStyle={smallScreen ? styles.fullPageStyle : styles.dialogStyle}
                visible={this.props.visible}
                onHide={this.props.onHide}
            >
                <form>
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
                        <TextField
                            label="Route name"
                            name="name"
                            id="name"
                            required
                            value={this.state.route.name}
                            onChange={this.updateRouteName}
                        />
                        {/* !this.props.initialValues &&
                            <Field
                                component={renderTextField}
                                label="Extension"
                                name="extension"
                                id="extension"
                            />
                        */}
                        {actionRows}
                        {this.props.editing &&
                            <LinearProgress id="submitting-route" />
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
                                type="button"
                                onClick={this.handleSubmit}
                                disabled={this.props.editing}
                            />
                        </div>
                    </div>
                </form>
            </Dialog>
        );
    }
}

const mapStateToProps = state => ({
    routes: state.routes.items,
    media: state.media.items,
    menus: state.menus.items,
    queues: state.queues.items,
    editing: state.routes.editing,
});

const mapDispatchToProps = {
    editRoutes: editRoutes.request,
    createRoutes: createRoutes.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditRoute);
