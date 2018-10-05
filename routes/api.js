const express = require('express');
const router = express.Router();

// import from mongo.js 
const Mongo = require('../mongo');
const Course = Mongo.Course;
const Prof = Mongo.Prof;
const Tutor = Mongo.Tutor;

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
    Prof.findOne( {'name': req.query.name} ).then(function(prof){
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
router.put('/courses/assign', function(req, res, next){
    Course.findOneAndUpdate({'code': req.body.code, 'type': req.body.type},
        {
            $push: {
                "schedule.$[i].slots.$[j].scheduledweek":
                {
                    'week': req.body.week,
                    'assignee': req.body.name
                }
            }
      },
      {
          arrayFilters:[{'i.group': req.body.group}, {'j.day': req.body.day}]
      }
    ).then(function(data){

        Course.aggregate([
            {
                $match: {'code': req.body.code, 'type': req.body.type}
            },
            {
                $project: {
                    schedule: {
                        $filter:{
                            input: {
                                $map: {
                                    input: "$schedule",
                                    as: "schedule",
                                    in: {
                                        group: "$$schedule.group",
                                        slots: {
                                            $filter: {
                                                input: "$$schedule.slots",
                                                as: "slot",
                                                cond: { $eq: ["$$slot.day", req.body.day] }
                                            }  
                                        }
                                    }
                                 }
                            },        
                            as: "schedule",
                            cond: { $eq: ["$$schedule.group", req.body.group ]}
                        }
                    }
                }
            }
        ]).then(function(result){

            console.log("return project: "+JSON.stringify(result));
            var schedule = result[0].schedule[0];
            var course = {};
            course.code = req.body.code;
            course.type = req.body.type;
            course.group = req.body.group;
            course.teachingweek = schedule.slots[0].scheduledweek[0].week;
            course.day = schedule.slots[0].day;
            course.time = schedule.slots[0].time;
            course.venue = schedule.slots[0].venue;

            console.log("course: "+JSON.stringify(course));
 
            Prof.findOneAndUpdate({name: req.body.name}, {
                $push: {courses: course}
            }).then(function(prof){
                console.log("updated prof: " + JSON.stringify(prof));
            });
        });
        res.json(data);
        console.log('PUT Request for teaching assignment');
        console.log("Request Body: " + req.body);
        console.log("Response: " + res);
    }).catch(next);
});

// delete a course from the db 
router.delete('/courses/:id', function(req, res, next){
    Course.findByIdAndDelete({_id: req.params.id}).then(function(course){
        res.json({type: 'DELETE'});
        console.log("DELETE Request");
        console.log("Request Body: " + req.params);
    }).catch(next);
});

module.exports = router;