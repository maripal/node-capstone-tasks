"use strict";

const express = require('express');
const moment = require('moment');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app = express();
const {PORT, DATABASE_URL} = require('./config');


app.use(express.static('public'));

let server;

function runServer(databaseUrl, port=PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

if (require.main === module) {
    app.listen(process.env.PORT || 8080, () => {
        console.info(`Your is listening on port ${process.env.PORT}`);
    });
}

module.exports = app;