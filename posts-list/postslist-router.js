"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const {GoalPost} = require('./postslist-models');

// GET endpoint
router.get('/', (req, res) => {
    GoalPost.get()
    .then(posts => {
        res.json(posts);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Oops. Something went wrong.'});
    });
})

module.exports = router;