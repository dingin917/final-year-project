const assert = require('assert');

const Mongo = require('./connection');
const User = Mongo.Prof;

// Describe test
describe('Deleting records', function(){

    var user;
    
    beforeEach(function(done){
            user = new User({
            initial: "Iron Man",
            fullname: "Tony Stark",
            email: "tong.stark@marvel.universe"
        });

        user.save().then(function(){
            done();
        });
    });

    // Create tests
    it('Deletes one record from the database', function(done){

        User.findOneAndDelete({initial: "Iron Man"}).then(function(){
            User.findOne({initial: "Iron Man"}).then(function(result){
                assert(result === null);
                done();
            });
        });

    });
    
});