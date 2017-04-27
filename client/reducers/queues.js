import * as actions from '../actions';

const queues = (state = { error: '', message: '', loading: false, editing: false, items: null }, action) => {
    switch (action.type) {
        case actions.FETCH_QUEUES.REQUEST:
            if (state.items && state.items.length) {
                return state;
            } else {
                return { ...state, loading: true };
            }
        case actions.FETCH_QUEUES.SUCCESS:
            return { ...state, loading: false, items: action.response.items || [] };
        case actions.FETCH_QUEUES.FAILURE:
            return { ...state, error: action.error, loading: false };
        case actions.EDIT_QUEUES.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.EDIT_QUEUES.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.EDIT_QUEUES.FAILURE:
            return { ...state, message: '', error: action.error, editing: false };
        case actions.CREATE_QUEUES.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.CREATE_QUEUES.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.CREATE_QUEUES.FAILURE:
            return { ...state, message: '', error: action.error, editing: false };
        case actions.DELETE_QUEUES.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.DELETE_QUEUES.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.DELETE_QUEUES.FAILURE:
            return { ...state, message: '', error: action.error, editing: false };
        default:
            return state;
    }
};

export default queues;
