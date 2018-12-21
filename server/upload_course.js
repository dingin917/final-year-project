// reference -> https://www.techighness.com/post/node-expressjs-endpoint-to-upload-and-process-csv-file/
const csv = require('fast-csv');
const fs = require('fs');

// import from mongo.js 
const Mongo = require('../mongo');
const Course = Mongo.Course;


var readCSV = function CSVToArray(req, res, next){
  const fileRows = [];
  // open uploaded file
  csv.fromPath(req.file.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      //console.log(fileRows);
      fs.unlinkSync(req.file.path);   // remove temp file

      /*
        process "fileRows" and respond
      */

      // res.json(fileRows);

      // var used to upload courses to database
      const acad_yr = fileRows[1][0];
      const sem = fileRows[1][1];
      const category = req.body.category; // TODO: read from input..
      console.log("cate:" + category);

      var last_row = fileRows[1];
      var index = 0;

      for (var i=2; i<fileRows.length; i++) {
        var aRow = fileRows[i];
        if(aRow[0].trim()!=''){
          if(aRow[2] == last_row[2] && aRow[3] == last_row[3] && aRow[4] == last_row[4]){
            // special case: same course code, type & group name 
            if (index == 0){
              // no previous record for the same course code, type & group name combination
              last_row[4] =  last_row[4] + '-' + String.fromCharCode(65);
            }
            updateCourseToDB(last_row);
            index++;
            last_row = aRow;
            last_row[4] = aRow[4] + '-' + String.fromCharCode(65 + index);
          } else {
            // general case: same course code & type but diff group || diff course code & type
            updateCourseToDB(last_row);
            last_row = aRow;
            index = 0;
          }
        }
      }

      // upload the last course to database 
      updateCourseToDB(last_row);

      function updateCourseToDB(aRow){
        var teaching_weeks = [];
        console.log(aRow);
        for (var j=9; j<22; j++){
          if(aRow[j]!='N'){
            teaching_weeks.push(j-8);
          }
        }
        Course.findOneAndUpdate({'acad_yr':acad_yr, 'sem':sem, 'category':category, 'code':aRow[2], 'type':aRow[3]}, 
        {
          $push: {
            'schedule': {
              'group': aRow[4],
              'teaching_weeks':  teaching_weeks,
              'day': aRow[5],
              'start_time': aRow[6],
              'end_time': aRow[7],
              'venue': aRow[8],
              'unscheduled_weeks': teaching_weeks
            }
          }
        }, { new: true, upsert: true })
        .then(function(result){
          console.log(JSON.stringify(result));
        })
        .catch(next);
      }

      var html = '';
      html += '<p> The course csv file has been successfully uploaded </p>';
      html += '<a href="/"> Back to homepage .. </a><br>';
      html += '<p> You can view the online database <a href="https://mlab.com/welcome/"> here </a> </p>';
      res.send(html);

    });
}

module.exports = {  
  readCSV: readCSV
};