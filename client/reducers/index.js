import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {browserHistory} from 'react-router';

import account from './account';
import available from './availableNumbers';
//import blocking from './blocking';
import calls from './calls';
import devices from './devices';
import extensions from './extensions';
import media from './media';
import menus from './menus';
import numbers from './numbers';
import queues from './queues';
import routes from './routes';
import schedules from './schedules';
import sms from './sms';
import snackbar from './snackbar';

const appReducer = combineReducers({
    account,
    available,
    //blocking,
    calls,
    devices,
    extensions,
    media,
    menus,
    numbers,
    queues,
    routes,
    schedules,
    sms,
    snackbar,
    form: formReducer,
});

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        localStorage.removeItem('token');
        localStorage.removeItem('account');
        state = undefined;
        browserHistory.push('/');
    }
    if (action.type === 'USER_LOGIN_REQUEST') {
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
