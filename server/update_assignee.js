// import from mongo.js 
const Mongo = require('../mongo');
const Course = Mongo.Course;
const Prof = Mongo.Prof;

var updateAssignee = function(req, res, next){
    Course.findOneAndUpdate({'code': req.body.code, 'type': req.body.type},
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
        arrayFilters:[{'i.group': req.body.group}, {'j.day': req.body.day, 
                            'j.start_time': req.body.start_time,'j.end_time': req.body.end_time,
                            'j.venue': req.body.venue}],
        new: true
        
    }
    ).then(function(err, result){
        if (err) {
            res.json(null);
            console.log('PUT Request for teaching assignment');
            console.log("Request Body: " + JSON.stringify(req.body));
            console.log("Response: Cannot find the record in database");
        } else {
            res.json(result);
            console.log('PUT Request for teaching assignment');
            console.log("Request Body: " + JSON.stringify(req.body));
            console.log("Response: " +  JSON.stringify(result));

            var course = {};
            course.code = req.body.code;
            course.type = req.body.type;
            course.group = req.body.group;
            course.teaching_weeks = req.body.week;
            course.day = req.body.day;
            course.start_time = req.body.start_time;
            course.end_time = req.body.end_time;
            course.venue = req.body.venue;

            Prof.findOneAndUpdate({initial: req.body.name}, {
                $push: {courses: course}
            }).then(function(prof){
                console.log("updated prof: " + JSON.stringify(prof));
            });
        }
    }).catch(next);
}

    
module.exports = {  
    updateAssignee: updateAssignee
  };