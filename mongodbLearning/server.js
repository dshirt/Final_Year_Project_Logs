//define express library using the express module
const express = require('express');
const app = express();
//Using the mongodb driver
//npm install mongodb --save
const MongoClient = require('mongodb').MongoClient;
//connection url for mongodb atlas
const url = "mongodb+srv://Admin:Dshirt49300770@fleetmanager-xixqp.mongodb.net/test?retryWrites=true&w=majority";
const dataBaseName = 'first-test';
const dbCollection = 'users';
//creating a variable to be used in the application
var str = "";


/*app.get('/', (req, res) => {
    res.send('Using global content security policy!');
});*/

//design a route to the application called name
app.route('/Name').get(function(req,res)
{
    MongoClient.connect(url, function(err, client){
        const db = client.db(dataBaseName);
        //find all entries in the database
        var cursor = db.collection(dbCollection).find();
        cursor.each(function (err, item) {
            //if item is not empty put all the information in a string
                if (item != null) {
                    str = str + "  name " + item.name + "</br>";
                }
            });
                res.send(err);
                db.close();
    });
});
var server = app.listen(3000, function(){});
//connect and insert data into the database
/*MongoClient.connect(url, function(error, client){
    const db = client.db(dataBaseName);
    //insert an entry into the database
    db.collection(dbCollection).insertOne({
        name:"Shea",
        age : 3
    });
});*/


//update an entry
MongoClient.connect(url, function(error, client){
    const db = client.db(dataBaseName);
    //insert an entry into the database
    db.collection(dbCollection).updateOne(
        {"name":"John"},
        { $set: {"age" : 4}
    });
});

//delete entry
MongoClient.connect(url, function(error, client){
    const db = client.db(dataBaseName);
    //insert an entry into the database
    db.collection(dbCollection).deleteOne(
        {"name":"Shea"}
        );
});


//connecting to the database
//This is how the connection has to be done in mongodb above v2.2.33
//connect and find all the entries in the database
MongoClient.connect(url, function(error, client){
    const db = client.db(dataBaseName);
    //find all entries in the database
    var cursor = db.collection(dbCollection).find();
    //iterate through all the instances
    cursor.each(function(err,doc){
        console.log(doc);
    });
});;
