const mongoose = require('mongoose');
// config.database
mongoose.connect( process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// C:/Users/sebat/mongodb/bin/mongod.exe --dbpath=C:/Users/sebat/mongodb-data