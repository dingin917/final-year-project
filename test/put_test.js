const assert = require('assert');
const fetch = require('node-fetch');

const Mongo = require('./connection');
const Prof = Mongo.Prof;
const Course = Mongo.Course;

// Describe our tests
describe('PUT request testing', function () {

    beforeEach(function (done) {
        var course = new Course({
            "acad_yr": 2018,
            "sem": 1,
            "category": "fulltime",
            "code": "EE4483",
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

        course.save().then(function () {
            var prof = new Prof({
                "initial": "Iron Man",
                "fullname": "Tony Stark",
                "title": "Boss",
                "teachingarea": "Electronic Engineering",
                "email": "tony.stark@marvel.universe"
            });

            prof.save().then(function () {
                done();
            });
        });
    });

    // Create tests
    it('Update a course and prof record from database', function (done) {
        var requestBody = {
            acad_yr: 2018,
            sem: 1,
            category: 'fulltime',
            code: "EE4483",
            type: "LEC",
            week:[1,2,3,4,5,6,7],
            name: "Iron Man",
            group: "LE",
            day: "F",
            start_time: "10:30",
            end_time: "11:30",
            venue: "LT29",
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
            assert(json.schedule[0].scheduled_weeks[0].assignee === 'Iron Man');
            done();
        });
    });

});