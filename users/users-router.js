"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const userRouter = express.Router();

const { User } = require('./users-models');

const jsonParser = bodyParser.json();

// POST endpoint to create new user
userRouter.post('/', jsonParser, (req, res) => {
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const stringFields = ['username', 'password', 'firstName', 'lastName'];
    const nonStringField = stringFields.find(field => field in req.body && typeof req.body[field] !== 'string');

    if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected a string',
            location: nonStringField
        });
    }

    //code to give error if username and password have whitespace, no trimming
    const explicitlyTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicitlyTrimmedFields.find(field => req.body[field].trim() !== req.body[field]);

    if (nonTrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'cannot start or end with whitespace',
            location: nonTrimmedField
        });
    }

    //field character count
    const acceptedSizedFields = {
        username: {
            min: 1
        },
        password: {
            min: 10,
            max: 72
        }
    };

    const tooSmallField = Object.keys(acceptedSizedFields).find(field => 
        'min' in acceptedSizedFields[field] && req.body[field].trim().length < acceptedSizedFields[field].min 
    );
    const tooLargeField = Object.keys(acceptedSizedFields).find(field =>
        'max' in acceptedSizedFields[field] && req.body[field].trim().length > acceptedSizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField ? `Must be at least ${acceptedSizedFields[tooSmallField].min} characters long`
            : `Must be at most ${acceptedSizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }

    let {username, password, firstName = '', lastName = ''} = req.body;

    firstName = firstName.trim();
    lastName = lastName.trim();
    
    return User.find({username})
        .count()
        .then(count => {
            
            if (count > 0) {
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already exists',
                    location: username
                });
            }
            //if username doesn't exist, return hashed password
            return User.hashPassword(password);
        })
        .then(hash => {
            
            return User.create({
                username: username,
                password: hash,
                firstName: firstName,
                lastName: lastName
            });
        })
        .then(user => {
            return res.status(201).json(user.serialize());
        })
        .catch(err => {
            if(err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            console.log(err);
            res.status(500).json({code: 500, message: 'Internal Server Error'});
        });
});


userRouter.get('/', (req, res) => {
    return User.find()
      .then(users => res.json(users.map(user => user.serialize())))
      .catch(err => res.status(500).json({message: 'Internal server error'}));
  });
  
module.exports = userRouter;