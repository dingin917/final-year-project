// Import the mongoose module 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Connect to the db before tests run 
before(function(done){
    // Set up default mongoose connection
    mongoose.connect(
        "mongodb://dingin:GDragon0818@ds119503.mlab.com:19503/test-db",
        { useNewUrlParser: true }
    );

    var db = mongoose.connection;
    db.once('open', function(){
        console.log('Database connection has been made, now make fireworks...');
        done();
    });
    db.on('error', console.error.bind(console, 'db connection error:'));
});

// Drop the collections before each test 

beforeEach(function(done){
    // Drop the collection
    mongoose.connection.collections.users.drop(function(){
        done();
    });
});


// Define Schema 

var courseSchema = new Schema({
    title: String,              // e.g. Web Application Design
    code: String,               // e.g. EE4717
    type: String,               // e.g. LEC, TUT, LAB
    schedule: [{
        index: Number,          // e.g. 33054
        group: String,          // e.g. FC36
        teachingweek: [Number],
        day: String,            // e.g. Mon, Tue
        time: String,           // e.g. 1330-1430
        status: Boolean,            
        assignee: String
    }],
});

var profSchema = new Schema({
    name: String,
    email: String,
    courses: [courseSchema]
});

var tutorSchema = new Schema({
    name: String,
    email: String,
    courses: [courseSchema]
});

// Schema below is only used for mocha testing
var userSchema = new Schema({ 
    name: String,
    email: String,
    height: Number
});

// Export Model
module.exports = {  
                    Course: mongoose.model('courses', courseSchema), 
                    Prof: mongoose.model('profs', profSchema),
                    Tutor: mongoose.model('tutors', tutorSchema),
                    User: mongoose.model('users', userSchema),
                };
