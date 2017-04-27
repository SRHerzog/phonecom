const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');

function formatPhoneNumber(number) {
    const rawNumber = number.replace(/\D+/g, '');
    if (rawNumber[0] == 1) {
        return `+${rawNumber}`;
    }
    return `+1${rawNumber}`;
}

module.exports = function LocalApis() {
    const callsColumns = [
        'callee_phone_number',
        'caller_phone_number',
        'caller_extension',
        'time',
        'account_id',
    ];

    const smsColumns = [
        'recipients',
        'sender',
        'text',
        'time',
        'account_id',
    ];

    this.signup = function(req, res, db) {
        const databaseValues = [
            req.phoneComResponse.id,
            `'${req.authResponse._id}'`,
            new Date().getUTCDate(),
            `'${req.body.args.email}'`,
        ].join(',');
        console.log('Attempting database insert with values: ', databaseValues);
        db.query(`INSERT INTO users (phone_com_id, auth0_id, billing_day, email) VALUES(${databaseValues});`,
            (err, rows) => {
                if (err) {
                    console.log('DB error: ', err);
                    res.status(400).json({ error: err });
                } else {
                    console.log('DB response: ', rows);
                    res.json(req.phoneComResponse);
                }
            }
        );
    };

    this.account = {
        get: function(email, db, callback) {
            db.query('SELECT phone_com_id FROM users WHERE email="' + email + '";', (err, results) => {
                console.log('Retrieved phone.com id: ', results);
                callback(err, results[0].phone_com_id);
            });
        },
        edit: function(req, res) {
            console.log('Edit Account request received');
            res.json({message: 'Success!'});
        },
    };

    this.calls = {
        get: function(req, res, db) {
            db.query(`SELECT * FROM scheduled_calls WHERE account_id=${req.query.id};`, (err, results) => {
                if (err) {
                    console.log('Database error: ', err);
                    res.json({ error: err });
                } else {
                    console.log('Retrieved scheduled calls: ', results);
                    res.json({ items: results });
                }
            });
        },
        add: function(req, res, db) {
            console.log('Received scheduled call request: ', req.body);
            const formattedDate = moment(req.body.args.time, 'MM/DD/YYYY hh:mm a').format('YYYY-MM-DD HH:mm:ss');
            const addValues = `('${formatPhoneNumber(req.body.args.callee_phone_number)}','${req.body.args.caller_phone_number}',` +
                `${req.body.args.caller_extension},'${formattedDate}',${req.body.id})`;
            const callQuery = `INSERT INTO scheduled_calls (${callsColumns.join(',')}) ` +
                `VALUES ${addValues}`;
            console.log('Query: ', callQuery);
            db.query(callQuery, (err, results) => {
                if (err) {
                    console.log('Database error: ', err);
                    res.json({error: err});
                } else {
                    console.log('Created scheduled call: ', results);
                    res.json(results);
                }
            });
        },
        edit: (req, res, db) => {
            if (req.body.args.time) {
                req.body.args.time = moment(req.body.args.time, 'MM/DD/YYYY hh:mm a').format('YYYY-MM-DD HH:mm:ss');
            }
            let queryString = 'UPDATE scheduled_calls SET ';
            _.forEach(callsColumns, (column) => {
                queryString += `${column}=${req.body.args[column]} `;
            });
            queryString += `WHERE call_id=${req.body.args.call_id};`;
            db.query(queryString, (err, results) => {
                if (err) {
                    console.log('Database error: ', err);
                    res.json({error: err});
                } else {
                    console.log('Edited scheduled call: ', results);
                    res.json(results);
                }
            });
        },
        cancel: function(req, res, db) {
            db.query(`DELETE FROM scheduled_calls WHERE call_id=${req.body.args.call_id}`, (err, results) => {
                if (err) {
                    console.log('Database error: ', err);
                    res.json({error: err});
                } else {
                    console.log('Deleted scheduled call: ', results);
                    res.json(results);
                }
            });
        },
    };

    this.sms = {
        get: function(req, res, db) {
            db.query(`SELECT * FROM scheduled_sms WHERE account_id=${req.query.id} AND sent=false;`, (err, results) => {
                if (err) {
                    console.log('Database error: ', err);
                    res.json({error: err});
                } else {
                    console.log('Retrieved scheduled sms: ', results);
                    res.json({items: results});
                }
            });
        },
        add: function(req, res, db) {
            const formattedDate = moment(req.body.args.time, 'MM/DD/YYYY hh:mm a').format('YYYY-MM-DD HH:mm:ss');
            const dbQuery = `INSERT INTO scheduled_sms (${smsColumns.join(',')}) ` +
                `VALUES ('${req.body.args.to}','${req.body.args.from}','${req.body.args.text}','${formattedDate}',${req.query.id});`;
                console.log('Query string: ', dbQuery);
            db.query(dbQuery, (err, results) => {
                if (err) {
                    console.log('Database error: ', err);
                    res.json({error: err});
                } else {
                    console.log('Created scheduled message: ', results);
                    res.json(results);
                }
            });
        },
        edit: (req, res, db) => {
            if (req.body.args.time) {
                req.body.args.time = moment(req.body.args.time, 'MM/DD/YYYY hh:mm a').format('YYYY-MM-DD HH:mm:ss');
            }
            let queryString = 'UPDATE scheduled_sms SET ';
            _.forEach(smsColumns, (column) => {
                queryString += `${column}=${req.body.args[column]} `;
            });
            queryString += `WHERE call_id=${req.body.args.call_id};`;
            db.query(queryString, (err, results) => {
                if (err) {
                    console.log('Database error: ', err);
                    res.json({error: err});
                } else {
                    console.log('Edited scheduled message: ', results);
                    res.json(results);
                }
            });
        },
        cancel: function(req, res, db) {
            db.query(`DELETE FROM scheduled_sms WHERE call_id=${req.body.args.call_id}`, (err, results) => {
                if (err) {
                    console.log('Database error: ', err);
                    res.json({error: err});
                } else {
                    console.log('Deleted scheduled message: ', results);
                    res.json(results);
                }
            });
        },
    };

    this.transcripts = function(transcript, db) {
        const text = transcript.body.results[0].results.map(item => item.alternatives[0].transcript).join('\\n');
        const dbQuery = `UPDATE transcription_history SET transcript='${text}' WHERE call_id=${transcript.body.user_token};`;
        db.query(dbQuery, (err) => {
            if (err) {
                console.log('Database error: ', err);
            } else {
                console.log('Saved completed transcript for call ' + transcript.body.user_token);
            }
        });
    };
};
