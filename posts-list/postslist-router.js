"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const multer = require('multer');

const { GoalPost } = require('./postslist-models');

//set storage engine
const storage = multer.diskStorage({
    destination: '',
    filename: function(req, file, callback) {
        callback(null, `${file.fieldname}-${Date.now()}-${path.extname(file.originalname)}`);
    }
})

//initialize image upload
const upload = multer({storage});

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
    // this is for if user adds notes to post
    let notes = [];
    if (notes.length === 0) {
        notes.push(req.body.notes);
    }
    // this is for if user adds images to post
    let images = [];
    if (images.length === 0) {
        images.push(req.body.images);
    }
    GoalPost
        .create({
            text: req.body.text,
            notes: req.body.notes,
            images: req.body.images,
            completed: false
        })
        .then(post => {
            return res.status(201).json(post.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Oops. Something went wrong.'});
        });
})

// PUT endpoint
router.put('/:id', (req, res) => {
    const requiredField = 'text';
    if(!(requiredField in req.body)) {
        const message = `Missing required \`${requiredField}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
    }
    if (req.params.id !== req.body.id) {
        const message = `Request path id (${
          req.params.id
        }) and request body id ``(${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
      }
    GoalPost
        .findByIdAndUpdate(req.params.id, {$set: {text: req.body.text}})
        .then(post => {
            return res.status(204).end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Oops. Something went wrong.'});
        });
})

// DELETE endpoint
router.delete('/:id', (req, res) => {
    GoalPost
        .findByIdAndRemove(req.params.id)
        .then(post => {
            return res.status(204).end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Oops. Something went wrong.'});
        });
})

module.exports = router;