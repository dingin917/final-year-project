import React, { Component } from 'react';
import './style.css';

class Footer extends Component {

    render() {
        return (
            <div className="prod">
                <footer>
                    <div className="container-fluid padding">
                        <div className="row text-center">
                            <div className="col-12">
                                <hr />
                                <h5>&copy; 2018 by Teaching Assignment Planner. Proudly created with NTU School of EEE.</h5>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

export default Footer;