const express = require('express');
const router = new express.Router();
const Article = require('../models/article');

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

router.post('/articles/add', async (req, res) => {
    const article = new Article(req.body);
    
    try{
        await article.save();
        res.redirect('/');
    } catch(e) {
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
        console.log('success!');
        res.send('Success!');
    } catch(e) {
        res.status(400).send(e);
    }
    
});

module.exports = router;