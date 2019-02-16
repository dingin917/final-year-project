// import from mongo.js 
const Mongo = require('../mongo');
const Course = Mongo.Course;
const Prof = Mongo.Prof;

var updateAssignee = function(req, res, next){

    console.log('PUT Request for teaching assignment');
    console.log("Request Body: " + JSON.stringify(req.body));
    
    // remove the updating weeks from unscheduled_weeks
    Course.findOneAndUpdate({'acad_yr': req.body.acad_yr, 'sem': req.body.sem, 'category': req.body.category, 'code': req.body.code, 'type': req.body.type},
        {
            $set: {
                "schedule.$[i].unscheduled_weeks": req.body.weeks
            }
        }, 
        {
            arrayFilters:[{'i.group': req.body.group}],
            new: true
        }
    ).then(function(delete_result){
        console.log("Course after remove updating weeks => \n" + JSON.stringify(delete_result));
        Course.findOneAndUpdate({'acad_yr': req.body.acad_yr, 'sem': req.body.sem, 'category': req.body.category, 'code': req.body.code, 'type': req.body.type, 'schedule': {$elemMatch:{group: req.body.group, scheduled_weeks:{$elemMatch: {assignee: req.body.name}}}}},
        {
            $set: {
                "schedule.$[i].scheduled_weeks.$[j].week": req.body.week
            }
        }, 
        {
            arrayFilters:[{'i.group': req.body.group},{'j.assignee': req.body.name}],
            new: true
        }
        ).then(function(result){
            console.log("Course with existing assignee:\n"+JSON.stringify(result));
            if (result != null){
                update_prof_profile(req, res, result, next);
            } else {
                Course.findOneAndUpdate({'acad_yr': req.body.acad_yr, 'sem': req.body.sem, 'category': req.body.category, 'code': req.body.code, 'type': req.body.type},
                {
                    $push: {
                        "schedule.$[i].scheduled_weeks":
                        {
                            'week': req.body.week,
                            'assignee': req.body.name
                        }
                    }
                }, 
                {
                    arrayFilters:[{'i.group': req.body.group}],
                    new: true
                }).then(function(newcourse){
                    console.log("Course without existing assignee:\n"+JSON.stringify(newcourse));
                    update_prof_profile(req, res, newcourse, next);
                }).catch(next); 
            }
        }).catch(next);
    }).catch(next);
}

function update_prof_profile(req, res, updated_course, next){
    res.json(updated_course);
    console.log("Updated Course: \n" + JSON.stringify(updated_course));
    var schedule = updated_course['schedule'].find(ele => ele.group == req.body.group);
    Prof.findOneAndUpdate({'initial': req.body.name, 'schedule': {$elemMatch: {acad_yr: req.body.acad_yr, sem: req.body.sem, courses: {$elemMatch: {code: req.body.code, type: req.body.type, category: req.body.category, group: req.body.group}}}}},
    { 
        $set: {
            'schedule.$[j].courses.$[i].teaching_weeks': req.body.week
        }
    }, 
    {
        arrayFilters:[{'j.acad_yr': req.body.acad_yr, 'j.sem': req.body.sem},
                        {'i.code': req.body.code, 'i.type': req.body.type,
                        'i.category': req.body.category, 'i.group': req.body.group}],
        new: true
    })
    .then(function(prof){
        console.log("updated prof profile: \n" + JSON.stringify(prof));
        if(prof == null) {
            Prof.findOneAndUpdate({'initial': req.body.name, 'schedule': {$elemMatch: {acad_yr: req.body.acad_yr, sem: req.body.sem}}}, 
            {
                $push: {
                    'schedule.$[j].courses': {
                        'code': req.body.code,
                        'type': req.body.type,
                        'category': req.body.category,
                        'group': req.body.group,
                        'teaching_weeks': req.body.week,
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
                console.log("updated prof profile with a new course: \n" + JSON.stringify(profile));
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
                                    'category': req.body.category,
                                    'group': req.body.group,
                                    'teaching_weeks': req.body.week,
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
                        console.log("updated prof profile with a new schedule for the semester: \n" + JSON.stringify(newschedule));
                    }).catch(next);
                }
            }).catch(next);
        }
    }).catch(next);

}

module.exports = {  
    updateAssignee: updateAssignee
};