import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import Button from 'react-md/lib/Buttons';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardText from 'react-md/lib/Cards/CardText';

import {fetchQueues, editQueues, createQueues, deleteQueues, userLogout, setSnackbar} from '../../actions';

import { styles } from '../reusables';

import EditQueue from './EditQueue';
import StatusMonitor from '../StatusMonitor';

class Queues extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editForm: false,
            editQueue: '',
        };

        props.fetchQueues();

        this.toggleOpenEdit = this.toggleOpenEdit.bind(this);
        this.getSubmitFunction = this.getSubmitFunction.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.editing && !newProps.editing) {
            this.setState({
                editForm: false,
                editQueue: '',
            });
            this.props.fetchQueues();
        }
        if (newProps.error.status === 401) {
            newProps.userLogout();
        }
    }

    toggleOpenEdit(queue) {
        if (this.state.editForm) {
            this.setState({
                editForm: false,
                editQueue: '',
            });
        } else {
            let editQueue = '';
            if (queue) {
                editQueue = _.cloneDeep(queue);
            }
            this.setState({
                editForm: true,
                editQueue: { ...editQueue, greeting: editQueue.greeting ? editQueue.greeting.id : '', hold_music: editQueue.hold_music ? editQueue.hold_music.id : '' },
            });
        }
    }

    getSubmitFunction(queue) {
        if (queue) {
            return data => this.props.editQueues(data);
        } else {
            return data => this.props.createQueues(data);
        }
    }

    render() {
        const component = this;
        return (
            <div className="md-grid">
                <Card style={{ maxWidth: '800px', margin: '0px auto' }} className="md-cell--12">
                    <CardTitle title="Queues" />
                    <StatusMonitor />
                    <CardText>
                        <Button raised onClick={() => this.toggleOpenEdit()} label="Add new queue" />
                        <DataTable plain>
                            <TableHeader>
                                <TableRow>
                                    <TableColumn>Name</TableColumn>
                                    <TableColumn className="desktopOnly">Greeting</TableColumn>
                                    <TableColumn className="desktopOnly">Hold music</TableColumn>
                                    {/* <TableColumn className="desktopOnly">Max hold time</TableColumn>
                                    <TableColumn className="desktopOnly">Ring time</TableColumn> */}
                                    <TableColumn>Members</TableColumn>
                                    <TableColumn />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {this.props.queues && this.props.queues.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableColumn>{item.name}</TableColumn>
                                        <TableColumn className="desktopOnly">{item.greeting ? item.greeting.name : 'none'}</TableColumn>
                                        <TableColumn className="desktopOnly">{item.hold_music ? item.hold_music.name : 'default'}</TableColumn>
                                        {/* <TableColumn className="desktopOnly">{item.max_hold_time || '300'}</TableColumn>
                                        <TableColumn className="desktopOnly">{item.ring_time || '5'}</TableColumn> */}
                                        <TableColumn>
                                            {item.members.length && item.members.map(number => (
                                                <p key={item.name + number.phone_number}>{number.phone_number}</p>
                                            ))}
                                        </TableColumn>
                                        <TableColumn style={styles.buttonColumn}>
                                            <Button icon onClick={() => component.toggleOpenEdit(item)}>mode_edit</Button>
                                            <Button icon onClick={() => component.props.deleteQueues(item.id)}>delete</Button>
                                        </TableColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </DataTable>
                        <EditQueue
                            visible={this.state.editForm}
                            onHide={this.toggleOpenEdit}
                            editing={this.props.editing}
                            initialValues={this.state.editQueue || {}}
                            onSubmit={this.getSubmitFunction(this.state.editQueue)}
                            media={this.props.media}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    error: state.queues.error,
    message: state.queues.message,
    loading: state.queues.loading,
    editing: state.queues.editing,
    queues: state.queues.items,
    media: state.media.items,
});

const mapDispatchToProps = {
    fetchQueues: fetchQueues.request,
    editQueues: editQueues.request,
    createQueues: createQueues.request,
    deleteQueues: deleteQueues.request,
    userLogout: userLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Queues);
