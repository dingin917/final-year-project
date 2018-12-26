const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'tmp/csv/' });

// import from mongo.js 
const Mongo = require('../mongo');
const Course = Mongo.Course;
const Prof = Mongo.Prof;
const WeekToDate = Mongo.WeekToDate;

// import from server folder
const LoadProfile = require('../server/load_profile');
const UploadCourse = require('../server/upload_course');
const ConvertWeekToDates = require('../server/convert_weektodate');
const UpdateAssignee = require('../server/update_assignee');
const Handover = require('../server/handover');

// upload teaching profiles to db in csv format
router.post('/teachers/upload', upload.single('file'), function (req, res, next) {
    LoadProfile.readCSV(req, res, next);
});

// upload courses to db in csv format
router.post('/courses/upload', upload.single('file'), function (req, res, next) {
    UploadCourse.readCSV(req, res, next);
});

// update academic calendar to db
router.post('/dates', function(req, res, next){
    ConvertWeekToDates.updateDB(req, res, next);
});

// update a course assignee in the db
router.put('/courses/assign', function(req, res, next){
    UpdateAssignee.updateAssignee(req, res, next);
});

// handover a course to another prof 
router.put('/courses/handover', function(req, res, next){
    Handover.Handover(req, res, next);
});

// retrieve academic calendar from db
router.get('/dates', function(req, res, next){
    WeekToDate.findOne({'acad_yr': req.query.acad_yr, 'sem': req.query.sem})
    .then(function(calendar){
        res.json(calendar);
        console.log("GET Request for viewing academic calendar");
        console.log("URL Request Params: " + JSON.stringify(req.query));
        console.log("Response: " + calendar);
    })
    .catch(next);
});

// retrieve a course detail from db
router.get('/courses', function(req, res, next){
    Course.findOne({'acad_yr': req.query.acad_yr, 'sem': req.query.sem, 'category': req.query.category, 'code': req.query.code, 'type': req.query.type})
    .then(function(course){
        res.json(course);
        console.log("GET Request for viewing a course detail");
        console.log("URL Request Params: " + JSON.stringify(req.query));
        console.log("Response: " + course);
    })
    .catch(next);
});

// retrieve a teaching staff assignment detail from db 
router.get('/teachers', function(req, res, next){
    Prof.findOne( {'initial': req.query.initial, 'schedule': {$elemMatch: {acad_yr: req.query.acad_yr, sem: req.query.sem}}} )
    .then(function(prof){
        res.json(prof);
        console.log("GET Request for viewing a teaching staff detail");
        console.log("URL Request Params: " + req.query);
        console.log("Response: " + prof);
    })
    .catch(next);
});

// retrieve a teaching profile from db
router.get('/teachers/profile', function(req, res, next){
    Prof.findOne( {'initial': req.query.initial} )
    .then(function(prof){
        res.json(prof);
        console.log("GET Request for viewing a teaching staff detail");
        console.log("URL Request Params: " + req.query);
        console.log("Response: " + prof);
    })
    .catch(next);
});

// add a new teaching staff to the db 
router.post('/teachers', function(req, res, next){
    Prof.create(req.body)
    .then(function(prof){
        res.json(prof);
        console.log('POST Request for adding a new teaching staff');
        console.log("Request Body: " + req.body);
        console.log("Response: " + prof);
    })
    .catch(next);
});

// delete a course from the db, currently not implemented 
router.delete('/courses/:id', function(req, res, next){
    Course.findByIdAndDelete({_id: req.params.id}).then(function(course){
        res.json({type: 'DELETE'});
        console.log("DELETE Request");
        console.log("Request Body: " + req.params);
    }).catch(next);
});

module.exports = router;