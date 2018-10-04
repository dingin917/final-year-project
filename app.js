const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');

const app = express();

// View Engine 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware -> app.use() functioning between request and response 
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use('/api',require('./routes/api'));
app.use(function(err, req, res, next){
    res.status(422).send({error: err.message});
});

app.listen(3000, function(){
    console.log('Sever Started on Port 3000, now listening for requests...');
});
