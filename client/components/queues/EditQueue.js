import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import _ from 'lodash';

import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';
import Toolbar from 'react-md/lib/Toolbars';

import { renderTextField, renderSelectField, phoneInput, styles } from '../reusables';

function renderQueuesArray({ fields }) {
    return (
        <div className="md-cell--12">
            <h5 style={{ marginTop: '10px' }}>Queue members (phone numbers)</h5>
            {fields.map((member, index) =>
                <div style={{ display: 'flex', alignItems: 'center', height: '33px' }} key={index}>
                    <Field
                        component={renderTextField}
                        id={`${member}.phone_number`}
                        name={`${member}.phone_number`}
                    />
                    <Button
                        flat
                        className="smallButton"
                        type="button"
                        onClick={() => fields.remove(index)}
                        label="remove"
                    />
                </div>
            )}
            <Button flat type="button" onClick={() => fields.push({})} label="Add member">add_box</Button>
        </div>
    );
}

const title = 'Add/edit queue';

const EditQueue = props => {
    const { handleSubmit, media, onHide } = props;
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
            dialogStyle={smallScreen ? styles.fullPageStyle : styles.dialogStyle}
            visible={props.visible}
            onHide={props.onHide}
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
                        component={renderTextField}
                        className="md-cell--12"
                        label="Queue name"
                        name="name"
                        id="name"
                        required
                    />
                    <Field
                        component={renderSelectField}
                        className="md-cell--12"
                        type="message"
                        label="Greeting"
                        name="greeting"
                        id="greeting"
                        menuItems={_.filter(media, item => item.type !== 'hold_music')}
                        itemLabel="name"
                        itemValue="id"
                    />
                    <Field
                        component={renderSelectField}
                        className="md-cell--12"
                        label="Hold music"
                        name="hold_music"
                        id="hold_music"
                        menuItems={_.filter(media, item => item.type === 'hold_music')}
                        itemLabel="name"
                        itemValue="id"
                    />
                    <Field
                        component={renderSelectField}
                        className="md-cell--12"
                        type="numbers"
                        label="Maximum hold time (seconds)"
                        name="max_hold_time"
                        id="max_hold_time"
                        menuItems={[60, 120, 180, 240, 300, 600, 900, 1200, 1800, 2700, 3600]}
                    />
                    <Field
                        component={renderSelectField}
                        className="md-cell--12"
                        type="numbers"
                        label="Ring time (seconds)"
                        name="ring_time"
                        id="ring_time"
                        menuItems={[5, 10, 15, 20, 25, 30]}
                    />
                    <FieldArray
                        name="members"
                        id="members"
                        component={renderQueuesArray}
                    />
                    {props.editing &&
                        <LinearProgress id="submitting-queue" />
                    }
                    <div style={{ float: 'right' }}>
                        <Button
                            flat
                            className="md-cell--right"
                            label="cancel"
                            type="button"
                            onClick={onHide}
                            disabled={props.editing}
                        />
                        <Button
                            flat
                            primary
                            className="md-cell--right"
                            label="submit"
                            type="submit"
                            disabled={props.editing}
                        />
                    </div>
                 </div>
            </form>
        </Dialog>
    );
};

export default reduxForm({
    form: 'editQueue',
    enableReinitialize: true,
})(EditQueue);
