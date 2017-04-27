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

import { fetchMedia, createMedia, editMedia, deleteMedia, userLogout } from '../../actions';
import { styles } from '../reusables';

import EditMedia from './EditMedia';
import StatusMonitor from '../StatusMonitor';

class Media extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editForm: false,
            editMedia: '',
        };

        props.fetchMedia();

        this.toggleOpenEdit = this.toggleOpenEdit.bind(this);
        this.getSubmitFunction = this.getSubmitFunction.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.apiMessage && !this.props.apiMessage) {
            this.setState({
                editForm: false,
            });
            this.props.fetchMedia();
        }
        if (newProps.error.status === 401) {
            newProps.userLogout();
        }
    }

    toggleOpenEdit(media) {
        if (this.state.editForm) {
            this.setState({
                editForm: false,
                editMedia: '',
            });
        } else {
            let editMedia = {};
            if (media) {
                editMedia = _.cloneDeep(media);
                editMedia.tts_voice = media.tts.voice;
                editMedia.tts_text = media.tts.text;
                editMedia.is_temporary = 'N';
                editMedia.tts = undefined;
                editMedia['@controls'] = undefined;
            }
            this.setState({
                editForm: true,
                editMedia,
            });
        }
    }

    getSubmitFunction(menu) {
        if (menu) {
            return data => this.props.editMedia(data);
        } else {
            return data => this.props.createMedia(data);
        }
    }

    render() {
        const component = this;
        return (
            <div className="md-grid">
                <Card style={{ maxWidth: '850px', margin: '0px auto' }} className="md-cell--12">
                    <CardTitle title="Media" />
                    <StatusMonitor />
                    <CardText>
                        <Button raised onClick={() => this.toggleOpenEdit()} label="Add new media" />
                        <DataTable plain>
                            <TableHeader>
                                <TableRow>
                                    <TableColumn>Name</TableColumn>
                                    <TableColumn>Type</TableColumn>
                                    <TableColumn>Text</TableColumn>
                                    <TableColumn />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {this.props.media && this.props.media.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableColumn>{item.name}</TableColumn>
                                        <TableColumn>{item.type === 'greeting' ? 'Greeting' : 'Hold music'}</TableColumn>
                                        <TableColumn>{item.tts && item.tts.text}</TableColumn>
                                        <TableColumn style={styles.buttonColumn}>
                                            {item.type === 'greeting' && <Button icon onClick={() => component.toggleOpenEdit(item)}>mode_edit</Button>}
                                            <Button icon onClick={() => component.props.deleteMedia(item.id)}>delete</Button>
                                        </TableColumn>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </DataTable>
                        <EditMedia
                            visible={this.state.editForm}
                            onHide={this.toggleOpenEdit}
                            initialValues={this.state.editMedia || { origin: 'tts', type: 'greeting' }}
                            editing={this.props.editing}
                            onSubmit={this.getSubmitFunction(this.state.editMedia)}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    error: state.media.error,
    apiMessage: state.media.message,
    loading: state.media.loading,
    media: state.media.items,
    editing: state.media.editing,
});

const mapDispatchToProps = {
    fetchMedia: fetchMedia.request,
    editMedia: editMedia.request,
    createMedia: createMedia.request,
    deleteMedia: deleteMedia.request,
    userLogout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Media);
