const assert = require('assert');

const Mongo = require('./connection');
const User = Mongo.Prof;

// Describe test
describe('Finding records', function(){

    var user;
    
    beforeEach(function(done){
            user = new User({
            name: "Ding Jin",
            email: "jding003@e.ntu.edu.sg"
        });

        user.save().then(function(){
            done();
        });
    });

    // Create tests
    it('Finds one record from the database', function(done){

        User.findOne({name: "Ding Jin"}).then(function(result){
            assert(result.name === "Ding Jin");
            done();
        });

    });
    
    it('Finds one record by ID from the database', function(done){

        User.findOne({_id: user._id}).then(function(result){
            assert(result._id.toString() === user._id.toString());
            done();
        });

    });

});