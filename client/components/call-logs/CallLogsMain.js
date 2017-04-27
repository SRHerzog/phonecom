import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { fetchCallHistory } from '../../actions';

import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import Button from 'react-md/lib/Buttons';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardText from 'react-md/lib/Cards/CardText';

class CallLogs extends Component {
    constructor(props) {
        super(props);

        props.fetchCallHistory();
    }

    render() {
        return (
            <Card style={{ maxWidth: '800px', margin: '20px auto' }}>
                <CardTitle title="Call history" />
                <CardText>
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
        );
    }
}

const mapStateToProps = state => ({
    error: state.calls.error,
    history: state.calls.history,
});

const mapDispatchToProps = {
    fetchCallHistory: fetchCallHistory.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(CallLogs);
