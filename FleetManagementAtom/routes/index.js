var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/scriptDb');
var Schema = mongoose.Schema;

var scriptSchema = new Schema({
  Name: String,
  Script: String
});

var theScript = mongoose.model('script', scriptSchema);

var theScriptOutput = "";

router.get('/', function(req, res, next) {
        res.render('index', {title: "Fleet Management"});
});
/*router.get('/', function(req, res, next) {
  theScript.find()
      .then(function(doc) {
        console.log("Array length is: " + doc.length);
        res.render('/index', {title: "My Page"});
      });
});*/

router.post('/runScript', function(req, res, next) {
  theScriptOutput += "It worked again. ";
  res.redirect('/');
});

router.post('/post-signup', function(req, res, next) {
        res.render('fleettable', {title: "Login status", yourUsername: req.body.username,
        yourPassword: req.body.password, TruckReg: req.body.registration});

      });


module.exports = router;
