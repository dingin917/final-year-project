const express = require('express');
const router = express.Router();

// import from mongo.js 
const Mongo = require('../mongo');
const Course = Mongo.Course;
const Prof = Mongo.Prof;
const Tutor = Mongo.Tutor;

// import from server folder
const LoadProfile = require("../server/load_profile");
const Assign = require("../server/assign");

// retrieve a course detail from the db
router.get('/courses', function(req, res, next){
    Course.findOne({ 'code': req.query.code, 'type': req.query.type} ).then(function(course){
        res.json(course);
        console.log("GET Request for viewing a course detail");
        console.log("URL Request Params: " + req.query);
        console.log("Response: " + course);
    }).catch(next);
});

// retrieve a teaching staff detail from the db 
router.get('/teachers', function(req, res, next){
    Prof.findOne( {'initial': req.query.name} ).then(function(prof){
        res.json(prof);
        console.log("GET Request for viewing a teaching staff detail");
        console.log("URL Request Params: " + req.query);
        console.log("Response: " + prof);
    }).catch(next);
});

// add a new teaching staff to the db 
router.post('/teachers', function(req, res, next){
    Prof.create(req.body).then(function(prof){
        res.json(prof);
        console.log('POST Request for adding a new teaching staff');
        console.log("Request Body: " + req.body);
        console.log("Response: " + prof);
    }).catch(next);
});

// add a new course to the db, when error occurs, go to the next piece of middleware -> error handling 
router.post('/courses', function(req, res, next){
    Course.create(req.body).then(function(course){
        res.json(course);
        console.log('POST Request for adding a new course');
        console.log("Request Body: " + req.body);
        console.log("Response: " + course);
    }).catch(next);
});

// update a course assignee in the db
router.put('/courses/assign', Assign.assign(req, res, next));

// delete a course from the db 
router.delete('/courses/:id', function(req, res, next){
    Course.findByIdAndDelete({_id: req.params.id}).then(function(course){
        res.json({type: 'DELETE'});
        console.log("DELETE Request");
        console.log("Request Body: " + req.params);
    }).catch(next);
});

module.exports = router;