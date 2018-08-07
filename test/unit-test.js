const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

const app = require('../server');

describe ('Home Page', function() {
    it('should load and work correctly', function() {
        return chai.request(app)
        .get('/')
        .then(res => {
            expect(res).to.have.status(200);
        });
    });
});