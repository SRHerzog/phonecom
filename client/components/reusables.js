import React from 'react';
import InputMask from 'react-input-mask';

import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';

export const renderTextField = ({ input, meta: { touched, error }, ...others }) => (
    <TextField
        {...input}
        {...others}
        error={touched && !!error}
        errorText={error}
    />
);

export const renderSelectField = ({ input, meta: { touched, error }, ...others }) => (
    <SelectField
        {...input}
        {...others}
        error={touched && !!error}
        errorText={error}
    />
);

export const renderCheckbox = ({ input, meta: { touched, error }, ...others }) => (
    <Checkbox
        {...others}
        checked={input.value.enabled}
    />
);

export const selectField = props => (
    <div className={props.className}>
        <label>
            {props.inline ? props.formLabel : <p>{props.formLabel}</p>}
            <select {...props.input}>
                <option value={null}>Select...</option>
                {props.items && props.items.map(item => {
                    if (props.type === 'numbers' || props.type === 'text') {
                        return <option key={item}>{item}</option>;
                    } else if (props.type === 'phone_number') {
                        return <option value={item.phone_number} key={item.phone_number}>{item.name}</option>;
                    } else if (props.type === 'hold_music' && item.type === 'hold_music' ||
                        props.type !== 'hold_music' && item.type !== 'hold_music') {
                        return <option value={item.id} key={item.id || 0}>{item.name}</option>;
                    } else {
                        return '';
                    }
                })}
            </select>
        </label>
    </div>
);

export const dateTimeField = props => (
        <label>{props.label}
            <InputMask
                mask="19/39/2199 19:59 am"
                formatChars={{
                    '1': '[0-1]',
                    '2': '[0-2]',
                    '3': '[0-3]',
                    '5': '[0-5]',
                    '9': '[0-9]',
                    'a': '[ap]',
                    'm': 'm',
                }}
                {...props.input}
            />
        </label>
);

export const phoneInput = props => (
    <label>{props.label}
        <InputMask
            mask="(999) 999-9999"
            {...props.input}
        />
    </label>
);

export const styles = {
    buttonColumn: {
        paddingTop: 0,
        paddingBottom: 0,
        verticalAlign: 'auto',
    },
    dialogStyle: {
        width: '90%',
        maxWidth: '500px',
        maxHeight: '800px',
        overflowY: 'scroll',
    },
    fullPageStyle: {
        padding: '10px',
    },
    textColumn: {
        wordWrap: 'break-word',
        whiteSpace: 'normal',
        width: '200px',
    },
};
