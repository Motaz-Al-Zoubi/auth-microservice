const { Router } = require('express');
const validate = require('express-validation');

const AuthValidation = require('./validation');
const { registerUser, authenticateUser } = require('./controller');

const router = new Router();

router.post('/register', validate(AuthValidation.register), registerUser);
router.post('/authenticate', validate(AuthValidation.authenticate), authenticateUser);

module.exports = router;
