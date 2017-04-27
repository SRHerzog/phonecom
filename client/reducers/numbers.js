import * as actions from '../actions';

const numbers = (state = {
    error: '',
    purchaseError: '',
    message: '',
    purchaseMessage: '',
    loading: true,
    editing: false,
    purchasing: false,
    items: null,
}, action) => {
    switch (action.type) {
        case actions.FETCH_NUMBERS.REQUEST:
            if (state.items && state.items.length) {
                return state;
            } else {
                return { ...state, loading: true };
            }
        case actions.FETCH_NUMBERS.SUCCESS:
            return { ...state, loading: false, items: action.response.items || [] };
        case actions.FETCH_NUMBERS.FAILURE:
            return { ...state, error: action.error, loading: false };
        case actions.EDIT_NUMBERS.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.EDIT_NUMBERS.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.EDIT_NUMBERS.FAILURE:
            return { ...state, message: '', error: action.error, editing: false };
        case actions.CREATE_NUMBERS.REQUEST:
            return { ...state, purchaseMessage: '', purchaseError: '', purchasing: true };
        case actions.CREATE_NUMBERS.SUCCESS:
            return { ...state, purchaseMessage: 'success', purchasing: false };
        case actions.CREATE_NUMBERS.FAILURE:
            return { ...state, purchaseMessage: '', purchaseError: action.error, purchasing: false };
        default:
            return state;
    }
};

export default numbers;
