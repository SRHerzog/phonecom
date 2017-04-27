import * as actions from '../actions';

const initialState = {
    scheduledError: '',
    historyError: '',
    sendingError: '',
    message: '',
    loadingHistory: false,
    loadingScheduled: false,
    sending: false,
    history: [],
    scheduledItems: [],
};

const sms = (state = initialState, action) => {
    switch (action.type) {
        case actions.FETCH_SMS_HISTORY.REQUEST:
            if (state.history.length) {
                return state;
            } else {
                return { ...state, loadingHistory: true };
            }
        case actions.FETCH_SMS_HISTORY.SUCCESS:
            return { ...state, loadingHistory: false, history: action.response.items };
        case actions.FETCH_SMS_HISTORY.FAILURE:
            return { ...state, error: action.error, loading: false };
        case actions.SEND_SMS.REQUEST:
            return { ...state, message: '', sendingError: '', sending: true };
        case actions.SEND_SMS.SUCCESS:
            return { ...state, message: 'success', sending: false };
        case actions.SEND_SMS.FAILURE:
            return { ...state, message: '', sendingError: action.error, sending: false };
        case actions.FETCH_SCHEDULED_SMS.REQUEST:
            if (state.scheduledItems.length) {
                return state;
            } else {
                return { ...state, loadingScheduled: true };
            }
        case actions.FETCH_SCHEDULED_SMS.SUCCESS:
            return { ...state, loadingScheduled: false, scheduledItems: action.response.items };
        case actions.FETCH_SCHEDULED_SMS.FAILURE:
            return { ...state, error: action.error, loadingScheduled: false };
        case actions.EDIT_SCHEDULED_SMS.REQUEST:
            return { ...state, message: '', sending: true };
        case actions.EDIT_SCHEDULED_SMS.SUCCESS:
            return { ...state, message: 'success', sending: false };
        case actions.EDIT_SCHEDULED_SMS.FAILURE:
            return { ...state, message: '', error: action.error, sending: false };
        case actions.CREATE_SCHEDULED_SMS.REQUEST:
            return { ...state, message: '', sending: true };
        case actions.CREATE_SCHEDULED_SMS.SUCCESS:
            return { ...state, message: 'success', sending: false };
        case actions.CREATE_SCHEDULED_SMS.FAILURE:
            return { ...state, message: '', error: action.error, sending: false };
        case actions.DELETE_SCHEDULED_SMS.REQUEST:
            return { ...state, message: '', sending: true };
        case actions.DELETE_SCHEDULED_SMS.SUCCESS:
            return { ...state, message: 'success', sending: false };
        case actions.DELETE_SCHEDULED_SMS.FAILURE:
            return { ...state, message: '', error: action.error, sending: false };
        default:
            return state;
    }
};

export default sms;
