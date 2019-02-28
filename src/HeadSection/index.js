import React, { Component } from 'react';
import './style.css';

class HeadSection extends Component {
    render() {
        return (
            <div className="prod">
                <nav className="navbar navbar-expand-md navbar-light bg-light sticky-top" id="header">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/"><img alt="img" src="./img/logo.png" /></a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarResponsive">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item active">
                                    <a className="nav-link" href="/">Home</a>
                                </li>
                                <li className="nav-item active">
                                    <a className="nav-link" href="/assign">Assignmemt</a>
                                </li>
                                <li className="nav-item active">
                                    <a className="nav-link" href="/prof">Profile</a>
                                </li>
                                {/* <li className="nav-item active">
                                    <a className="nav-link" href="/summary">Summary</a>
                                </li> */}
                                <li className="nav-item active">
                                    <a className="nav-link" href="/room">Room</a>
                                </li>
                                <li className="nav-item active">
                                    <a className="nav-link" href="/register">Register</a>
                                </li>
                                <li className="nav-item active">
                                    <a className="nav-link" href="/upload">Upload</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default HeadSection;
