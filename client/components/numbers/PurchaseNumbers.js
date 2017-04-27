import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import Button from 'react-md/lib/Buttons';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardText from 'react-md/lib/Cards/CardText';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';

import NumberFilters from './NumberFilters';
import { createNumbers, setSnackbar } from '../../actions';

class PurchaseNumbers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewFilters: false,
            filters: {},
            offset: 0,
            searchType: 'numbers',
            selected: {},
            purchasing: false,
        };

        this.handleSubmitPurchase = this.handleSubmitPurchase.bind(this);
        this.setPageOffset = this.setPageOffset.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.toggleFilters = this.toggleFilters.bind(this);
        this.toggleSelected = this.toggleSelected.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.message !== nextProps.message && nextProps.message === 'success') {
            this.props.setSnackbar('Purchase successful!');
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.offset !== nextState.offset ||
            !_.isEqual(this.state.filters, nextState.filters) ||
            (!this.props.message && nextProps.message)) {
            this.props.refresh(nextState);
        }
    }

    handleSubmitPurchase() {
        const numbers = _.keys(this.state.selected);
        if (numbers.length === 0) {
            this.props.setSnackbar('You must select one or more numbers to purchase.');
        } else {
            this.props.createNumbers(numbers);
        }
    }

    applyFilter(filters) {
        this.setState({
            filters: filters,
            offset: 0,
        });
    }

    toggleFilters() {
        this.setState({
            viewFilters: !this.state.viewFilters,
        });
    }

    setPageOffset(number) {
        this.setState({
            offset: this.state.offset + number,
        });
    }

    setSearchType(type) {
        this.setState({
            searchType: type,
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

    handleTabChange(tab) {
        this.setState({ tab });
    }

    render() {
        return (
            <Card
                id="purchase"
                className="md-cell--4 md-cell--12-phone"
                style={{ maxHeight: this.state.viewFilters ? '1000px' : '800px '}}
            >
                <CardTitle title="Purchase Numbers" />
                <CardText style={{ paddingRight: 0 }}>
                    <div style={{ textAlign: 'center' }}>
                        <Button flat primary label="show/hide filters" onClick={this.toggleFilters} />
                    </div>
                    {this.state.viewFilters &&
                        <TabsContainer onTabChange={this.handleTabChange} activeTabIndex={this.state.tab}>
                            <Tabs tabId="tab" desktopMinWidth={250}>
                                <Tab
                                    style={{ minWidth: '72px', maxWidth: '50%' }}
                                    label="Text search"
                                >
                                    <NumberFilters onSubmit={this.applyFilter} textSearch={true} />
                                </Tab>
                                <Tab
                                    style={{ minWidth: '72px', maxWidth: '50%' }}
                                    label="Number search"
                                >
                                    <NumberFilters onSubmit={this.applyFilter} textSearch={false} />
                                </Tab>
                            </Tabs>
                        </TabsContainer>
                    }
                    {this.props.loading && !this.props.purchasing &&
                        <div>
                            <p style={{ marginTop: '15px' }}>Loading, please wait...</p>
                            <p>Numbers load much more quickly if filtered by area code</p>
                            <CircularProgress id="loading-available-numbers"  scale={2} />
                        </div>
                    }
                    {this.props.purchasing &&
                        <div>
                            <p style={{ marginTop: '15px' }}>Sending purchase request, please wait...</p>
                            <CircularProgress id="purchasing-numbers" />
                        </div>
                    }
                    {!this.props.loading && !this.props.purchasing && !!this.props.available && !!this.props.available.length &&
                        <div>
                            {/*<p>Displaying available numbers {this.state.offset + 1} to {this.state.offset + this.props.available.length}.</p>*/}
                            <p style={{ marginTop: '15px' }}>Select any quantity of numbers to add to your account.</p>
                            {this.props.available && !!this.props.available.length &&
                                <div style={{ textAlign: 'center', margin: '15px 0' }}>
                                    <Button
                                        raised
                                        type="submit"
                                        label="purchase"
                                        onClick={this.handleSubmitPurchase}
                                    />
                                </div>
                            }
                            <div style={{ overflowY: 'scroll', maxHeight: '470px' }}>
                                <DataTable baseId="number">
                                    <TableBody>
                                        {this.props.available.map((item) => (
                                            <TableRow
                                                key={item.phone_number}
                                                selected={this.state.selected[item.phone_number.slice(1)]}
                                                onClick={() => this.toggleSelected(item)}
                                                onCheckboxClick={() => this.toggleSelected(item)}
                                            >
                                                {[<TableColumn key={`${item.phone_number}1`}>{item.formatted}</TableColumn>]}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </DataTable>
                            </div>
                            {this.props.available && !!this.props.available.length &&
                                <div style={{ textAlign: 'center', margin: '15px 0' }}>
                                    <Button
                                        raised
                                        type="submit"
                                        disabled={this.props.purchasing}
                                        label="purchase"
                                        onClick={this.handleSubmitPurchase}
                                    />
                                </div>
                            }
                        </div>
                    }
                    {!this.props.loading && !this.props.available.length &&
                        <p>No results found. Try searching with different filters.</p>
                    }
                </CardText>
            </Card>
        );
    }
}

PurchaseNumbers.propTypes = {
    loading: PropTypes.bool,
    available: PropTypes.array,
    onSubmit: PropTypes.func,
    refresh: PropTypes.func,
};

const mapStateToProps = state => ({
    loading: state.available.loading,
    available: state.available.items,
    purchasing: state.numbers.purchasing,
    message: state.numbers.purchaseMessage,
});

const mapDispatchToProps = {
    createNumbers: createNumbers.request,
    setSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseNumbers);
