const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Registere form
router.get('/register', (req, res) => {
    res.render('register');
});

// Register proccess
router.post('/register',[
    check('name').not().isEmpty().withMessage('Name required!'),
    check('email').not().isEmpty().withMessage('Email required!'),
    check('email').isEmail().withMessage('Invalid email address!'),
    check('username').not().isEmpty().withMessage('Username required!'),
    check('password').not().isEmpty().withMessage('Password required!'),
  ], async (req, res) => {
    // Check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.render('register', {
            errors: errors.array()
        });
    }
    try{
        const newUser = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;
        await newUser.save()
        req.flash('success', 'Account created!');
        res.redirect('/login');
    } catch(e) {
        res.status(400).send(e);
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

// Login process
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Logout process
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out.');
    res.redirect('/login');
});

module.exports = router;