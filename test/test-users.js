"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const {User} = require('../users/users-models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('User API', function() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const username = faker.internet.userName();
    const password = faker.lorem.words();
    const firstNameB = faker.name.firstName();
    const lastNameB = faker.name.lastName();
    const usernameB = fake.internet.userName();
    const passwordB = fake.lorem.words();

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
    })

    afterEach(function() {
        return User.remove({});
    });

    after(function() {
        return closeServer();
    });

    describe('users api', function() {
        describe('POST', function() {
            it('should reject users with missing username', function() {
                return chai.request(app)
                .post('/users')
                .send({
                    firstName,
                    lastName,
                    password
                })
                .then(() =>
                    expect.fail(null, null, 'Request shouldn\'t succeed')
                )
                .catch( err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('username');
                });
            });

            it('should reject users with missing password', function() {
                return chai.request(app)
                .post('/users')
                .send({
                    firstName,
                    lastName,
                    username
                })
                .then(() => 
                    expect.fail(null, null, 'Request shouldn\'t succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Missing field');
                    expect(res.body.location).to.equal('password');
                });
            });

            it('should reject users with non-string username', function() {
                return chai.request(app)
                .post('/users')
                .send({
                    firstName,
                    lastName,
                    username: 1234,
                    password
                })
                .then(() => 
                    expect.fail(null, null, 'Request shouldn\'t succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected a string');
                    expect(res.body.location).to.equal('username');
                });
            });

            it('should reject users with non-string password', function() {
                return chai.request(app)
                .post('/users')
                .send({
                    firstName,
                    lastName,
                    username,
                    password: 1234
                })
                .then(() => 
                    expect.fail(null, null, 'Request shouldn\'t succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected a string');
                    expect(res.body.location).to.equal('password');
                });
            });

            it('should reject users with non-string first name', function() {
                return chai.request(app)
                .post('/users')
                .send({
                    firstName: 1234,
                    lastName,
                    username,
                    password
                })
                .then(() =>
                    expect.fail(null, null, 'Request shouldn\'t succed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: exoected a string');
                    expect(res.body.location).to.equal('firstName');
                });
            });

            it('should reject users with non-string last name', function() {
                return chai.request(app)
                .post('/users')
                .send({
                    firstName,
                    lastName: 1234,
                    username,
                    password
                })
                .then(() => 
                    expect.fail(null, null, 'Request shouldn\'t succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Incorrect field type: expected a string');
                    expect(res.body.location).to.equal('lastName');
                });
            });

            it('should reject users with non-trimmed username', function() {
                return chai.request(app)
                .post('/users')
                .send({
                    firstName,
                    lastName,
                    username: ` ${username} `,
                    password
                })
                .then(() => 
                    expect.fail(null, null, 'Request shouldn\'t succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Cannot start or end with whitespace');
                    expect(res.body.location).to.equal('username');
                });
            });

            it('should reject users with non-trimmed password', function() {
                return chai.request(app)
                .post('/users')
                .send({
                    firstName,
                    lastName,
                    username,
                    password: ` ${password} `
                })
                .then(() =>
                    expect.fail(null, null, 'Request shouldn\'t succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Cannot start or end with whitespace');
                    expect(res.body.location).to.equal('password');
                });
            });

            it('should reject users with empty username', function() {
                return chai.request(app)
                .post('/users')
                .send({
                    firstName,
                    lastName,
                    username: "",
                    password
                })
                .then(() => 
                    expect.fail(null, null, 'Request shouldn\'t succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Must be at least one character long');
                    expect(res.body.location).to.equal('username')
                });
            });

            it('should reject users with password less than ten characters', function() {
                return chai.request(app)
                .post('/users')
                .send({
                    firstName,
                    lastName,
                    username,
                    password: "12345678"
                })
                .then(() =>
                    expect.fail(null, null, 'Request shouldn\'t succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Must be at least 10 characters long');
                    expect(res.body.location).to.equal('password');
                });
            });

            it('should reject users with password greater than 72 characters', function() {
                return chai.request(app)
                .post('/users')
                .send({
                    firstName,
                    lastName,
                    username,
                    password: new Array(73).fill('a').join('')
                })
                .then(() => 
                    expect.fail(null, null, 'Request shouldn\'t succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Cannot be more than 72 characters long');
                    expect(res.body.location).to.equal('password')
                });
            });

            it('should reject users with duplicate username', function() {
                return User.create({
                    firstName,
                    lastName,
                    username,
                    password
                })
                .then(() => 
                    chai.request(app).post('/users').send({
                        firstName,
                        lastName,
                        username,
                        password
                    })
                )
                .then(() =>
                    expect.fail(null, null, 'Request shouldn\'t succeed')
                )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }

                    const res = err.response;
                    expect(res).to.have.status(422);
                    expect(res.body.reason).to.equal('ValidationError');
                    expect(res.body.message).to.equal('Username already exists');
                    expect(res.body.location).to.equal('username');
                });
            });

            it('should create a new user', function() {
                return chai.request(app)
                .post('/users')
                .send({
                    firstName,
                    lastName,
                    username,
                    password
                })
                .then(res => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('firstName', 'lastName', 'username');
                    expect(res.body.firstName).to.equal(firstName);
                    expect(res.body.lastName).to.equal(lastName);
                    expect(res.body.username).to.equal(username);
                    
                    return User.findOne({
                        username
                    });
                })
                .then(user => {
                    expect(user).to.not.be.null;
                    expect(user.firstName).to.equal(firstName);
                    expect(user.lastName).to.equal(lastName);
                    return user.validatePassword(password);
                })
                .then(passwordIsCorrect => {
                    expect(passwordIsCorrect).to.be.true;
                });
            });

            it('should trim first and last name', function() {
                return chai.request(app)
                .post('/users')
                .send({
                    firstName: ` ${firstName} `,
                    lastName: ` ${lastName} `,
                    username,
                    password
                })
                .then(res => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.keys('firstName', 'lastName', 'username');
                    expect(res.body.firstName).to.equal(firstName);
                    expect(res.body.lastName).to.equal(lastName);
                    expect(res.body.username).to.equal(username);
                    return User.findOne({
                        username
                    });
                })
                .then(user => {
                    expect(user).to.not.be.null;
                    expect(user.firstName).to.equal(firstName);
                    expect(user.lastName).to.equal(lastName);
                });
            });
        });

        describe('GET', function() {
            it('should return an empty array initially', function() {
                return chai.request(app)
                .get('/users')
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(0);
                });
            });

            it('should return an array of users', function() {
                return User.create({
                    firstName,
                    lastName,
                    username,
                    password
                },
                {
                    firstName: firstNameB,
                    lastName: lastNameB,
                    username: usernameB,
                    password: passwordB
                })
                .then(() => chai.request(app).get('/users'))
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(2);
                    expect(res.body[0]).to.deep.equal({
                        firstName,
                        lastName,
                        username
                    });
                    expect(res.body[1]).to.deep.equal({
                        firstName: firstNameB,
                        lastName: lastNameB,
                        username: usernameB
                    });
                });
            });
        });
    });

});