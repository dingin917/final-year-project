// reference -> https://www.techighness.com/post/node-expressjs-endpoint-to-upload-and-process-csv-file/
const csv = require('fast-csv');
const fs = require('fs');

// import from mongo.js 
const Mongo = require('../mongo');
const Course = Mongo.Course;
const VenueUtil = Mongo.VenueUtil;


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

      // record the first row to compare with the following one 
      var last_row = fileRows[0];
      var index = 0;

      // check for repeated uploading 
      Course.findOne({'acad_yr':acad_yr, 'sem':sem, 'category':category})
      .then(function(output){
        console.log("output -> " + output);
        if(output != null){
          console.log("repeated uploading");
          let html = '';
          html += '<p> Sorry that the course csv file cannot be uploaded, since there is existing record for this semester and academic year. </p>';
          html += '<p> Due to potential risk of losing existing assignment data, the upload operation cannot be executed. </p>';
          html += '<a href="/"> Back to homepage .. </a><br>';
          html += '<p> You can view the online database <a href="https://mlab.com/welcome/"> here </a> </p>';
          res.send(html);
        }
        else {

          const forLoop = async () => {
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
                  await updateCourseToDB(last_row);
                  index++;
                  last_row = aRow.slice(0);
                  last_row[4] = aRow[4] + '-' + String.fromCharCode(65 + index);
                  console.log('\n index: ' + index + '\n name: ' + last_row[4] + '\n aRow: ' + aRow);
                } else {
                  // general case: same course code & type but diff group || diff course code & type
                  await updateCourseToDB(last_row);
                  index = 0;
                  last_row = aRow.slice(0);
                  console.log('\n index: ' + index + '\n name: ' + last_row[4] + '\n aRow: ' + aRow);
                }
              }
            }
            // upload the last course to database 
            await updateCourseToDB(last_row);
          }

          forLoop();

          let html = '';
          html += '<p> The course csv file has been successfully uploaded </p>';
          html += '<a href="/"> Back to homepage .. </a><br>';
          html += '<p> You can view the online database <a href="https://cloud.mongodb.com/"> here </a> </p>';
          res.send(html);
        }

      }).catch(next);

      const process_course = (arow, venue, group, teaching_weeks) => {
        return Course.findOneAndUpdate({'acad_yr':acad_yr, 'sem':sem, 'category':category, 'code':arow[2], 'type':arow[3]}, 
        {
          $push: {
            'schedule': {
              'group': group,
              'teaching_weeks':  teaching_weeks,
              'day': arow[5],
              'start_time': arow[6],
              'end_time': arow[7],
              'venue': venue,
              'unscheduled_weeks': teaching_weeks
            }
          }
        }, { new: true, upsert: true });
      }

      const func_course = (arow, venue, group, teaching_weeks) => {
        // Then
        process_course(arow, venue, group, teaching_weeks).then(result => {          
          console.log(JSON.stringify(result));
        });
      }

      const process_venue = (arow, venue, group, teaching_weeks) => {
        // update venue utilization db 
        return VenueUtil.findOneAndUpdate({'venue': venue, 'acad_yr': acad_yr, 'sem': sem}, 
          {
            $push: {
              'scheduled_time': {
                'course': arow[2],
                'courseType': arow[3],
                'group': group,
                'day': arow[5],
                'start_time': arow[6],
                'end_time': arow[7],
                'week': teaching_weeks,
              }
            }
          }, { new: true, upsert: true});
      }

      const func_venue = (arow, venue, group, teaching_weeks) => {
        // Then
        process_venue(arow, venue, group, teaching_weeks).then(updated_venue => {
          console.log(updated_venue);
        });
      }

      const updateCourseToDB = async (arow) => {
        // re-format venue, merge XX-XX-XX. with XX-XX-XX 
        let venue = arow[8];
        if(venue.slice(-1) === '.'){
          venue = venue.slice(0, venue.length-1);
        }

        // check for LAB-A/B/C
        let group = arow[4];
        if(arow[3] === "LAB" && arow.length > 22){
          if(arow[22].trim()!='')
            group = arow[22];
        }

        let teaching_weeks = [];
        console.log(arow);
        for (let j=9; j<22; j++){
          if(arow[j]!='N'){
            teaching_weeks.push(j-8);
          }
        }
        const result_course = await process_course(arow, venue, group, teaching_weeks);
        console.log(result_course);
        const result_venue = await process_venue(arow, venue, group, teaching_weeks);
        console.log(result_venue);
      }
    });
}

module.exports = {  
  readCSV: readCSV
};