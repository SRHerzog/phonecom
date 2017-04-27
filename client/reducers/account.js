import * as actions from '../actions';

const account = (state = {error: '', loading: true, id: 0, details: localStorage.getItem('account') || {}}, action) => {
    switch (action.type) {
        case actions.USER_LOGIN.REQUEST:
            return {...state, loading: true};
        case actions.USER_LOGIN.SUCCESS:
            return {...state, loading: false, id: action.response.account.id, details: action.response.account};
        case actions.USER_LOGIN.FAILURE:
            return {...state, error: action.error, loading: false, id: 0};
        case actions.EDIT_ACCOUNT.REQUEST:
            return {...state, loading: true};
        case actions.EDIT_ACCOUNT.SUCCESS:
            return {...state, loading: false, details: action.response};
        case actions.EDIT_ACCOUNT.FAILURE:
            return {...state, error: action.error, loading: false};
        case actions.CREATE_ACCOUNT.REQUEST:
            return {...state, loading: true};
        case actions.CREATE_ACCOUNT.SUCCESS:
            return {...state, loading: false, details: action.account};
        case actions.CREATE_ACCOUNT.FAILURE:
            return {...state, error: action.error, loading: false};
        default:
            return state;
    }
};

export default account;
