const express = require('express');
// import React from 'react';
// import { renderToString } from 'react-dom/server';
const bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');

const app = express();


app.use(express.static(path.join(__dirname, 'interface', 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.get('/', (req, res) => {
    // const body = ReactDOMServer.renderToString(App);
    res.send(
        "HTML(body)"
    );
});
app.use('/api', require('./routes/api'));
app.use(function (err, req, res, next) {
    res.status(422).send({ error: err.message });
});

app.listen(3001, function () {
    console.log('Sever Started on Port 3001, now listening for requests...');
});
