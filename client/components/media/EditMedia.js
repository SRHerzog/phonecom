import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Button from 'react-md/lib/Buttons';
import Dialog from 'react-md/lib/Dialogs';
import Toolbar from 'react-md/lib/Toolbars';

import { renderTextField, renderSelectField, styles } from '../reusables';

const title = 'Add/edit media';

const voices = [
    'allison',
    'amy',
    'belle',
    'callie',
    'callieq',
    'dallas',
    'damien',
    'david',
    'designerdave',
    'diane',
    'diesel',
    'dog',
    'duchess',
    'duncan',
    'emily',
    'evilgenius',
    'frank',
    'french-fry',
    'gregory',
    'isabelle',
    'jean-pierre',
    'jerkface',
    'katrin',
    'kayla',
    'kidaroo',
    'lawrence',
    'layo',
    'linda',
    'marta',
    'matthias',
    'miguel',
    'millie',
    'princess',
    'ransomnote',
    'robin',
    'shouty',
    'shygirl',
    'tamika',
    'tophat',
    'vittoria',
    'vixen',
    'vlad',
    'walter',
    'whispery',
    'william',
    'wiseguy',
    'zach',
];

class EditMedia extends Component {
    componentWillReceiveProps(newProps) {
        if (this.props.visible !== newProps.visible) {
            this.props.reset();
        }
    }

    render() {
        const { handleSubmit, onHide, visible } = this.props;
        const smallScreen = (document.documentElement.clientWidth <= 550);
        const closeButton = <Button icon type="button" onClick={onHide}>cancel</Button>;
        const submitButton = <Button flat primary label="submit" type="submit" />;
        return (
            <Dialog
                id="editMedia"
                fullPage={!!smallScreen}
                title={smallScreen ? title : undefined}
                aria-labelledby="dialogHeader"
                dialogStyle={smallScreen ? styles.fullPageStyle : styles.dialogStyle}
                visible={visible}
                onHide={onHide}
                lastChild
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
                    <div className={smallScreen ? 'md-toolbar-relative md-grid' : 'md-grid'}>
                        {!smallScreen &&
                            <header>
                                <h2 id="dialogHeader">{title}</h2>
                            </header>
                        }
                        <Field
                            component={renderTextField}
                            className="md-cell--12"
                            type="text"
                            label="Media name"
                            id="name"
                            name="name"
                            required
                        />
                        <Field
                            component={renderTextField}
                            rows={2}
                            maxLength={800}
                            className="md-cell--12"
                            lineDirection="right"
                            type="text"
                            label="Message (max 800 characters)"
                            id="tts_text"
                            name="tts_text"
                            required
                        />
                        <Field
                            component={renderSelectField}
                            className="md-cell--12"
                            label="TTS voice"
                            id="tts_voice"
                            name="tts_voice"
                            menuItems={voices}
                        />
                        <p style={{ fontSize: '9px' }}>
                            <a href="http://www.voiceforge.com/demo" target="_blank">Listen to voice samples</a>
                        </p>
                        <Field
                            component={renderTextField}
                            rows={2}
                            maxLength={800}
                            className="md-cell--12"
                            label="Notes"
                            id="notes"
                            name="notes"
                        />
                        {this.props.editing ?
                            <LinearProgress id="submitting-media" /> : null
                        }
                        <div style={{ float: 'right' }}>
                            <Button
                                flat
                                className="md-cell--right"
                                label="cancel"
                                type="button"
                                onClick={onHide}
                                disabled={this.props.editing}
                            />
                            <Button
                                flat
                                primary
                                className="md-cell--right"
                                label="submit"
                                type="submit"
                                disabled={this.props.editing}
                            />
                        </div>
                    </div>
                </form>
            </Dialog>
        );
    }
}

export default reduxForm({
    form: 'editMedia',
    enableReinitialize: true,
    initialValues: { origin: 'tts', type: 'greeting' },
})(EditMedia);
