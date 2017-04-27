import { takeLatest, delay } from 'redux-saga';
import { call, select, put } from 'redux-saga/effects';
import { change } from 'redux-form';
import { browserHistory } from 'react-router';
import _ from 'lodash';

import * as actions from '../actions';
import api from '../api';

const getAccountId = (state) => state.account.id;
const getAccountEmail = (state) => {
    if (state && state.account && state.account.details && state.account.details.contact) {
        return state.account.details.contact.primary_email;
    }
    return JSON.parse(localStorage.getItem('account')).username;
};

const apiMap = [
    'userLogin',
    'createAccount',
    'editAccount',
    'fetchAvailable',
    'fetchSMSHistory',
    'fetchCallHistory',
    'sendSMS',
    'sendCalls',
];

const entityTypes = [
    'Devices',
    'Extensions',
    'Numbers',
    'Menus',
    'Media',
    'Queues',
    'Routes',
    'ScheduledSMS',
    'ScheduledCalls',
];

_.forEach(['fetch', 'create', 'edit', 'delete'], (type) => {
    _.forEach(entityTypes, (entity) => {
        apiMap.push(type + entity);
    });
});

function* fetchEntitySaga(entity, apiFunction, logout, action) {
    if (action.type !== actions.USER_LOGIN.REQUEST) {
        const userId = yield select(getAccountId);
        const email = yield select(getAccountEmail);
        action.id = userId;
        action.email = encodeURIComponent(email);
    }
    const { response } = yield call(apiFunction, action);
    if (!response.error) {
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('account', JSON.stringify(response.account));
            browserHistory.push('/numbers');
        }
        yield put(entity.success(response));
        if (action.args && action.args.next) {
            if (action.args.next.responseType === 'queue') {
                action.args.next.payload.rules[0].actions[0].queue = response.id;
            } else if (action.args.next.memo === 'memo') {
                action.args.next.payload.next.memo = response.id;
            }
            if (action.args.next.type === 'change') {
                yield delay(50);
                yield put(change(action.args.next.form, action.args.next.field, action.args.next.memo));
            } else {
                yield put(action.args.next.type(action.args.next.payload));
            }
        }
    } else {
        if (response.error.status === 401) {
            yield put(entity.failure(response.error));
        } else {
            yield put(entity.failure(response.error));
        }
        if (action.type.slice(0, 1) === 'D') {
            yield put(actions.setSnackbar('Failed to delete. This item may be in use by another number, menu, queue, route, or extension.'));
        }
    }
}

function fetchEntity(entity, apiFunction) {
    return fetchEntitySaga.bind(null, entity, apiFunction, actions.userLogout);
}

export function* takeLatestRequest(entity, apiFunction) {
     yield takeLatest(entity.types.REQUEST, fetchEntity(entity, apiFunction));
}

export default function* fetchers() {
    yield [
        ...apiMap.map((fetcher) => {
            return takeLatestRequest(actions[fetcher], api[fetcher]);
        }),
    ];
}
