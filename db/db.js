const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/articles', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

// C:/Users/sebat/mongodb/bin/mongod.exe --dbpath=C:/Users/sebat/mongodb-data