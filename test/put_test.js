const assert = require('assert');
const fetch = require('node-fetch');

const Mongo = require('./connection');
const Prof = Mongo.Prof;
const Course = Mongo.Course;

// Describe our tests
describe('PUT request testing', function(){

    beforeEach(function(done){
        var course = new Course({
            "acad_yr": 2018,
            "sem": 1,
            "code": "EE4483",
            "type":"LEC", 
            "schedule": [
	        {         
        		"group": "LE",
                "slots": [
                    {
                        "teaching_weeks": [1,2,3,4,5,6,7,8,9,10,11,12,13],
                        "day": "T",            
        		        "start_time": "1030",
                        "end_time": "1130",
				        "venue": "LT28"
                    },
                    {
                        "teaching_weeks": [1,2,3,4,5,6,7,8,9,10,11,12,13],
                        "day": "F",            
        		        "start_time": "1030",
                        "end_time": "1130",
				        "venue": "LT29"
                    }
                ]
   	        }]
        });

        course.save().then(function(){
            var prof = new Prof({
                "initial": "Iron Man",
                "fullname": "Tony Stark",
                "title": "Boss",
                "teachingarea": "Electronic Engineering",
                "email": "tony.stark@marvel.universe"
            });
    
            prof.save().then(function(){
                done(); 
            });
        });
    });

    // Create tests
    it('Update a course and prof record from database', function(done){
        var requestBody = {
            code: "EE4483",
            type: "LEC",
            week: [1,2,3,4,5,6,7],
            name: "Iron Man",
            group: "LE",
            day: "F",
            start_time: "1030",
            end_time: "1130",
            venue: "LT29"
        };

        fetch('http://localhost:3000/api/courses/assign', {
            method: 'PUT',
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(requestBody)
        }).then(function () {
            Prof.findOne({initial: "Iron Man"}).then(function(data){
                assert(data.courses[0].code === "EE4483");
                done();
            });
        });

    });

});