const _ = require('lodash');
const mysql = require('mysql');
const parseXML = require('xml2js').parseString;
const schedule = require('node-schedule');
const moment = require('moment');
const lame = require('lame');
const wav = require('wav');
const request = require('request');
const fs = require('fs');

const PhoneComApi = require('./phoneComApi.js');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect();

const transcriptColumns = [
    'call_id',
    'time',
    'duration',
    'caller_id',
    'called_number',
    'account_id',
];

const phoneCom = new PhoneComApi;

const everyDay = new schedule.RecurrenceRule();
everyDay.hour = 23;
everyDay.minute = 0;

const speechToText = process.env.SPEECH_TO_TEXT_URL;

/* The scheduler will poll the database for scheduled phone calls every minute,
* and scheduled SMS messages every five minutes.
*/

function sendCall(row) {
    phoneCom.dial({ body: {
        id: row.account_id,
        args: row,
    } }, null)
    .then((response) => {
        if (response === 'success') {
            process.send('Successful call.');
            db.query(`UPDATE scheduled_calls SET called = true WHERE call_id=${row.call_id};`,
                (err) => {
                    if (err) {
                        process.send('Database UPDATE error: ' + err);
                    } else {
                        process.send(`Operation complete for call ${row.call_id}`);
                    }
            });
        } else {
            db.query(`UPDATE scheduled_calls SET called=true, failed=true WHERE call_id=${row.call_id};`,
                (err) => {
                    if (err) {
                        process.send('Database UPDATE error: ' + err);
                    } else {
                        process.send('Dialing error registered in database.');
                    }
                });
        }
    })
    .catch((error) => {
        process.send('Dialing error: ' + error);
    });
}

function sendMessage(row) {
    phoneCom.sms.send({body: {
        id: row.account_id,
        args: {
            to: row.recipients,
            from: row.sender,
            text: row.text,
        },
    }}, null)
    .then((response) => {
        if (response === 'success') {
            process.send('Successful message.');
            db.query(`UPDATE scheduled_sms SET sent=true WHERE message_id=${row.message_id};`,
                (err) => {
                    if (err) {
                        console.log(err);
                        process.send('Database UPDATE error.');
                    } else {
                        process.send(`Operation complete for message ${row.message_id}`);
                    }
            });
        } else {
            db.query(`UPDATE scheduled_sms SET sent=true, failed=true WHERE message_id=${row.message_id};`,
                (err) => {
                    if (err) {
                        console.log(err);
                        process.send('Database UPDATE error.');
                    } else {
                        process.send('SMS error registered in database.');
                    }
                });
        }
    })
    .catch((error) => {
        process.send('Message error: ' + error);
    });
}

function getLatestTranscripts() {
    // Needs fixing for new API
    //
    // console.log('Getting transcripts');
    // phoneCom.callLogs({startTime: moment().subtract(2, 'days').unix()}, null)
    // .then((textResponse) => {
    //     phoneCom(textResponse, (err, result) => {
    //         const parsedResults = result.response.resultData[0].callList[0].call.map((call, index) => ({
    //             callId: call.$.id,
    //             calledNumber: call.calledNumber[0],
    //             callerExtension: call.callerExtension[0],
    //             callerId: call.callerId[0],
    //             duration: call.duration[0],
    //             startTime: moment(call.startTime[0]).unix(),
    //             url: call.url[0],
    //             accountId: 1305639,
    //         }));
    //         _.forEach(parsedResults, (call) => {
    //             const dbQuery = `INSERT IGNORE INTO transcription_history (${transcriptColumns.join(',')}) ` +
    //                 `VALUES (${call.callId},FROM_UNIXTIME(${call.startTime}),${call.duration},'${call.callerId}',` +
    //                 `'${call.calledNumber}', ${call.accountId});`;
    //             db.query(dbQuery, (err) => {
    //                 if (err) {
    //                     process.send('Transcription database error: ' + err);
    //                 } else {
    //                     process.send('Saved transcript metadata for call id ' + call.callId);
    //                     const decoder = new lame.Decoder();
    //                     decoder.on('format', transcribeMP3.bind(decoder, call.accountId, call.callId));
    //                     request(call.url).pipe(decoder);
    //                 }
    //             });
    //         });
    //     });
    // })
    // .catch(error => {
    //     process.send('Call log error: ' + error);
    // });
}

function transcribeMP3(accountId, callId, format) {
    const wavWriter = new wav.Writer(format);
    let responseString = '';
    const output = fs.createWriteStream(`test${callId}.wav`);
    this.pipe(wavWriter)
    .pipe(request.post({
        url: speechToText + callId,
        headers: {
            'Content-Type': 'audio/wav',
        },
    }))
    .on('data', (data) => {
        responseString += data;
    })
    .on('end', () => {
        process.send('New transcription URL: ' + responseString);
    });
}

setInterval(() => {
    db.query('SELECT * FROM scheduled_calls WHERE time <= NOW() AND called = false;', (err, result) => {
        if (err) {
            process.send('Database SELECT error:' + err.Error);
        } else {
            _.forEach(result, sendCall);
        }
    });
}, 60000);

setInterval(() => {
    db.query('SELECT * FROM scheduled_sms WHERE time <= NOW() AND sent = false;', (err, result) => {
        if (err) {
            process.send('Database SELECT error: ' + err);
        } else if (result.length) {
            _.forEach(result, sendMessage);
        }
    });
}, 300000);

// const dailyTranscripts = schedule.scheduleJob(everyDay, getLatestTranscripts);
