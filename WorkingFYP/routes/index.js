var express = require('express');
var router = express.Router();
var ajax = require('ajax');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require("mongoose");
var assert = require('assert');
// replace the uri string with your connection string.
const uri = "mongodb+srv://dshirt:test1234@fleetmanager-xixqp.mongodb.net/test?retryWrites=true&w=majority";
const db = "first-test";
const http = require("http");
var fs = require("fs");
var database, collection;
var resultArray = [];
const fastcsv = require("fast-csv");
const Json2csvParser = require("json2csv").Parser;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/', function(req, res, next) {
  res.render('index', {title: "Fleet Management"});
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/login', function(req, res, next) {
  res.render('login.html', {title: "Fleet Management"});
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/post-login', function(req, res, next) {
    var item = {
      username: req.body.username,
      password: req.body.password
    };

    console.log("XXXXXXXXXXXXXXXX");

    const dbName = 'second-test';

      // Use connect method to connect to the Server
      MongoClient.connect(uri, { useUnifiedTopology: true } , (error, client) => {
        if (error) {
          throw error;
        }
        database = client.db(dbName);
        collection = database.collection("user");
        console.log("Connected to `" + dbName + "`!");

        //TODO Find out how to get this into a java script so I can pull from mongodb through webpage

        database.collection('user', function (err, collection) {

          collection.find().toArray((err, items) => {
            if (err) throw err;
            console.log(items);
          });
        });
  });

  res.redirect('/');
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*router.get('/get-login', function(req, res, next){

  const dbName = 'second-test';

  // Use connect method to connect to the Server
  MongoClient.connect(uri, { useUnifiedTopology: true } , (error, client) => {
    if (error) {
      throw error;
    }
    database = client.db(dbName);
    collection = database.collection("user");
    console.log("Connected to `" + dbName + "`!");

    database.collection('user', function (err, collection) {

      collection.find().toArray((err, resultArray) => {
        if (err) throw err;
        console.log(resultArray);
      });
    });
  });

  res.redirect('/');

});*/

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/post-signup', function(req, res, next) {
var user = {
    username: req.body.username,
    password: req.body.password,
    reg: req.body.registration,
    code: req.body.code
  };
  const dbName = 'second-test';
  MongoClient.connect(uri, { useUnifiedTopology: true } , (error, client) => {
    if (error) {
      throw error;
    }
    database = client.db(dbName);
    collection = database.collection("user");
    console.log("Connected to `" + dbName + "`!");
    database.collection('user', function (err, collection) {
      collection.insertOne(user);
      console.log(user);
    });
  });

  res.redirect('/');
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/get-login', function(req, res, next) {
  const dbName = 'second-test';
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) {
      throw error;
    }
    database = client.db(dbName);
    collection = database.collection("user");
    console.log("Connected to `" + dbName + "`!");
    collection.find().toArray((err, resultArray) => {
      if (err) throw err;
      console.log(resultArray);
      const json2csvParser = new Json2csvParser({header: true});
      const csvData = json2csvParser.parse(resultArray);

      fs.writeFile("tripleVData.csv", csvData, function (error) {
        if (error) throw error;
        console.log("Write to tripleVData.csv successfully!");
      });
    });
  });
  res.render('fleettable');
});




module.exports = router;
