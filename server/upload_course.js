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
      var last_code = fileRows[1][2];
      var last_type = fileRows[1][3];
      var last_grp = fileRows[1][4];
      var course = {'schedule':[]};
      var schedule_arr = [];
      var schedule = {'slots':[]};
      var slot_arr = [];
      var slot = {'teaching_weeks':[]};

      for(var i=1; i<fileRows.length; i++){
        var aRow = fileRows[i];
        if(aRow[0].trim()!=''){
          if(aRow[2] == last_code && aRow[3] == last_type){
            // same course code & type
            if(aRow[4] == last_grp){
              // same group under same course & type
              addToSlot(aRow);
            } else {
              // diff group but same course & type
              schedule['group'] = last_grp; 
              schedule['slots'] = slot_arr;
              schedule_arr.push(schedule);

              schedule = {'slots':[]};
              slot_arr = [];
              addToSlot(aRow);
            }
          } else {
            // diff course code & type
            addCourseToDB();
            course = {'schedule':[]};
            schedule_arr = [];
            schedule = {'slots':[]};
            slot_arr = [];
          
            addToSlot(aRow);
          }

          // update course code, type and group
          last_code = aRow[2];
          last_type = aRow[3];
          last_grp = aRow[4];

        }
      }

      // upload the last course to database 
      addCourseToDB();

      function addToSlot(aRow){
        slot = {'teaching_weeks':[]};
        for (var j=9; j<22; j++){
          if(aRow[j]!='N'){
            slot['teaching_weeks'].push(j-8);
          }
        }
      
        slot['day'] = aRow[5];
        slot['start_time'] = aRow[6];
        slot['end_time'] = aRow[7];
        slot['venue'] = aRow[8];
      
        slot_arr.push(slot);
        console.log(JSON.stringify(slot));
      }

      function addCourseToDB(){
        course['acad_yr'] = acad_yr;
        course['sem'] = sem;
        course['code'] = last_code;
        course['type'] = last_type;

        schedule['group'] = last_grp; 
        schedule['slots'] = slot_arr;
        schedule_arr.push(schedule);

        course['schedule'] = schedule_arr;
        console.log("\n\n\n", JSON.stringify(course));
        
        Course.create(course).then(function(result){
          console.log('POST Request for uploading a new course');
          console.log("Response: " + result);
        }).catch(next);

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