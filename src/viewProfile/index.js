import React, { Component } from 'react';

class ViewProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            prof: { schedule: [{courses: []}] }
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        var initial = this.refs.initial.value;

        fetch('/api/teachers/profile?initial=' + initial, {
            method: 'GET',
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            redirect: "follow",
            referrer: "no-referrer"
        }).then(function (data) {
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
            <div id="prof-course-container">
                <h1> View Profile </h1>
                <form id="search" className="form-group" onSubmit={this.handleSubmit}>
                    <label>Enter a teaching staff name </label>
                    <input className="form-control" type="text" ref="initial" placeholder="e.g.SP" required />
                    <input className="form-control" type="submit" value="Find Schedule" />
                </form>
                <div>
                    {prof.fullname}
                </div>
                <ul>
                    {
                        prof.schedule.map(sche => sche.courses.map(course => 
                            <li key={course._id}>
                                <span className="code">Code: {course.code} </span>
                                <span className="type">Type: {course.type} </span>
                                <span className="group">Group: {course.group} </span>
                                <span className="teaching_weeks">Week: {course.teaching_weeks.map(function (week) {
                                    return <span>{week} </span>
                                })} </span>
                                <span className="day">Time: {course.day} </span>
                                <span className="time">{course.start_time+"-"+course.end_time} </span>
                                <span className="venue">Venue: {course.venue} </span>
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}

export default ViewProfile;
