const assert = require('assert');
const fetch = require('node-fetch');

const Mongo = require('./connection');
const Prof = Mongo.Prof;

// Describe test
describe('POST request testing', function () {

    // Create tests
    it('Saves to a prof record to the database', function (done) {

        var prof = new Prof({
            "initial": "DJ",
            "fullname": "Ding Jin",
            "title": "Student",
            "teachingarea": "Info-Communication",
            "email": "jin.ding@outlook.com"
        });

        fetch('http://localhost:3001/api/teachers', {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(prof)
        }).then(function () {
            Prof.findOne({ initial: "DJ" }).then(function (data) {
                assert(data.fullname === "Ding Jin");
                done();
            });
        });

    });

});