import * as actions from '../actions';

const initialState = {
    scheduledError: '',
    historyError: '',
    dialingError: '',
    message: '',
    loadingHistory: false,
    loadingScheduled: false,
    sending: false,
    history: [],
    scheduledItems: [],
};

const calls = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCH_CALL_HISTORY.REQUEST:
            if (state.history.length) {
                return { ...state, historyError: '' };
            } else {
                return { ...state, historyError: '', loadingHistory: true };
            }
        case actions.FETCH_CALL_HISTORY.SUCCESS:
            return { ...state, loadingHistory: false, history: action.response.items };
        case actions.FETCH_CALL_HISTORY.FAILURE:
            return { ...state, historyError: action.error, loadingHistory: false };
        case actions.SEND_CALLS.REQUEST:
            return { ...state, dialingError: '', message: '', sending: true };
        case actions.SEND_CALLS.SUCCESS:
            return { ...state, message: 'success', sending: false };
        case actions.SEND_CALLS.FAILURE:
            return { ...state, message: '', dialingError: action.error, sending: false };
        case actions.FETCH_SCHEDULED_CALLS.REQUEST:
            if (state.scheduledItems.length) {
                return { ...state, scheduledError: '' };
            } else {
                return { ...state, scheduledError: '', loadingScheduled: true };
            }
        case actions.FETCH_SCHEDULED_CALLS.SUCCESS:
            return { ...state, loadingScheduled: false, scheduledItems: action.response.items };
        case actions.FETCH_SCHEDULED_CALLS.FAILURE:
            return { ...state, scheduledError: action.error, loadingScheduled: false };
        case actions.EDIT_SCHEDULED_CALLS.REQUEST:
            return { ...state, message: '', scheduledError: '', sending: true };
        case actions.EDIT_SCHEDULED_CALLS.SUCCESS:
            return { ...state, message: 'edit success', sending: false };
        case actions.EDIT_SCHEDULED_CALLS.FAILURE:
            return { ...state, message: '', scheduledError: action.error, sending: false };
        case actions.CREATE_SCHEDULED_CALLS.REQUEST:
            return { ...state, message: '', scheduledError: '', sending: true };
        case actions.CREATE_SCHEDULED_CALLS.SUCCESS:
            return { ...state, message: 'create success', sending: false };
        case actions.CREATE_SCHEDULED_CALLS.FAILURE:
            return { ...state, message: '', scheduledError: action.error, sending: false };
        case actions.DELETE_SCHEDULED_CALLS.REQUEST:
            return { ...state, message: '', scheduledError: '', sending: true };
        case actions.DELETE_SCHEDULED_CALLS.SUCCESS:
            return { ...state, message: 'delete success', sending: false };
        case actions.DELETE_SCHEDULED_CALLS.FAILURE:
            return { ...state, message: '', scheduledError: action.error, sending: false };
        default:
            return state;
    }
};

export default calls;
