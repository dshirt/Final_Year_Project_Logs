var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dshirt:test1234@fleetmanager-xixqp.mongodb.net/test?retryWrites=true&w=majority";
var fs = require("fs");
var database, collection;
var resultArray = [];
const Json2csvParser = require("json2csv").Parser;
var BCRYPT_SALT_ROUNDS = 12;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/', function(req, res, next) {
  res.render('index', {title: "TripleV"});
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/login', function(req, res, next) {
  res.render('login.html', {title: "Log in"});
});

router.get('/registerDriver', function(req, res, next) {
  res.redirect('pages/registerDriver.html');
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
      writeToCsv();
    });
  });

  res.redirect('/pages/fleettable.html');
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/post-registerAdmin', function(req, res, next) {

     var username= req.body.username;
    var password= req.body.password;
  const dbName = 'second-test';
  MongoClient.connect(uri, { useUnifiedTopology: true } , (error, client) => {
    if (error) {
      throw error;
    }
    database = client.db(dbName);
    collection = database.collection("user");
    console.log("Connected to `" + dbName + "`!");
    database.collection('user', function (err, collection) {
      bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
          .then(function(hashedPassword) {
            var item = {
              username: username,
              password: hashedPassword
            };
            return collection.insertOne(item);
          })
          .then(function() {
            res.send();
          })
          .catch(function(error){
            console.log("Error saving user: ");
            console.log(error);
            next();
          });
      console.log(username);
    });
  });
  res.redirect('/');
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/post-login', function(req, res, next) {

  var username= req.body.username;
  var password= req.body.password;
  const dbName = 'second-test';
  MongoClient.connect(uri, { useUnifiedTopology: true } , (error, client) => {
    if (error) {
      throw error;
    }
    console.log(dbName);
    database = client.db(dbName);
    collection = database.collection("user");
    console.log("Connected to `" + dbName + "`!");
    database.collection('user', function (err, collection) {
      collection.findOne({username})
          .then(function(user) {
            console.log(user);
            return bcrypt.compare(password, user.password);
          })
          .then(function(samePassword) {
            if(samePassword) {
              //res.status(403).send();
             writeToCsv();
              res.redirect('/pages/fleettable.html');
            }
              res.send();

          })
          .catch(function(error){
            console.log("Error authenticating user: ");
            console.log(error);
            next();
          });
    });
    });
  });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function writeToCsv(){
  collection.find().toArray((err, resultArray) => {
    if (err) throw err;
    console.log(resultArray);
    const json2csvParser = new Json2csvParser({header: true});
    const csvData = json2csvParser.parse(resultArray);

    fs.writeFile("C:\\Users\\john\\OneDrive - GMIT\\FinalYearProject2020\\Final_Year_Project_Logs\\WorkingFYP\\public\\pages\\tripleVData.csv", csvData, function (error) {
      if (error) throw error;
      console.log("Write to tripleVData.csv successfully!");
    });
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  module.exports = router;
