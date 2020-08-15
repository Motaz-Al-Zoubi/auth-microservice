require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const methodOverride = require('method-override');
const { NOT_FOUND } = require('http-status');

const router = require('./router');
const { setupPassport } = require('./lib/passport');

setupPassport();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(methodOverride('X-HTTP-Method-Override'));

app.use('/api/v0', router);

// General error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const response = { message: err.message };

    if(err.message === 'validation error') {
        response.errors = err.errors;
    }

    return res.status(err.status).json(response);
});

app.use((req, res) => {
    return res.status(NOT_FOUND).json({ message: 'endpoint not found !' });
});

module.exports = app;
