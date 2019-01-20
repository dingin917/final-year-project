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
    acad_yr: Number,            // e.g. 2018
    sem: Number,                // e.g. 1 
    category: String,           // e.g. fulltime or parttime 
    code: String,               // e.g. EE4717
    type: String,               // e.g. LEC, TUT, LAB
    schedule: [{
        group: String,          // e.g. FC36 for TUT & LAB, LE for LEC
        teaching_weeks: [Number],
        day: String,            // e.g. M, T, W, TH, F
        start_time: String,     // e.g. 13:30
        end_time: String,       // e.g. 14:30
        venue: String,          // e.g. LT25
        scheduled_weeks: [{
            week: [Number],
            assignee: String,
        }],
        unscheduled_weeks: [Number]
    }],
});

var courseScheduleSchema = new Schema({
    code: String,
    type: String,
    category: String, 
    group: String,
    teaching_weeks: [Number],
    day: String,
    start_time: String,
    end_time: String,
    venue: String,
});

var profSchema = new Schema({
    initial: String,
    fullname: String,
    title: String,
    teachingarea: String,
    email: String,
    schedule: [{
        acad_yr: Number,
        sem: Number,
        courses: [courseScheduleSchema]
    }]
});

var dateSchema = new Schema({
    acad_yr: Number,
    sem: Number,
    weektodate: [{week: Number, start_date: Date, end_date: Date}]
});

var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        trim: true
    },

    password: {
        type: String,
    },

    passwordConf: {
        type: String,
    }
});

// Export Model
module.exports = {  
                    Course: mongoose.model('courses', courseSchema), 
                    Prof: mongoose.model('profs', profSchema),
                    WeekToDate: mongoose.model('weektodate', dateSchema),
                    User: mongoose.model('user', userSchema),
                };