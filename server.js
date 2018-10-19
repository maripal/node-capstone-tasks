"use strict";

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const moment = require('moment');

mongoose.Promise = global.Promise;

const app = express();
const {PORT, DATABASE_URL} = require('./config');
const { GoalPost } = require('./posts-list/postslist-models');
const { User } = require('./users/users-models');

const router = require('./posts-list/postslist-router');
const userRouter = require('./users/users-router');
const authRouter = require('./auth/router');
const { localStrategy, jwtStrategy } = require('./auth/strategies'); 

app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/posts', router);
app.use('/users', userRouter);
app.use('/auth', authRouter);

// CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
      return res.send(204);
    }
    next();
  });

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

/*app.get('/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});*/

app.use('*', (req, res) => {
    res.status(404).json({message: 'Not Found'});
})

// GET endpoint
app.get('/', (req, res) => {
    res.status(200).res.sendFile(__dirname + "/views/index.html");
});


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