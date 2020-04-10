/*
* John Lawless
* G00351835@gmit.ie
* 10/04/2020
*
* This code forms part of my Final Year Project
* for a BEng(Hons) Software and Electronic Engineering
*
* Vehicle Visage Verification (TripleV) is a fully networked,
* cloud-based fleet management system
* It includes:
*      1. A cloud based web application for managing the fleet
*      2. A cloud based database for storing all relative information
*      3. Encryption for all sensitive information on the database
*      4. Face recognition software held on a Raspberry Pi
*      5. A GUI held on the Pi.
* This code is where all button pushes or
 change of states are routed to functions
 After the functions execute  a redirect to the next page occurs

 All dependencies are assigned to a variables here also.

* */



var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var MongoClient = require('mongodb').MongoClient;
//This URI is specific to the facerecog database and only allows access to the collections held in there
const uri = "mongodb+srv://dshirt:test1234@fleetmanager-xixqp.mongodb.net/test?retryWrites=true&w=majority";
//required to write to the file system to save json
var fs = require("fs");
var database, collection;
var resultArray = [];
var BCRYPT_SALT_ROUNDS = 12;

//////////////////////////////////////////////Render Landing Page////////////////////////////////////////////////////////////////////////////////

router.get('/', function(req, res, next) {
  res.render('index', {title: "TripleV"});
});

router.get('/logout', function(req, res, next) {
    res.render('index', {title: "TripleV"});
});

/////////////////////////////////////////////////This function unlocks the system////////////////////////////////////////////////////////////////////////////////


router.post('/post-unlockcode', function(req, res, next) {
    //take the password entered into the web page
    //assign it to unlock
    var unlock = req.body.password;
    var admin = "admin";

    const dbName = 'facerecog';
    //connect to facerecog
    MongoClient.connect(uri, {useUnifiedTopology: true}, (error, client) => {
        if (error) {
            throw error;
        }
        database = client.db(dbName);
        collection = database.collection("unlockCode");
        console.log("Connected to `" + dbName + "`!");
        console.log(dbName);
        database.collection('unlockCode', function (err, collection) {
            /*There is only one entry in the unlockCode collection
            * on the database and the admin is admin
            * we find that and retieve all its details
            * e.g. the access code*/
            collection.findOne({admin})
                .then(function(code) {
                    /*compare an encrypted version of the entered password
                    * with the encrypted password in the database*/
                    return bcrypt.compare(unlock, code.code);
                })
                .then(function(samePassword) {
                    /* if they match then enter the system
                    * else redirect back to the landing page*/
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



/////////////////////////////////////////////////////Register/ login manager functions/////////////////////////////////////////////////////////////////////////////

router.get('/login', function(req, res, next) {
  res.render('login.html', {title: "Log in"});
});

router.get('/registerDriver', function(req, res, next) {
  res.redirect('pages/registerDriver.html');
});


//////////////////////////////////////////////////////////sign up new Driver///////////////////////////////////////////////////////////////////////////////


router.post('/post-signup', function(req, res, next) {
    /*Place all the information entered into a driver object*/
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
    /*insert the driver details on the database*/
    collection.insertOne(driver);
    database.collection('users', function (err, collection) {
        /*encrypt the details of the driver object that need to be secured
        * and update the drivers details in the database*/
        bcrypt.hash(driver.password, BCRYPT_SALT_ROUNDS)
            .then(function(hashedPassword) {
                return collection.updateOne({"driversname": driver.driversname }, {$set: {"password" : hashedPassword}});
            });bcrypt.hash(driver.code, BCRYPT_SALT_ROUNDS)
            .then(function(hashedCode) {
                return collection.updateOne({"driversname": driver.driversname }, {$set: {"code" : hashedCode}});
            });bcrypt.hash(driver.username, BCRYPT_SALT_ROUNDS)
            .then(function(hashedUsername) {
                return collection.updateOne({"driversname": driver.driversname }, {$set: {"username" : hashedUsername}});
            })
            .then(function() {
                //Update the json with all details in the database
                writeToJSON();
            });
        });
    });
  /*timeout used to delay the redirect to the fleet table
  * to make sure the json file is updated
  * before displaying the new details*/
    setTimeout(function () {
        res.redirect('/pages/fleettable.html')
    }, 2000);
});


/////////////////////////////////////////////////////////Register New manager on the system/////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////Login Manager///////////////////////////////////////////////////////////////////////////////

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


/////////////////////////////////////////////////////////Update data ////////////////////////////////////////////////////////////////////////////////////////////////
/*This is the function called every 10 seconds
* when the fleet table page is open
* and constantly updates the page as data changes*/

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






//////////////////////////////////////////////This function writes to a json ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* This function has the sole purpose of creating a new json
* It was written to negate these lines of code being repeated*/
function writeToJSON(){
    collection = database.collection("users");
    //extracts all data in users collection and writes to an array of objects
      collection.find().toArray((err, resultArray) => {
        if (err) throw err;
        console.log(resultArray);
        //convert the array of objects into a Json string and write to a json file
        var json = JSON.stringify(resultArray);
        fs.writeFile("C:\\Users\\john\\OneDrive - GMIT\\FinalYearProject2020\\Final_Year_Project_Logs\\WorkingFYP\\public\\pages\\tripleVData.json", json, function (error) {
          if (error) throw error;
          //console.log() is simply for debugging and writes a message to the console
          console.log("Write to tripleVData.json successfully!");
    });
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  module.exports = router;
