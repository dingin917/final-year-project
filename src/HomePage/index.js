import React, { Component } from 'react';

class HomePage extends Component {
    render() {
        return (
            <div className="prod">
                <div id="slides" className="carousel slide" data-ride="carousel">
                    <ul className="carousel-indicators">
                        <li data-target="#slides" data-slide-to="0" className="active"></li>
                        <li data-target="#slides" data-slide-to="1"></li>
                        <li data-target="#slides" data-slide-to="2"></li>
                    </ul>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img alt="img" src="./img/ntu.png" />
                            <div className="carousel-caption">
                                <h1 className="display-2">Welcome To Timeslots Planner for School of EEE</h1>
                                <h3>Help to Customize your Timetable in a second</h3>
                                <button type="button" className="btn btn-outline-light btn-lg">View Demo</button>
                                <button type="button" className="btn btn-primary btn-lg">Get Started</button>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img alt="img" src="./img/hive.jpg" />
                        </div>
                        <div className="carousel-item">
                            <img alt="img" src="./img/hive-inside.jpg" />
                        </div>
                    </div>
                </div>


                <div className="container-fluid intro">
                    <div className="row jumbotron">
                        <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-10">
                            <p className="lead">A Final Year Project from School of Electrical and Electronic Engineering.
                              Timeslots Planner has been proudly providing automated className timetable planning for all teaching staff in
                              EEE.
                              To learn more, simply browse through our site.
                            </p>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-2">
                            <a href="/">
                                <button type="button" className="btn btn-outline-secondary btn-lg">
                                    Learn More
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
