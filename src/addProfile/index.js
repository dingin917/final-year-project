import React, { Component } from 'react';

class AddProfile extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            profile: { courses: [], }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        event.preventDefault();

        var requestBody = {};
        requestBody.initial = this.refs.initial.value;
        requestBody.fullname = this.refs.fullname.value;
        requestBody.title = this.refs.title.value;
        requestBody.teachingarea = this.refs.teachingarea.value;
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
                <h1> Add a Teaching Staff Profile </h1>
                <form className="form-group" id="addProfile" onSubmit={this.handleSubmit}>
                    <label>Enter a teaching staff initial </label>
                    <input className="form-control" type="text" ref="initial" placeholder="e.g.SP" required />
                    <label>Enter a teaching staff fullname </label>
                    <input className="form-control" type="text" ref="fullname" placeholder="e.g.Shum Ping" required />
                    <label>Enter his / her title </label>
                    <input className="form-control" type="text" ref="title" placeholder="e.g.Prof" required />
                    <label>Enter his / her teaching area </label>
                    <input className="form-control" type="text" ref="teachingarea" placeholder="e.g.Info-Communications" required />
                    <label>Enter his / her email </label>
                    <input className="form-control" type="text" ref="email" placeholder="e.g.epshum@ntu.edu.sg" required />
                    <input className="form-control" type="submit" value="Add a teaching staff" />
                </form>
                <span>{profile.fullname===undefined ? "" : "Hello, "+profile.fullname}</span>
            </div>
        );
    }
}

export default AddProfile;
