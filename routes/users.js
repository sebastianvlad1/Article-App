const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { check, validationResult } = require('express-validator');

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
        const user = new User(req.body);
        await user.save()
        req.flash('success', 'Account created!');
        res.redirect('/');
    } catch(e) {
        res.status(400).send(e);
    }
});


module.exports = router;