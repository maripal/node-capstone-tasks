"use strict";

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.methods.serialize = function() {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        userName: this.userName,
        //password: this.password
    };
}

const User = mongoose.model('User', userSchema);

module.exports = {User};