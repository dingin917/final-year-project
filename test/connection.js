// Import the mongoose module 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Connect to the db before tests run 
before(function(done){
    // Set up default mongoose connection
    // mongoose.connect(
    //     "mongodb://dingin:GDragon0818@ds119503.mlab.com:19503/test-db",
    //     { useNewUrlParser: true }
    // );
    mongoose.connect(
        "mongodb+srv://admin:ntu-eee-2019@fypcluster-4qx6v.mongodb.net/test?retryWrites=true",
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
    mongoose.connection.collections.profs.drop(function(){
        mongoose.connection.collections.courses.drop(function(){
            mongoose.connection.collections.profassignmenttimes.drop(function(){
                mongoose.connection.collections.venueutils.drop(function(){
                    done();
                });
            });
        });
    });
});

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

// implemented for clash check before assignment 
var profAssignmentTimeSchema = new Schema({
    initial: String,
    schedule_time: [{
        acad_yr: Number,
        sem: Number,
        time_assigned: [{
            week: Number,
            day: String,
            start_time: String, // e.g. 13:30
            end_time: String    // e.g. 15:30
        }]
    }]
});

// implemented for Room Utilisation Calendar
// https://stackoverflow.com/questions/33846939/mongoose-schema-error-cast-to-string-failed-for-value-when-pushing-object-to
// https://mongoosejs.com/docs/guide.html#typeKey
var venueUtilSchema = new Schema({
    venue: String,
    acad_yr: Number,
    sem: Number,
    scheduled_time: [{
        // x-axis
        course: String,
        courseType: String,     // cannot use type: String here 
        group: String,
        day: String,
        start_time: String,
        end_time: String,
        // y-axis
        week: [Number]
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

    username: {
        type: String,
    }
});

// Export Model
module.exports = {  
                    Course: mongoose.model('courses', courseSchema), 
                    Prof: mongoose.model('profs', profSchema),
                    WeekToDate: mongoose.model('weektodate', dateSchema),
                    User: mongoose.model('user', userSchema),
                    ProfAssignmentTime: mongoose.model('profassignmenttime', profAssignmentTimeSchema),
                    VenueUtil: mongoose.model('venueutil', venueUtilSchema)
                };