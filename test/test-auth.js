"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../users/users-models');
const {TEST_DATABASE_URL} = require('../config');
const JWT_SECRET = process.env.JWT_SECRET || 'dtexas';

const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth endpoints', function() {
    const firstName = 'Example';
    const lastName = 'User';
    const username = 'exampleUser';
    const password = 'examplePass';

    before(function() {
        runServer(TEST_DATABASE_URL);
        User.hashPassword(password).then(password => 
            User.create({
                firstName,
                lastName,
                username,
                password
            })
        )
    });

    beforeEach(function() {
        
    });

    afterEach(function() {
        
    });

    after(function() {
        User.find({}).remove();
        return closeServer();
    });

    describe('auth/login', function() {
        it('should reject requests with no credentials', function() {
            return chai.request(app)
            .post('/auth/login')
            .then((res) => {
                expect(res).to.have.status(400);
            });
        });

        it('should reject requests with incorrect username', function() {
            return chai.request(app)
            .post('/auth/login')
            .send({
                username: 'wrongUser',
                password
            })
            .then((res) => {
                expect(res).to.have.status(401);
            });
        });

        it('should reject requests with incorrect password', function() {
            return chai.request(app)
            .post('/auth/login')
            .send({
                username,
                password: 'wrongPass'
            })
            .then((res) => {
                expect(res).to.have.status(401);
            });
        });

        it('should return a valid token', function() {
            return chai.request(app)
            .post('/auth/login')
            .send({
                username,
                password
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                const token = res.body.authToken;
                expect(token).to.be.a('string');
                const payload = jwt.verify(token, JWT_SECRET, {
                    algorithm: ['HS256']
                });
                /*expect(payload.user).to.equal({
                    id,
                    firstName,
                    lastName,
                    username
                });*/
            });
        });
    });

    describe('/auth/refresh', function() {
        it('should reject requests with no credentials', function() {
            return chai.request(app)
            .post('/auth/refresh')
            .then((res) => {
                expect(res).to.have.status(401);
            });
        });

        it('should reject requests with an invalid token', function() {
            const token = jwt.sign ({
                firstName,
                lastName,
                username
            },
                'wrongSecret',
            {
                algorithm: 'HS256',
                expiresIn: '7d'
            }
            );
            return chai.request(app)
            .post('/auth/refresh')
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
                expect(res).to.have.status(401);
            });
        });

        it('should reject requests with an expired token', function() {
            const token = jwt.sign({
                user : {
                    firstName,
                    lastName,
                    username
                },
            },
            JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: Math.floor(Date.now() / 1000) - 10 
                }
            );
            return chai.request(app)
            .post('/auth/refresh')
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
                expect(res).to.have.status(200);
            });
        });

        it('should return a valid token with newer expiry date', function() {
            const token = jwt.sign({
                user: {
                    firstName,
                    lastName,
                    username
                },
            },
            JWT_SECRET,
                {
                    algorithm: 'HS256',
                    subject: username,
                    expiresIn: '7d'
                }
            );
            const decoded = jwt.decode(token);

            return chai.request(app)
            .post('/auth/refresh')
            .set('Authorization', `Bearer ${token}`)
            .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                const token = res.body.authToken;
                expect(token).to.be.a('string');
                const payload = jwt.verify(token, JWT_SECRET, {
                    algorithm: ['HS256']
                });
                expect(payload.user).to.deep.equal({
                    firstName,
                    lastName,
                    username
                });
                expect(payload.exp).to.be.at.least(decoded.exp);
            });
        });
    });

})