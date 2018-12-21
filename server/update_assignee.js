// import from mongo.js 
const Mongo = require('../mongo');
const Course = Mongo.Course;
const Prof = Mongo.Prof;

var updateAssignee = function(req, res, next){

    console.log('PUT Request for teaching assignment');
    console.log("Request Body: " + JSON.stringify(req.body));

    var week = [];
    for (var i=parseInt(req.body.start_week); i<=parseInt(req.body.end_week); i++){
        week.push(i);
    }
    console.log("teaching_weeks: " + week);

    Course.findOneAndUpdate({'acad_yr': req.body.acad_yr, 'sem': req.body.sem, 'code': req.body.code, 'type': req.body.type},
        {
            $push: {
                "schedule.$[i].scheduled_weeks":
                {
                    'week': week,
                    'assignee': req.body.name
                }
            },
            // $pull: {
            //     "schedule.$[i].unscheduled_weeks": 
            //     {
            //         $and: [{$gte: req.body.start_week}, {$lte: req.body.end_week}]
            //     }
            // }
        }, 
        {
            arrayFilters:[{'i.group': req.body.group}],
            new: true
        }
    ).then(function(result){
        res.json(result);
        console.log("Response: " +  JSON.stringify(result));
        var schedule = result['schedule'].find(ele => ele.group = req.body.group);
        Prof.findOneAndUpdate({'initial': req.body.name, 'schedule': {$elemMatch: {acad_yr: req.body.acad_yr, sem: req.body.sem, courses: {$elemMatch: {code: req.body.code, type: req.body.type, group: req.body.group}}}}},
        { 
            $push: {
                'schedule.$[j].courses.$[i].teaching_weeks': {$each: week}
            }
        }, 
        {
            arrayFilters:[{'j.acad_yr': req.body.acad_yr, 'j.sem': req.body.sem},
                            {'i.code': req.body.code, 'i.type': req.body.type,
                            'i.group': req.body.group}],
            new: true
        })
        .then(function(prof){
            console.log("updated prof profile: " + JSON.stringify(prof));
            if(prof == null) {
                Prof.findOneAndUpdate({'initial': req.body.name, 'schedule': {$elemMatch: {acad_yr: req.body.acad_yr, sem: req.body.sem}}}, 
                {
                    $push: {
                        'schedule.$[j].courses': {
                            'code': req.body.code,
                            'type': req.body.type,
                            'group': req.body.group,
                            'teaching_weeks': week,
                            'day': schedule.day,
                            'start_time': schedule.start_time,
                            'end_time': schedule.end_time,
                            'venue': schedule.venue
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
                                        'teaching_weeks': week,
                                        'day': schedule.day,
                                        'start_time': schedule.start_time,
                                        'end_time': schedule.end_time,
                                        'venue': schedule.venue
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
    }).catch(next);

}

module.exports = {  
    updateAssignee: updateAssignee
  };