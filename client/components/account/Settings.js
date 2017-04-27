import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';

import {simpleField} from '../reusables';

class Settings extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<form onSubmit={this.props.handleSubmit}>
				<Field
					component={simpleField}
					name="accountName"
					label="Account name"
					required={true}
				/>
				<Field
					component={simpleField}
					name="contactName"
					label="Contact"
					required={true}
				/>
				<Field
					component={simpleField}
					name="company"
					label="Company"
				/>
				<Field
					component={simpleField}
					name="line_1"
					label="Address Line 1"
					required={true}
				/>
				<Field
					component={simpleField}
					name="line_2"
					label="Address Line 2"
				/>
				<Field
					component={simpleField}
					name="city"
					label="City"
					required={true}
				/>
				<Field
					component={simpleField}
					name="province"
					label="State/Province"
				/>
				<Field
					component={simpleField}
					name="postal_code"
					label="Postal Code"
				/>
				<Field
					component={simpleField}
					name="country"
					label="Country"
					required={true}
				/>
				<Field
					component={simpleField}
					name="phone"
					label="Phone"
					required={true}
				/>
				<Field
					component={simpleField}
					name="email"
					label="Email"
					required={true}
				/>
				<button type="submit">Submit changes</button>
			</form>
		);
	}
}

export default reduxForm({
	form: 'editAccount',
})(Settings);
