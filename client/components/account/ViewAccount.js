import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {editAccount} from '../../actions';

import Settings from './Settings';

class ViewAccount extends Component {
	constructor(props) {
		super(props);

		this.state = {
			editing: false,
		};

		this.toggleEdit = this.toggleEdit.bind(this);
	}

	toggleEdit() {
		this.setState({
			editing: !this.state.editing,
		});
	}

	render() {
		const name = this.props.account.name;
		const contact = this.props.account.contact || {};
		return (
			<main>
				<h1>Account Details</h1>
				{this.props.loading ?
					<div>
						Loading!
					</div>
				:
					<div>
						{this.state.editing && this.props.account.contact &&
							<Settings
								initialValues={{
									accountName: name,
									contactName: contact.name,
									company: contact.company,
									...contact.address,
									phone: contact.phone,
									email: contact.primary_email,
								}}
								onSubmit={this.props.editAccount}
							/>
						}
						{!this.state.editing && this.props.account.contact &&
							<table>
								<tbody>
									<tr>
										<th>Account name</th>
										<td>{name}</td>
									</tr>
									<tr>
										<th>Contact</th>
										<td>{contact.name}</td>
									</tr>
									<tr>
										<th>Company</th>
										<td>{contact.company}</td>
									</tr>
									<tr>
										<th>Address</th>
										<td>
											{contact.address.line_1}<br />
											{contact.address.line_2}<br />
											{contact.address.city}, {contact.address.province} {contact.address.postal_code} {contact.address.country}
										</td>
									</tr>
									<tr>
										<th>Phone</th>
										<td>{contact.phone}</td>
									</tr>
									<tr>
										<th>Email</th>
										<td>{contact.primary_email}</td>
									</tr>
								</tbody>
							</table>
						}
						<button onClick={this.toggleEdit}>
							{this.state.editing ? 'Cancel' : 'Edit'}
						</button>
					</div>
				}
			</main>
		);
	}
}

ViewAccount.propTypes = {
	account: PropTypes.object,
	loading: PropTypes.bool,
	editAccount: PropTypes.func,
};

const mapStateToProps = state => ({
	account: state.account.details,
	loading: state.account.loading,
});

const mapDispatchToProps = {
	editAccount: editAccount.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewAccount);
