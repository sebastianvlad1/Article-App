const localStragety = require('passport-local').Strategy;
const User = require('../models/user');
require('../db/db');
const bcrypt = require('bcryptjs');

module.exports = function (passport){
    // Local stragety
    passport.use(new localStragety(function(username, password, done){
        let query = {
            username
        };
        User.findOne(query, (err, user) => {
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'No user found'});
            }
            // match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;

                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Wrong password'});
                }
            });
        })
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

}
