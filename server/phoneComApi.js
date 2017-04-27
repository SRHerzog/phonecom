const fetch = require('isomorphic-fetch');


function formatPhoneNumber(number) {
    const formatted = number.replace(/\D/g, '');
    return '(' + formatted.slice(1, 4) + ') ' +
        formatted.slice(4, 7) + '-' + formatted.slice(7);
}

function stringToArray(string) {
    return string.replace(/[^0-9,]/g, '').split(',');
}

module.exports = function PhoneComApi() {
    const apiKey = process.env.PHONE_COM_API;
    const masterAccountId = process.env.PHONE_COM_ACCOUNT;
    const apiUrl = 'https://api.phone.com/v4/';

    function commonFunctions(type) {
        return {
            get: function(req, res) {
                if (type === '/call-logs/') {
                    console.log('Attempting to get call history');
                }
                const accountId = req.query.id;
                fetch(`${apiUrl}accounts/${accountId}${type}?limit=500`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': apiKey,
                    },
                }).then(rawResponse => rawResponse.json()
                ).then((formattedResponse) => {
                    if (formattedResponse['@error']) {
                        res.status(400).json({error: formattedResponse['@error']['@message']});
                    } else {
                        res.json(formattedResponse);
                    }
                })
                .catch((error) => {
                    console.log('Err: ', error);
                    res.status(400).json({error: error});
                });
            },
            add: function(req, res) {
                const accountId = req.body.id;
                if (type === '/sms/') {
                    req.body.args.text = req.body.args.text
                        .replace(/\\\'/g, '\'')
                        .replace(/\\\"/g, '"');
                }
                return fetch(apiUrl + 'accounts/' + accountId + type, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': apiKey,
                    },
                    body: JSON.stringify(req.body.args),
                }).then((rawResponse) => {
                    return rawResponse.json();
                }).then((formattedResponse) => {
                    if (res) {
                        if (formattedResponse['@error']) {
                            res.status(400).json({ error: formattedResponse['@error']['@message'] });
                        } else {
                            res.json(formattedResponse);
                        }
                    } else {
                        if (formattedResponse.from) {
                            return 'success';
                        } else {
                            return 'failure';
                        }
                    }
                })
                .catch((error) => {
                    console.log('Err: ', error);
                    if (res) {
                        res.status(400).json({error: error});
                    }
                });
            },
            edit: function(req, res) {
                const accountId = req.body.id;
                console.log(`Edit ${type} request:`, JSON.stringify(req.body.args));
                fetch(`${apiUrl}accounts/${accountId}${type}/${req.body.args.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': apiKey,
                    },
                    body: JSON.stringify(req.body.args),
                }).then(rawResponse => rawResponse.json())
                .then((formattedResponse) => {
                    if (formattedResponse['@error']) {
                        console.log('Error:', formattedResponse);
                        res.status(400).json({error: formattedResponse['@error']['@message']});
                    } else {
                        res.json(formattedResponse);
                    }
                })
                .catch((error) => {
                    console.log('Err: ', error);
                    res.status(400).json({error: error});
                });
            },
            delete: function(req, res) {
                const accountId = req.query.id;
                fetch(`${apiUrl}accounts/${accountId}${type}/${req.query.item_id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': apiKey,
                    },
                }).then(rawResponse => rawResponse.json())
                .then((formattedResponse) => {
                    if (formattedResponse['@error']) {
                        res.status(400).json({error: formattedResponse['@error']['@message']});
                    } else {
                        res.json(formattedResponse);
                    }
                })
                .catch((error) => {
                    console.log('Err: ', error);
                    res.status(400).json({error: error});
                });
            },
        };
    }

    this.account = {
        get: function(res, id, token) {
            fetch(apiUrl + 'accounts/' + id, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': apiKey,
                },
            }).then(rawResponse => rawResponse.json()
            ).then((formattedResponse) => {
                res.json({ account: formattedResponse, token });
            }).catch((error) => {
                console.log('Err: ', error);
                res.status(400).json({ error });
            });
        },
        add: function(req, res, next) {
            console.log('Attempting to create phone.com account.');
            const body = req.body.args;
            const newAccount = {
                username: body.email,
                password: body.password,
                contact: {
                    name: body.contactname,
                    address: {
                        line_1: body.address1,
                        line_2: body.address2,
                        city: body.city,
                        province: body.state,
                        postal_code: body.postalcode,
                        country: body.country,
                    },
                    primary_email: body.email,
                    company: body.company,
                    phone: body.phone,
                },
                billing_contact: {
                    name: 'Guy Sheetrit',
                    address: {
                        line_1: 'Savyon 2',
                        city: 'Kiryat Tivon',
                        province: 'Haifa',
                        postal_code: '36531',
                        country: 'IL',
                    },
                    primary_email: 'info@overthetopseo.com',
                    company: 'Over the Top SEO',
                    phone: '(323)375-0707',
                },
            };
            fetch(apiUrl + 'accounts/' + masterAccountId + '/subaccounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': apiKey,
                },
                body: JSON.stringify(newAccount),
            }).then(rawResponse => rawResponse.json())
            .then((phoneComResponse) => {
                req.phoneComResponse = phoneComResponse;
                next();
            }).catch((error) => {
                console.log('Phone.com signup error: ', error);
                res.status(500).json({ error });
            });
        },
    };

    this.media = commonFunctions('/media');

    this.numbers = {
        get: commonFunctions('/phone-numbers').get,
        add: function(req, res) {
            const accountId = req.body.id;
            Promise.all(req.body.args.map(number => {
                return fetch(apiUrl + 'accounts/' + accountId + '/phone-numbers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': apiKey,
                    },
                    body: JSON.stringify({
                        phone_number: '+' + number,
                        route: null, //accountId === 1305639 ? 4698652 : null,
                        name: formatPhoneNumber(number),
                        block_incoming: false,
                        block_anonymous: false,
                        caller_id: null,
                        sms_forwarding: accountId === 1305639 ? {
                            type: 'extension',
                            extension: '1769620',
                        } : null,
                        call_notifications: null,
                    }),
                });
            })).then(rawResponse => Promise.all(rawResponse.map(item => item.json()))
            ).then((formattedResponse) => {
                if (formattedResponse['@error']) {
                    res.status(400).json({error: formattedResponse['@error']['@message']});
                } else {
                    res.json(formattedResponse);
                }
            }).catch((error) => {
                console.log('Err: ', error);
                res.status(400).json({error: error});
            });
        },
        edit: function(req, res) {
            const { args } = req.body;
            console.log('Route: ', args.route);
            const accountId = req.body.id;
            const emailArray = typeof args.call_notifications_emails === 'string' ?
                args.call_notifications_emails.split(',') : args.call_notifications_emails;
            fetch(apiUrl + 'accounts/' + accountId + '/phone-numbers/' + req.body.args.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': apiKey,
                },
                body: JSON.stringify({
                    name: args.name,
                    block_incoming: args.block_incoming,
                    block_anonymous: args.block_anonymous,
                    route: {
                        id: args.route,
                    },
                    caller_id: args.caller_id_name ? {
                        name: args.caller_id_name,
                        type: 'business',
                    } : args.caller_id,
                    sms_forwarding: args.sms_forwarding ? {
                        type: 'extension',
                        extension: args.sms_forwarding,
                    } : null,
                    call_notifications: args.call_notifications_emails || args.call_notifications_sms ? {
                        emails: emailArray,
                        sms: args.call_notifications_sms,
                    } : args.call_notifications,
                }),
            }).then(rawResponse => rawResponse.json()
            ).then((formattedResponse) => {
                if (formattedResponse['@error']) {
                    res.status(400).json({ error: formattedResponse['@error']['@message'] });
                } else {
                    res.json(formattedResponse);
                }
            }).catch((error) => {
                console.log('Err: ', error);
                res.status(400).json({ error: error });
            });
        },
    };

    this.routes = commonFunctions('/routes');
    this.devices = commonFunctions('/devices');
    this.extensions = {
        get: commonFunctions('/extensions').get,
        add: function(req, res) {
            const { args } = req.body;
            const accountId = req.body.id;
            console.log('POST args: ', args);
            fetch(apiUrl + 'accounts/' + accountId + '/extensions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': apiKey,
                },
                body: JSON.stringify({
                    caller_id: 'private',
                    usage_type: 'limited',
                    allow_call_waiting: true,
                    extension: args.extension,
                    include_in_directory: true,
                    name: args.name,
                    full_name: args.full_name,
                    timezone: args.timezone,
                    name_greeting: args.name_greeting,
                    local_area_code: args.local_area_code,
                    enable_outbound_calls: false,
                    enable_call_waiting: false,
                    voicemail: args.voicemail,
                }),
            }).then(rawResponse => rawResponse.json()
            ).then((formattedResponse) => {
                if (formattedResponse['@error']) {
                    res.status(400).json({ error: formattedResponse['@error']['@message'] });
                } else {
                    res.json(formattedResponse);
                }
            }).catch((error) => {
                console.log('Err: ', error);
                res.status(400).json({error: error});
            });
        },
        edit: commonFunctions('/extensions').edit,
    };

    this.menus = commonFunctions('/menus');
    this.queues = commonFunctions('/queues');
    this.schedules = commonFunctions('/schedules');

    this.availableNumbers = function(req, res) {
        const filters = {
            offset: req.query.offset,
        };
        if (req.query.areacodes) {
            filters['filters[npa]'] = 'eq:' + req.query.areacodes;
        }
        if (req.query.nxx) {
            filters['filters[nxx]'] = 'in:' + req.query.nxx;
        }
        if (req.query.xxxx) {
            filters['filters[xxxx]'] = 'in:' + req.query.xxxx;
        }
        if (req.query.textSearch) {
            filters['filters[phone_number]'] = 'contains:' + req.query.textSearch;
        }
        const formattedFilters = Object.keys(filters).map(key =>
            key + '=' + encodeURIComponent(filters[key]))
            .join('&');
        console.log('available filters: ', formattedFilters);
        fetch(apiUrl + 'phone-numbers/available?filters[price]=eq:0&limit=500&' + formattedFilters, {
            headers: {
                'Accept': 'application/json',
                'Authorization': apiKey,
            },
        }).then(rawResponse => rawResponse.json()
        ).then((formattedResponse) => {
            if (formattedResponse['@error']) {
                res.status(400).json({error: formattedResponse['@error']['@message']});
            } else {
                res.json(formattedResponse);
            }
        })
        .catch((error) => {
            res.status(400).json({error: error});
        });
    };

    this.sms = {
        get: commonFunctions('/sms').get,
        send: commonFunctions('/sms').add,
    };

    this.callLogs = commonFunctions('/call-logs/?sort[start_time]=desc&limit=100').get;
    this.dial = commonFunctions('/calls').add;
};
