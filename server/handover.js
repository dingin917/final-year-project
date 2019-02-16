// import from mongo.js 
const Mongo = require('../mongo');
const Course = Mongo.Course;
const Prof = Mongo.Prof;
const ProfAssignmentTime = Mongo.ProfAssignmentTime;

var Handover = function(req, res, next){

    console.log('PUT Request for handover assignment');
    console.log("Request Body: " + JSON.stringify(req.body));

    // formatting upate info for prof-assignment-time db
    let time_assigned = [];
    req.body.week.forEach(w => {
        time_assigned.push({
            week: w,
            day: req.body.day, 
            start_time: req.body.start_time, 
            end_time: req.body.end_time
        });
    });

    /*
        requestBody.name = this.refs.newname.value;
        requestBody.acad_yr = this.state.course.acad_yr;
        requestBody.sem = this.state.course.sem;
        requestBody.code = this.state.course.code;
        requestBody.type = this.state.course.type;
        requestBody.category = this.refs.category.value;
        requestBody.group = this.refs.newgroup.value;
        requestBody.week = updated_week;
    */

    // update course db 
    Course.findOneAndUpdate({'acad_yr': req.body.acad_yr, 'sem': req.body.sem, 'category': req.body.category, 'code': req.body.code, 'type': req.body.type, 'schedule': {$elemMatch:{group: req.body.group, scheduled_weeks:{$elemMatch:{assignee: req.body.name}}}}},
        {
            $set: {
                "schedule.$[i].scheduled_weeks.$[j].week": req.body.week
            }
        }, 
        {
            arrayFilters:[{'i.group': req.body.group},{'j.assignee': req.body.name}],
            new: true
        }
    ).then(function(course){
        if(course != null){
            res.json(course);
            console.log("RESPONSE: Updated course profile ($SET):\n" + JSON.stringify(course));
            update_prof_profile(req, course, next);
            if(!req.body.flag){
                update_prof_assignment_time(req, res, next, time_assigned);
            }
        } else {
            Course.findOneAndUpdate({'acad_yr': req.body.acad_yr, 'sem': req.body.sem, 'category': req.body.category, 'code': req.body.code, 'type': req.body.type, 'schedule': {$elemMatch: {group: req.body.group}}},
            {
                $push: {
                    "schedule.$[i].scheduled_weeks": {
                        'week': req.body.week,
                        'assignee': req.body.name
                    }
                }
            }, 
            {
                arrayFilters:[{'i.group': req.body.group}],
                new: true
            }).then(function(newcourse){
                res.json(newcourse);
                console.log("RESPONSE: Updated course profile ($PUSH):\n" + JSON.stringify(newcourse));
                update_prof_profile(req, newcourse, next);
                if(!req.body.flag){
                    update_prof_assignment_time(req, res, next, time_assigned);
                }
            }).catch();
        }
    }).catch();
}

function update_prof_profile(req, course, next){
    // update prof db 
    var schedule = course.schedule.find(ele => ele.group == req.body.group);
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
        console.log("updated prof profile ($SET): \n" + JSON.stringify(prof));
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
                console.log("updated prof profile with a new course ($PUSH TO COURSE): \n" + JSON.stringify(profile));
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
                        console.log("updated prof profile with a new schedule for the semester ($PUSH TO SCHEDULE): \n" + JSON.stringify(newschedule));
                    }).catch();
                }
            }).catch();
        }
    }).catch();
}

function update_prof_assignment_time(req, res, next, time_assigned) {
    // update prof-assignment-time db
    ProfAssignmentTime.findOneAndUpdate({'initial': req.body.name},
        {
            $pull: {
                'schedule_time.$[i].time_assigned': {
                    week: { $in: req.body.original_weeks }, 
                    day: req.body.day, 
                    start_time: req.body.start_time, 
                    end_time: req.body.end_time
                }
            }
        }, 
        {
            arrayFilters:[{'i.acad_yr': req.body.acad_yr, 'i.sem': req.body.sem}],
            new: true
        }
    ).then(function(new_profassignmenttime) {
        console.log("Step1: pull previous assigned weeks first:\n" + JSON.stringify(new_profassignmenttime));
        ProfAssignmentTime.findOneAndUpdate({'initial': req.body.name},
            {
                $push: {
                    'schedule_time.$[i].time_assigned': {
                        $each: time_assigned
                    }
                }
            },
            {
                arrayFilters:[{'i.acad_yr': req.body.acad_yr, 'i.sem': req.body.sem}],
                new: true
            }
        ).then(function(new_timeassigned) {
            console.log("Step2: push newly assigned weeks:\n" + JSON.stringify(new_timeassigned));
        }).catch();
    }).catch();
}

module.exports = {  
    Handover: Handover
};