const assert = require('assert');

const Mongo = require('./connection');
const User = Mongo.User;

// Describe test
describe('Deleting records', function(){

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
    it('Deletes one record from the database', function(done){

        User.findOneAndDelete({name: "Ding Jin"}).then(function(){
            User.findOne({name: "Ding Jin"}).then(function(result){
                assert(result === null);
                done();
            });
        });

    });
    
});