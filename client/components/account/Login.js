import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import Button from 'react-md/lib/Buttons';

import { userLogin } from '../../actions';
import { renderTextField } from '../reusables';

class Login extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<form onSubmit={this.props.handleSubmit(this.props.userLogin)}>
				<Field
					component={renderTextField}
					name="email"
					type="text"
					id="email"
					label="Email or username"
					required
				/>
				<Field
					component={renderTextField}
					name="password"
					label="Password"
					id="password"
					type="password"
					required
				/>
                <div style={{ textAlign: 'center' }}>
                    <Button raised type="submit" label="submit"/>
                </div>
			</form>
		);
	}
}

Login = reduxForm({
	form: 'login',
})(Login);

const mapDispatchToProps = {
	userLogin: userLogin.request,
};

export default connect(null, mapDispatchToProps)(Login);
