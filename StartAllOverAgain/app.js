const express = require('express');
const app = express();
const port = process.env.PORT || "3000";
var path = require('path');

//routes


app.get('/', (req,res) => {
    res.sendFile(__dirname+'/index.html', "text/html");
});

app.get('/fleetmanagement.css', (req,res) => {
    res.sendFile(__dirname+'/fleetmanagement.css', "text/css");
});

app.get('/images/fleetmanagement', (req,res) => {
    res.sendFile(__dirname+'/images/fleetmanagement', "image/jpeg");
});

app.listen(port);