import React, { Component } from 'react';
import './style.css';

class UploadFiles extends Component {

    render() {
        return (
            <div className="board">
                <div id="info">
                    <h1 className="display-4">File Uploading</h1>
                    <p>You can upload teaching staff profile in csv file via <i>Upload</i> portal. <br />
                    You may also upload the course informatin file in csv format. <br/> 
                    To update the academic calendar, you need to select the first day of that semester.</p>
                </div>
                <div className="data">
                <div className="col-4" id="form1">
                    <h1> Upload Faculty Profiles </h1>
                    <form action="/api/teachers/upload" method="POST" encType="multipart/form-data">
                        <input type="file" name="file" accept="*.csv" /><br/><br/>
                        <input type="submit" value="Upload Faculty Profiles" />
                    </form>
                </div>
                <div className="col-4" id="form2">
                    <h1> Upload Courses </h1>
                    <form action="/api/courses/upload" method="POST" encType="multipart/form-data">
                        <label>Select File: </label>
                        <input type="file" name="file" accept="*.csv" /><br/><br/>
                        <label>Category: </label>
                        <select name="category">
                            <option value="fulltime">Full Time</option>
                            <option value="parttime">Part Time</option>
                        </select><br/><br/>
                        <input type="submit" value="Upload Courses" />
                    </form>
                </div>
                <div className="col-4" id="form3">
                    <h1> Update Academic Calendar </h1>
                    <form action="/api/dates" method="post">
                        <label>Academic Year: </label>
                        <input type="text" name="acad_yr" placeholder="e.g. 2018" required/><br/><br/>
                        <label>Semester: </label>
                        <input type="text" name="sem" placeholder="e.g. 1" required/><br/><br/>
                        <label>Start Date: </label>
                        <input type="date" name="start_date" required/><br/><br/>
                        <input type="submit" value="Update Academic Calendar" />
                    </form>
                </div>
                </div>
            </div>
        )
    }
}

export default UploadFiles;