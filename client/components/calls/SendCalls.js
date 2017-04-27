import React from 'react';
import { Field, reduxForm } from 'redux-form';

import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';
import Toolbar from 'react-md/lib/Toolbars';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import { DatePicker, TimePicker } from 'react-md/lib/Pickers';

import { renderTextField, renderSelectField, styles } from '../reusables';

const title = 'Place a call';

const SendCalls = props => {
    const { handleSubmit, numbers, extensions, onHide, visible, sendLater, toggleSendLater } = props;
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
                    <Field
                        component={renderSelectField}
                        className="md-cell--12"
                        type="phone_number"
                        name="caller_phone_number"
                        id="caller_phone_number"
                        label="From"
                        menuItems={numbers || []}
                        itemLabel="name"
                        itemValue="phone_number"
                        required
                    />
                    <Field
                        component={renderTextField}
                        className="md-cell--12"
                        type="tel"
                        name="callee_phone_number"
                        id="callee_phone_number"
                        label="To"
                        required
                    />
                    <Field
                        component={renderTextField}
                        className="md-cell--12"
                        type="text"
                        name="caller_caller_id"
                        id="caller_caller_id"
                        label="Outgoing caller ID"
                    />
                    <Field
                        component={renderSelectField}
                        className="md-cell--12"
                        type="extension"
                        name="caller_extension"
                        id="caller_extension"
                        label="Extension"
                        menuItems={extensions || []}
                        itemLabel="name"
                        itemValue="id"
                        required
                    />
                    {/*<Checkbox
                        name="sendLater"
                        id="sendLater"
                        checked={sendLater}
                        onChange={toggleSendLater}
                        label="Schedule for later"
                    />
                    {sendLater &&
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
                        <LinearProgress id="submitting-call" />
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
    form: 'sendCalls',
})(SendCalls);
