function assign(req, res, next){
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
 
            Prof.findOneAndUpdate({initial: req.body.name}, {
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
}