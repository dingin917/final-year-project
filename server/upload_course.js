// reference -> https://www.techighness.com/post/node-expressjs-endpoint-to-upload-and-process-csv-file/
const csv = require('fast-csv');
const fs = require('fs');

// import from mongo.js 
const Mongo = require('../mongo');
const Course = Mongo.Course;


let readCSV = function CSVToArray(req, res, next){
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

      // variables used to upload courses to database
      const acad_yr = fileRows[1][0];
      const sem = fileRows[1][1];
      const category = req.body.category;
      console.log("cate:" + category);

      // eliminate the header row, sort csv file before uploading to db 
      fileRows.splice(0,1);
      fileRows.sort();
      console.log(JSON.stringify(fileRows));
      var last_row = fileRows[0];
      var index = 0;
      for (let i=1; i<fileRows.length; i++) {
        let aRow = fileRows[i];
        if(aRow[0].trim()!=''){
          // get the original group name of the last row to compare with the current one 
          let last_grpname = last_row[4];
          if(last_grpname.indexOf('-')>0){
            last_grpname = last_grpname.slice(0, last_row[4].indexOf('-'));
          }
          if(aRow[2] === last_row[2] && aRow[3] === last_row[3] && aRow[4] === last_grpname){
            // special case: same course code, type & group name 
            if (index === 0){
              // no previous record for the same course code, type & group name combination
              last_row[4] =  last_row[4] + '-' + String.fromCharCode(65);
            }
            updateCourseToDB(last_row);
            index++;
            last_row = aRow.slice(0);
            last_row[4] = aRow[4] + '-' + String.fromCharCode(65 + index);
            console.log('\n index: ' + index + '\n name: ' + last_row[4] + '\n aRow: ' + aRow);
          } else {
            // general case: same course code & type but diff group || diff course code & type
            updateCourseToDB(last_row);
            index = 0;
            last_row = aRow.slice(0);
            console.log('\n index: ' + index + '\n name: ' + last_row[4] + '\n aRow: ' + aRow);
          }
        }
      }

      // upload the last course to database 
      updateCourseToDB(last_row);

      function updateCourseToDB(arow){
        let teaching_weeks = [];
        console.log(arow);
        for (let j=9; j<22; j++){
          if(arow[j]!='N'){
            teaching_weeks.push(j-8);
          }
        }
        Course.findOneAndUpdate({'acad_yr':acad_yr, 'sem':sem, 'category':category, 'code':arow[2], 'type':arow[3]}, 
        {
          $push: {
            'schedule': {
              'group': arow[4],
              'teaching_weeks':  teaching_weeks,
              'day': arow[5],
              'start_time': arow[6],
              'end_time': arow[7],
              'venue': arow[8],
              'unscheduled_weeks': teaching_weeks
            }
          }
        }, { new: true, upsert: true })
        .then(function(result){
          console.log(JSON.stringify(result));
        })
        .catch(next);
      }

      let html = '';
      html += '<p> The course csv file has been successfully uploaded </p>';
      html += '<a href="/"> Back to homepage .. </a><br>';
      html += '<p> You can view the online database <a href="https://mlab.com/welcome/"> here </a> </p>';
      res.send(html);

    });
}

module.exports = {  
  readCSV: readCSV
};