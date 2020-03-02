/*const express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const http = require("http");
var fs = require("fs");
const CONNECTION_URL = "mongodb+srv://Admin:Dshirt49300770@fleetmanager-xixqp.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "first-test";
var path = require('path')

const app = express();
app.use(express.static(path.join(__dirname, 'app')));
app.use('/app', express.static('app'));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;



    http.createServer(function (request, response) {
        console.log("Requested URL is: " + request.url);
        if (request.url === "/") {
            sendFileContent(response, "index.ejs", "text/html");
        }else if(request.url === "/login") {
            sendFileContent(response, "login.ejs", "text/html");
        }else if(request.url === "/signup"){
                sendFileContent(response, "signup.ejs", "text/html");
        } else if (/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())) {
            sendFileContent(response, request.url.toString().substring(1), "text/javascript");
        } else if (/^\/[a-zA-Z0-9\/]*.ejs$/.test(request.url.toString())) {
            sendFileContent(response, request.url.toString().substring(1), "text/html");
        } else if (request.url === "/fleetmanagement.css") {
            sendFileContent(response, request.url.toString().substring(1), "text/css");
        } else if (/^\/[a-zA-Z0-9\/]*.jpeg$/.test(request.url.toString())) {
            sendFileContent(response, request.url.toString().substring(1), "image/jpeg");
        } else {
            console.log("Requested URL is: " + request.url);
            response.end();
        }
    }).listen(8000, () => {
        MongoClient.connect(CONNECTION_URL, {useNewUrlParser: true}, (error, client) => {
            if (error) {
                throw error;
            }
            database = client.db(DATABASE_NAME);
            collection = database.collection("users");
            console.log("Connected to `" + DATABASE_NAME + "`!");

            //TODO Find out how to get this into a java script so I can pull from mongodb through webpage

            database.collection('users', function (err, collection) {

                collection.find().toArray((err, items) => {
                    if (err) throw err;
                    console.log(items);
                });
            });
        });
    });

    function sendFileContent(response, fileName, contentType) {
        fs.readFile(fileName, function (err, data) {
            if (err) {
                response.writeHead(404);
                response.write("Not Found!");
            } else {
                response.writeHead(200, {'Content-Type': contentType});
                response.write(data);
            }
            response.end();
        });
    }*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.engine('hbs', hbs({extname: 'hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
