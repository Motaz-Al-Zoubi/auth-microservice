'use strict';

const chai = require('chai');

chai.use(require('chai-as-promised'));
chai.use(require('chai-subset'));

chai.should();

module.exports = chai.expect;
