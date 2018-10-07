const assert = require('assert');
const fetch = require('node-fetch');

const Mongo = require('./connection');
const Prof = Mongo.Prof;

// Describe test
describe('GET request testing', function(){
    
    beforeEach(function(done){
        
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

    // Create tests
    it('Find a prof record from database', function(done){

        fetch('http://localhost:3000/api/teachers?initial=' + "Iron Man", {
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
            assert(json.fullname === "Tony Stark");
            done();
        });

    });

});