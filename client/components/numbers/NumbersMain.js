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

import { fetchNumbers, fetchAvailable, editNumbers, userLogout } from '../../actions';

import { styles } from '../reusables';

import EditNumber from './EditNumber';
import PurchaseNumbers from './PurchaseNumbers';
import StatusMonitor from '../StatusMonitor';

class Numbers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editForm: false,
            editNumber: {},
            purchaseNumbers: false,
        };

        props.fetchNumbers();
        props.fetchAvailable({ filters: {}, offset: 0 });

        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.togglePurchaseList = this.togglePurchaseList.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.apiMessage && !this.props.apiMessage) {
            console.log(newProps.apiMessage);
            this.props.fetchNumbers();
            this.closeEdit();
        }
        if (newProps.error.status === 401) {
            newProps.userLogout();
        }
    }

    openEdit(number) {
        this.setState({
            editForm: true,
            editNumber: number || {},
        });
    }

    closeEdit() {
        this.setState({
            editForm: false,
            editNumber: {},
        });
    }

    togglePurchaseList() {
        this.setState({
            purchaseNumbers: !this.state.purchaseNumbers,
        });
    }

    scrollToPurchase() {
        document.getElementById('purchase').scrollIntoView();
    }

    render() {
        const component = this;
        const { editForm, editNumber } = this.state;
        const smallScreen = (document.documentElement.clientWidth <= 550);
        return (
            <div className="md-grid">
                <Card className="md-cell--8 md-cell--12-phone">
                    <CardTitle title="Manage Numbers" />
                    <StatusMonitor />
                    <CardText>
                        {smallScreen &&
                                <Button
                                    raised
                                    label="purchase numbers"
                                    onClick={this.scrollToPurchase}
                                />
                        }
                        <DataTable plain>
                            <TableHeader>
                                <TableRow>
                                    <TableColumn>Name</TableColumn>
                                    <TableColumn>Number</TableColumn>
                                    <TableColumn>Route</TableColumn>
                                    <TableColumn />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {component.props.numbers && _.map(component.props.numbers, item => (
                                    <TableRow key={item.id}>
                                        <TableColumn>{item.name}</TableColumn>
                                        <TableColumn>{item.phone_number}</TableColumn>
                                        <TableColumn>{item.route ? item.route.name : 'None'}</TableColumn>
                                        <TableColumn style={styles.buttonColumn}>
                                            <Button
                                                icon
                                                onClick={() => component.openEdit(item)}
                                            >
                                                mode_edit
                                            </Button>
                                        </TableColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </DataTable>
                    </CardText>
                </Card>
                <PurchaseNumbers refresh={this.props.fetchAvailable} />
                <EditNumber
                    visible={editForm}
                    onHide={this.closeEdit}
                    initialValues={{
                        ...editNumber,
                        route: editNumber.route ? editNumber.route.id : '',
                        caller_id_name: editNumber.caller_id ? editNumber.caller_id.name : '',
                        call_notifications_emails: editNumber.call_notifications ? editNumber.call_notifications.emails : '',
                        call_notifications_sms: editNumber.call_notifications ? editNumber.call_notifications.sms : '',
                        sms_forwarding: editNumber.sms_forwarding && editNumber.sms_forwarding.extension ? editNumber.sms_forwarding.extension.id : '',
                    }}
                    onSubmit={component.props.editNumbers}
                    routes={component.props.routes}
                    extensions={component.props.extensions}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    error: state.numbers.error,
    loading: state.numbers.loading,
    numbers: state.numbers.items,
    apiMessage: state.numbers.message,
    available: state.available.items,
    routes: state.routes.items,
    extensions: state.extensions.items,
});

const mapDispatchToProps = {
    fetchNumbers: fetchNumbers.request,
    fetchAvailable: fetchAvailable.request,
    editNumbers: editNumbers.request,
    userLogout: userLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Numbers);
