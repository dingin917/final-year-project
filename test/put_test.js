const assert = require('assert');
const fetch = require('node-fetch');

const Mongo = require('./connection');
const Prof = Mongo.Prof;
const Course = Mongo.Course;

// Describe our tests
describe('PUT request testing', function () {

    beforeEach(function (done) {
        var course_ft = new Course({
            "acad_yr": 2018,
            "sem": 1,
            "category": "fulltime",
            "code": "EExxxx",
            "type": "LEC",
            "schedule": [
                {
                    "group": "LE",                      
                    "teaching_weeks": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                    "day": "F",
                    "start_time": "1030",
                    "end_time": "1130",
                    "venue": "LT29",
                    "unscheduled_weeks": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
                }]
        });

        var tutorial_ft = new Course({
            "acad_yr": 2018,
            "sem": 1,
            "category": "fulltime",
            "code": "EExxxx",
            "type": "TUT",
            "schedule": [
                {
                    "group": "TA01",                      
                    "teaching_weeks": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                    "day": "F",
                    "start_time": "1030",
                    "end_time": "1130",
                    "venue": "TR+88",
                    "unscheduled_weeks": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
                },
                {
                    "group": "TA02",                      
                    "teaching_weeks": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                    "day": "F",
                    "start_time": "1030",
                    "end_time": "1130",
                    "venue": "TR+89",
                    "unscheduled_weeks": [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
                }]
        });

        var course_pt = new Course({
            "acad_yr": 2018,
            "sem": 1,
            "category": "parttime",
            "code": "EExxxx",
            "type": "LEC",
            "schedule": [
                {
                    "group": "LE",                      
                    "teaching_weeks": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                    "day": "M",
                    "start_time": "1830",
                    "end_time": "1930",
                    "venue": "LT28",
                    "unscheduled_weeks": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
                }]
        });

        course_ft.save().then(function () {
            course_pt.save().then(function() {
                tutorial_ft.save().then(function(){
                    var prof = new Prof({
                        "initial": "DJ",
                        "fullname": "Ding Jin",
                        "title": "Student",
                        "teachingarea": "Info-Communication",
                        "email": "jin.ding@outlook.com"
                    });
        
                    prof.save().then(function () {
                        done();
                    });
                });
            });
        });
    });

    // Create tests
    it('Update a course and prof record from database', function (done) {
        var requestBody = {
            acad_yr: 2018,
            sem: 1,
            category: 'fulltime',
            code: "EExxxx",
            type: "LEC",
            week:[1,2,3,4,5,6,7],
            name: "DJ",
            group: "LE",
            weeks: [8,9,10,11,12,13]
        };

        fetch('http://localhost:3001/api/courses/assign', {
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
        }).then(function (data) {
            return data.json();
        }).then(json => {
            console.log("Update Course: "+JSON.stringify(json));
            assert(json.schedule[0].scheduled_weeks[0].assignee === 'DJ');
            done();
        });
    });

});