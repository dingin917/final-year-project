const assert = require('assert');
const fetch = require('node-fetch');

const Mongo = require('./connection');
const Prof = Mongo.Prof;

// Describe test
describe('GET request testing', function () {

    beforeEach(function (done) {

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

    // Create tests
    it('Find a prof record from database', function (done) {

        fetch('http://localhost:3001/api/teachers/profile?initial=' + "DJ", {
            method: 'GET',
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            redirect: "follow",
            referrer: "no-referrer"
        }).then(function (data) {
            return data.json();
        }).then(json => {
            assert(json.fullname === "Ding Jin");
            done();
        });

    });

});