"use strict";

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const goalPostSchema = mongoose.Schema({
    user : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    text : {type: String, required: true},
    notes : [{type: String}],
    images : [{ path: 
                {type: String}
            }],
    created : {type: Date, default: Date.now},
    completed: Boolean,
}, 
    // to hide the '__v' property
    {versionKey: false});

goalPostSchema.methods.serialize = function() {
    return {
        //id: this._id,
        user: this.user,
        text: this.text,
        notes: this.notes,
        images: this.images,
        created: this.created,
        completed: this.completed,
    };
};

const GoalPost = mongoose.model('GoalPost', goalPostSchema);

module.exports = {GoalPost};
