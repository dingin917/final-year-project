import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import HeadSection from './HeadSection';
import Footer from './Footer';
import AddProfile from './addProfile'
import FindTimeSlots from './findTimeSlots'
import ViewProfile from './viewProfile'
import './index.css';
import ViewCalendar from './viewCalendar';
import ViewSummary from './viewSummary';

class App extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            show: true
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange() {
        this.setState({ show: !this.state.show })
    }
    render() {
        return (
            <div>
                <div style={{ display: this.state.show ? "block" : "none" }}>
                    <HeadSection />
                </div>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" data-toggle="toggle" value={this.state} onChange={this.handleChange} />
                        Hide original Page
                    </label>
                </div>
                <div className="board" id="service">
                    <div className="view">
                        <FindTimeSlots className="container padding" ></FindTimeSlots>
                    </div>
                    <div className="data">
                        <AddProfile className="container padding" ></AddProfile>
                        <ViewProfile className="container padding" ></ViewProfile>
                    </div>
                    <div className="view">
                        <ViewCalendar className="container padding"></ViewCalendar>
                    </div>
                    <div className="data">
                        <div>
                            <h1> Upload Faculty Profiles </h1>
                            <form action="/api/teachers/upload" method="POST" encType="multipart/form-data">
                                <input type="file" name="file" accept="*.csv" /><br/><br/>
                                <input type="submit" value="Upload Faculty Profiles" />
                            </form>
                        </div>
                        <div>
                            <h1> Upload Courses </h1>
                            <form action="/api/courses/upload" method="POST" encType="multipart/form-data">
                                <label>Select File: </label>
                                <input type="file" name="file" accept="*.csv" /><br/><br/>
                                <label>Category: </label>
                                <select name="category">
                                    <option value="fulltime">Full Time</option>
                                    <option value="parttime">Part Time</option>
                                </select><br/><br/>
                                <input type="submit" value="Upload Courses" />
                            </form>
                        </div>
                        <div>
                            <h1> Update Academic Calendar </h1>
                            <form action="/api/dates" method="post">
                                <label>Academic Year: </label>
                                <input type="text" name="acad_yr" placeholder="e.g. 2018" required/>
                                <label>Semester: </label>
                                <input type="text" name="sem" placeholder="e.g. 1" required/>
                                <label>Start Date: </label>
                                <input type="date" name="start_date" required/><br/><br/>
                                <input type="submit" value="Update Academic Calendar" />
                            </form>
                        </div>
                    </div>
                    <div className="view">
                        <ViewSummary className="container padding"></ViewSummary>
                    </div>
                </div>
                <div style={{ display: this.state.show ? "auto" : "none" }}>
                    <Footer className={this.state.show} />
                </div>
            </div>
        );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));

export default App