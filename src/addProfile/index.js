import React, { Component } from 'react';
import './style.css';

class AddProfile extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            course: { schedule: [] }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        event.preventDefault();
        var code = this.refs.code.value;
        var type = this.refs.type.value;

        fetch('/api/courses?code=' + code + '&type=' + type).then(function (data) {
            return data.json();
        }).then(json => {
            this.setState({
                course: json
            });
        });
    }

    render() {
        var course = this.state.course;
        var schedule = course.schedule;

        return (
            <div id="course-container">
                <h1> AddProfile</h1>
                <form id="search" className="form-group" onSubmit={this.handleSubmit}>
                    <label>Enter a course code </label>
                    <input className="form-control" type="text" ref="code" placeholder="e.g.EE4483" required />
                    <label>Enter a class type </label>
                    <input className="form-control" type="text" ref="type" placeholder="e.g.LEC" required />
                    <input className="form-control" type="submit" value="Find Timeslots" />
                </form>
                <div>
                    {course.title}
                </div>
                <ul>
                    {
                        schedule.map(schedule =>
                            <li key={schedule._id}>
                                <span className="group">Group: {schedule.group} </span>
                                <span className="day">Time: {schedule.day} </span>
                                <span className="time">{schedule.time} </span>
                                <span className="venue">Venue: {schedule.venue} </span>
                                <span className="assignee">Assignee: {schedule.assignee == null ? "To be assigned" : schedule.assignee} </span>
                            </li>)
                    }
                </ul>
            </div>
        );
    }
}

export default AddProfile;
