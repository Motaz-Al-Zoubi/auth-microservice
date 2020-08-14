const User = require('../../models/Users');
const { generateJWT } = require('../../common/utils');

/**
 * Register a new user
 *
 * @prop {string} username
 * @prop {string} password
 *
 * @returns {Promise<object>} registeredUserDocument
 * The created database document without the hashed password field
 */
const registerUser = async({ username, password: inputPassword }) => {
    const userObject = await User.create({ username, password: inputPassword });

    const userDocument = userObject.toJSON();

    // Cleanup the response, removing the hashed password
    const { password, ...userDataWithoutPassword } = userDocument; // eslint-disable-line

    return userDataWithoutPassword;
};

/**
 * Authenticates a user and generate the JWT token
 *
 * @prop {string} username
 * @prop {string} password
 *
 * @returns {Promise<string>} jwtToken
 */
const authenticateUser = async({ username: inputUserName, password }) => {
    await User.init();
    const user = await User.findOne({ username: inputUserName });

    if(!user) {
        throw new Error('User Not found');
    }

    const isMatch = await user.comparePassword(password);

    // Report an error to the user
    if(!isMatch) {
        throw new Error('password mismatch');
    }

    const { _id, username } = user.toJSON();

    return generateJWT({ payload: { _id, username } });
};

module.exports = { registerUser, authenticateUser };
