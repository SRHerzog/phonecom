// import Overview from './components/Overview';
// import Account from './components/account/ViewAccount';
// import Analytics from './components/analytics/Analytics';
// import CallBlocking from './components/call-blocking/CallBlocking';
import Numbers from './components/numbers/NumbersMain';
// import Devices from './components/devices/DevicesMain';
import Extensions from './components/extensions/ExtensionsMain';
import Media from './components/media/MediaMain';
import Menus from './components/menus/MenusMain';
import Queues from './components/queues/QueuesMain';
import Routes from './components/routes/RoutesMain';
import SMS from './components/sms/SMSMain';
import Calls from './components/calls/CallsMain';
// import Schedules from './components/schedules/SchedulesMain';
// import Settings from './components/account/Settings';
// import Help from './components/help/Help';

const functionList = [
    // {
    //     name: 'Account',
    //     component: Overview,
    //     link: 'overview',
    // },
    // {
    //     name: 'Caller Analytics',
    //     component: Analytics,
    //     link: 'analytics',
    // },
    // {
    //     name: 'Call Blocking',
    //     component: CallBlocking,
    //     link: 'call-blocking',
    // },
    // {
    //     name: 'Call Logs',
    //     component: CallLogs,
    //     link: 'call-logs',
    // },
    // {
    //     name: 'Devices',
    //     component: Devices,
    //     link: 'devices',
    // },
    {
        name: 'Extensions',
        component: Extensions,
        link: 'extensions',
    },
    {
        name: 'Numbers',
        component: Numbers,
        link: 'numbers',
    },
    {
        name: 'Media',
        component: Media,
        link: 'media',
    },
    {
        name: 'Menus',
        component: Menus,
        link: 'menus',
    },
    {
        name: 'Queues',
        component: Queues,
        link: 'queues',
    },
    {
        name: 'Routes',
        component: Routes,
        link: 'routes',
    },
    {
        name: 'SMS',
        component: SMS,
        link: 'sms',
        mobileDisplay: true,
    },
    {
        name: 'Calls',
        component: Calls,
        link: 'calls',
        mobileDisplay: true,
    },
    // {
    //     name: 'Schedules',
    //     component: Schedules,
    //     link: 'schedules',
    // },
    // {
    //     name: 'Settings',
    //     component: Settings,
    //     link: 'settings',
    // },
    // {
    //     name: 'Help',
    //     component: Help,
    //     link: 'help',
    // },
];

export default functionList;
