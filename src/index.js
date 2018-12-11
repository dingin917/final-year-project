import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import HeadSection from './HeadSection';
import Footer from './Footer';
import ViewTable from './viewTable'
import AddProfile from './addProfile'
import FindTimeSlots from './findTimeSlots'
import ViewProfile from './viewProfile'
import UpdateAssignment from './updateAssignments'
import './index.css';

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
                        <ViewTable />
                        <FindTimeSlots className="container padding" ></FindTimeSlots>
                        <UpdateAssignment className="container padding" ></UpdateAssignment>
                    </div>
                    <div className="data">
                        <AddProfile className="container padding" ></AddProfile>
                        <ViewProfile className="container padding" ></ViewProfile>
                        <div>
                            <form action="/api/teachers/upload" method="POST" encType="multipart/form-data">
                                <input type="file" name="file" accept="*.csv" /><br/><br/>
                                <input type="submit" value="Upload Faculty Profiles" />
                            </form>
                        </div>
                        <div>
                            <form action="/api/courses/upload" method="POST" encType="multipart/form-data">
                                <input type="file" name="file" accept="*.csv" /><br/><br/>
                                <input type="submit" value="Upload Courses" />
                            </form>
                        </div>
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