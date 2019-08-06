const express = require('express');
const router = new express.Router();
const Article = require('../models/article');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');

// Access control
const authMiddleware = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Please login!');
        res.redirect('/login');
    }
}

router.get('/', async (req, res) => {

    try{
        const articles = await Article.find({});
        res.render('index', {
            title: 'Articles 2019',
            articles
        });
    } catch(e) {
        res.status(400).send(e);
    }
});


router.get('/articles/add', authMiddleware,(req, res) => {
    
    res.render('add_article', {
        title: 'Add Article'
    });
});

router.post('/articles/add',[
    //check('author').not().isEmpty().withMessage('Author cannot be empty!'),
    check('title').not().isEmpty().withMessage('Title cannot be empty!'),
    check('body').isLength({ min: 5 }).withMessage('Body must have at least 5 characters!')
  ], async (req, res) => {
      // Check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('add_article',{
            title: 'Add article again',
            errors: errors.array()
        });
      }

    const article = new Article({
        title : req.body.title,
        author : req.user._id,
        body : req.body.body
    });
    
    try{
        await article.save();
        req.flash('success', 'Article Added')
        res.redirect('/');
    } catch(e) {

        req.flash('danger', 'Error while creating article!');
        res.status(400).send(e);
    }
});

router.get('/article/:id', async (req, res) => {
    try{
        const article = await Article.findById(req.params.id);
        const user = await User.findById(article.author);
        res.render('article', {
            article,
            author: user.name
        });
    } catch(e) {
        res.status(400).send(e);
    }
});

// Load edit form
router.get('/article/edit/:id', authMiddleware,async (req, res) => {
    try{
        const article = await Article.findById(req.params.id);
        if(article.author != req.user._id){
            req.flash('danger', "You're not the author of the article!");
            return res.redirect('/');
        }
        res.render('edit_article', {
            title: 'Edit Title',
            article
        });
    } catch(e) {
        res.status(400).send(e);
    }
});

//Save edited article
router.post('/article/edit/:id', async (req, res) => {
    try{
        const updates = {
            ...req.body
        }
        const query = {
            _id: req.params.id
        };
        await Article.updateOne(query, updates);
        req.flash('danger', 'Article updated');
        res.redirect('/')
    } catch(e) {
        res.status(400).send(3);
    }
});

//delete article
router.delete('/article/delete/:id', authMiddleware, async (req, res) => {
    
    try{
        const article = await Article.findById(req.params.id);
        if(article.author != req.user._id){
            req.flash('danger', 'You dont own that article in order to delete it!');
            return res.status(400).send();
        }
        req.flash('danger', 'Article removed!');
        await article.remove();
        res.send();
    } catch(e) {
        res.status(400).send('errorbasadas');
    }
});



module.exports = router;