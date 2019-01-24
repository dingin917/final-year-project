import React, { Component } from 'react';
import './style.css';

class RegisterUser extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            username: String,
            email: String,
            password: String,
            registered: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        event.preventDefault();
        // validate password 
        if(this.refs.password.value === this.refs.repassword.value){
            let requestBody = {};
            requestBody.cipher = this.refs.cipher.value;
            requestBody.email = this.refs.email.value;
            requestBody.password = this.refs.password.value;
            requestBody.username = this.refs.username.value;

            fetch('api/user/register', {
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
            }).then(function(data){
                return data.json();
            }).then(json => {
                if(json == null){
                    alert("Wrong cipher captured, please try another time.");
                    return false;
                } else {
                    this.setState({
                        username: this.refs.username.value,
                        email: this.refs.email.value,
                        password: this.refs.password.value,
                        registered: true
                    });
                    console.log("Successfully registered an user account");
                }
            });

        } else {
            alert("Password do not match, please try another time.");
            return false;
        }
    }
    handleLogoff(event) {
        event.preventDefault();
        localStorage.setItem('email', 'false');
        window.location.reload();
    }

    render() {
        return (
            <div id="registration-container" className="board">
                <div id="info">
                    <h1 className="display-4">Register User Account</h1>
                    <p>You can register a new user account via <i>Register</i> portal. <br />
                    Please note that you need to provide <i>cipher</i> for authorization authentication. </p>
                </div>
                <div className="col-6" id="register-form">
                    <h1> Register a new user account </h1>
                    <form className="form-group" id="register" onSubmit={this.handleSubmit}>
                        <label>Enter your username </label>
                        <input className="form-control" type="text" ref="username" placeholder="e.g. Grace" required />
                        <label>Enter your email address </label>
                        <input className="form-control" type="email" ref="email" placeholder="e.g. xxxx@ntu.edu.sg" required />
                        <label>Enter your password</label>
                        <input className="form-control" type="password" ref="password" required />
                        <laber>Confirm your password</laber>
                        <input className="form-control" type="password" ref="repassword" required />
                        <label>Enter the cipher to authenticate your authorization of registration </label>
                        <input className="form-control" type="text" ref="cipher" required />
                        <input className="form-control" type="submit" value="Regster an account" />
                    </form>
                </div>
                <div id="logoff" className="col-6" style={this.state.registered ? null : { display: 'none' }}>
                    <p>You have successfully registered a new user account. <br /> You may log off your current account and re-login here.</p>
                    <button onClick={this.handleLogoff}>Confirm to Logoff</button>
                </div>
            </div>
        );
    }
}

export default RegisterUser;
