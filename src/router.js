const { Router } = require('express');

const AuthRouter = require('./modules/auth/router');

const router = new Router();

router.use('/', AuthRouter);

module.exports = AuthRouter;
