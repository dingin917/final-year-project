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
        requestBody.day = this.refs.day.value;
        requestBody.start_time = this.refs.start_time.value;
        requestBody.end_time = this.refs.end_time.value;
        requestBody.venue = this.refs.venue.value;
        requestBody.name = this.refs.name.value;
        requestBody.week = this.refs.week.value.split(',').map(Number);
        

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
                <h1> Update Assignments </h1>
                <form className="form-group" id="assign" onSubmit={this.handleSubmit}>
                    <label>Enter a course code </label>
                    <input className="form-control" type="text" ref="code" placeholder="e.g.EE4483" required />
                    <label>Enter a class type </label>
                    <input className="form-control" type="text" ref="type" placeholder="e.g.TUT" required />
                    <label>Enter a course group </label>
                    <input className="form-control" type="text" ref="group" placeholder="e.g.FC1" required />
                    <label>Enter a course weekday </label>
                    <input className="form-control" type="text" ref="day" placeholder="e.g.F" required />
                    <label>Enter a course start time </label>
                    <input className="form-control" type="text" ref="start_time" placeholder="e.g.1030" required />
                    <label>Enter a course end time </label>
                    <input className="form-control" type="text" ref="end_time" placeholder="e.g.1130" required />
                    <label>Enter a course venue </label>
                    <input className="form-control" type="text" ref="venue" placeholder="e.g.LT29" required />
                    <label>Assign the teaching weeks </label>
                    <input className="form-control" type="text" ref="week" placeholder="e.g.1,2,3" required />
                    <label>Assign a teaching staff name </label>
                    <input className="form-control" type="text" ref="name" placeholder="e.g.CLH" required />
                    <input className="form-control" type="submit" value="Assign a teaching staff" />
                </form>
                <div>
                    {course.code}
                </div>
                <ul>{
                        schedule.map(schedule =>
                            <li key={schedule._id}>
                                <span className="group">Group: {schedule.group} </span>
                            <ul>
                                {
                                    schedule.slots.map(slot => 
                                        <li key={slot._id}>
                                            <span className="teaching_weeks">Week: {slot.teaching_weeks.map(function(week){
                                                return <span>{week} </span>})} </span>
                                            <span className="time"><b>Time: {slot.day+" "+slot.start_time+"-"+slot.end_time} </b></span>
                                            <span className="venue"><b>Venue: {slot.venue} </b></span>
                                            <span>{slot.scheduled_weeks != null ? slot.scheduled_weeks.map(scheduling => 
                                                <li key={scheduling._id}>
                                                    <span>Scheduled Week: {scheduling.week.map(function(week){return <span>{week} </span>})}</span>
                                                    <span>Assignee: {scheduling.assignee}</span>
                                                </li>) : "Currently not assigned to anyone"}
                                            </span>
                                        </li>
                                    )
                                }
                             </ul>
                        </li>)
                }</ul>
            </div>
        );
    }


}

export default UpdateAssignments;
