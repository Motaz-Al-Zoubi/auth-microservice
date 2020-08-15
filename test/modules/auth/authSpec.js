const _ = require('lodash');
const mongoose = require('mongoose');
const request = require('supertest');
const { OK, CREATED, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED } = require('http-status');

const index = require('../../../index');
const { API_BASE } = index.common.constants;
const app = index.app;
const { Users } = index.models;
const expect = require('../../Helpers/expect');
const userData = require('../../Helpers/example');

describe('[INTEGRATION] Authentication Endpoints', () => {
    before(async() => {
        const { MONGO_URI } = process.env;
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
        await Users.init();
        await Users.collection.deleteMany({});
    });

    after(async() => {
        await Users.deleteMany({});
        await mongoose.connection.close();
    });

    describe('POST /register', () => {
        it('should register a new user with username and password', async() => {
            const response = await request(app)
                .post(`${API_BASE}/register`)
                .send(userData);
            expect(response.status).to.be.equal(CREATED);

            expect(response.body).not.to.be.undefined;
            expect(response.body).to.contain.keys(['username', '_id']);
            expect(response.body).not.to.contain.keys(['password']);
        });

        it('should fail when a user with used username is inserted', async() => {
            const response = await request(app)
                .post(`${API_BASE}/register`)
                .send(userData);
            expect(response.status).to.be.equal(BAD_REQUEST);

            expect(response.body).not.to.be.undefined;
            expect(response.body.message).to.equal('Username already exists');
        });

        it('should return validation error', async() => {
            const invalidUserData = _.omit(userData, 'username');
            const response = await request(app)
                .post(`${API_BASE}/register`)
                .send(invalidUserData);
            expect(response.status).to.be.equal(BAD_REQUEST);
            expect(response.body).not.to.be.undefined;
            expect(response.body).to.contain.keys(['message', 'errors']);
            expect(response.body.message).to.be.equal('validation error');
            expect(response.body.errors).to.deep.equal([{
                field: [ 'username' ],
                location: 'body',
                messages: [ '"username" is required' ],
                types: [ 'any.required' ]
            }]);
        });
    });

    describe('POST /authenticate', () => {
        it('should authenticate a logged in user generating a JWT', async() => {
            const response = await request(app)
                .post(`${API_BASE}/authenticate`)
                .send(userData);
            expect(response.status).to.be.equal(OK);

            expect(response.body).not.to.be.undefined;
            expect(response.body).to.contain.keys(['message', 'token']);
            expect(response.body.token).to.be.a('string');
        });

        it('should fail authenticating a user with wrong credentials', async() => {
            const clonedUserData = { ...userData };
            clonedUserData.password += 'false';

            const response = await request(app)
                .post(`${API_BASE}/authenticate`)
                .send(clonedUserData);
            expect(response.status).to.be.equal(UNAUTHORIZED);
        });

        it('should fail authenticating a user not registered', async() => {
            const clonedUserData = { ...userData };
            clonedUserData.username += 'false';

            const response = await request(app)
                .post(`${API_BASE}/authenticate`)
                .send(clonedUserData);
            expect(response.status).to.be.equal(NOT_FOUND);
        });
    });

    describe('GET /notFoundLink', () => {
        it('should return endpoint not found', async() => {
            const response = await request(app)
                .get(`${API_BASE}/notFoundLink`)
            expect(response.status).to.be.equal(NOT_FOUND);
            expect(response.body).to.be.an('object');
            expect(response.body).to.contain.keys(['message']);
            expect(response.body.message).to.be.equal('endpoint not found !');
        });
    });
});
