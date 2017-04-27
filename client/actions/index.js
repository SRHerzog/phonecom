const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

function createRequestTypes(base) {
	return [REQUEST, SUCCESS, FAILURE].reduce((act, type) => {
		act[type] = `${base}_${type}`;
		return act;
	}, {});
}

function action(type, payload = {}) {
	return { type, ...payload };
}

export const USER_LOGIN = createRequestTypes('USER_LOGIN');
export const userLogin = {
	request: (args) => action(USER_LOGIN.REQUEST, { args }),
	success: (response) => action(USER_LOGIN.SUCCESS, { response }),
	failure: (error) => action(USER_LOGIN.FAILURE, { error }),
	types: USER_LOGIN,
};

export const CREATE_ACCOUNT = createRequestTypes('CREATE_ACCOUNT');
export const createAccount = {
    request: (args) => action(CREATE_ACCOUNT.REQUEST, { args }),
    success: (response) => action(CREATE_ACCOUNT.SUCCESS, { response }),
    failure: (error) => action(CREATE_ACCOUNT.FAILURE, { error }),
    types: CREATE_ACCOUNT,
};

export const EDIT_ACCOUNT = createRequestTypes('EDIT_ACCOUNT');
export const editAccount = {
    request: (args) => action(EDIT_ACCOUNT.REQUEST, { args }),
    success: (response) => action(EDIT_ACCOUNT.SUCCESS, { response }),
    failure: (error) => action(EDIT_ACCOUNT.FAILURE, { error }),
    types: EDIT_ACCOUNT,
};

export const FETCH_AVAILABLE = createRequestTypes('FETCH_AVAILABLE');
export const fetchAvailable = {
    request: ({ filters, offset }) => action(FETCH_AVAILABLE.REQUEST, { filters: { ...filters, offset } }),
    success: (response) => action(FETCH_AVAILABLE.SUCCESS, { response }),
    failure: (error) => action(FETCH_AVAILABLE.FAILURE, { error }),
    types: FETCH_AVAILABLE,
};

export const FETCH_MEDIA = createRequestTypes('FETCH_MEDIA');
export const fetchMedia = {
    request: () => action(FETCH_MEDIA.REQUEST),
    success: (response) => action(FETCH_MEDIA.SUCCESS, { response }),
    failure: (error) => action(FETCH_MEDIA.FAILURE, { error }),
    types: FETCH_MEDIA,
};

export const USER_LOGOUT = 'USER_LOGOUT';
export const userLogout = () => action(USER_LOGOUT);

export const FETCH_EXTENSIONS = createRequestTypes('FETCH_EXTENSIONS');
export const fetchExtensions = {
    request: () => action(FETCH_EXTENSIONS.REQUEST),
    success: (response) => action(FETCH_EXTENSIONS.SUCCESS, { response }),
    failure: (error) => action(FETCH_EXTENSIONS.FAILURE, { error }),
    types: FETCH_EXTENSIONS,
};

export const FETCH_DEVICES = createRequestTypes('FETCH_DEVICES');
export const fetchDevices = {
    request: () => action(FETCH_DEVICES.REQUEST),
    success: (response) => action(FETCH_DEVICES.SUCCESS, { response }),
    failure: (error) => action(FETCH_DEVICES.FAILURE, { error }),
    types: FETCH_DEVICES,
};

export const FETCH_NUMBERS = createRequestTypes('FETCH_NUMBERS');
export const fetchNumbers = {
    request: () => action(FETCH_NUMBERS.REQUEST),
    success: (response) => action(FETCH_NUMBERS.SUCCESS, { response }),
    failure: (error) => action(FETCH_NUMBERS.FAILURE, { error }),
    types: FETCH_NUMBERS,
};

export const FETCH_MENUS = createRequestTypes('FETCH_MENUS');
export const fetchMenus = {
    request: () => action(FETCH_MENUS.REQUEST),
    success: (response) => action(FETCH_MENUS.SUCCESS, { response }),
    failure: (error) => action(FETCH_MENUS.FAILURE, { error }),
    types: FETCH_MENUS,
};

export const FETCH_QUEUES = createRequestTypes('FETCH_QUEUES');
export const fetchQueues = {
    request: () => action(FETCH_QUEUES.REQUEST),
    success: (response) => action(FETCH_QUEUES.SUCCESS, { response }),
    failure: (error) => action(FETCH_QUEUES.FAILURE, { error }),
    types: FETCH_QUEUES,
};

export const FETCH_ROUTES = createRequestTypes('FETCH_ROUTES');
export const fetchRoutes = {
    request: (args) => action(FETCH_ROUTES.REQUEST, { args }),
    success: (response) => action(FETCH_ROUTES.SUCCESS, { response }),
    failure: (error) => action(FETCH_ROUTES.FAILURE, { error }),
    types: FETCH_ROUTES,
};

export const FETCH_SCHEDULES = createRequestTypes('FETCH_SCHEDULES');
export const fetchSchedules = {
    request: () => action(FETCH_SCHEDULES.REQUEST),
    success: (response) => action(FETCH_SCHEDULES.SUCCESS, { response }),
    failure: (error) => action(FETCH_SCHEDULES.FAILURE, { error }),
    types: FETCH_SCHEDULES,
};

export const FETCH_SMS_HISTORY = createRequestTypes('FETCH_SMS_HISTORY');
export const fetchSMSHistory = {
    request: () => action(FETCH_SMS_HISTORY.REQUEST),
    success: (response) => action(FETCH_SMS_HISTORY.SUCCESS, { response }),
    failure: (error) => action(FETCH_SMS_HISTORY.FAILURE, { error }),
    types: FETCH_SMS_HISTORY,
};

export const FETCH_SCHEDULED_SMS = createRequestTypes('FETCH_SCHEDULED_SMS');
export const fetchScheduledSMS = {
    request: () => action(FETCH_SCHEDULED_SMS.REQUEST),
    success: (response) => action(FETCH_SCHEDULED_SMS.SUCCESS, { response }),
    failure: (error) => action(FETCH_SCHEDULED_SMS.FAILURE, { error }),
    types: FETCH_SCHEDULED_SMS,
};

export const FETCH_CALL_HISTORY = createRequestTypes('FETCH_CALL_HISTORY');
export const fetchCallHistory = {
    request: () => action(FETCH_CALL_HISTORY.REQUEST),
    success: (response) => action(FETCH_CALL_HISTORY.SUCCESS, { response }),
    failure: (error) => action(FETCH_CALL_HISTORY.FAILURE, { error }),
    types: FETCH_CALL_HISTORY,
};

export const FETCH_SCHEDULED_CALLS = createRequestTypes('FETCH_SCHEDULED_CALLS');
export const fetchScheduledCalls = {
    request: () => action(FETCH_SCHEDULED_CALLS.REQUEST),
    success: (response) => action(FETCH_SCHEDULED_CALLS.SUCCESS, { response }),
    failure: (error) => action(FETCH_SCHEDULED_CALLS.FAILURE, { error }),
    types: FETCH_SCHEDULED_CALLS,
};

export const CREATE_NUMBERS = createRequestTypes('CREATE_NUMBERS');
export const createNumbers = {
    request: (args) => action(CREATE_NUMBERS.REQUEST, { args }),
    success: (response) => action(CREATE_NUMBERS.SUCCESS, { response }),
    failure: (error) => action(CREATE_NUMBERS.FAILURE, { error }),
    types: CREATE_NUMBERS,
};

export const CREATE_DEVICES = createRequestTypes('CREATE_DEVICES');
export const createDevices = {
    request: (args) => action(CREATE_DEVICES.REQUEST, { args }),
    success: (response) => action(CREATE_DEVICES.SUCCESS, { response }),
    failure: (error) => action(CREATE_DEVICES.FAILURE, { error }),
    types: CREATE_DEVICES,
};

export const CREATE_EXTENSIONS = createRequestTypes('CREATE_EXTENSIONS');
export const createExtensions = {
    request: (args) => action(CREATE_EXTENSIONS.REQUEST, { args }),
    success: (response) => action(CREATE_EXTENSIONS.SUCCESS, { response }),
    failure: (error) => action(CREATE_EXTENSIONS.FAILURE, { error }),
    types: CREATE_EXTENSIONS,
};

export const CREATE_MENUS = createRequestTypes('CREATE_MENUS');
export const createMenus = {
    request: (args) => action(CREATE_MENUS.REQUEST, { args }),
    success: (response) => action(CREATE_MENUS.SUCCESS, { response }),
    failure: (error) => action(CREATE_MENUS.FAILURE, { error }),
    types: CREATE_MENUS,
};

export const CREATE_QUEUES = createRequestTypes('CREATE_QUEUES');
export const createQueues = {
    request: (args) => action(CREATE_QUEUES.REQUEST, { args }),
    success: (response) => action(CREATE_QUEUES.SUCCESS, { response }),
    failure: (error) => action(CREATE_QUEUES.FAILURE, { error }),
    types: CREATE_QUEUES,
};

export const CREATE_ROUTES = createRequestTypes('CREATE_ROUTES');
export const createRoutes = {
    request: (args) => action(CREATE_ROUTES.REQUEST, { args }),
    success: (response) => action(CREATE_ROUTES.SUCCESS, { response }),
    failure: (error) => action(CREATE_ROUTES.FAILURE, { error }),
    types: CREATE_ROUTES,
};

export const CREATE_MEDIA = createRequestTypes('CREATE_MEDIA');
export const createMedia = {
    request: (args) => action(CREATE_MEDIA.REQUEST, { args }),
    success: (response) => action(CREATE_MEDIA.SUCCESS, { response }),
    failure: (error) => action(CREATE_MEDIA.FAILURE, { error }),
    types: CREATE_MEDIA,
};

export const SEND_SMS = createRequestTypes('SEND_SMS');
export const sendSMS = {
    request: (args) => action(SEND_SMS.REQUEST, { args }),
    success: (response) => action(SEND_SMS.SUCCESS, { response }),
    failure: (error) => action(SEND_SMS.FAILURE, { error }),
    types: SEND_SMS,
};

export const SEND_CALLS = createRequestTypes('SEND_CALLS');
export const sendCalls = {
    request: (args) => action(SEND_CALLS.REQUEST, { args }),
    success: (response) => action(SEND_CALLS.SUCCESS, { response }),
    failure: (error) => action(SEND_CALLS.FAILURE, { error }),
    types: SEND_CALLS,
};

export const CREATE_SCHEDULED_SMS = createRequestTypes('CREATE_SCHEDULED_SMS');
export const createScheduledSMS = {
    request: (args) => action(CREATE_SCHEDULED_SMS.REQUEST, { args }),
    success: (response) => action(CREATE_SCHEDULED_SMS.SUCCESS, { response }),
    failure: (error) => action(CREATE_SCHEDULED_SMS.FAILURE, { error }),
    types: CREATE_SCHEDULED_SMS,
};

export const CREATE_SCHEDULED_CALLS = createRequestTypes('CREATE_SCHEDULED_CALLS');
export const createScheduledCalls = {
    request: (args) => action(CREATE_SCHEDULED_CALLS.REQUEST, { args }),
    success: (response) => action(CREATE_SCHEDULED_CALLS.SUCCESS, { response }),
    failure: (error) => action(CREATE_SCHEDULED_CALLS.FAILURE, { error }),
    types: CREATE_SCHEDULED_CALLS,
};

export const CREATE_SCHEDULES = createRequestTypes('CREATE_SCHEDULES');
export const createSchedules = {
    request: () => action(CREATE_SCHEDULES.REQUEST),
    success: (response) => action(CREATE_SCHEDULES.SUCCESS, { response }),
    failure: (error) => action(CREATE_SCHEDULES.FAILURE, { error }),
    types: CREATE_SCHEDULES,
};

export const EDIT_NUMBERS = createRequestTypes('EDIT_NUMBERS');
export const editNumbers = {
    request: (args) => action(EDIT_NUMBERS.REQUEST, { args }),
    success: (response) => action(EDIT_NUMBERS.SUCCESS, { response }),
    failure: (error) => action(EDIT_NUMBERS.FAILURE, { error }),
    types: EDIT_NUMBERS,
};

export const EDIT_DEVICES = createRequestTypes('EDIT_DEVICES');
export const editDevices = {
    request: (args) => action(EDIT_DEVICES.REQUEST, { args }),
    success: (response) => action(EDIT_DEVICES.SUCCESS, { response }),
    failure: (error) => action(EDIT_DEVICES.FAILURE, { error }),
    types: EDIT_DEVICES,
};

export const EDIT_EXTENSIONS = createRequestTypes('EDIT_EXTENSIONS');
export const editExtensions = {
    request: (args) => action(EDIT_EXTENSIONS.REQUEST, { args }),
    success: (response) => action(EDIT_EXTENSIONS.SUCCESS, { response }),
    failure: (error) => action(EDIT_EXTENSIONS.FAILURE, { error }),
    types: EDIT_EXTENSIONS,
};

export const EDIT_MENUS = createRequestTypes('EDIT_MENUS');
export const editMenus = {
    request: (args) => action(EDIT_MENUS.REQUEST, { args }),
    success: (response) => action(EDIT_MENUS.SUCCESS, { response }),
    failure: (error) => action(EDIT_MENUS.FAILURE, { error }),
    types: EDIT_MENUS,
};

export const EDIT_MEDIA = createRequestTypes('EDIT_MEDIA');
export const editMedia = {
    request: (args) => action(EDIT_MEDIA.REQUEST, { args }),
    success: (response) => action(EDIT_MEDIA.SUCCESS, { response }),
    failure: (error) => action(EDIT_MEDIA.FAILURE, { error }),
    types: EDIT_MEDIA,
};

export const EDIT_QUEUES = createRequestTypes('EDIT_QUEUES');
export const editQueues = {
    request: (args) => action(EDIT_QUEUES.REQUEST, { args }),
    success: (response) => action(EDIT_QUEUES.SUCCESS, { response }),
    failure: (error) => action(EDIT_QUEUES.FAILURE, { error }),
    types: EDIT_QUEUES,
};

export const EDIT_ROUTES = createRequestTypes('EDIT_ROUTES');
export const editRoutes = {
    request: (args) => action(EDIT_ROUTES.REQUEST, { args }),
    success: (response) => action(EDIT_ROUTES.SUCCESS, { response }),
    failure: (error) => action(EDIT_ROUTES.FAILURE, { error }),
    types: EDIT_ROUTES,
};

export const EDIT_SCHEDULED_SMS = createRequestTypes('EDIT_SCHEDULED_SMS');
export const editScheduledSMS = {
    request: (args) => action(EDIT_SCHEDULED_SMS.REQUEST, { args }),
    success: (response) => action(EDIT_SCHEDULED_SMS.SUCCESS, { response }),
    failure: (error) => action(EDIT_SCHEDULED_SMS.FAILURE, { error }),
    types: EDIT_SCHEDULED_SMS,
};

export const EDIT_SCHEDULED_CALLS = createRequestTypes('EDIT_SCHEDULED_CALLS');
export const editScheduledCalls = {
    request: (args) => action(EDIT_SCHEDULED_CALLS.REQUEST, { args }),
    success: (response) => action(EDIT_SCHEDULED_CALLS.SUCCESS, { response }),
    failure: (error) => action(EDIT_SCHEDULED_CALLS.FAILURE, { error }),
    types: EDIT_SCHEDULED_CALLS,
};

export const EDIT_SCHEDULES = createRequestTypes('EDIT_SCHEDULES');
export const editSchedules = {
    request: (args) => action(EDIT_SCHEDULES.REQUES, { args }),
    success: (response) => action(EDIT_SCHEDULES.SUCCESS, { response }),
    failure: (error) => action(EDIT_SCHEDULES.FAILURE, { error }),
    types: EDIT_SCHEDULES,
};

export const DELETE_NUMBERS = createRequestTypes('DELETE_NUMBERS');
export const deleteNumbers = {
    request: (args) => action(DELETE_NUMBERS.REQUEST, { args }),
    success: (response) => action(DELETE_NUMBERS.SUCCESS, { response }),
    failure: (error) => action(DELETE_NUMBERS.FAILURE, { error }),
    types: DELETE_NUMBERS,
};

export const DELETE_DEVICES = createRequestTypes('DELETE_DEVICES');
export const deleteDevices = {
    request: () => action(DELETE_DEVICES.REQUEST),
    success: (response) => action(DELETE_DEVICES.SUCCESS, { response }),
    failure: (error) => action(DELETE_DEVICES.FAILURE, { error }),
    types: DELETE_DEVICES,
};

export const DELETE_EXTENSIONS = createRequestTypes('DELETE_EXTENSIONS');
export const deleteExtensions = {
    request: (item_id) => action(DELETE_EXTENSIONS.REQUEST, { item_id }),
    success: (response) => action(DELETE_EXTENSIONS.SUCCESS, { response }),
    failure: (error) => action(DELETE_EXTENSIONS.FAILURE, { error }),
    types: DELETE_EXTENSIONS,
};

export const DELETE_MENUS = createRequestTypes('DELETE_MENUS');
export const deleteMenus = {
    request: (item_id) => action(DELETE_MENUS.REQUEST, { item_id }),
    success: (response) => action(DELETE_MENUS.SUCCESS, { response }),
    failure: (error) => action(DELETE_MENUS.FAILURE, { error }),
    types: DELETE_MENUS,
};

export const DELETE_MEDIA = createRequestTypes('DELETE_MEDIA');
export const deleteMedia = {
    request: (item_id) => action(DELETE_MEDIA.REQUEST, { item_id }),
    success: (response) => action(DELETE_MEDIA.SUCCESS, { response }),
    failure: (error) => action(DELETE_MEDIA.FAILURE, { error }),
    types: DELETE_MEDIA,
};

export const DELETE_QUEUES = createRequestTypes('DELETE_QUEUES');
export const deleteQueues = {
    request: (item_id) => action(DELETE_QUEUES.REQUEST, { item_id }),
    success: (response) => action(DELETE_QUEUES.SUCCESS, { response }),
    failure: (error) => action(DELETE_QUEUES.FAILURE, { error }),
    types: DELETE_QUEUES,
};

export const DELETE_ROUTES = createRequestTypes('DELETE_ROUTES');
export const deleteRoutes = {
    request: (item_id) => action(DELETE_ROUTES.REQUEST, { item_id }),
    success: (response) => action(DELETE_ROUTES.SUCCESS, { response }),
    failure: (error) => action(DELETE_ROUTES.FAILURE, { error }),
    types: DELETE_ROUTES,
};

export const DELETE_SCHEDULED_SMS = createRequestTypes('DELETE_SCHEDULED_SMS');
export const deleteScheduledSMS = {
    request: (args) => action(DELETE_SCHEDULED_SMS.REQUEST, { args }),
    success: (response) => action(DELETE_SCHEDULED_SMS.SUCCESS, { response }),
    failure: (error) => action(DELETE_SCHEDULED_SMS.FAILURE, { error }),
    types: DELETE_SCHEDULED_SMS,
};

export const DELETE_SCHEDULED_CALLS = createRequestTypes('DELETE_SCHEDULED_CALLS');
export const deleteScheduledCalls = {
    request: (args) => action(DELETE_SCHEDULED_CALLS.REQUEST, { args }),
    success: (response) => action(DELETE_SCHEDULED_CALLS.SUCCESS, { response }),
    failure: (error) => action(DELETE_SCHEDULED_CALLS.FAILURE, { error }),
    types: DELETE_SCHEDULED_CALLS,
};

export const DELETE_SCHEDULES = createRequestTypes('DELETE_SCHEDULES');
export const deleteSchedules = {
    request: () => action(DELETE_SCHEDULES.REQUEST),
    success: (response) => action(DELETE_SCHEDULES.SUCCESS, { response }),
    failure: (error) => action(DELETE_SCHEDULES.FAILURE, { error }),
    types: DELETE_SCHEDULES,
};

export const SET_SNACKBAR = 'SET_SNACKBAR';
export const setSnackbar = (toast) => action(SET_SNACKBAR, { toast });

export const REMOVE_TOAST = 'REMOVE_TOAST';
export const removeToast = () => action(REMOVE_TOAST);

// admin functions
