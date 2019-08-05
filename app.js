const express = require('express');
const path = require('path');
const router = require('./routes/route');
const routerUser = require('./routes/users');
const bodyParser = require('body-parser');
const Article = require('./models/article');
const flash = require('connect-flash');
const session = require('express-session');
require('./db/db');

// Initialize App
const app = express();
const port = process.env.PORT || 3000;


//Set Paths
const viewPath = path.join(__dirname, './views');
const publicPath = path.join(__dirname, './public');

//Change view engine
app.set('view engine', 'pug');
app.set('views', viewPath);

//Parse incoming data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(publicPath));


//Express Session Middleware
var sess = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
  }
   
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }
   
  app.use(session(sess))

//Express Messages Middleware
app.use(require('connect-flash')());
app.use( function (req, res, next){
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator Middleware

// Use app routers
app.use(router);
app.use(routerUser);

// Turn the server on
app.listen(port, () => {
    console.log('Server is up on port ', port);
})