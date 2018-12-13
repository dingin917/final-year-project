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


class FindTimeSlots extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            course: { schedule: [] },
            update: false,
            dates: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }
    handleSubmit(event) {
        event.preventDefault();
        var acad_yr = this.refs.myacad_yr.value;
        var sem = this.refs.mysem.value;
        var code = this.refs.mycode.value;
        var type = this.refs.mytype.value;

        fetch('/api/courses?code=' + code + '&type=' + type + '&acad_yr=' + acad_yr + '&sem=' + sem)
        .then(function(data){
            return data.json();
        })
        .then(json => {
            if (json!=null){
                this.setState({
                    course: json,
                    update: true
                });
                fetch('/api/dates?acad_yr=' + acad_yr +'&sem=' + sem)
                .then(function(result){
                    return result.json();
                })
                .then(json => {
                    this.setState({
                        dates: json.weektodate
                    })
                });
            } else {
                alert('No record found in database, please try again.');
                return false;
            }
        });
    }
    handleUpdate(event){
        event.preventDefault();

        var requestBody = {};
        requestBody.code = this.state.course.code;
        requestBody.type = this.state.course.type;
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
        var mycourse = this.state.course;
        var myupdate = this.state.update;
        var mydate = this.state.dates;

        let input = [];
        for (var i=1; i<14; i++) { 
            input.push({id:i, date:""});
        }

        mydate.forEach(ele => {
            console.log(JSON.stringify(ele));
            input[ele.week-1].date = ele.start_date.slice(5,10) + ' to ' + ele.end_date.slice(5,10);
        })

        var thc =[];
        thc.push(
            <TableHeaderColumn row='0' dataField='id' rowSpan='2' csvHeader='Teaching Week' headerAlign='center' dataAlign='center'>Teaching<br />Week</TableHeaderColumn>
        );

        thc.push(
            <TableHeaderColumn row='0' dataField='date' rowSpan='2' csvHeader='Dates' headerAlign='center' dataAlign='center'>Date</TableHeaderColumn>
        );

        var weekday = {
            MON:[],
            TUE:[],
            WED:[],
            THU:[],
            FRI:[]
        };
        
        mycourse.schedule.forEach(sche => {
            var grp_name = sche.group;
            sche.slots.forEach(slot => {
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
                        console.log('id - ' + slot._id);
                        break;
                }

                var not_available = [1,2,3,4,5,6,7,8,9,10,11,12,13].filter(e => !slot.teaching_weeks.includes(e));

                not_available.forEach (w => {
                    input[w-1][slot._id]='NOT AVAILABLE';
                });

                slot.scheduled_weeks.forEach(scheduling => {
                    var assigneed_prof = scheduling.assignee;
                    scheduling.week.forEach(w => {
                        input[w-1][slot._id] = assigneed_prof;
                    }); 
                });
            });
        });

        Object.keys(weekday).forEach(day => {
            if (weekday[day].length>0){
                thc.push(
                    <TableHeaderColumn row='0' csvHeader={day} colSpan={weekday[day].length} headerAlign='center' dataAlign='center'>{day}</TableHeaderColumn>
                )
                weekday[day].forEach(slot => {
                    var id = slot.id;
                    var time = slot.time;
                    var grp = slot.group;
                    var venue = slot.venue;
                    var header = time + ' ' + grp + ' ' + venue;
                    thc.push (
                        <TableHeaderColumn row='1' csvHeader={header} dataField={id} headerAlign='center' dataAlign='center'>{time}<br />{grp}<br />{venue}</TableHeaderColumn>
                    );
                });
            }
        });

        return (
            <div>
                <div>
                    <h1> Find Timeslots</h1>
                    <form id="search" className="form-group" onSubmit={this.handleSubmit}>
                        <label>Enter academic year</label>
                        <input className="form-control" type="text" ref="myacad_yr" placeholder="e.g.2018" required />
                        <label>Enter semester</label>
                        <input className="form-control" type="text" ref="mysem" placeholder="e.g.1" required />
                        <label>Enter a course code </label>
                        <input className="form-control" type="text" ref="mycode" placeholder="e.g.EE4483" required />
                        <label>Enter a class type </label>
                        <input className="form-control" type="text" ref="mytype" placeholder="e.g.LEC" required />
                        <input className="form-control" type="submit" value="Find Timeslots" />
                    </form>
                </div>
                <div id="course-container" style={myupdate ? null : { display: 'none' }}>
                    <div className="col-md-3">
                        <h1>Update Teaching Assignment</h1>
                        <form className="form-group" id="assign" onSubmit={this.handleUpdate}>
                            <label>Enter a course group </label>
                            <input className="form-control" type="text" ref="group" placeholder="e.g.FC1" required />
                            <label>Enter a course weekday </label>
                            <input className="form-control" type="text" ref="day" placeholder="e.g.F" required />
                            <label>Enter a course start time </label>
                            <input className="form-control" type="text" ref="start_time" placeholder="e.g.10:30" required />
                            <label>Enter a course end time </label>
                            <input className="form-control" type="text" ref="end_time" placeholder="e.g.11:30" required />
                            <label>Enter a course venue </label>
                            <input className="form-control" type="text" ref="venue" placeholder="e.g.LT29" required />
                            <label>Assign the teaching weeks </label>
                            <input className="form-control" type="text" ref="week" placeholder="e.g.1,2,3" required />
                            <label>Assign a teaching staff name </label>
                            <input className="form-control" type="text" ref="name" placeholder="e.g.CLH" required />
                            <input className="form-control" type="submit" value="Assign a teaching staff" />
                        </form>
                    </div>
                    <div className="col-md-9" id="table">
                        <h1>{mycourse.code}</h1>
                        <h1>Academic Year {mycourse.acad_yr} &nbsp; &nbsp; Semester {mycourse.sem}</h1>
                        <h1>Teaching Assignment Form - {mycourse.type}</h1>
                        <BootstrapTable ref='tab' data={input} options={options} selectRow={selectRow} cellEdit={cellEdit} keyField='id'
                            insertRow deleteRow exportCSV>
                        {thc}
                        </BootstrapTable>
                    </div>
                </div>
            </div>
        );
    }
}

export default FindTimeSlots;