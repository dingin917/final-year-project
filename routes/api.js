const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'tmp/csv/' });
const crypto = require('crypto');

// import from mongo.js 
const Mongo = require('../mongo');
const Course = Mongo.Course;
const Prof = Mongo.Prof;
const WeekToDate = Mongo.WeekToDate;
const User = Mongo.User;

// import from server folder
const LoadProfile = require('../server/load_profile');
const UploadCourse = require('../server/upload_course');
const ConvertWeekToDates = require('../server/convert_weektodate');
const UpdateAssignee = require('../server/update_assignee');
const Handover = require('../server/handover');
const SendEmail = require('../server/send_email');

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

// send email to prof 
router.post('/email', function(req, res, next){
    SendEmail.SendEmail(req, res, next);
});

// retrieve prof list for search 
router.get('/search_prof', function(req, res, next){
    Prof.aggregate([{$project: {initial: 1, fullname: 1}}])
    .then(function(result){
        res.json(result);
        console.log("GET Request for course list used to search");
        console.log("URL Request Params: " + JSON.stringify(req.query));
        console.log("Response: " + result);
    })
    .catch(next);
});

// retrieve course list for search 
router.get('/search_course', function(req, res, next){
    Course.find({'acad_yr': req.query.acad_yr, 'sem': req.query.sem})
    .then(function(result){
        let courseSet = [...new Set(result.map(item => item.code))];
        let courseList = [];
        courseSet.forEach(ele => {
	        courseList.push({code:ele});
        })
        res.json(courseList);
        console.log("GET Request for course list used to search");
        console.log("URL Request Params: " + JSON.stringify(req.query));
        console.log("Response: " + courseList);
    })
    .catch(next);
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

// add a user to db
router.post('/user/register', function(req, res, next){
    // Encrypt password before saving to database
    let key = crypto.createCipher('aes-128-ecb', 'ntu-eee');
    let encrypted = key.update(req.body.password, 'utf8', 'hex') + key.final('hex');

    // Decrypt password 
    let cipher = crypto.createDecipher('aes-128-ecb', 'ntu-eee');
    let decrpted = cipher.update(encrypted,'hex', 'utf8') + cipher.final('utf8');
    console.log("Decrpted password: " + decrpted);

    User.findOneAndUpdate({email: req.body.email},
    { 
        $set: {
            'password': encrypted,
            'username': req.body.username
        }
    }, 
    {
        new: true,
        upsert: true
    })
    .then(function(user){
        res.json(user);
        console.log("POST Request for adding a user");
        console.log("Request Body: " + JSON.stringify(req.body));
        console.log("Response: " + user);

    }).catch(next);
});

// authenticate a user 
router.get('/user/authenticate', function(req, res, next){
    User.find({email: req.query.email, password: req.query.password})
    .then(function(user){
        res.json(user);
        console.log("GET Request for authenticating a user");
        console.log("Request Body: " + JSON.stringify(req.body));
        console.log("Response: " + user);
    }).catch(next);
});

module.exports = router;