/* istanbul ignore file */
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');

const Users = require('../models/Users');

const setupPassport = () => {
    const strategy = new JWTStrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
        },
        async(jwtPayload, done) => {
            try {
                const user = await Users.findOne({ _id: jwtPayload._id });

                // If there is no error but we have no user record don't authenticate
                if(!user) {
                    return done(null, false);
                }

                const { _id, username } = user;

                return done(null, { _id, username });
            } catch(err) {
                return done(err, false);
            }
        },
    );

    passport.use(strategy);
};

module.exports = { setupPassport };
