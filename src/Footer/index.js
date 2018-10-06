import React, { Component } from 'react';
import './style.css';

class Footer extends Component {

    render() {
        return (
            <div className="prod">
                <div className="container-fluid padding">
                    <hr className="my-4" />
                    <div className="row padding">
                        <div className="col-lg-6">

                        </div>
                        <div className="col-lg-6">

                        </div>
                    </div>
                </div>


                <div className="container-fluid padding">
                    <div className="row text-center padding">
                        <div className="col-12">
                            <h2>Connect</h2>
                        </div>
                        <div className="col-12 social padding">
                            <a href="/"><i className="fab fa-facebook"></i></a>
                            <a href="/"><i className="fab fa-google-plus-g"></i></a>
                            <a href="/"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>


                <footer>
                    <div className="container-fluid padding">
                        <div className="row text-center">
                            <div className="col-12">
                                <hr className="light" />
                                <h5>&copy; 2018 by Timeslots Planner. Proudly created with NTU School of EEE.</h5>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    }
}

export default Footer;