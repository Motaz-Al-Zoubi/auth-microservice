const mongoose = require('mongoose');
const index = require('../../index');
const expect = require('../Helpers/expect');
const userData = require('../Helpers/example');
const { UNIQUE_ERROR_CODE } = index.common.constants;
const Users = index.models.Users;

describe('models/users', () => {
    before(async() => {
        const { MONGO_URI } = process.env;
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
        await Users.init();
        await Users.deleteMany({});
    });

    after(async() => {
        await Users.deleteMany({});
        await mongoose.connection.close();
    });

    describe('run', () => {
        it('should hashes passwords before saving', async() => {
            const user = await Users.create(userData);

            expect(user.password).not.to.equal(userData.password);
        });

        it('should fails when a user with used username is inserted', async() => {
            expect(Users.create(userData)).to.be.eventually.rejectedWith(Error).then(err => {
                expect(err.code).to.be.equal(UNIQUE_ERROR_CODE);
            });
        });

        it('should matches the hash with correct password comparison', async() => {
            const user = await Users.findOne();

            const isMatch = await user.comparePassword(
                userData.password,
                user.password,
            );

            expect(isMatch).to.be.equal(true);
        });

        it('should fails to match the hash with wrong password comparison', async() => {
            const user = await Users.findOne();

            const isMatch = await user.comparePassword(
                'some-wrong-password',
                user.password,
            );

            expect(isMatch).to.be.equal(false);
        });
    });
});
