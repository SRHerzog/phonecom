import fetch from 'isomorphic-fetch';

const apiUrl = process.env.NODE_ENV === 'production' ? 'http://54.165.235.107/api/' : 'http://localhost:8080/api/';

function get(url, action) {
    let queryString;
    if (url === 'available-numbers') {
        queryString = `?${Object.keys(action.filters).map(key =>
            `${key}=${action.filters[key]}`)
        .join('&')}&email=${action.email}`;
    } else {
        if (!action.id) {
            return { response: {
                items: null,
            } };
        }
        queryString = '/?id=' + action.id + '&email=' + action.email;
    }
    return fetch(apiUrl + url + queryString, {
        headers: {
            'authorization': localStorage.getItem('token'),
        },
    })
    .then(rawResponse => rawResponse.json())
    .then(response => ({ response }),
        error => ({ error }))
    .catch(error => {
        console.log('Err: ', error);
        return { error };
    });
}

function post(url, action) {
    return fetch(apiUrl + url + '?email=' + action.email + '&id=' + action.id, {
        method: 'POST',
        headers: {
            'authorization': localStorage.getItem('token'),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: action.id,
            args: action.args,
        }),
    })
    .then(rawResponse => rawResponse.json())
    .then(response => ({ response }))
    .catch((error) => {
        console.log('Err: ', error);
        return { error };
    });
}

function put(url, action) {
    return fetch(apiUrl + url + '?email=' + action.email, {
        method: 'PUT',
        headers: {
            'authorization': localStorage.getItem('token'),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: action.id,
            args: action.args,
        }),
    })
    .then(rawResponse => rawResponse.json())
    .then(response => ({response}))
    .catch((error) => {
        console.log('Err: ', error);
    });
}

function apiDelete(url, action) {
    return fetch(apiUrl + url + `?id=${action.id}&item_id=${action.item_id}&email=${action.email}`, {
        method: 'DELETE',
        headers: {
            'authorization': localStorage.getItem('token'),
        },
    })
    .then(rawResponse => rawResponse.json())
    .then(response => ({response}))
    .catch((error) => {
        console.log('Err: ', error);
    });
}

const api = {
    userLogin: post.bind(null, 'login'),
    createAccount: post.bind(null, 'signup'),

    fetchDevices: get.bind(null, 'devices'),
    fetchExtensions: get.bind(null, 'extensions'),
    fetchMenus: get.bind(null, 'menus'),
    fetchNumbers: get.bind(null, 'numbers'),
    fetchAvailable: get.bind(null, 'available-numbers'),
    fetchMedia: get.bind(null, 'media'),
    fetchQueues: get.bind(null, 'queues'),
    fetchRoutes: get.bind(null, 'routes'),
    // fetchSchedules: get.bind(null, 'schedules'),
    fetchSMSHistory: get.bind(null, 'sms'),
    fetchCallHistory: get.bind(null, 'history'),
    fetchScheduledSMS: get.bind(null, 'schedule-sms'),
    fetchScheduledCalls: get.bind(null, 'schedule-calls'),

    createDevices: post.bind(null, 'devices'),
    createExtensions: post.bind(null, 'extensions'),
    createMenus: post.bind(null, 'menus'),
    createMedia: post.bind(null, 'media'),
    createNumbers: post.bind(null, 'numbers'),
    createQueues: post.bind(null, 'queues'),
    createRoutes: post.bind(null, 'routes'),
    sendSMS: post.bind(null, 'sms'),
    createScheduledSMS: post.bind(null, 'schedule-sms'),
    sendCalls: post.bind(null, 'call'),
    createScheduledCalls: post.bind(null, 'schedule-calls'),
    // createSchedules: get.bind(null, 'schedules'),

    editAccount: put.bind(null, 'account'),
    editDevices: put.bind(null, 'devices'),
    editExtensions: put.bind(null, 'extensions'),
    editMenus: put.bind(null, 'menus'),
    editMedia: put.bind(null, 'media'),
    editNumbers: put.bind(null, 'numbers'),
    editQueues: put.bind(null, 'queues'),
    editRoutes: put.bind(null, 'routes'),
    editScheduledSMS: put.bind(null, 'schedule-sms'),
    editCalls: put.bind(null, 'schedule-calls'),
    // editSchedules: get.bind(null, 'schedules'),

    deleteDevices: apiDelete.bind(null, 'devices'),
    deleteExtensions: apiDelete.bind(null, 'extensions'),
    deleteMenus: apiDelete.bind(null, 'menus'),
    deleteMedia: apiDelete.bind(null, 'media'),
    deleteQueues: apiDelete.bind(null, 'queues'),
    deleteRoutes: apiDelete.bind(null, 'routes'),
    cancelSMS: apiDelete.bind(null, 'schedule-sms'),
    cancelCalls: apiDelete.bind(null, 'schedule-calls'),
    // deleteSchedules: get.bind(null, 'schedules'),
};

export default api;
