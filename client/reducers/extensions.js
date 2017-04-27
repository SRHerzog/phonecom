import * as actions from '../actions';

const extensions = (state = { error: '', message: '', loading: true, editing: false, items: null }, action) => {
    switch (action.type) {
        case actions.FETCH_EXTENSIONS.REQUEST:
            if (state.items && state.items.length) {
                return state;
            } else {
                return { ...state, loading: true };
            }
        case actions.FETCH_EXTENSIONS.SUCCESS:
            return { ...state, loading: false, items: action.response.items || [] };
        case actions.FETCH_EXTENSIONS.FAILURE:
            return { ...state, error: action.error, loading: false };
        case actions.EDIT_EXTENSIONS.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.EDIT_EXTENSIONS.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.EDIT_EXTENSIONS.FAILURE:
            return { ...state, message: '', error: action.error, editing: false };
        case actions.CREATE_EXTENSIONS.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.CREATE_EXTENSIONS.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.CREATE_EXTENSIONS.FAILURE:
            return { ...state, message: '', error: action.error, editing: false };
        case actions.DELETE_EXTENSIONS.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.DELETE_EXTENSIONS.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.DELETE_EXTENSIONS.FAILURE:
            return { ...state, message: '', error: action.error, editing: false };
        default:
            return state;
    }
};

export default extensions;
