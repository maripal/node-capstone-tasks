"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
    };
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
}

const User = mongoose.model('users', userSchema);

module.exports = {User};