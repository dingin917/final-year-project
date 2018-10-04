const assert = require('assert');
const mongoose = require('mongoose');
const mongo = require('./connection');
const Prof = mongo.Prof;

// Describe our tests
describe('Nesting records', function(){

    this.beforeEach(function(done){
        mongoose.connection.collections.profs.drop(function(){
            done();
        });
    });

    // Create tests
    it('Creates a prof with sub-documents', function(done){

        var sp = new Prof({
            name: "Shum Ping",
            email: "sp@ntu.edu.sg",
            courses: [{title: "Web Application Design", code: "EE4717"}]
        });

        sp.save().then(function(){
            Prof.findOne({name: "Shum Ping"}).then(function(record){
                assert(record.courses.length === 1);
                done();
            });
        });
    });


    it('Adds a course to a prof',function(done){

        var sp = new Prof({
            name: "Shum Ping",
            email: "sp@ntu.edu.sg",
            courses: [{title: "Web Application Design", code: "EE4717"}]
        });

        sp.save().then(function(){
            Prof.findOne({name: "Shum Ping"}).then(function(record){
                // add a course to the courses array
                record.courses.push({name: "Project Design", code: "EE2073"});
                record.save().then(function(){
                    Prof.findOne({name: "Shum Ping"}).then(function(result){
                        assert(result.courses.length === 2);
                        done();
                    });
                });
                
            });
        });

    });

});