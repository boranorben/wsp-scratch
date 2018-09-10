const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
// const flash = require('connect-flash');
const passport = require('passport');
const config = require('./config/database');

// Connect to the database
mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function() {
    console.log('Connected to MongoDB')
})

// Check for db errors
db.on('error', function(err) {
    console.log(err);
});

// Init app
const app = express();

// Bring in Models
let Athlete = require('./models/athlete');

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// Parse application/x-www.form-urlencoded
app.use(bodyParser.urlencoded());
// Parse application.json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session(
    {
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true
    }
))

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.message = require('express-messages')(req, res);
    next();
})

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
})

// Home Route (send something to web browser)
app.get('/', function(req, res) {
    Athlete.find({}, function(err, athletes) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Athletes List',
                athletes: athletes
            });
        }
    })
});

// Route Files
let athletes = require('./routes/athletes');
let users = require('./routes/users');
app.use('/athletes', athletes);
app.use('/users', users);

// Start server
app.listen(3000, function() {
    console.log('Server started on port 3000...')
});