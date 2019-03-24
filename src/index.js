import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import HeadSection from './HeadSection';
import Footer from './Footer';
import Routes from './Routes';
import './index.css';

class App extends Component {
    constructor(prop) {
        super(prop);
        this.handleLogin = this.handleLogin.bind(this);
    }
    handleLogin(event) {
        // if document.querySelector('#id').value===process.env.passwd
        // this.setState({ login: true });

        event.preventDefault();
        fetch('/api//user/authenticate?email=' + this.refs.myemail.value + '&password=' + this.refs.mypassword.value, {
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
            console.log("\nFROM DB -> " + JSON.stringify(json));
            if (json!= null && Object.keys(json).length>0){
                localStorage.setItem('email', this.refs.myemail.value);
                window.location.reload();
            } else {
                localStorage.setItem('email', 'false');
                alert("Unsuccessful Login Attempted, Please Try Again..");
                return false;
            }
            
        });
    }
    render() {
        if (localStorage.getItem('email') === null || localStorage.getItem('email') ==='false') return (
            <div id="login-page">
                <div className="modal-dialog text-center">
                    <div className="col-sm-8 main-section">
                        <div className="modal-content">
                            <div className="col-12 user-img">
                                <img alt="img" src="./img/user.png" /> 
                            </div>
                            <div className="col-12 user-name">
                                <h1>User Login</h1>
                            </div>
                            <div className="col-12 form-input">
                                <form>
                                    <div className="form-group">
                                        <input ref="myemail" type="email" className="form-control" placeholder="Enter Email" />
                                    </div>
                                    <div className="form-group">
                                        <input ref="mypassword" type="password" className="form-control" placeholder="Password" />
                                    </div>
                                    <button onClick={this.handleLogin} type="submit" className="btn btn-success">Login</button>
                                </form>
                            </div>
                            <div className="col-12 link-part">
                                <a href="https://hackmd.io/uc5Dz57AT26OmFCgW5i-pA?view" target="_blank">Forgot Password?</a>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        );
        return (
            <div>
                <div style={{"margin-bottom": "5rem"}}>
                    <HeadSection />
                </div>
                <Routes />
                <div>
                    <Footer />
                </div>
            </div>
        );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));

export default App