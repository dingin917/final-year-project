import React, { Component } from 'react';

class UploadFiles extends Component {

    render() {
        return (
           <div className="data">
                <div>
                    <h1> Upload Faculty Profiles </h1>
                    <form action="/api/teachers/upload" method="POST" encType="multipart/form-data">
                        <input type="file" name="file" accept="*.csv" /><br/><br/>
                        <input type="submit" value="Upload Faculty Profiles" />
                    </form>
                </div>
                <div>
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
                <div>
                    <h1> Update Academic Calendar </h1>
                    <form action="/api/dates" method="post">
                        <label>Academic Year: </label>
                        <input type="text" name="acad_yr" placeholder="e.g. 2018" required/>
                        <label>Semester: </label>
                        <input type="text" name="sem" placeholder="e.g. 1" required/>
                        <label>Start Date: </label>
                        <input type="date" name="start_date" required/><br/><br/>
                        <input type="submit" value="Update Academic Calendar" />
                    </form>
                </div>
            </div>
        )
    }
}

export default UploadFiles;