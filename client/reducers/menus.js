import * as actions from '../actions';

const menus = (state = {
    error: '',
    loading: false,
    editing: false,
    message: '',
    items: null
}, action) => {
    switch (action.type) {
        case actions.FETCH_MENUS.REQUEST:
            if (state.items && state.items.length) {
                return state;
            } else {
                return { ...state, loading: true };
            }
        case actions.FETCH_MENUS.SUCCESS:
            return { ...state, loading: false, items: action.response.items || [] };
        case actions.FETCH_MENUS.FAILURE:
            return { ...state, error: action.error, loading: false };
        case actions.EDIT_MENUS.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.EDIT_MENUS.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.EDIT_MENUS.FAILURE:
            return { ...state, message: '', error: action.error, editing: true };
        case actions.CREATE_MENUS.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.CREATE_MENUS.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.CREATE_MENUS.FAILURE:
            return { ...state, message: '', error: action.error, editing: true };
        case actions.DELETE_MENUS.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.DELETE_MENUS.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.DELETE_MENUS.FAILURE:
            return { ...state, message: '', error: action.error, editing: false };
        default:
            return state;
    }
};

export default menus;
