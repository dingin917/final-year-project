const assert = require('assert');

const Mongo = require('./connection');
const User = Mongo.User;

// Describe test
describe('Saving records', function(){

    // Create tests
    it('Saves to a record to the database', function(done){

        var user = new User({
            name: "Ding Jin",
            email: "jding003@e.ntu.edu.sg"
        });

        user.save().then(function(){
            assert(user.isNew === false);
            done();
        });

    });

    // Next test 

});