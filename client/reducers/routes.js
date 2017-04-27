import * as actions from '../actions';
import _ from 'lodash';

const routes = (state = { error: '', message: '', loading: true, editing: false, items: null }, action) => {
    switch (action.type) {
        case actions.FETCH_ROUTES.REQUEST:
            if (state.items && state.items.length) {
                return state;
            } else {
                return { ...state, loading: true };
            }
        case actions.FETCH_ROUTES.SUCCESS:
            return { ...state, loading: false, items: action.response.items || [] };
        case actions.FETCH_ROUTES.FAILURE:
            return { ...state, error: action.error, loading: false };
        case actions.EDIT_ROUTES.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.EDIT_ROUTES.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.EDIT_ROUTES.FAILURE:
            return { ...state, message: '', error: action.error, editing: false };
        case actions.CREATE_ROUTES.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.CREATE_ROUTES.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.CREATE_ROUTES.FAILURE:
            return { ...state, message: '', error: action.error, editing: false };
        case actions.DELETE_ROUTES.REQUEST:
            return { ...state, message: '', editing: true };
        case actions.DELETE_ROUTES.SUCCESS:
            return { ...state, message: 'success', editing: false };
        case actions.DELETE_ROUTES.FAILURE:
            return { ...state, message: '', error: action.error, editing: false };
        default:
            return state;
    }
};

export default routes;

export const getRoutesById = (routes) => {
    const routesById = {};
    _.forEach(routes, (item) => {
        routesById[item.id] = item;
    });
    return routesById;
};
