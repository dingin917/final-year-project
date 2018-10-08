const assert = require('assert');
const fetch = require('node-fetch');

const Mongo = require('./connection');
const Prof = Mongo.Prof;

// Describe test
describe('POST request testing', function () {

    // Create tests
    it('Saves to a prof record to the database', function (done) {

        var prof = new Prof({
            "initial": "Iron Man",
            "fullname": "Tony Stark",
            "title": "Boss",
            "teachingarea": "Electronic Engineering",
            "email": "tony.stark@marvel.universe"
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
            Prof.findOne({ initial: "Iron Man" }).then(function (data) {
                assert(data.fullname === "Tony Stark");
                done();
            });
        });

    });

});