// reference -> https://stackoverflow.com/questions/563406/add-days-to-javascript-date

// import from mongo.js 
const Mongo = require('../mongo');
const WeekToDate = Mongo.WeekToDate;

/*
    WeekToDate Schema 
    {
        acad_yr: Number,
        sem: Number,
        weektodate: [{week: Number, start_date: Number, end_date: Number}]
    }
*/

var updateDB = function convertToDate(req, res, next){
    var acad_yr = req.body.acad_yr;
    var sem = req.body.sem;
    var start_date = new Date(req.body.start_date);

    var weektodate = { acad_yr: acad_yr, sem: sem, weektodate: []};
    var oneweek = {};
    var j = 1;

    for(var i=1; i<15; i++){
        var temp_date = new Date(start_date);
        var end_date = new Date(start_date);
        end_date.setDate(end_date.getDate()+6);

        if (i==8){
            // recess week 
            start_date.setDate(start_date.getDate()+7);
            continue;
        } else {
            oneweek['week'] = j;
            oneweek['start_date'] = temp_date;
            oneweek['end_date'] = end_date;

            weektodate.weektodate.push(oneweek);
            start_date.setDate(start_date.getDate()+7);
            oneweek = {}; 
            j++;
        }
    }

    //res.json(weektodate);
    console.log(JSON.stringify(weektodate));

    WeekToDate.findOneAndUpdate({acad_yr: acad_yr, sem: sem}, 
        {weektodate: weektodate.weektodate}, {new: true, upsert: true})
        .then(function (result){
            console.log(result);
        })
        .catch(next);
    
    var html = '';
    html += '<p> Academic Calendar has been successfully updated </p>';
    html += '<a href="/"> Back to homepage .. </a><br>';
    html += '<p> You can view the online database <a href="https://mlab.com/welcome/"> here </p>';
    res.send(html);
}

module.exports = {  
    updateDB: updateDB
};