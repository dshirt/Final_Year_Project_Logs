var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://Admin:Dshirt49300770@fleetmanager-xixqp.mongodb.net/test?retryWrites=true&w=majority";
const dataBaseName = 'first-test';
const dbCollection = 'users';
var passport = require('passport');
var flash = require('connect-flash');

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
 extended: true
}));

app.set('view engine', 'ejs');

mongoose.connect(CONNECTION_URL, {useNewUrlParser: true},
    ()=> console.log("connected to database"));

app.use(session({
 secret: 'justasecret',
 resave:true,
 saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/Assets', express.static('Assets'));
require('./app/routes.js')(app, passport);

app.listen(port);
console.log("Port: " + port);