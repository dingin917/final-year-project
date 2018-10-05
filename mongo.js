// Import the mongoose module 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Set up default mongoose connection
mongoose.connect(
    //"mongodb://dingin:GDragon0818@ds111913.mlab.com:11913/fypdb",
    "mongodb://dingin:GDragon0818@ds119503.mlab.com:19503/test-db",
    { useNewUrlParser: true }
);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));
db.once('open', () => console.log('db connected')); 

// Define Schema 
var courseSchema = new Schema({
    title: String,              // e.g. Web Application Design
    code: String,               // e.g. EE4717
    type: String,               // e.g. LEC, TUT, LAB
    schedule: [{
        index: Number,          // e.g. 33054
        group: String,          // e.g. FC36 for TUT & LAB, part 1/2 for LEC
        teachingweek: [Number],
        slots:[{
            module: String,         // e.g. Lab: A,B,C
            day: String,            // e.g. Mon, Tue
            time: String,           // e.g. 1330-1430
            venue: String,          // e.g. LT25
            scheduledweek: [{
                week: [Number],
                assignee: String,
            }],
        }],
        unscheduledweeks:[Number],
    }],
});


var courseScheduleSchema = new Schema({
    title: String,
    code: String,
    type: String,
    index: Number,
    group: String,
    module: String,
    teachingweek: [Number],
    day: String,
    time: String,
    venue: String,
});

var profSchema = new Schema({
    name: String,
    fullname: String,
    email: String,
    courses: [courseScheduleSchema]
});

var tutorSchema = new Schema({
    name: String,
    email: String,
    courses: [courseScheduleSchema]
});

// Export Model
module.exports = {  
                    Course: mongoose.model('courses', courseSchema), 
                    Prof: mongoose.model('profs', profSchema),
                    Tutor: mongoose.model('tutors', tutorSchema),
                };