import React, { Component } from 'react';
import './style.css';

class UpdateAssignments extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            course: { schedule: [] }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        var requestBody = {};
        requestBody.code = this.refs.code.value;
        requestBody.type = this.refs.type.value;
        requestBody.group = this.refs.group.value;
        requestBody.name = this.refs.name.value;

        fetch('/api/courses/assign', {
            method: 'PUT',
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(requestBody)
        }).then(function (data) {
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
            <div id="tut-assignment-container">
                <h1> UpdateAssignments </h1>
                <form className="form-group" id="assign" onSubmit={this.handleSubmit}>
                    <label>Enter a course code </label>
                    <input className="form-control" type="text" ref="code" placeholder="e.g.EE4483" required />
                    <label>Enter a class type </label>
                    <input className="form-control" type="text" ref="type" placeholder="e.g.TUT" required />
                    <label>Enter a course group </label>
                    <input className="form-control" type="text" ref="group" placeholder="e.g.FC1" required />
                    <label>Enter a teaching staff name </label>
                    <input className="form-control" type="text" ref="name" placeholder="e.g.CLH" required />
                    <input className="form-control" type="submit" value="Assign a teaching staff" />
                </form>
                <div>
                    {course.title}
                </div>
                <ul>{
                    schedule.map(schedule =>
                        <li key={schedule._id}>
                            <span className="group">Group: {schedule.group} </span>
                            <span className="day">Time: {schedule.day} </span>
                            <span className="time">{schedule.time} </span>
                            <span className="venue">Venue: {schedule.venue} </span>
                            <span className="assignee">Assignee: {schedule.assignee == null ? "To be assigned" : schedule.assignee} </span>
                        </li>)
                }</ul>
            </div>
        );
    }


}

export default UpdateAssignments;
