const Joi = require('joi');

const usernameAndPasswordSchema = {
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
};

const AuthValidation = {
    register: {
        body: {
            ...usernameAndPasswordSchema,
        },
    },

    authenticate: {
        body: {
            ...usernameAndPasswordSchema,
        },
    },
};

module.exports = AuthValidation;
