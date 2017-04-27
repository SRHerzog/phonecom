import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, getFormValues } from 'redux-form';

import Button from 'react-md/lib/Buttons';

import { createAccount } from '../../actions';
import { renderTextField, renderSelectField } from '../reusables';

// TODO: Country should be a select field

const months = [
    { value: '01', label: '01 - Jan' },
    { value: '02', label: '02 - Feb' },
    { value: '03', label: '03 - Mar' },
    { value: '04', label: '04 - Apr' },
    { value: '05', label: '05 - May' },
    { value: '06', label: '06 - Jun' },
    { value: '07', label: '07 - Jul' },
    { value: '08', label: '08 - Aug' },
    { value: '09', label: '09 - Sep' },
    { value: '10', label: '10 - Oct' },
    { value: '11', label: '11 - Nov' },
    { value: '12', label: '12 - Dec' },
];

const years = [
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
    '2026',
    '2027',
    '2028',
];

class Register extends Component {
    constructor() {
        super();

        TCO.loadPubKey('sandbox');
        
        this.submitForm = this.submitForm.bind(this);
        this.handlePaymentError = this.handlePaymentError.bind(this);
        this.getToken = this.getToken.bind(this);
    }

    submitForm(data) {
        console.log('bork2!');
        this.props.createAccount(data);
    }

    handlePaymentError() {
        console.log('payment error!');
    }

    getToken(data) {
        console.log('borkin!', data, TCO);
        const args = {
            sellerId: '202846634',
            publishableKey: '213C4542-8525-477C-A267-48C4182ACE73',
            ccNo: this.props.values.ccNo,
            cvv: this.props.values.cvv,
            expMonth: this.props.values.expMonth,
            expYear: this.props.values.expYear,
        };
        TCO.requestToken(() => this.submitForm(data), this.handlePaymentError, args);
    }

    render() {
        return (
            <form onSubmit={this.props.handleSubmit(this.getToken)}>
                <Field
                    component={renderTextField}
                    name="contactname"
                    id="contactname"
                    label="Primary contact name"
                    required
                />
                <Field
                    component={renderTextField}
                    name="company"
                    id="company"
                    label="Business name"
                />
                <Field
                    component={renderTextField}
                    name="address1"
                    id="address1"
                    label="Billing address line 1"
                    required
                />
                <Field
                    component={renderTextField}
                    name="address2"
                    id="address2"
                    label="Address line 2"
                />
                <Field
                    component={renderTextField}
                    name="city"
                    id="city"
                    label="City"
                    required
                />
                <Field
                    component={renderTextField}
                    name="state"
                    id="state"
                    label="State/Province"
                />
                <Field
                    component={renderTextField}
                    name="postalcode"
                    id="postalcode"
                    label="Postal code"
                />
                <Field
                    component={renderTextField}
                    name="country"
                    id="country"
                    label="Country"
                    required
                />
                <Field
                    component={renderTextField}
                    name="phone"
                    id="phone"
                    label="Phone number"
                    required
                />
                <Field
                    component={renderTextField}
                    name="email"
                    id="email"
                    label="Email address"
                    type="email"
                    required
                />
                <Field
                    component={renderTextField}
                    name="ccNo"
                    id="ccNo"
                    type="number"
                    label="Credit card number"
                    maxLength={16}
                    required
                />
                <Field
                    component={renderTextField}
                    name="cvv"
                    id="cvv"
                    type="number"
                    label="Validation code"
                    maxLength={3}
                    required
                />
                <Field
                    className="md-cell--6 md-cell--4-tablet md-cell--2-phone"
                    component={renderSelectField}
                    name="expMonth"
                    id="expMonth"
                    label="Exp. month"
                    menuItems={months}
                />
                <Field
                    style={{ float: 'right' }}
                    className="md-cell--6 md-cell--4-tablet md-cell--2-phone"
                    component={renderSelectField}
                    name="expYear"
                    id="expYear"
                    label="Exp. year"
                    menuItems={years}
                />
                <Field
                    component={renderTextField}
                    name="password"
                    id="password"
                    label="Password"
                    type="password"
                    required
                />
                <Field
                    component={renderTextField}
                    name="validatepassword"
                    id="validatepassword"
                    label="Repeat password"
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

Register = reduxForm({
    form: 'register',
})(Register);

const mapStateToProps = state => ({
    values: getFormValues('register')(state),
});

const mapDispatchToProps = {
    createAccount: createAccount.request,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
