import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';

import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import Button from 'react-md/lib/Buttons';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardText from 'react-md/lib/Cards/CardText';

import { fetchScheduledCalls, fetchCallHistory, sendCalls, createScheduledCalls, userLogout } from '../../actions';

import { styles } from '../reusables';

import SendCalls from './SendCalls';
import StatusMonitor from '../StatusMonitor';

class CallsMain extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sendDialog: false,
            sendLater: false,
        };

        props.fetchCallHistory();
        // props.fetchScheduledCalls();

        this.toggleSendDialog = this.toggleSendDialog.bind(this);
        this.toggleSendLater = this.toggleSendLater.bind(this);
        this.setSnackbar = this.setSnackbar.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.message !== newProps.message) {
            this.setSnackbar(newProps.message);
        }
    }

    setSnackbar(message) {
        console.log(message);
    }

    toggleSendDialog() {
        this.setState({
            sendDialog: !this.state.sendDialog,
            sendLater: false,
        });
    }

    toggleSendLater() {
        this.setState({
            sendLater: !this.state.sendLater,
        });
    }

    render() {
        return (
            <div className="md-grid">
                {/*<Card style={{ maxWidth: '800px', margin: '0px auto' }} className="md-cell--12">
                    <CardTitle title="Scheduled Calls" />
                    <CardText>
                        <DataTable plain>
                            <TableHeader>
                                <TableRow>
                                    <TableColumn>From</TableColumn>
                                    <TableColumn>To</TableColumn>
                                    <TableColumn>Time</TableColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {this.props.scheduledCalls && _.map(this.props.scheduledCalls, item => (
                                    <TableRow key={item.id} autoAdjust={false}>
                                        <TableColumn key={item.id + 'a'}>{item.caller_phone_number}</TableColumn>
                                        <TableColumn key={item.id + 'b'}>{item.callee_phone_number}</TableColumn>
                                        <TableColumn key={item.id + 'c'}>{moment(item.time).format('MMM D, YYYY h:mm a')}</TableColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </DataTable>
                        <SendCalls
                            visible={this.state.sendDialog}
                            onHide={this.toggleSendDialog}
                            onSubmit={this.state.sendLater ? this.props.createScheduledCalls : this.props.sendCalls}
                            numbers={this.props.numbers}
                            submitting={this.props.submitting}
                            extensions={this.props.extensions}
                            sendLater={this.state.sendLater}
                            toggleSendLater={this.toggleSendLater}
                        />
                    </CardText>
                </Card>*/}
                <Card style={{ maxWidth: '800px', margin: '20px auto' }}>
                    <CardTitle title="Call history" />
                    <StatusMonitor />
                    <CardText>
                        <Button raised onClick={this.toggleSendDialog} label="Place a call">phone</Button>
                        <DataTable plain>
                            <TableHeader>
                                <TableRow>
                                    <TableColumn>Date</TableColumn>
                                    <TableColumn className="desktopOnly">From</TableColumn>
                                    <TableColumn className="desktopOnly">To</TableColumn>
                                    <TableColumn>Duration</TableColumn>
                                    <TableColumn className="desktopOnly">Audio</TableColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {this.props.history && _.map(this.props.history, item =>
                                    <TableRow key={item.id}>
                                        <TableColumn>{moment(item.start_time).format('YYYY-MM-DD HH:mm')}</TableColumn>
                                        <TableColumn className="desktopOnly">{item.caller_id || item.caller_extension.extension || 'Default extension'}</TableColumn>
                                        <TableColumn className="desktopOnly">{item.called_number}</TableColumn>
                                        <TableColumn>{Math.floor(item.call_duration / 60)}:{item.call_duration % 60 < 10 ? `0${item.call_duration % 60}` : item.call_duration % 60}</TableColumn>
                                        <TableColumn className="desktopOnly">{item.call_recording && <audio src={item.call_recording} controls={true} preload="metadata">Listen</audio>}</TableColumn>
                                    </TableRow>
                                )}
                            </TableBody>
                        </DataTable>
                    </CardText>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    history: state.calls.history,
    scheduledCalls: state.calls.scheduledItems,
    numbers: state.numbers.items,
    extensions: state.extensions.items,
    loadingHistory: state.calls.loadingHistory,
    loadingScheduled: state.calls.loadingScheduled,
    message: state.calls.message,
    scheduledError: state.calls.error,
    historyError: state.calls.historyError,
    sending: state.calls.sending,
});

const mapDispatchToProps = {
    fetchCallHistory: fetchCallHistory.request,
    fetchScheduledCalls: fetchScheduledCalls.request,
    sendCalls: sendCalls.request,
    createScheduledCalls: createScheduledCalls.request,
    userLogout: userLogout.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(CallsMain);
