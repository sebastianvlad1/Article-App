const express = require('express');
const path = require('path');
const router = require('./routes/route');
const bodyParser = require('body-parser');
const Article = require('./models/article');
require('./db/db');


const app = express();
const port = process.env.PORT || 3000;

const viewPath = path.join(__dirname, './views');
const publicPath = path.join(__dirname, './public');

app.set('view engine', 'pug');
app.set('views', viewPath);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(publicPath));
app.use(router);

app.listen(port, () => {
    console.log('Server is up on port ', port);
})