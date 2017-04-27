import * as actions from '../actions';

const schedules = (state = {error: '', message: '', loading: true, editing: false, items: null}, action) => {
    switch (action.type) {
        case actions.FETCH_SCHEDULES.REQUEST:
            if (state.items && state.items.length) {
                return state;
            } else {
                return {...state, loading: true};
            }
        case actions.FETCH_SCHEDULES.SUCCESS:
            return {...state, loading: false, items: action.response.items || []};
        case actions.FETCH_SCHEDULES.FAILURE:
            return {...state, error: action.error, loading: false};
        case actions.EDIT_SCHEDULES.REQUEST:
            return {...state, message: '', editing: true};
        case actions.EDIT_SCHEDULES.SUCCESS:
            return {...state, message: 'success', editing: false};
        case actions.EDIT_SCHEDULES.FAILURE:
            return {...state, message: '', error: action.error, editing: false};
        case actions.CREATE_SCHEDULES.REQUEST:
            return {...state, message: '', editing: true};
        case actions.CREATE_SCHEDULES.SUCCESS:
            return {...state, message: 'success', editing: false};
        case actions.CREATE_SCHEDULES.FAILURE:
            return {...state, message: '', error: action.error, editing: false};
        case actions.DELETE_SCHEDULES.REQUEST:
            return {...state, message: '', editing: true};
        case actions.DELETE_SCHEDULES.SUCCESS:
            return {...state, message: 'success', editing: false};
        case actions.DELETE_SCHEDULES.FAILURE:
            return {...state, message: '', error: action.error, editing: false};
        default:
            return state;
    }
};

export default schedules;
