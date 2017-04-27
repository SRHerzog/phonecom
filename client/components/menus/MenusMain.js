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

import { fetchMenus, editMenus, createMenus, deleteMenus, userLogout } from '../../actions';

import { styles } from '../reusables';

import EditMenu from './EditMenu';
import StatusMonitor from '../StatusMonitor';

class Menus extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editForm: false,
            editMenu: '',
        };

        props.fetchMenus();

        this.toggleOpenEdit = this.toggleOpenEdit.bind(this);
        this.getSubmitFunction = this.getSubmitFunction.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.editing && !newProps.editing) {
            this.setState({
                editForm: false,
                editMenu: '',
            });
            this.props.fetchMenus();
        }
        if (newProps.error.status === 401) {
            newProps.userLogout();
        }
    }

    toggleOpenEdit(menu) {
        if (this.state.editForm) {
            this.setState({
                editForm: false,
                editMenu: '',
            });
        } else {
            let editMenu = '';
            if (menu) {
                editMenu = _.cloneDeep(menu);
                editMenu.options = _.map(editMenu.options, item => ({
                    key: item.key,
                    route: item.route.id,
                }));
            }
            this.setState({
                editForm: true,
                editMenu: {
                    ...editMenu,
                    greeting: editMenu.greeting.id,
                    keypress_error: editMenu.keypress_error.id,
                    timeout_handler: editMenu.timeout_handler.id,
                },
            });
        }
    }

    getSubmitFunction(menu) {
        if (menu) {
            return data => this.props.editMenus(data);
        } else {
            return data => this.props.createMenus(data);
        }
    }

    render() {
        const component = this;
        return (
            <div className="md-grid">
                <Card style={{ maxWidth: '850px', margin: '0px auto' }} className="md-cell--12">
                    <CardTitle title="Menus" />
                    <StatusMonitor />
                    <CardText>
                        <Button raised onClick={() => this.toggleOpenEdit()} label="Add new menu" />
                        <DataTable plain>
                            <TableHeader>
                                <TableRow>
                                    <TableColumn>Name</TableColumn>
                                    <TableColumn className="desktopOnly">Greeting</TableColumn>
                                    {/* <TableColumn className="desktopOnly">Error message</TableColumn> */}
                                    <TableColumn className="desktopOnly">Wait time</TableColumn>
                                    <TableColumn className="desktopOnly">Timeout route</TableColumn>
                                    <TableColumn>Options</TableColumn>
                                    <TableColumn />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {this.props.menus && this.props.menus.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableColumn>{item.name}</TableColumn>
                                        <TableColumn className="desktopOnly">{item.greeting.name}</TableColumn>
                                        {/* <TableColumn className="desktopOnly">{item.keypress_error ? item.keypress_error.name : 'default'}</TableColumn> */}
                                        {/* <TableColumn className="desktopOnly">{item.keypress_wait_time}</TableColumn> */}
                                        <TableColumn className="desktopOnly">{item.timeout_handler ? item.timeout_handler.name : 'none'}</TableColumn>
                                        <TableColumn>
                                            {item.options.length && item.options.map(option => (
                                                <p key={option.key}>{option.key}: {option.route.name}</p>
                                            ))}
                                        </TableColumn>
                                        <TableColumn style={styles.buttonColumn}>
                                            <Button icon onClick={() => component.toggleOpenEdit(item)}>mode_edit</Button>
                                            <Button icon onClick={() => component.props.deleteMenus(item.id)}>delete</Button>
                                        </TableColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </DataTable>
                        <EditMenu
                            visible={this.state.editForm}
                            onHide={this.toggleOpenEdit}
                            initialValues={this.state.editMenu || {}}
                            editing={this.props.editing}
                            onSubmit={this.getSubmitFunction(this.state.editMenu)}
                            media={this.props.media}
                            routes={this.props.routes}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    error: state.menus.error,
    message: state.menus.message,
    loading: state.menus.loading,
    editing: state.menus.editing,
    menus: state.menus.items,
    media: state.media.items,
    routes: state.routes.items,
});

const mapDispatchToProps = {
    fetchMenus: fetchMenus.request,
    editMenus: editMenus.request,
    createMenus: createMenus.request,
    deleteMenus: deleteMenus.request,
    userLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Menus);
