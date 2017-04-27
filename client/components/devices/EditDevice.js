import React from 'react';
import {Field, reduxForm} from 'redux-form';

import {simpleField, selectField} from '../reusables';
import timeZones from '../../constants/timeZones';
import {stripSpecialChars, integerNormalizer} from '../../constants/formFunctions';

const EditDevice = props => {
	const {handleSubmit, cancel} = props;
	return (<div>BARRG</div>);/*
		<form onSubmit={handleSubmit}>
			<Field
				component={simpleField}
				type="text"
				formLabel="Device Nickname"
				name="name"
				normalize={stripSpecialChars}
			/>
			<Field
				component={simpleField}
				type="text"
				formLabel="Contact name"
				name="full_name"
				required={true}
				normalize={stripSpecialChars}
			/>
			<Field
				component={simpleField}
				type="number"
				formLabel="Number"
				name="extension"
				normalize={integerNormalizer}
			/>
			<Field
				component={selectField}
				type="greeting"
				formLabel="Recorded name"
				name="name_greeting"
				items={media}
			/>
			<Field
				component={selectField}
				type="text"
				formLabel="Time Zone"
				name="timezone"
				items={timeZones}
			/>
			<Field
				component={simpleField}
				type="number"
				formLabel="Local Area Code (for outbound calls)"
				name="local_area_code"
				max="3"
				normalize={integerNormalizer}
			/>
			<div className="subForm">
				<Field
					component={simpleField}
					type="checkbox"
					formLabel="Enable voicemail"
					name="voicemail"
				/>
				<Field
					component={selectField}
					type="text"
					formLabel="Voicemail greeting type"
					name="voicemail.greeting.type"
					items={['name', 'standard']}
				/>
				<Field
					component={selectField}
					type="greeting"
					formLabel="Standard Greeting"
					name="voicemail.greeting.standard"
					items={media}
				/>
				<Field
					component={simpleField}
					type="number"
					formLabel="Voicemail password"
					name="voicemail.password"
					maxLength="6"
					normalize={integerNormalizer}
				/>
			</div>
			<button type="button" onClick={cancel}>Cancel</button>
			<button type="submit">Submit</button>
		</form>
	);*/
};

export default reduxForm({
	form: 'editDevice',
})(EditDevice);
