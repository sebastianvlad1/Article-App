const express = require('express');
const router = new express.Router();
const Article = require('../models/article');
const { check, validationResult } = require('express-validator');


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


router.get('/articles/add', (req, res) => {
    
    res.render('add_article', {
        title: 'Add Article'
    });
});

router.post('/articles/add',[
    check('author').not().isEmpty().withMessage('Author cannot be empty!'),
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

    const article = new Article(req.body);
    
    try{
        await article.save();
        req.flash('success', 'Article Added')
        res.redirect('/');
    } catch(e) {

        req.flash('danger', 'Add author pls!');
        res.status(400).send(e);
    }
});

router.get('/article/:id', async (req, res) => {
    try{
        const article = await Article.findById(req.params.id);
        res.render('article', {
            article
        });
    } catch(e) {
        res.status(400).send(e);
    }
});

// Load edit form
router.get('/article/edit/:id', async (req, res) => {
    try{
        const article = await Article.findById(req.params.id);
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
router.delete('/article/delete/:id', async (req, res) => {
    try{
        const article = await Article.findById(req.params.id);
        await article.remove();
        res.send();
    } catch(e) {
        res.status(400).send(e);
    }
    
});

module.exports = router;