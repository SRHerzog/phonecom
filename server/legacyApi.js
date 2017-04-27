const fetch = require('isomorphic-fetch');
const parseXML = require('xml2js').parseString;
const moment = require('moment');
const fs = require('fs');
const request = require('request');

function standardNumber(number) {
    return number.replace(/\D/g, '');
}

module.exports = function LegacyApi() {
    const speechToText = process.env._SPEECH_TO_TEXT_URL;
    const adminUser = process.env.PHONE_COM_ADMIN_USER;
    const adminPassword = process.env.PHONE_COM_ADMIN_PASSWORD;
    const apiUrl = `https://control.phone.com/special/xmlapi?username=${adminUser}&password=${adminPassword}&action=`;

    this.dial = (req, res) => {
        console.log('Dial request: ', req.body.args);
        return fetch(`${apiUrl}originateCall&legAPhoneNumber=${standardNumber(req.body.args.recipients)}` +
            //`&legACallerId=${req.body.args.caller_id_to}&legATimeout=${req.body.args.timeout}` +
            `&legBPhoneNumber=${standardNumber(req.body.args.caller)}`) // &legBCallerId=${req.body.args.caller_id_from}`)
        .then(rawResponse => rawResponse.text())
        .then(textResponse => {
            if (res) {
                parseXML(textResponse, (err, result) => {
                    if (err) {
                        console.log('XML error: ', err);
                        res.json({error: err});
                    } else {
                        console.log('XML response: ', JSON.stringify(result.response.result[0].$));
                        res.json(result.response.result[0].$);
                    }
                });
            } else {
                return textResponse;
            }
        })
        .catch(error => {
            console.log('XML API error: ', error);
            return error;
        });
    };

    this.parseXML = parseXML;

    this.callLogs = (req, res) => {
        const startTime = req.startTime ? `&startTime=${req.startTime}` : '';
        return fetch(`${apiUrl}getCallList${startTime}`)
        .then(rawResponse => rawResponse.text())
        .then(textResponse => {
            if (res) {
                parseXML(textResponse, (err, result) => {
                    if (err) {
                        console.log('XML error: ', err);
                        if (res) {
                            res.json({error: err});
                        } else {
                            return {error: err};
                        }
                    }
                });
            } else {
                return textResponse;
            }
        })
        .catch(error => {
            console.log('XML API error: ', error);
            return error;
        });
    };
};
