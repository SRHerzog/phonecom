import * as actions from '../actions';
import _ from 'lodash';

const snackbar = (state = {toasts: [], autohide: true}, action) => {
    const toasts = _.clone(state.toasts);
    switch (action.type) {
        case actions.SET_SNACKBAR:
            toasts.push({text: action.toast});
            return {
                toasts,
                autohide: state.autohide,
            };
        case actions.REMOVE_TOAST:
            toasts.shift();
            return {
                toasts,
                autohide: state.autohide,
            };
        default:
            if (action.type.slice(-7) === 'FAILURE' &&
                (action.type.slice(4) === 'EDIT' || action.type.slice(6) === 'CREATE')) {
                toasts.push({ text: action.error });
                return {
                    toasts,
                    autohide: state.autohide,
                };
            }
            return state;
    }
};

export default snackbar;
