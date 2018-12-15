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
                console.log("Error Message: Cannot find the record in database");
            } else {
                res.json(result);
                console.log("Response: " +  JSON.stringify(result));
                // Prof.findOneAndUpdate({initial: req.body.name}, 
                //     {
                //         $push: {
                //             'courses.$[i]':
                //             {
                //                 'teaching_weeks': req.body.week
                //             }
                //         }
                //     }, 
                //     {
                //         arrayFilters:[{'i.code': req.body.code, 'i.type': req.body.type,
                //                         'i.group': req.body.group, 'i.day': req.body.day,
                //                         'i.start_time': req.body.start_time, 
                //                         'i.end_time': req.body.end_time,'i.venue': req.body.venue}],
                //         new: true, 
                //         upsert: true
                //     }).then(function(prof){
                //     console.log("updated prof: " + JSON.stringify(prof));
                // }).catch(console.log("Error occurred when updating staff profile.."));
            }
        }).catch(console.log("Error occurred when updating course profile.."));
    }).catch(next);
}

module.exports = {  
    updateAssignee: updateAssignee
  };