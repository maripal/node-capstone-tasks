"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const { GoalPost } = require('./postslist-models');

// GET endpoint
router.get('/', (req, res) => {
    GoalPost.find()
    .then(posts => {
        res.json(posts);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Oops. Something went wrong.'});
    });
})

/*router.get('/', (req, res) => {
    res.status(200).json({message: "Connected!"});
})*/

// POST endpoint
router.post('/', (req, res) => {
    const requiredField = 'text';
    if (!(requiredField in req.body)) {
        const message = `Missing required \`${requiredField}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
    }
    GoalPost
        .create({
            text: req.body.title
        })
        .then(post => {
            return res.status(201).json(post.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Oops. Something went wrong.'});
        });
})

module.exports = router;