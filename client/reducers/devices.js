import * as actions from '../actions';

const devices = (state = {error: '', message: '', loading: true, editing: false, items: null}, action) => {
    switch (action.type) {
        case actions.FETCH_DEVICES.REQUEST:
            if (state.items && state.items.length) {
                return state;
            } else {
                return {...state, loading: true};
            }
        case actions.FETCH_DEVICES.SUCCESS:
            return {...state, loading: false, items: action.response.items || []};
        case actions.FETCH_DEVICES.FAILURE:
            return {...state, error: action.error, loading: false};
        case actions.EDIT_DEVICES.REQUEST:
            return {...state, message: '', editing: true};
        case actions.EDIT_DEVICES.SUCCESS:
            return {...state, message: 'success', editing: false};
        case actions.EDIT_DEVICES.FAILURE:
            return {...state, message: '', error: action.error, editing: false};
        case actions.CREATE_DEVICES.REQUEST:
            return {...state, message: '', editing: true};
        case actions.CREATE_DEVICES.SUCCESS:
            return {...state, message: 'success', editing: false};
        case actions.CREATE_DEVICES.FAILURE:
            return {...state, message: '', error: action.error, editing: false};
        default:
            return state;
    }
};

export default devices;
