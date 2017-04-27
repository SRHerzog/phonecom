import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import LinearProgress from 'react-md/lib/Progress/LinearProgress';

import { setSnackbar } from '../actions';

const StatusMonitor = props => {
    const count = _.filter(props.loadingUpdatingCount, item => item).length;
    if (count > 0) {
        return <LinearProgress id="loading-data" />;
    }
    return <LinearProgress value={100} id="page-loaded" />;
};

const mapStateToProps = state => ({
    loadingUpdatingCount: [
        state.calls.loadingHistory,
        state.calls.loadingScheduled,
        state.sms.loadingHistory,
        state.routes.loading,
        state.queues.loading,
        state.menus.loading,
        state.extensions.loading,
        state.numbers.loading,
        state.media.loading,
        state.calls.sending,
        state.sms.sending,
        state.routes.editing,
        state.queues.editing,
        state.menus.editing,
        state.extensions.editing,
        state.numbers.editing,
        state.numbers.purchasing,
    ],
    loading: {
        callHistory: state.calls.loadingHistory,
        scheduledCalls: state.calls.loadingScheduled,
        smsHistory: state.sms.loadingHistory,
        routes: state.routes.loading,
        queues: state.queues.loading,
        menus: state.menus.loading,
        extensions: state.extensions.loading,
        numbers: state.numbers.loading,
        media: state.media.loading,
    },
    updating: {
        calls: state.calls.sending,
        sms: state.sms.sending,
        routes: state.routes.editing,
        queues: state.queues.editing,
        menus: state.menus.editing,
        extensions: state.extensions.editing,
        numbers: state.numbers.editing,
        purchaseNumbers: state.numbers.purchasing,
    },
    errors: {
        callHistory: state.calls.historyError,
        scheduledCalls: state.calls.historyError,
        sendCalls: state.calls.dialingError,
        routes: state.routes.error,
        queues: state.queues.error,
        menus: state.menus.error,
        extensions: state.extensions.error,
        numbers: state.numbers.error,
        purchaseNumbers: state.numbers.purchaseError,
        error: state.media.error,
    },
    results: {
        calls: state.calls.message,
        sms: state.sms.message,
        routes: state.routes.message,
        queues: state.queues.message,
        menus: state.menus.message,
        extensions: state.extensions.message,
        numbers: state.numbers.message,
        purchaseNumbers: state.numbers.purchaseMessage,
    },
});

const mapDispatchToProps = {
    setSnackbar,
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusMonitor);
