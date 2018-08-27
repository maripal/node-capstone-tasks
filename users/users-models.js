"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bycryptjs');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.methods.serialize = function() {
    return {
        firstName: this.firstName || '',
        lastName: this.lastName || '',
        username: this.userName || ''
    };
}

const User = mongoose.model('User', userSchema);

module.exports = {User};