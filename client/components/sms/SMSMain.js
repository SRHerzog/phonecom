import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { fetchSMSHistory, fetchScheduledSMS, sendSMS, createScheduledSMS, userLogout } from '../../actions';

import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import Button from 'react-md/lib/Buttons';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardText from 'react-md/lib/Cards/CardText';

import { styles } from '../reusables';

import SendSMS from './SendSMS';
import StatusMonitor from '../StatusMonitor';

class SMSMain extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sendDialog: false,
            sendLater: false,
        };

        props.fetchSMSHistory();
        // props.fetchScheduledSMS();

        this.toggleSendDialog = this.toggleSendDialog.bind(this);
        this.toggleSendLater = this.toggleSendLater.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.sending && !newProps.sending) {
            this.setState({
                sendDialog: false,
                sendLater: false,
            });
            // this.props.fetchScheduledSMS();
        }
        if (newProps.error.status === 401) {
            newProps.userLogout();
        }
    }

    toggleSendDialog() {
        this.setState({
            sendDialog: !this.state.sendDialog,
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
                <Card style={{ maxWidth: '875px', margin: '0px auto' }} className="md-cell--12">
                    <CardTitle title="SMS Messages" />
                    <StatusMonitor />
                    <CardText>
                        <Button raised onClick={() => this.toggleSendDialog()} label="Send message" />
                        <DataTable plain>
                            <TableHeader>
                                <TableRow>
                                    <TableColumn className="desktopOnly">From</TableColumn>
                                    <TableColumn className="desktopOnly">To</TableColumn>
                                    <TableColumn className="desktopOnly">Time</TableColumn>
                                    <TableColumn>Text</TableColumn>
                                    <TableColumn>Status</TableColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {this.props.scheduledSMS ? this.props.scheduledSMS.map(item => (
                                    <TableRow key={item.message_id}>
                                        <TableColumn className="desktopOnly">{item.sender}</TableColumn>
                                        <TableColumn className="desktopOnly">{item.recipients}</TableColumn>
                                        <TableColumn className="desktopOnly">{moment(item.time).local().format('MMM D Y h:mm a')}</TableColumn>
                                        <TableColumn><div style={styles.textColumn}>{item.text}</div></TableColumn>
                                        <TableColumn>Scheduled</TableColumn>
                                    </TableRow>
                                )) : null}
                                {this.props.smsHistory ? this.props.smsHistory.map(item => {
                                    const smsTo = item.to.map(recipient => (
                                        <p key={recipient.number}>{recipient.number}</p>
                                    ));
                                    const smsTime = moment.unix(item.created_epoch).local().format('MMM D Y h:mm a');
                                    return (
                                        <TableRow key={item.id}>
                                            <TableColumn className="desktopOnly">{item.from}</TableColumn>
                                            <TableColumn className="desktopOnly">{smsTo}</TableColumn>
                                            <TableColumn className="desktopOnly">{smsTime}</TableColumn>
                                            <TableColumn><div style={styles.textColumn}>{item.text}</div></TableColumn>
                                            <TableColumn>{item.direction === 'out' ? 'Sent' : 'Received'}</TableColumn>
                                        </TableRow>
                                    );
                                }) : null}
                            </TableBody>
                        </DataTable>
                        <SendSMS
                            visible={this.state.sendDialog}
                            onHide={this.toggleSendDialog}
                            onSubmit={this.state.sendLater ? this.props.createScheduledSMS : this.props.sendSMS}
                            sendLater={this.state.sendLater}
                            toggleSendLater={this.toggleSendLater}
                            numbers={this.props.numbers || []}
                            sending={this.props.sending}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    error: state.sms.historyError,
    sending: state.sms.sending,
    smsHistory: state.sms.history,
    // scheduledSMS: state.sms.scheduledItems,
    numbers: state.numbers.items,
});

const mapDispatchToProps = {
    fetchSMSHistory: fetchSMSHistory.request,
    fetchScheduledSMS: fetchScheduledSMS.request,
    sendSMS: sendSMS.request,
    createScheduledSMS: createScheduledSMS.request,
    userLogout: userLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(SMSMain);
