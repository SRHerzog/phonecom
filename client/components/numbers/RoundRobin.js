import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import Card from 'react-md/lib/Cards/Card';
import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';
import Toolbar from 'react-md/lib/Toolbars';
import Subheader from 'react-md/lib/Subheaders';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';

import { setSnackbar } from '../../actions';
import { styles } from '../reusables';

class RoundRobin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queue: {
                name: props.initialValues ? props.initialValues.name : 'New round robin',
                greeting: '',
                hold_music: '',
                max_hold_time: 300,
                caller_id_type: 'called_number',
                ring_time: 10,
                members: [],
            },
            selected: {},
        };

        this.updateField = this.updateField.bind(this);
        this.toggleSelected = this.toggleSelected.bind(this);
        this.addMember = this.addMember.bind(this);
        this.removeMember = this.removeMember.bind(this);
        this.updateMember = this.updateField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.visible !== newProps.visible) {
            this.state = {
                queue: {
                    name: this.props.initialValues ? this.props.initialValues.name : 'New round robin',
                    greeting: '',
                    hold_music: '',
                    max_hold_time: 60,
                    caller_id_type: 'called_number',
                    ring_time: 5,
                    members: [],
                },
                selected: {},
            };
        }
        if (this.props.visible && (this.props.message !== newProps.message) &&
            newProps.message === 'success') {
            this.props.onHide();
            this.props.setSnackbar('Round robin created successfully.');
        }
    }

    updateField(field, value) {
        const queue = _.cloneDeep(this.state.queue);
        queue[field] = value;
        this.setState({
            queue,
        });
    }

    toggleSelected(item) {
        const selected = _.clone(this.state.selected);
        if (this.state.selected[item.phone_number.slice(1)]) {
            _.unset(selected, item.phone_number.slice(1));
        } else {
            selected[item.phone_number.slice(1)] = true;
        }
        this.setState({
            selected,
        });
    }

    addMember() {
        const queue = _.cloneDeep(this.state.queue);
        queue.members.push({
            phone_number: '',
        });
        this.setState({
            queue,
        });
    }

    removeMember(removeIndex) {
        const queue = _.cloneDeep(this.state.queue);
        queue.members = _.filter(queue.members, (item, index) => index !== removeIndex);
        this.setState({
            queue,
        });
    }

    updateMember(value, index) {
        const queue = _.cloneDeep(this.state.queue);
        queue.members[index].phone_number = value;
        this.setState({
            queue,
        });
    }

    handleSubmit() {
        const queue = _.cloneDeep(this.state.queue);
        queue.members = _.map(_.keys(this.state.selected), key => ({
            phone_number: key,
        }));
        this.props.submit(queue);
    }

    render() {
        const { onHide, visible } = this.props;
        const smallScreen = (document.documentElement.clientWidth <= 550);
        const closeButton = <Button icon type="button" onClick={onHide}>cancel</Button>;
        const submitButton = <Button flat primary label="submit" type="submit" />;
        const title = 'Round robin';
        return (
            <Dialog
                id="editRoute"
                fullPage={!!smallScreen}
                title={smallScreen ? title : undefined}
                aria-labelledby="dialogHeader"
                className="md-grid"
                lastChild={!smallScreen}
                renderNode={smallScreen ? document.querySelector('.md-dialog--full-page') : document.body}
                dialogStyle={smallScreen ? styles.fullPageStyle : styles.dialogStyle}
                visible={visible}
                onHide={onHide}
            >
                <form>
                    {smallScreen ?
                        <Toolbar
                            colored
                            nav={closeButton}
                            actions={[submitButton]}
                            title={title}
                            fixed
                        /> :
                        null
                    }
                    <div className={smallScreen ? 'md-toolbar-relative' : ''}>
                        {!smallScreen &&
                            <header>
                                <h2 id="dialogHeader">{title}</h2>
                            </header>
                        }
                        <TextField
                            label="Queue name"
                            name="name"
                            id="name"
                            required
                            value={this.state.queue.name}
                            onChange={(value) => this.updateField('name', value)}
                        />
                        <SelectField
                            fullWidth
                            label="Greeting"
                            name="greeting"
                            id="greeting"
                            menuItems={_.filter(this.props.media, item => item.type !== 'hold_music')}
                            itemLabel="name"
                            itemValue="id"
                            value={this.state.queue.greeting}
                            onChange={value => this.updateField('greeting', value)}
                        />
                        <SelectField
                            fullWidth
                            label="Hold music"
                            name="hold_music"
                            id="hold_music"
                            menuItems={_.filter(this.props.media, item => item.type === 'hold_music')}
                            itemLabel="name"
                            itemValue="id"
                            value={this.state.queue.hold_music}
                            onChange={value => this.updateField('hold_music', value)}
                        />
                        <SelectField
                            fullWidth
                            label="Max. hold time (seconds)"
                            name="max_hold_time"
                            id="max_hold_time"
                            menuItems={[60, 120, 180, 240, 300, 600, 900, 1200, 1800, 2700, 3600]}
                            value={this.state.queue.max_hold_time}
                            onChange={value => this.updateField('max_hold_time', value)}
                        />
                        <SelectField
                            fullWidth
                            label="Ring time (seconds)"
                            name="ring_time"
                            id="ring_time"
                            menuItems={[5, 10, 15, 20, 25, 30]}
                            value={this.state.queue.ring_time}
                            onChange={value => this.updateField('ring_time', value)}
                        />
                        {/*<SelectField
                            fullWidth
                            label="Caller ID type"
                            name="caller_id_type"
                            id="caller_id_type"
                            menuItems={[{
                                label: 'Called number',
                                value: 'called_number',
                            },
                            {
                                label: 'Calling number',
                                value: 'calling_number',
                            }]}
                            itemLabel="label"
                            itemValue="value"
                            value={this.state.queue.caller_id_type}
                            onChange={value => this.updateField('caller_id_type', value)}
                        />*/}
                        <Card style={{ overflowY: 'scroll', maxHeight: '300px', margin: '20px auto' }}>
                            <Subheader component="h4" primary primaryText="Members" />
                            <DataTable baseId="number">
                                <TableBody>
                                    {this.props.numbers.map((item) => (
                                        <TableRow
                                            key={item.phone_number}
                                            selected={this.state.selected[item.phone_number.slice(1)]}
                                            onClick={() => this.toggleSelected(item)}
                                            onCheckboxClick={() => this.toggleSelected(item)}
                                        >
                                            {[<TableColumn key={`${item.phone_number}1`}>{item.name}</TableColumn>]}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </DataTable>
                        </Card>
                        <div style={{ float: 'right' }}>
                            <Button flat className="md-cell--right" label="cancel" type="button" onClick={onHide} />
                            <Button flat primary className="md-cell--right" label="submit" type="button" onClick={this.handleSubmit} />
                        </div>
                    </div>
                </form>
            </Dialog>
        );
    }
}

const mapStateToProps = state => ({
    numbers: state.numbers.items,
    media: state.media.items,
    message: state.routes.message,
});

const mapDispatchToProps = {
    setSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(RoundRobin);
