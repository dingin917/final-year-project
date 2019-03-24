// import from mongo.js 
const Mongo = require('../mongo');
const ProfAssignmentTime = Mongo.ProfAssignmentTime;

var clashCheckProf = function(req, res, next){

    console.log('PUT Request for clash check of prof assignment\n');
    console.log("Request Body: " + JSON.stringify(req.body));

    let start_time = req.body.start_time;
    let end_time = req.body.end_time; 

    // format time:{week, day, start_time, end_time} for update profAssignmentTime
    let time_assigned_update_arr = [];
    for(let i = parseInt(req.body.start_week); i <= parseInt(req.body.end_week); i++){
        time_assigned_update_arr.push({week: i, day: req.body.day, start_time: req.body.start_time, end_time: req.body.end_time})
    }

    // clash check before assignment 
    ProfAssignmentTime.findOne({'initial': req.body.name, 'schedule_time': {$elemMatch: {acad_yr: req.body.acad_yr, sem: req.body.sem}}})
    .then(function(profAssignmentTime){
        if (profAssignmentTime == null){
            // no previous assignment - ok 
            res.json(null);            
            update_prof_assignment_time(req, res, next, time_assigned_update_arr);
        } else {
            console.log("schedule_time\n" + JSON.stringify(profAssignmentTime.schedule_time));
            let scheduled_time = profAssignmentTime.schedule_time.filter(sche => sche.acad_yr === req.body.acad_yr && sche.sem === req.body.sem);
            console.log("filtered schedule_time\n" + JSON.stringify(scheduled_time));
            let time_assigned = scheduled_time[0].time_assigned;
            console.log("time_assigned\n" + time_assigned);
            let flag = []; // flag set to the clash week if detected 
            for(let i = parseInt(req.body.start_week); i <= parseInt(req.body.end_week); i++){
                let time_assigned_filtered = time_assigned.filter(ele => ele.week === i && ele.day === req.body.day);
                let time_clash = time_assigned_filtered.filter(ele => (ele.start_time < start_time && ele.end_time > start_time) || (ele.start_time >= start_time && ele.start_time < end_time));
                console.log("time_assigned_filtered\n" + JSON.stringify(time_assigned_filtered));
                console.log("time_clash\n" + JSON.stringify(time_clash));
                if (time_clash.length === 0) {
                    // no clash
                    continue;
                } else {
                    flag.push(i); 
                }
            }

            if(flag.length>0) {
                res.json({msg: "Clash detected for time slot - week " + JSON.stringify(flag) + " day "+ req.body.day + " " + req.body.start_time + " to " + req.body.end_time});
            } else {
                res.json(null);
                update_prof_assignment_time(req, res, next, time_assigned_update_arr);
            }
        }
    }).catch(next);
}

function update_prof_assignment_time(req, res, next, time_assigned_update){
    ProfAssignmentTime.findOneAndUpdate({'initial': req.body.name},
        {
            $push: {
                'schedule_time.$[i].time_assigned': {
                    $each: time_assigned_update
                }
            }
        }, 
        {
            arrayFilters:[{'i.acad_yr': req.body.acad_yr, 'i.sem': req.body.sem}],
            new: true
        }
    ).then(function(new_profassignmenttime) {
        if(new_profassignmenttime == null) {
            ProfAssignmentTime.findOneAndUpdate({'initial': req.body.name},
                {
                    $push: {
                        'schedule_time': {
                            'acad_yr': req.body.acad_yr,
                            'sem': req.body.sem,
                            'time_assigned': time_assigned_update 
                        }
                    }
                },
                {
                    new: true,
                    upsert: true
                }
            ).then(function(new_timeassigned) {
                console.log("Created prof assignment time:\n" + JSON.stringify(new_timeassigned));
            }).catch(next);
        } else {
            console.log("Updated prof assignment time:\n" + JSON.stringify(new_profassignmenttime));
        }
    }).catch(next);
}

module.exports = {  
    clashCheckProf: clashCheckProf
};