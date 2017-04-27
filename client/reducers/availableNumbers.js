import * as actions from '../actions';

const available = (state = {error: '', loading: false, items: []}, action) => {
    switch (action.type) {
        case actions.FETCH_AVAILABLE.REQUEST:
            return {...state, loading: true};
        case actions.FETCH_AVAILABLE.SUCCESS:
            return {...state, loading: false, items: action.response.items};
        case actions.FETCH_AVAILABLE.FAILURE:
            return {...state, error: action.error, loading: false};
        default:
            return state;
    }
};

export default available;
