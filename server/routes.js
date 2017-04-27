'use strict';

const path = process.cwd();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const Apis = {
    Local: require(path + '/server/localApi.js'),
    PhoneCom: require(path + '/server/phoneComApi.js'),
    Auth: require(path + '/server/authApi.js'),
    Legacy: require(path + '/server/legacyApi.js'),
    Payments: require(path + '/server/paymentApi.js'),
};

const authSecret = process.env.AUTH0_CLIENT_SECRET;
const secret = new Buffer(authSecret, 'base64');

function verifyToken(req, res, next) {
    jwt.verify(req.headers.authorization, secret, (err, data) => {
        if (err || (data && data.email !== req.query.email)) {
            res.status(401).json({ error: { status: 401, message: err } });
        } else {
            next();
        }
    });
}

module.exports = function(app, db) {
	const phoneCom = new Apis.PhoneCom;
    const local = new Apis.Local;
    // const legacy = new Apis.Legacy;
    const auth = new Apis.Auth;
    const payments = new Apis.Payments;

    app.route('/api/signup').post(
        bodyParser.json(),
        payments.pay,
        auth.signup,
        phoneCom.account.add,
        (req, res) => local.signup(req, res, db)
    );

    app.route('/api/login').post(bodyParser.json(), (req, res) => {
        const loginPromise = new Promise((resolve, reject) => {
            if (req.body.args.email.indexOf('@') < 0) {
                db.query(`SELECT email FROM users WHERE username='${req.body.args.email}'`, (accountErr, results) => {
                    if (accountErr) {
                        reject(accountErr);
                    } else {
                        console.log('got email: ', results[0].email);
                        req.body.args.email = results[0].email;
                        resolve(req);
                    }
                });
            } else {
                resolve(req);
            }
        });
        loginPromise.then(newReq => auth.login(newReq))
        .then((id_token) => {
            console.log('Auth0 success: ', id_token);
            jwt.verify(id_token, secret, (verifyErr, data) => {
                if (verifyErr) {
                    throw verifyErr;
                } else {
                    local.account.get(data.email, db, (getErr, id) => {
                        if (getErr) {
                            throw getErr;
                        } else {
                            phoneCom.account.get(res, id, id_token);
                        }
                    });
                }
            });
        })
        .catch((error) => {
            console.log('Caught promise error: ', error);
            res.status(400).json({ error });
        });
    });

    app.route('/api/numbers')
        .get(verifyToken, phoneCom.numbers.get)
        .post(verifyToken, bodyParser.json(), (req, res) => {
            if (req.body && Array.isArray(req.body.args)) {
                phoneCom.numbers.add(req, res);
            } else {
                res.status(400).json({ error: 'Invalid request.' });
            }
        })
        .put(verifyToken, bodyParser.json(), phoneCom.numbers.edit);
    app.route('/api/routes')
        .get(verifyToken, phoneCom.routes.get)
        .post(verifyToken, bodyParser.json(), phoneCom.routes.add)
        .put(verifyToken, bodyParser.json(), phoneCom.routes.edit)
        .delete(verifyToken, phoneCom.routes.delete);
    app.route('/api/menus')
        .get(verifyToken, phoneCom.menus.get)
        .post(verifyToken, bodyParser.json(), phoneCom.menus.add)
        .put(verifyToken, bodyParser.json(), phoneCom.menus.edit)
        .delete(verifyToken, phoneCom.menus.delete);
    app.route('/api/queues')
        .get(verifyToken, phoneCom.queues.get)
        .post(verifyToken, bodyParser.json(), phoneCom.queues.add)
        .put(verifyToken, bodyParser.json(), phoneCom.queues.edit)
        .delete(verifyToken, phoneCom.queues.delete);
    app.route('/api/schedules')
        .get(verifyToken, phoneCom.schedules.get)
        .post(verifyToken, bodyParser.json(), phoneCom.schedules.add)
        .put(verifyToken, bodyParser.json(), phoneCom.schedules.edit);
    app.route('/api/devices')
        .get(verifyToken, phoneCom.devices.get)
        .post(verifyToken, bodyParser.json(), phoneCom.devices.add)
        .put(verifyToken, bodyParser.json(), phoneCom.devices.edit);  
    app.route('/api/extensions')
        .get(verifyToken, phoneCom.extensions.get)
        .post(verifyToken, bodyParser.json(), phoneCom.extensions.add)
        .put(verifyToken, bodyParser.json(), phoneCom.extensions.edit);
    app.route('/api/sms')
        .get(verifyToken, phoneCom.sms.get)
        .post(verifyToken, bodyParser.json(), phoneCom.sms.send);
    app.route('/api/schedule-sms')
        .get(verifyToken, (req, res) => local.sms.get(req, res, db))
        .post(verifyToken, bodyParser.json(), (req, res) => local.sms.add(req, res, db))
        .put(verifyToken, bodyParser.json(), (req, res) => local.sms.edit(req, res, db))
        .delete(verifyToken, (req, res) => local.sms.cancel(req, res, db));
    app.route('/api/call')
        .post(verifyToken, bodyParser.json(), phoneCom.dial);
    app.route('/api/schedule-calls')
        .get(verifyToken, (req, res) => local.calls.get(req, res, db))
        .post(verifyToken, bodyParser.json(), (req, res) => local.calls.add(req, res, db))
        .put(verifyToken, bodyParser.json(), (req, res) => local.calls.edit(req, res, db))
        .delete(verifyToken, (req, res) => local.call.cancel(req, res, db));
    app.route('/api/available-numbers')
        .get(verifyToken, phoneCom.availableNumbers);
    app.route('/api/media')
        .get(verifyToken, phoneCom.media.get)
        .post(verifyToken, bodyParser.json(), phoneCom.media.add)
        .put(verifyToken, bodyParser.json(), phoneCom.media.edit)
        .delete(verifyToken, phoneCom.media.delete);

    app.route('/api/history').get(phoneCom.callLogs);
    // app.route('/api/audio').get(phoneCom.recording);
    // app.route('/api/admin').get(phoneCom.admin);

    app.route('/api/transcription/results')
        .post(bodyParser.json(), (req) => local.transcripts(req, db));

    app.get('*', (req, res) => {
        res.sendFile(path + '/dist/index.html');
    });
};
