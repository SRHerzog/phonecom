import React from 'react';
import {Field, reduxForm} from 'redux-form';

import Button from 'react-md/lib/Buttons';

import {renderTextField} from '../reusables';
// import formStyles from '../../styles/forms.css';


const NumberFilters = props => (
    props.textSearch ?
        <form onSubmit={props.handleSubmit}>
            <Field
                component={renderTextField}
                name="areacodes"
                id="areacodes"
                label="Area code"
            />
            <Field
                component={renderTextField}
                name="textSearch"
                id="textSearch"
                label="Text to search"
            />
            <div style={{ textAlign: 'center', margin: '15px 0 0 0' }}>
                <Button raised primary type="submit" label="Apply" />
            </div>
        </form>
    :
        <form onSubmit={props.handleSubmit}>
            <p>Separate multiple entries with commas.</p>
            <Field
                component={renderTextField}
                name="areacodes"
                id="areacodes"
                label="Area Code(s)"
            />
            <Field
                component={renderTextField}
                name="nxx"
                id="nxx"
                label="Prefix(es)"
            />
            <Field
                component={renderTextField}
                name="xxxx"
                id="xxxx"
                label="Last four digits"
            />
            <div style={{ textAlign: 'center', margin: '15px 0 0 0' }}>
                <Button raised primary type="submit" label="Apply" />
            </div>
        </form>
);

export default reduxForm({
    form: 'numberFilters',
})(NumberFilters);
