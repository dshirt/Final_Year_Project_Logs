var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Admin:Dshirt49300770@fleetmanager-xixqp.mongodb.net/test?retryWrites=true&w=majority");
var Schema = mongoose.Schema;

var scriptSchema = new Schema({
  Name: String,
  Script: String
});

var theScript = mongoose.model('script', scriptSchema);

var theScriptOutput = "";

router.get('/', function(req, res, next) {
        res.render('index1', {title: "Fleet Management"});
});

/*router.get('/', function(req, res, next) {
  theScript.find()
      .then(function(doc) {
        console.log("Array length is: " + doc.length);
        res.render('index', {title: "My Page", items: doc, scriptOutput: theScriptOutput});
      });
});*/

router.post('/runScript', function(req, res, next) {
  theScriptOutput += "It worked again. ";
  res.redirect('/');
});


module.exports = router;
