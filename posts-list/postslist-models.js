"use strict";

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const goalPostSchema = mongoose.Schema({
    User : {type : mongoose.Schema.Types.ObjectId, ref:'User'},
    Text : {type: String, required: true},
    Created : {type: Date, default: Date.now},
    Completed: Boolean
});

goalPostSchema.methods.serialize = function() {
    return {
        id: this._id,
        user: this.user,
        text: this.text,
        created: this.created,
        completed: this.completed
    };
};

const GoalPost = mongoose.model('GoalPost', goalPostSchema);

module.exports = {GoalPost};
