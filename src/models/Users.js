const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String, minlength: 6 },
    createdAt: { type: Date, default: new Date() },
});

// Hash the user password before saving the document
userSchema.pre('save', async function(next) {
    const user = this;
    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
        const hash = await bcrypt.hash(user.password, salt);

        // override the cleartext password with the hashed one
        user.password = hash;
        return next();
    } catch(err) {
        return next(err);
    }
});

// Add a password hash validation helper method to the model
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const Users = mongoose.model('User', userSchema);
module.exports = Users;
