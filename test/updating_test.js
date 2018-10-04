const assert = require('assert');

const Mongo = require('./connection');
const User = Mongo.User;

// Describe test
describe('Updating records', function(){

    var user;
    
    beforeEach(function(done){
            user = new User({
            name: "Ding Jin",
            email: "jding003@e.ntu.edu.sg",
            height: 165
        });

        user.save().then(function(){
            done();
        });
    });

    // Create tests
    it('Updates one record in the database', function(done){

        User.findOneAndUpdate({name: "Ding Jin"}, {name: "Jennie"}).then(function(){
            User.findOne({_id: user._id}).then(function(result){
                assert(result.name === "Jennie");
                done();
            });
        });
    });

    it('Increments the height by 1', function(done){

        User.updateMany({}, { $inc: {height: 1} }).then(function(){
            User.findOne({name:'Ding Jin'}).then(function(record){
                assert(record.height === 166);
                done();
            });
        });
    });
    
});