"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const multer = require('multer');
//const uploadOne = multer().single('myImage');
const passport = require('passport');
const mongoose = require('mongoose');

const { GoalPost } = require('./postslist-models');

//set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
      },
    filename: function(req, file, callback) {
        console.log(file);
        let fileExtension = file.originalname.split('.');
        console.log(`${file.fieldname}-${Date.now()}.${fileExtension[1]}`);
        callback(null, `${file.fieldname}-${Date.now()}.${fileExtension[1]}`);
    }
})

const jwtAuth = passport.authenticate('jwt', {session: false});
//initialize image upload
const upload = multer({
    storage : storage,
    fileFilter: function (req, file, callback) {
        let fileSplit = file.originalname.split('.');
        let ext = `.${fileSplit[1]}`;
        console.log("this is ext" + ext)
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
});

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

router.get('/:id', jwtAuth, (req, res) => {
    GoalPost.findById(req.params.id)
    .then(post => {
        res.send(post);
    })
    .catch(err => {
        res.status(500).json({error: 'Something went wrong.'});
    })
})

// POST endpoint
router.post('/', jwtAuth, (req, res) => {
    const requiredField = 'text';
    if (!(requiredField in req.body)) {
        const message = `Missing required \`${requiredField}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
    }
    GoalPost
        .create({

            user: req.user.id,
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
router.put('/:id', jwtAuth, upload.single('myImage'), (req, res) => {
    const requiredField = 'text';
    if(!(requiredField in req.body)) {
        const message = `Missing required \`${requiredField}\` in request body`;
        console.error(message);
        return res.status(400).send(message);
    }
    if (req.params.id !== req.body.id) {
        const message = `Request path id (${
          req.params.id
        }) and request body id (${req.body.id}) must match`;
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

    if (req.file) {
    updated.images = {path : req.file.filename};
    console.log(typeof (updated.images));
    }
    
    GoalPost.findById(req.params.id)
        .then(post => {
            console.log(updated.notes);
            if (post.notes.length >= 1 && updated.notes != undefined) {
                post.notes.push(updated.notes);
                updated.notes = post.notes;
            }

            if (post.images.length >= 1 && updated.images !== undefined) {
                console.log(post.images);
                console.log(updated.images);
                post.images.push(updated.images);
                updated.images = post.images;
            }

        GoalPost.findByIdAndUpdate(req.body.id, {$set: updated}, {new: true})
        .then(post => {
            res.status(201).json(post.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Oops. Something went wrong.'});
        });
        })
        
})

// DELETE endpoint
router.delete('/:id', jwtAuth, (req, res) => {
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