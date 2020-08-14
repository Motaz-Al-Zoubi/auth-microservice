const {
    OK, CREATED, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED,
} = require('http-status');
const AuthService = require('./service');
const { UNIQUE_ERROR_CODE } = require('../../common/constants');

const registerUser = async(req, res, next) => {
    const { username, password: inputPassword } = req.body;

    try {
        const createdUser = await AuthService.registerUser({ username, password: inputPassword });
        return res.status(CREATED).json(createdUser);
    } catch(err) {
        // If this is a duplicate database key error
        if(err.code === UNIQUE_ERROR_CODE) {
            err.status = BAD_REQUEST;
            err.message = 'Username already exists';
        }

        return next(err);
    }
};

const authenticateUser = async(req, res, next) => {
    const { username, password } = req.body;

    try {
        const jwt = await AuthService.authenticateUser({ username, password });
        return res.status(OK).json({ message: 'successfully authenticated', token: jwt });
    } catch(err) {
        if(err.message.includes('User Not found')) {
            err.status = NOT_FOUND;
        } else {
            err.status = UNAUTHORIZED;
        }

        return next(err);
    }
};

module.exports = { registerUser, authenticateUser };
