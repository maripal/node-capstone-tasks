"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');
const mongoose = require('mongoose');

const { GoalPost } = require('./postslist-models');

//set storage engine
const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file, callback) {
        callback(null, `${file.fieldname}-${Date.now()}-${path.extname(file.originalname)}`);
    }
})

const jwtAuth = passport.authenticate('jwt', {session: false});
//initialize image upload
const upload = multer({storage});

// GET endpoint
router.get('/', jwtAuth, (req, res) => {
        GoalPost.find({user: req.user.id})
        .populate({"path" : "user"})
        .then(posts => {
            //res.status(200).json(posts);
            res.send(posts);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Oops. Something went wrong.'});
        })
})

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
            user: req.body.user,
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
router.put('/:id', upload.single('myImage'), (req, res) => {
    console.log(req.file);
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

    const updated = {};
    const updateableFields = ['text', 'images', 'notes', 'completed'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });
          // this is for if user adds notes to post
    let notes = [];
    if (notes.length === 0) {
        notes.push(req.body.notes);
    }
    // this is for if user adds images to post
    let images = [];
    //if (images.length === 0) {
    //    images.push(req.body.images);
    //}
    if (req.file) {
        images = {path : req.file.path};
    }
    GoalPost
        .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})//{$set: {text: req.body.text}})
        //.then(post => {
        //    return res.status(204).end();
        //})
        .then(updatedPost => res.status(200).json({
            id: updatedPost.id,
            text: updatedPost.text,
            images: updatedPost.images,
            notes: updatedPost.notes,
            completed: updatedPost.completed
        }))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Oops. Something went wrong.'});
        });
})
;
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