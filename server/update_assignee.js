// import from mongo.js 
const Mongo = require('../mongo');
const Course = Mongo.Course;
const Prof = Mongo.Prof;

var updateAssignee = function(req, res, next){

    console.log('PUT Request for teaching assignment');
    console.log("Request Body: " + JSON.stringify(req.body));

    Course.findOne({'acad_yr': req.body.acad_yr, 'sem': req.body.sem, 'code': req.body.code, 'type': req.body.type})
    .then(function(original){
        console.log('Original Response: ' + original);
        Course.findOneAndUpdate({'acad_yr': req.body.acad_yr, 'sem': req.body.sem, 'code': req.body.code, 'type': req.body.type},
            {
                $push: {
                    "schedule.$[i].slots.$[j].scheduled_weeks":
                    {
                        'week': req.body.week,
                        'assignee': req.body.name
                    }
                }
            }, 
            {
                arrayFilters:[{'i.group': req.body.group}, 
                            {'j.day': req.body.day, 'j.start_time': req.body.start_time,
                            'j.end_time': req.body.end_time, 'j.venue': req.body.venue}],
                new: true
            }
        ).then(function(result){
            if (JSON.stringify(original)===JSON.stringify(result)) {
                res.json(null);          
                console.log("Error Message: Cannot find the record in database, hence no updating..");
            } else {
                res.json(result);
                console.log("Response: " +  JSON.stringify(result));
                Prof.findOneAndUpdate({'initial': req.body.name, 'schedule': {$elemMatch: {acad_yr: req.body.acad_yr, sem: req.body.sem, courses: {$elemMatch: {code: req.body.code, type: req.body.type, group: req.body.group, day: req.body.day, start_time: req.body.start_time, end_time: req.body.end_time, venue:req.body.venue}}}}},
                { 
                    $push: {
                        'schedule.$[j].courses.$[i].teaching_weeks': {$each: req.body.week}
                    }
                }, 
                {
                    arrayFilters:[{'j.acad_yr': req.body.acad_yr, 'j.sem': req.body.sem},
                                    {'i.code': req.body.code, 'i.type': req.body.type,
                                    'i.group': req.body.group, 'i.day': req.body.day,
                                    'i.start_time': req.body.start_time, 
                                    'i.end_time': req.body.end_time, 'i.venue': req.body.venue}],
                    new: true
                }
                )
                .then(function(prof){
                    console.log("updated prof profile: " + JSON.stringify(prof));
                    if(prof == null) {
                        Prof.findOneAndUpdate({'initial': req.body.name, 'schedule': {$elemMatch: {acad_yr: req.body.acad_yr, sem: req.body.sem,}}}, 
                        {
                            $push: {
                                'schedule.$[j].courses': {
                                    'code': req.body.code,
                                    'type': req.body.type,
                                    'group': req.body.group,
                                    'teaching_weeks': req.body.week,
                                    'day': req.body.day,
                                    'start_time': req.body.start_time,
                                    'end_time': req.body.end_time,
                                    'venue': req.body.venue
                                }
                            }
                        }, 
                        {   
                            arrayFilters:[{'j.acad_yr': req.body.acad_yr, 'j.sem': req.body.sem}],
                            new: true   
                        })
                        .then(function(profile){
                            console.log("updated prof profile with a new course: " + JSON.stringify(profile));
                            if(profile == null) {
                                Prof.findOneAndUpdate({'initial': req.body.name},
                                {
                                    $push: {
                                        'schedule': {
                                            'acad_yr': req.body.acad_yr,
                                            'sem': req.body.sem,
                                            'courses': [{
                                                'code': req.body.code,
                                                'type': req.body.type,
                                                'group': req.body.group,
                                                'teaching_weeks': req.body.week,
                                                'day': req.body.day,
                                                'start_time': req.body.start_time,
                                                'end_time': req.body.end_time,
                                                'venue': req.body.venue
                                            }]
                                        }
                                    }
                                },
                                {   new: true })
                                .then(function(newschedule){
                                    console.log("updated prof profile with a new schedule: " + JSON.stringify(newschedule));
                                })
                            }
                        }).catch(next);
                    }
                }).catch(next);
            }
        }).catch(next);
    }).catch(next);
}

module.exports = {  
    updateAssignee: updateAssignee
  };