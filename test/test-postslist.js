"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const expect = chai.expect;

const {GoalPost} = require('../posts-list/postslist-models');
const {User} = require('../users/users-models');
const {app, runServer, closeServer} = require('../server');
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// input fake data using faker
function seedPostsData() {
    console.log('seeding restaurant data');
    const seedData = [];
    for (let i = 1; i <= 5; i++) {
        seedData.push(generatePostsData());
    }
    return GoalPost.insertMany(seedData);
}

// function to generate an object with posts data
function generatePostsData() {
    return {
        text: faker.lorem.sentence(),
        notes: faker.random.arrayElement(),
        images: [{path : faker.image.imageUrl()}],
        created: faker.date.recent(),
        completed: faker.random.arrayElement([true, false])
    };
}

// create user for authentication to posts
const  firstName = 'Test';
const  lastName = 'User';
const  username = 'testUser';
const  password = 'testPass';


let token = jwt.sign({
    user: {
        username,
        password
    }
},
    JWT_SECRET,
    {
        algorithm: 'HS256',
        subject: username,
        expiresIn: '7d'
    }
)

// to delete database after each test
function tearDownDb() {
    console.warn('Deleting database!');
    return mongoose.connection.dropDatabase();
}

describe('Posts API', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL)
    });

    beforeEach(function() {
        return seedPostsData()
    });

    afterEach(function() {
        return tearDownDb();
    });

    after(function() {
        return closeServer();
    });

    // test for GET endpoint
    describe('GET endpoint', function() {

        it('should return all posts', function() {
            let res;
            return chai.request(app)
            .get('/posts')
            .set('Authorization', `Bearer ${token}`)
            .then(function(_res) {
                res = _res;
                expect(res).to.have.status(200);
                expect(res).to.be.json;

                expect(res.body).to.have.lengthOf.at.least(1);
                return GoalPost.count();
            })
            .then(function(count) {
                expect(res.body).to.have.lengthOf(count);
            });
        });

        it('should return all posts with right fields', function() {
            let resPost;
            return chai.request(app)
            .get('/posts')
            .set('Authorization', `Bearer ${token}`)
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf.at.least(1);

                res.body.forEach(function(post) {
                    expect(post).to.be.a('object');
                    expect(post).to.include.keys('_id', 'text', 'notes', 'images', 'created', 'completed');
                });
                resPost = res.body[0];
                return GoalPost.findById(resPost.id);
            })
            /*.then(function(post) {
                expect(resPost._id).to.equal(post._id);
                expect(resPost.text).to.equal(post.text);
                expect(resPost.notes).to.equal(post.notes);
                expect(resPost.images).to.equal(post.images);
                expect(resPost.created).to.equal(post.created);
                expect(resPost.completed).to.equal(post.completed);
            });*/
        });
    });

    //test for POST endpoint
    describe('POST endpoint', function() {

        it('should add a new post', function() {
            const newPost = generatePostsData();
            return chai.request(app)
            .post('/posts')
            .set('Authorization', `Bearer ${token}`)
            .send(newPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('id', 'text', 'notes', 'images', 'created', 'completed');
                expect(res.body.id).to.not.be.null;
                //expect(res.body.text).to.equal(newPost.text);
                //expect(res.body.notes).to.equal(newPost.notes);
                //expect(res.body.images).to.equal(newPost.images);
                //expect(res.body.completed).to.equal(newPost.completed);

                return GoalPost.findById(res.body.id);
            })
            /*.then(function(post) {
                expect(post.text).to.equal(newPost.text);
                expect(post.notes).to.equal(newPost.notes);
                expect(post.images).to.equal(newPost.images);
                expect(post.completed).to.equal(newPost.completed);
            });*/
        });
    });

    // test for PUT endpoint
    describe('PUT endpoint', function() {

        it('should update a post', function() {
            const updatePost = {
                text : 'Go to Iceland.',
                notes : "See the northern lights while I'm there"
            };

            return GoalPost
                .findOne()
                .then(function(post) {
                    updatePost.id = post.id;

                    return chai.request(app)
                    .put(`/posts/${post.id}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send(updatePost)
                })
                .then(function(res) {
                    expect(res).to.have.status(201);
                    return GoalPost.findById(updatePost.id);
                })
                //.then(function(post) {
                //    expect(post.text).to.equal(updatePost.text);
                //    expect(post.notes).to.equal(updatePost.notes);
                //});
        });
    });

    // test for DELETE enpoint
    describe('DELETE endpoint', function() {

        it('should delete a post by id', function() {

            let post;

            return GoalPost
                findOne()
                .then(function(_post) {
                    post = _post;
                    return chai.request(app)
                    .delete(`/posts/${post.id}`)
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                    return GoalPost.findById(post.id);
                })
                .then(function(res) {
                    expect(_post).to.be.null;
                });
        });
    });
});