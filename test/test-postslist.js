"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {GoalPost} = require('../posts-list/postslist-models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

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
        images: faker.image.imageUrl(),
        created: faker.date.recent(),
        completed: faker.random.arrayElement([true, false])
    };
}

// to delete database after each test
function tearDownDb() {
    console.warn('Deleting database!');
    return mongoose.connection.dropDatabase();
}

describe('Posts API', function() {
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedPostsData();
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
            .then(function(_res) {
                res = _res;
                expect(res).to.have.status(200);

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
});