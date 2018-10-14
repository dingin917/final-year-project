import React, { Component } from 'react';
import './style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const options = {
    exportCSVText: 'export to csv',
    insertText: 'insert',
    deleteText: 'delete',
    saveText: 'save',
    closeText: 'close'
};

const selectRow = {
    mode: 'checkbox',
    bgColor: 'rgb(238, 193, 213)'
  };

const cellEdit = {
    mode: 'click',
    blurToSave: true
  };

class UpdateAssignments extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            course: { schedule: [] }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        var requestBody = {};
        requestBody.code = this.refs.code.value;
        requestBody.type = this.refs.type.value;
        requestBody.group = this.refs.group.value;
        requestBody.day = this.refs.day.value;
        requestBody.start_time = this.refs.start_time.value;
        requestBody.end_time = this.refs.end_time.value;
        requestBody.venue = this.refs.venue.value;
        requestBody.name = this.refs.name.value;
        requestBody.week = this.refs.week.value.split(',').map(Number);
        

        fetch('/api/courses/assign', {
            method: 'PUT',
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(requestBody)
        }).then(function (data) {
            return data.json();
        }).then(json => {
            this.setState({
                course: json
            });
        });
    }

    render() {
        var course = this.state.course;

        let input = [];
        for (var i=1; i<14; i++) { 
            input.push({id:i});
        }

        var weekday = {
            MON:[],
            TUE:[],
            WED:[],
            THU:[],
            FRI:[]
        };
        
        course.schedule.map(schedule => {
            var grp_name = schedule.group;
            schedule.slots.map(slot => {
                switch (slot.day) {
                    case 'M': 
                        weekday.MON.push({time:slot.start_time+'-'+slot.end_time, group: grp_name, venue:slot.venue, id:slot._id});
                        break;
                    case 'T':
                        weekday.TUE.push({time:slot.start_time+'-'+slot.end_time, group: grp_name, venue:slot.venue, id:slot._id});
                        break;
                    case 'W':
                        weekday.WED.push({time:slot.start_time+'-'+slot.end_time, group: grp_name, venue:slot.venue, id:slot._id});
                        break;  
                    case 'TH':
                        weekday.THU.push({time:slot.start_time+'-'+slot.end_time, group: grp_name, venue:slot.venue, id:slot._id});
                        break;
                    case 'F':
                        weekday.FRI.push({time:slot.start_time+'-'+slot.end_time, group: grp_name, venue:slot.venue, id:slot._id});
                        break;
                }

                var not_available = [1,2,3,4,5,6,7,8,9,10,11,12,13].filter(e => !slot.teaching_weeks.includes(e));

                not_available.map (w => {
                    input[w-1][grp_name]='NOT AVAILABLE';
                });
                
                slot.scheduled_weeks.map(scheduling => {
                    var assginee = scheduling["assignee"];
                    scheduling.week.map( w => {
                        input[w-1][grp_name]=assginee;
                    });
                });
            });
        });

        var thc =[];
        thc.push(
            <TableHeaderColumn row='0' dataField='id' rowSpan='2' csvHeader='Teaching Week' headerAlign='center' dataAlign='center'>Teaching<br />Week</TableHeaderColumn>
        );

        Object.keys(weekday).map(day => {
            if (weekday[day].length>0){
                thc.push(
                    <TableHeaderColumn row='0' csvHeader={day} colSpan={weekday[day].length} headerAlign='center' dataAlign='center'>{day}</TableHeaderColumn>
                )
                weekday[day].map(slot => {
                    var time = slot.time;
                    var grp = slot.group;
                    var venue = slot.venue;
                    var header = time + ' ' + grp + ' ' + venue;
                    thc.push (
                        <TableHeaderColumn row='1' csvHeader={header} dataField={grp} headerAlign='center' dataAlign='center'>{time}<br />{grp}<br />{venue}</TableHeaderColumn>
                    );
                });
            }
        });
 
        return (
            <div id="tut-assignment-container">
                <div className="col-md-3">                
                    <h1> Update Assignments </h1>
                    <form className="form-group" id="assign" onSubmit={this.handleSubmit}>
                        <label>Enter a course code </label>
                        <input className="form-control" type="text" ref="code" placeholder="e.g.EE4483" required />
                        <label>Enter a class type </label>
                        <input className="form-control" type="text" ref="type" placeholder="e.g.TUT" required />
                        <label>Enter a course group </label>
                        <input className="form-control" type="text" ref="group" placeholder="e.g.FC1" required />
                        <label>Enter a course weekday </label>
                        <input className="form-control" type="text" ref="day" placeholder="e.g.F" required />
                        <label>Enter a course start time </label>
                        <input className="form-control" type="text" ref="start_time" placeholder="e.g.1030" required />
                        <label>Enter a course end time </label>
                        <input className="form-control" type="text" ref="end_time" placeholder="e.g.1130" required />
                        <label>Enter a course venue </label>
                        <input className="form-control" type="text" ref="venue" placeholder="e.g.LT29" required />
                        <label>Assign the teaching weeks </label>
                        <input className="form-control" type="text" ref="week" placeholder="e.g.1,2,3" required />
                        <label>Assign a teaching staff name </label>
                        <input className="form-control" type="text" ref="name" placeholder="e.g.CLH" required />
                        <input className="form-control" type="submit" value="Assign a teaching staff" />
                    </form>
                </div>
                <div className="col-md-9">
                    <h1>{course.acad_yr} {course.code} {course.type}</h1>
                    <BootstrapTable ref='tab' data={input} options={options} selectRow={selectRow} cellEdit={cellEdit} keyField='id'
                        insertRow deleteRow exportCSV>
                    {thc}
                    </BootstrapTable>
                </div>
            </div>
        );
    }


}

export default UpdateAssignments;
