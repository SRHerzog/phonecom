import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {fetchDevices, createDevices, editDevices} from '../../actions';

import EditDevice from './EditDevice';

class Devices extends Component {
	constructor(props) {
		super(props);

		this.state = {
			editForm: false,
			editDevice: '',
			voicemailShown: '',
		};

		props.fetchDevices();

		this.toggleOpenEdit = this.toggleOpenEdit.bind(this);
		this.getSubmitFunction = this.getSubmitFunction.bind(this);
	}

	componentWillReceiveProps(newProps) {
		if (newProps.apiMessage && !this.props.apiMessage) {
			this.setState({
				editForm: false,
				editDevice: '',
			});
			this.props.fetchDevices();
		}
		if (newProps.error.status === 401) {
			newProps.userLogout();
		}
	}

	toggleOpenEdit(device) {
		if (this.state.editForm) {
			this.setState({
				editForm: false,
				editDevice: '',
			});
		} else {
			let editDevice = '';
			if (device) {
				editDevice = _.cloneDeep(device);
			}
			this.setState({
				editForm: true,
				editDevice: editDevice,
			});
		}
	}

	toggleShowVoicemail(id) {
		this.setState({
			voicemailShown: id,
		});
	}

	getSubmitFunction(device) {
		if (device) {
			return data => this.props.editDevices(data);
		} else {
			return data => this.props.createDevices(data);
		}
	}

	render() {
		return (
			<main>
				<header><h1>Devices</h1></header>
				<div>
					<table>
						<thead>
							<tr>
								<th>Device name</th>
								<th>Extension</th>
								<th className="desktopOnly">Authentication</th>
							</tr>
						</thead>
						<tbody>
							{this.props.devices && this.props.devices.map((device) => (
								<tr key={device.id}>
									<td>{device.name}</td>
									<td>{device.lines[0] ? (device.lines[0].extension ? device.lines[0].extension.extension : device.lines[0].line) : ''}</td>
									<td className="desktopOnly">
                                        <ul>
                                            <li>Hostname: {device.sip_authentication.host}</li>
                                            <li>Port: {device.sip_authentication.port}</li>
                                        </ul>
                                    </td>
									{!this.state.editForm &&
										<td><button className="smallButton" onClick={() => this.toggleOpenEdit(device)}>Edit</button></td>
									}
								</tr>
							))}
						</tbody>
					</table>
					{this.state.editForm &&
						<EditDevice
							initialValues={this.state.editDevice || {}}
							onSubmit={this.getSubmitFunction(this.state.editDevice)}
							cancel={() => this.toggleOpenEdit()}
							{...this.props}
						/>
					}
					{!this.state.editForm &&
						<button className="centerButton" onClick={() => this.toggleOpenEdit()}>Add new device</button>
					}
				</div>
			</main>
		);
	}
}

const mapStateToProps = state => ({
	error: state.devices.error,
	apiMessage: state.devices.message,
	loading: state.devices.loading,
	devices: state.devices.items,
	media: state.media.items,
	routes: state.routes.items,
});

const mapDispatchToProps = {
	fetchDevices: fetchDevices.request,
	createDevices: createDevices.request,
	editDevices: editDevices.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(Devices);

