// reference -> https://www.techighness.com/post/node-expressjs-endpoint-to-upload-and-process-csv-file/
const csv = require('fast-csv');
const fs = require('fs');

// import from mongo.js 
const Mongo = require('../mongo');
const Prof = Mongo.Prof;

var readCSV = function CSVToArray(req, res, next){
  const fileRows = [];
  // open uploaded file
  csv.fromPath(req.file.path)
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      console.log(fileRows);
      fs.unlinkSync(req.file.path);   // remove temp file

      /*
        process "fileRows" and respond
      */

      //res.json(fileRows);

      // get the index for columns
      var header = fileRows[0];
      var initial, name, title, area, email;
      initial = name = title = area = email = 0;
      header.forEach(function (value, index){
        switch(value){
          case "Initial": 
            initial = index;
            break;
          case "Staff Name":
            name = index;
            break;
          case "Title":
            title = index;
            break;
          case "Teaching Area":
            area = index;
            break;
          case "Email":
            email = index;
            break;
          default: 
            break;
        }
      });

      // upload to database 
      for (var i=1; i<fileRows.length; i++){
        var aRow = fileRows[i];
        if(aRow[2].trim()!=''){
          Prof.findOneAndUpdate({initial: aRow[initial]}, 
            { 
              $set: 
              {
                initial: aRow[initial], 
                fullname: aRow[name], 
                title: aRow[title], 
                teachingarea: aRow[area], 
                email: aRow[email]
              }
            }, 
            {new: true, upsert: true}).then(function (prof){
              console.log(prof);
          }).catch(next);
        }
      }

      var html = '';
      html += '<p> The teaching profile csv file has been successfully uploaded </p>';
      html += '<a href="/"> Back to homepage .. </a><br>';
      html += '<p> You can view the online database <a href="https://mlab.com/welcome/"> here </p>';
      res.send(html);

    });
}

module.exports = {  
  readCSV: readCSV
};