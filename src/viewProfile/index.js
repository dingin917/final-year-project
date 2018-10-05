import React, { Component } from 'react';
import './style.css';

class ViewProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            prof: { courses: [] }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        var name = this.refs.name.value;

        fetch('/api/teachers?name=' + name).then(function (data) {
            return data.json();
        }).then(json => {
            this.setState({
                prof: json
            });
        });
    }

    render() {
        var prof = this.state.prof;
        return (
            <div id="course-container">
                <h1> View Profile </h1>
                <form id="search" className="form-group" onSubmit={this.handleSubmit}>
                    <label>Enter a teaching staff name </label>
                    <input className="form-control" type="text" ref="name" placeholder="e.g.SP" required />
                    <input className="form-control" type="submit" value="Find Schedule" />
                </form>
                <div>
                    {prof.fullname}
                </div>
                <ul>
                    {
                        prof.courses.map(course =>
                            <li key={course._id}>
                                <span className="code">Code: {course.code} </span>
                                <span className="type">Type: {course.type} </span>
                                <span className="index">{course.index != null ? "Index: " + course.index : ""} </span>
                                <span className="group">Group: {course.group} </span>
                                <span className="teachingweek">Week: {course.teachingweek.map(function (week) {
                                    return <span>{week} </span>
                                })} </span>
                                <span className="day">Time: {course.day} </span>
                                <span className="time">{course.time} </span>
                                <span className="venue">Venue: {course.venue} </span>
                            </li>)
                    }
                </ul>
            </div>
        );
    }
}

export default ViewProfile;
