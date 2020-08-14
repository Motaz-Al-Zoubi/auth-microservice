const mongoose = require('mongoose');
const app = require('./app');

const { PORT, MONGO_URI } = process.env;

const bootServer = async() => {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
        console.log(`listening on port ${PORT}`);
        app.listen(PORT);
    } catch(error) {
        throw new Error('Mongo Connection failed');
    }
};

bootServer();
