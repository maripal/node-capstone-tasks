"use strict";

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const moment = require('moment');

mongoose.Promise = global.Promise;

const app = express();
const {PORT, DATABASE_URL} = require('./config');
const { GoalPost } = require('./posts-list/postslist-models');

const router = require('./posts-list/postslist-router');

app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());
app.use('/posts', router);

// GET endpoint
app.get('/', (req, res) => {
    res.status(200).res.sendFile(__dirname + "/views/index.html");
});




/*app.post('/posts', (req, res) => {
    const requiredFields = 'text';
    if(!(requiredFields in req.body)) {
        const message = `Missing \`${requiredFields}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
    }

    GoalPost
    .create({
        text: req.body.text
    })
    .then(post => res.status(201).json(post.serialize()))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Oops. Something went wrong.'});
    });
})*/


let server;

// function that connects to database, and starts server
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

// function that closes the server
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if(err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };