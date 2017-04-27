import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {fetchSchedules, createSchedules, editSchedules, deleteSchedules} from '../../actions';

import EditSchedule from './EditSchedule';

class Schedules extends Component {
	constructor(props) {
		super(props);

		this.state = {
			editForm: false,
			editSchedule: {},
		};

		props.fetchSchedules();

		this.toggleOpenEdit = this.toggleOpenEdit.bind(this);
		this.getSubmitFunction = this.getSubmitFunction.bind(this);
	}

	componentWillReceiveProps(newProps) {
		if (newProps.apiMessage && !this.props.apiMessage) {
			console.log(newProps.apiMessage);
			this.setState({
				editForm: false,
				editSchedule: '',
			});
			this.props.fetchSchedules();
		}
		if (newProps.error.status === 401) {
			newProps.userLogout();
		}
	}

	toggleOpenEdit(schedule) {
		if (this.state.editForm) {
			this.setState({
				editForm: false,
				editSchedule: {},
			});
		} else {
			let editSchedule = {};
			if (schedule) {
				editSchedule = _.cloneDeep(schedule);
			}
			this.setState({
				editForm: true,
				editSchedule: editSchedule,
			});
		}
	}

	getSubmitFunction(schedule) {
		if (schedule) {
			return data => this.props.editSchedules(data);
		} else {
			return data => this.props.createSchedules(data);
		}
	}

	render() {
		return (
			<main>
				<header><h1>Schedules</h1></header>
				<div>
					<table>
						<thead>
							<tr>
							</tr>
						</thead>
						<tbody>
							{this.props.schedules && this.props.schedules.map((schedule) => (
								<tr key={schedule.id}>
									<td><button onClick={() => this.openEdit(schedule)} />Edit</td>
									<td><button onClick={() => this.props.deleteSchedules(schedule.id)} />Delete</td>
								</tr>
							))}
						</tbody>
					</table>
					{this.state.editForm &&
						<EditSchedule
							initialValues={this.state.editSchedule}
							onSubmit={this.getSubmitFunction(this.state.editSchedule)}
							cancel={this.closeEdit}
							{...this.props}
						/>
					}
					{!this.state.editForm &&
						<button onClick={() => this.openEdit()}>Add new schedule</button>
					}
				</div>
			</main>
		);
	}
}

const mapStateToProps = state => ({
	error: state.schedules.error,
	apiMessage: state.schedules.message,
	loading: state.schedules.loading,
	schedules: state.schedules.items,
	routes: state.routes.items,
});

const mapDispatchToProps = {
	fetchSchedules: fetchSchedules.request,
	createSchedules: createSchedules.request,
	editSchedules: editSchedules.request,
	deleteSchedules: deleteSchedules.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedules);
