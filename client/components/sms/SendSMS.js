import React from 'react';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';
import Toolbar from 'react-md/lib/Toolbars';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import { DatePicker, TimePicker } from 'react-md/lib/Pickers';

import { renderTextField, renderSelectField, styles } from '../reusables';

import {
    textFormatter,
    textNormalizer,
    arrayValidator,
} from '../../constants/formFunctions';

function validate(values) {
    const errors = {};

    if (!values.from) {
        errors.from = 'Select a phone number to call from.';
    }
    if (!values.text) {
        errors.text = 'Enter a message to send.';
    }
    if (values.text && values.text.length > 160) {
        errors.text = 'Text messages must be 160 or fewer characters long.';
    }

    return errors;
}

const title = 'Send a message';

const SendSMS = props => {
    const { handleSubmit, numbers, onHide, visible, sendLater, toggleSendLater } = props;
    const smallScreen = (document.documentElement.clientWidth <= 550);
    const closeButton = <Button icon type="button" onClick={onHide}>cancel</Button>;
    const submitButton = <Button flat primary label="submit" type="submit" />;
    return (
        <Dialog
            id="editMenu"
            fullPage={!!smallScreen}
            title={smallScreen ? title : undefined}
            aria-labelledby="dialogHeader"
            className="md-grid"
            lastChild
            dialogStyle={smallScreen ? styles.fullPageStyle : styles.dialogStyle}
            visible={visible}
            onHide={onHide}
        >
            <form onSubmit={handleSubmit}>
                {smallScreen &&
                    <Toolbar
                        colored
                        nav={closeButton}
                        actions={[submitButton]}
                        title={title}
                        fixed
                    />
                }
                <div className={smallScreen ? 'md-toolbar-relative' : ''}>
                    {!smallScreen &&
                        <header>
                            <h2 id="dialogHeader">{title}</h2>
                        </header>
                    }
                    <h5>If no numbers are available to send messages from, you must edit your numbers and set SMS forwarding extensions.</h5>
                    <Field
                        component={renderSelectField}
                        type="phone_number"
                        name="from"
                        id="from"
                        label="From"
                        menuItems={_.filter(['', ...numbers], number =>
                            number === '' || (number.sms_forwarding && number.sms_forwarding.type === 'extension')
                        )}
                        itemLabel="name"
                        itemValue="phone_number"
                        required
                    />
                    <Field
                        component={renderTextField}
                        type="text"
                        name="to"
                        id="to"
                        label="To"
                        required
                    />
                    <Field
                        component={renderTextField}
                        type="text"
                        name="text"
                        id="text"
                        format={textFormatter}
                        normalize={textNormalizer}
                        label="Message (limit 160 characters)"
                        maxLength={160}
                        required
                    />
                    {/*<Checkbox
                        name="sendLater"
                        id="sendLater"
                        checked={sendLater}
                        onChange={toggleSendLater}
                        label="Schedule for later"
                    />
                    {sendLater
                        <DatePicker
                            className="md-cell--6"
                            name="date"
                            id="date"
                            lastChild={!smallScreen}
                            renderNode={smallScreen ? document.querySelector('.md-dialog--full-page') : document.body}
                            disabled={!sendLater}
                            label="Date"
                        />
                    }
                    {sendLater &&
                        <TimePicker
                            className="md-cell--6"
                            name="time"
                            id="time"
                            lastChild={!smallScreen}
                            renderNode={smallScreen ? document.querySelector('.md-dialog--full-page') : document.body}
                            disabled={!sendLater}
                            label="Time"
                        />
                    }*/}
                    {props.sending &&
                        <LinearProgress id="submitting message" />
                    }
                    <div style={{ float: 'right' }}>
                        <Button
                            flat
                            className="md-cell--right"
                            label="cancel"
                            type="button"
                            onClick={onHide}
                            disabled={props.sending}
                        />
                        <Button
                            flat
                            primary
                            className="md-cell--right"
                            label="submit"
                            type="submit"
                            disabled={props.sending}
                        />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default reduxForm({
    form: 'sendSMS',
    validate,
})(SendSMS);
