import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import ViewTable from './viewTable'
import AddProfile from './addProfile'
import FindTimeSlots from './findTimeSlots'
import ViewProfile from './viewProfile'
import UpdateAssignment from './updateAssignments'
import './index.css';

class App extends Component {
    render() {
        return (
            <div className="board">
                <div className="view">
                    <ViewTable />
                </div>

                <div className="controller">
                    <AddProfile className="container padding" ></AddProfile>
                    <FindTimeSlots className="container padding" ></FindTimeSlots>
                    <UpdateAssignment className="container padding" ></UpdateAssignment>
                </div>
                <div className="controller">
                    <ViewProfile className="container padding" ></ViewProfile>
                </div>
            </div>
        );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));

export default App