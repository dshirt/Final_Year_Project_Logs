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

router.get('/logout', function(req, res, next) {
    res.render('index', {title: "TripleV"});
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.post('/post-unlockcode', function(req, res, next) {

    var unlock = req.body.password;
    var admin = "admin";

    const dbName = 'facerecog';
    MongoClient.connect(uri, {useUnifiedTopology: true}, (error, client) => {
        if (error) {
            throw error;
        }
        database = client.db(dbName);
        collection = database.collection("unlockCode");
        console.log("Connected to `" + dbName + "`!");
        console.log(dbName);
        database.collection('unlockCode', function (err, collection) {
            collection.findOne({admin})
                .then(function(code) {
                    return bcrypt.compare(unlock, code.code);
                })
                .then(function(samePassword) {
                    if(samePassword) {
                        res.redirect('/pages/index.html');
                    }else
                        res.redirect('/');
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



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/login', function(req, res, next) {
  res.render('login.html', {title: "Log in"});
});

router.get('/registerDriver', function(req, res, next) {
  res.redirect('pages/registerDriver.html');
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.post('/post-signup', function(req, res, next) {
    var driver = {
        driversname: req.body.driversname,
        username : req.body.username,
        password : req.body.password,
        reg : req.body.registration,
        code :  req.body.code,
        active : "No"
    }

  const dbName = 'facerecog';
  MongoClient.connect(uri, { useUnifiedTopology: true } , (error, client) => {
    if (error) {
      throw error;
    }
    database = client.db(dbName);
    collection = database.collection("users");
    console.log("Connected to `" + dbName + "`!");
    collection.insertOne(driver);
    database.collection('users', function (err, collection) {
        bcrypt.hash(driver.password, BCRYPT_SALT_ROUNDS)
            .then(function(hashedPassword) {
                return collection.updateOne({"driversname": driver.driversname }, {$set: {"password" : hashedPassword}});
            });bcrypt.hash(driver.reg, BCRYPT_SALT_ROUNDS)
            .then(function(hashedCode) {
                return collection.updateOne({"driversname": driver.driversname }, {$set: {"code" : hashedCode}});
            });bcrypt.hash(driver.reg, BCRYPT_SALT_ROUNDS)
            .then(function(hashedUsername) {
                return collection.updateOne({"driversname": driver.driversname }, {$set: {"username" : hashedUsername}});
            })
            .then(function() {
                writeToJSON();
            });
        });
    });
    setTimeout(function () {
        res.redirect('/pages/fleettable.html')
    }, 2000);
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/post-registerAdmin', function(req, res, next) {

     var username= req.body.username;
    var password= req.body.password;
  const dbName = 'facerecog';
  MongoClient.connect(uri, { useUnifiedTopology: true } , (error, client) => {
    if (error) {
      throw error;
    }
    database = client.db(dbName);
    collection = database.collection("managers");
    console.log("Connected to `" + dbName + "`!");
    database.collection('managers', function (err, collection) {
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
  res.redirect('/pages/index.html');
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/post-login', function(req, res, next) {

  var username= req.body.username;
  var password= req.body.password;
  const dbName = 'facerecog';
  MongoClient.connect(uri, { useUnifiedTopology: true } , (error, client) => {
    if (error) {
      throw error;
    }
    console.log(dbName);
    database = client.db(dbName);
    collection = database.collection("managers");
    console.log("Connected to `" + dbName + "`!");
    database.collection('managers', function (err, collection) {
      collection.findOne({username})
          .then(function(user) {
            console.log(user);
            return bcrypt.compare(password, user.password);
          })
          .then(function(samePassword) {
            if(samePassword) {
              //res.status(403).send()
                writeToJSON();
                setTimeout(function () {
                    res.redirect('/pages/fleettable.html')
                }, 2000);
            }
            else
                res.redirect('/pages/login.html')
          })
          .catch(function(error){
            console.log("Error authenticating user: ");
            console.log(error);
            next();
          });
    });
});
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.post('/updatedata', function(req, res, next) {
    const dbName = 'facerecog';
    MongoClient.connect(uri, { useUnifiedTopology: true } , (error, client) => {
        if (error) {
            throw error;
        }
        console.log(dbName);
        database = client.db(dbName);
        collection = database.collection("users");
        console.log("Connected to `" + dbName + "`!");
        database.collection('users', function (err, collection) {
            writeToJSON();
            setTimeout(function () {
                res.redirect('/pages/fleettable.html')
            }, 2000);
        });
    });

});






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function writeToJSON(){
    collection = database.collection("users");
      collection.find().toArray((err, resultArray) => {
        if (err) throw err;
        console.log(resultArray);
        var json = JSON.stringify(resultArray);


        fs.writeFile("C:\\Users\\john\\OneDrive - GMIT\\FinalYearProject2020\\Final_Year_Project_Logs\\WorkingFYP\\public\\pages\\tripleVData.json", json, function (error) {
          if (error) throw error;
          console.log("Write to tripleVData.json successfully!");
    });
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  module.exports = router;
