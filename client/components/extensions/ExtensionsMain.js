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

import { fetchExtensions, createExtensions, editExtensions, deleteExtensions, userLogout } from '../../actions';
import { styles } from '../reusables';

import EditExtension from './EditExtension';
import StatusMonitor from '../StatusMonitor';

class Extensions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editForm: false,
            editExtension: '',
            voicemailShown: '',
        };

        props.fetchExtensions();

        this.toggleOpenEdit = this.toggleOpenEdit.bind(this);
        this.toggleShowVoicemail = this.toggleShowVoicemail.bind(this);
        this.getSubmitFunction = this.getSubmitFunction.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.apiMessage && !this.props.apiMessage) {
            this.setState({
                editForm: false,
                editExtension: '',
            });
            this.props.fetchExtensions();
        }
        if (newProps.error.status === 401) {
            newProps.userLogout();
        }
    }

    toggleOpenEdit(extension) {
        if (this.state.editForm) {
            this.setState({
                editForm: false,
                editExtension: '',
            });
        } else {
            let editExtension = '';
            if (extension) {
                editExtension = _.cloneDeep(extension);
            }
            this.setState({
                editForm: true,
                editExtension,
            });
        }
    }

    toggleShowVoicemail(id) {
        this.setState({
            voicemailShown: id,
        });
    }

    getSubmitFunction(extension) {
        if (extension) {
            return data => this.props.editExtensions(data);
        } else {
            return data => this.props.createExtensions(data);
        }
    }

    render() {
        return (
            <div className="md-grid">
                <Card style={{ maxWidth: '850px', margin: '0px auto' }} className="md-cell--12">
                    <CardTitle title="Extensions" />
                    <StatusMonitor />
                    <CardText>
                        <Button raised onClick={() => this.toggleOpenEdit()} label="Add new extension" />
                        <DataTable plain>
                            <TableHeader>
                                <TableRow>
                                    <TableColumn>Ext #</TableColumn>
                                    <TableColumn>Nickname</TableColumn>
                                    <TableColumn className="desktopOnly">Contact name</TableColumn>
                                    <TableColumn className="desktopOnly">Caller ID #</TableColumn>
                                    <TableColumn className="desktopOnly">Voicemail</TableColumn>
                                    <TableColumn />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {this.props.extensions && this.props.extensions.map((extension) => (
                                    <TableRow key={extension.id}>
                                        <TableColumn>{extension.extension}</TableColumn>
                                        <TableColumn>{extension.name}</TableColumn>
                                        <TableColumn className="desktopOnly">{extension.full_name}</TableColumn>
                                        <TableColumn className="desktopOnly">{extension.caller_id}</TableColumn>
                                        <TableColumn className="desktopOnly" style={styles.buttonColumn}>
                                            {extension.voicemail && extension.voicemail.enabled && !this.state.voiceMailShown &&
                                                <Button flat label="Show" onClick={() => this.toggleShowVoicemail(extension.id)} />
                                            }
                                            {this.state.voicemailShown === extension.id &&
                                                <ul>
                                                    <li>Password: {extension.voicemail.password}</li>
                                                    <li>Greeting: {extension.voicemail.greeting ? extension.voicemail.greeting.type : 'none'}
                                                        {extension.voicemail.greeting.type !== 'name' &&
                                                            <ul><li>{extension.voicemail.greeting.standard}</li></ul>
                                                        }
                                                    </li>
                                                    <Button flat label="Hide" onClick={() => this.toggleShowVoicemail('')} />
                                                </ul>
                                            }
                                        </TableColumn>
                                        <TableColumn style={styles.buttonColumn}>
                                            <Button icon onClick={() => this.toggleOpenEdit(extension)}>mode_edit</Button>
                                        </TableColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </DataTable>
                        <EditExtension
                            visible={this.state.editForm}
                            onHide={this.toggleOpenEdit}
                            initialValues={this.state.editExtension || {}}
                            onSubmit={this.getSubmitFunction(this.state.editExtension)}
                            media={this.props.media}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    error: state.extensions.error,
    apiMessage: state.extensions.message,
    loading: state.extensions.loading,
    extensions: state.extensions.items,
    media: state.media.items,
    routes: state.routes.items,
});

const mapDispatchToProps = {
    fetchExtensions: fetchExtensions.request,
    createExtensions: createExtensions.request,
    editExtensions: editExtensions.request,
    deleteExtensions: deleteExtensions.request,
    userLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Extensions);

