import * as actions from '../actions';

const media = (state = {
    error: '',
    loading: false,
    editing: false,
    message: '',
    items: null,
}, action) => {
    switch (action.type) {
        case actions.FETCH_MEDIA.REQUEST:
            if (state.items && state.items.length) {
                return state;
            } else {
                return { ...state, loading: true };
            }
        case actions.FETCH_MEDIA.SUCCESS:
            return { ...state, loading: false, items: action.response.items || [] };
        case actions.FETCH_MEDIA.FAILURE:
            return { ...state, error: action.error, loading: false };
        case actions.EDIT_MEDIA.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.EDIT_MEDIA.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.EDIT_MEDIA.FAILURE:
            return { ...state, message: '', error: action.error, editing: true };
        case actions.CREATE_MEDIA.REQUEST:
            return { ...state, editing: true, error: '', message: '' };
        case actions.CREATE_MEDIA.SUCCESS:
            return { ...state, editing: false, message: 'success' };
        case actions.CREATE_MEDIA.FAILURE:
            return { ...state, editing: false, error: action.error };
        case actions.DELETE_MEDIA.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.DELETE_MEDIA.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.DELETE_MEDIA.FAILURE:
            return { ...state, message: '', error: action.error, editing: false };
        default:
            return state;
    }
};

export default media;
