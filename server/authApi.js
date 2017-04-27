'use strict';

module.exports = function AuthApi() {
    const clientId = process.env.AUTH0_CLIENT_ID;
    const apiUrl = process.env.AUTH0_API_URL;

    this.signup = function(req, res, next) {
        console.log('Attempting Auth0 signup');
        return fetch(apiUrl + 'dbconnections/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: clientId,
                email: req.body.args.email,
                password: req.body.args.password,
                connection: 'Username-Password-Authentication',
            }),
        }).then(rawResponse => rawResponse.json())
        .then((authResponse) => {
            req.authResponse = authResponse;
            next();
        }).catch((error) => {
            console.log('Signup error:', error);
            res.status(500).json({ error });
        });
    };

    this.login = function(req) {
        return fetch(apiUrl + 'oauth/ro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: clientId,
                username: req.body.args.email,
                password: req.body.args.password,
                scope: 'openid profile',
                connection: 'Username-Password-Authentication',
            }),
        }).then(rawResponse => rawResponse.json())
        .then((formattedResponse) => {
            if (formattedResponse.access_token) {
                return formattedResponse.id_token;
            } else if (formattedResponse.error_description) {
                throw formattedResponse.error_description;
            } else {
                throw { error: formattedResponse };
            }
        });
    };
};
