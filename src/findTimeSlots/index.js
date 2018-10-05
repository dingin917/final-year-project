import React, { Component } from 'react';
import './style.css';

class FindTimeSlots extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            profile: { courses: [] }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        event.preventDefault();

        var requestBody = {};
        requestBody.name = this.refs.name.value;
        requestBody.email = this.refs.email.value;

        fetch('/api/teachers', {
            method: 'POST',
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
                profile: json
            });
        });
    }

    render() {
        var profile = this.state.profile;

        return (
            <div id="profile-container">
                <h1> FindTimeSlots </h1>
                <form className="form-group" id="addProfile" onSubmit={this.handleSubmit}>
                    <label>Enter a teaching staff name </label>
                    <input className="form-control" type="text" ref="name" placeholder="e.g.SP" required />
                    <label>Enter his / her email </label>
                    <input className="form-control" type="text" ref="email" placeholder="e.g.epshum@ntu.edu.sg" required />
                    <input className="form-control" type="submit" value="Add a teaching staff" />
                </form>
                <span>{profile.name} </span>
                <span>{profile.email} </span>
            </div>
        );
    }
}

export default FindTimeSlots;
