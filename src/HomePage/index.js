import React, { Component } from 'react';

class HomePage extends Component {
    render() {
        return (
            <div className="prod">
                <div id="slides">
                    <div className="carousel-inner">
                        <img alt="img" src="./img/keyboard.jpg" />
                        <div className="carousel-caption">
                            <h1 className="display-2">Welcome To Teaching Assignment Planner for School of EEE</h1>
                            <h3>Help to Assign a Course and Generate Specific Calendar</h3>
                            <button type="button" className="btn btn-outline-light btn-lg">View Demo</button>
                            <button type="button" className="btn btn-primary btn-lg">Get Started</button>
                        </div>
                        <div className="carousel-item">
                            <img alt="img" src="./img/ntu.png" />
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
                              The Teaching Assignment Planner has been proudly providing online assignment and downloading of faculty calendar for the teaching staff in
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
