import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import _ from 'lodash';

import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';
import Toolbar from 'react-md/lib/Toolbars';

import { renderTextField, renderSelectField, styles } from '../reusables';
import { stripSpecialChars } from '../../constants/formFunctions';

const title = 'Add/edit menu';

const EditMenu = props => {
    const { handleSubmit, media, routes, onHide, visible } = props;
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
                        component={renderTextField}
                        className="md-cell--12"
                        label="Menu name"
                        id="name"
                        name="name"
                        required
                    />
                    <Field
                        component={renderSelectField}
                        className="md-cell--12"
                        type="message"
                        label="Greeting"
                        id="greeting"
                        name="greeting"
                        menuItems={_.filter(media, item => item.type !== 'hold_music')}
                        itemLabel="name"
                        itemValue="id"
                        required
                    />
                    <Field
                        component={renderSelectField}
                        className="md-cell--12"
                        type="message"
                        label="Keypress error message"
                        id="keypress_error"
                        name="keypress_error"
                        menuItems={_.filter(media, item => item.type !== 'hold_music')}
                        itemLabel="name"
                        itemValue="id"
                        required
                    />
                    <Field
                        component={renderSelectField}
                        className="md-cell--6 md-cell--12-phone"
                        type="numbers"
                        label="Wait time (seconds)"
                        id="keypress_wait_time"
                        name="keypress_wait_time"
                        menuItems={[1, 2, 3, 4, 5]}
                        required
                    />
                    <Field
                        component={renderSelectField}
                        className="md-cell--6 md-cell--12-phone md-cell--right"
                        type="routes"
                        label="Timeout route"
                        id="timeout_handler"
                        name="timeout_handler"
                        menuItems={routes || []}
                        itemLabel="name"
                        itemValue="id"
                        required
                    />
                    <FieldArray
                        name="options"
                        component={({ fields }) =>
                            <div className="md-cell--12">
                                <p style={{ margin: '15px auto'}}>Enter up to 10 options assigned to numeric keys or the pound (#) sign.</p>
                                {fields.map((option, optionIndex) =>
                                    <li key={optionIndex} className="md-grid" style={{ maxHeight: '55px' }}>
                                        <Field
                                            className="md-cell--3 md-cell--2-tablet md-cell--1-phone md-cell--bottom"
                                            component={renderSelectField}
                                            fullWidth
                                            type="numbers"
                                            label="Key"
                                            id={`${option}.key`}
                                            name={`${option}.key`}
                                            menuItems={['0', 1, 2, 3, 4, 5, 6, 7, 8, 9, '#']}
                                            required
                                        />
                                        <Field
                                            className="md-cell--6 md-cell--4-tablet md-cell--2-phone md-cell--bottom"
                                            component={renderSelectField}
                                            fullWidth
                                            type="routes"
                                            label="Route"
                                            id={`${option}.route`}
                                            name={`${option}.route`}
                                            menuItems={routes || []}
                                            itemLabel="name"
                                            itemValue="id"
                                            required
                                        />
                                        {fields.length > 1 &&
                                            <Button
                                                className="md-cell--3 md-cell--2-tablet md-cell--1-phone md-cell--bottom"
                                                flat
                                                type="button"
                                                onClick={() => fields.remove(optionIndex)}
                                                label="Remove"
                                            />
                                        }
                                    </li>
                                )}
                                <Button icon type="button" onClick={() => fields.push({})}>add_box</Button>
                            </div>
                        }
                    />
                    {props.editing &&
                        <LinearProgress id="submitting-menu" />
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
    form: 'editMenu',
    enableReinitialize: true,
})(EditMenu);
