import React, { Component } from 'react';
import './style.css';

class FindTimeSlots extends Component {
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
                <h1> Find Timeslots</h1>
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
                    <span className="teachingweek">Week: {schedule.teachingweek.map(function(week){
                      return <span>{week} </span>})} </span>
                    <ul>
                        {
                            schedule.slots.map(slot => 
                                <li key={slot._id}>
                                    <span className="time"><b>Time: {slot.day} {slot.time} </b></span>
                                    <span className="venue"><b>Venue: {slot.venue} </b></span>
                                    <span>{slot.scheduledweek != null ? slot.scheduledweek.map(scheduling => 
                                        <li key={scheduling._id}>
                                            <span>Scheduled Week: {scheduling.week.map(function(week){return <span>{week} </span>})}</span>
                                            <span>Assignee: {scheduling.assignee}</span>
                                        </li>) : "Currently not assigned to anyone"}</span>
                                </li>
                            )
                        }
                    </ul>
                    </li>)
                }
                </ul>
            </div>
        );
    }
}

export default FindTimeSlots;
