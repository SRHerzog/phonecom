#!/usr/bin/env node

const express = require('express');
const routes = require('./server/routes.js');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fork = require('child_process').fork;
const fs = require('fs');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

function handleDisconnect(db) {
    db.on('error', (err) => {
        if (!err.fatal) {
          return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
          throw err;
        }

        console.log('Re-connecting lost connection: ' + err.stack);

        db = mysql.createConnection(db.config);
        handleDisconnect(db);
        db.connect();
    });
}

handleDisconnect(db);

const app = express();

const callScheduler = fork('./server/scheduler.js', {env: process.env});

callScheduler.on('message', (message) => {
    fs.appendFile('scheduler_log.txt', new Date() + '\r\n' + message + '\r\n', (err) => {
        if (err) {
            console.log('File write error: ', err);
        } else {
            console.log('Call scheduler: ', message);
        }
    });
});

app.use('/dist', express.static(process.cwd() + '/dist'));
app.use('/api/new', bodyParser.urlencoded({extended: true}));

routes(app, db);

app.listen(process.env.PORT || 8080, () => {
	console.log(`Listening on port ${process.env.PORT || 8080}`);
});
