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

    render() {
        return (
            <div id="course-container">
                <h1> ViewProfile </h1>
                <form id="search" className="form-group" onSubmit={this.handleSubmit}>
                    <label>Enter a teaching staff name </label>
                    <input className="form-control" type="text" ref="name" placeholder="e.g.SP" required />
                    <input className="form-control" type="submit" value="Find Schedule" />
                </form>
                <div>
                    {this.state.prof.name}
                </div>
                <ul>
                    {
                        this.state.prof.courses.map(course =>
                            <li key={course._id}>
                                <span className="code">Code: {course.code} </span>
                                <span className="title">Code: {course.title} </span>
                                <span className="type">Type: {course.type} </span>
                                <span className="index">Index: {course.index} </span>
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

    handleSubmit(event) {
        event.preventDefault();
        var name = this.refs.name.value;

        fetch('/api/teachers?name=' + name).then(function (data) {
            console.log(name);

            return data.json();
        }).then(json => {
            this.setState({
                prof: json
            });
        });
    }
}

export default ViewProfile;
