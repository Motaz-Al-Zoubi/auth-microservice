const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token !
 *
 * @prop {object} payload - the JWT payload to be encoded
 * @returns {Promise<string>} theToken
 */
const generateJWT = async({ payload }) => jwt.sign(payload, process.env.JWT_SECRET);

module.exports = { generateJWT };
