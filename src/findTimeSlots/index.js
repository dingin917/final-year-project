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
        var category = this.refs.category.value;
        var code = this.refs.mycode.value;
        var type = this.refs.mytype.value;

        fetch('/api/courses?code=' + code + '&type=' + type + '&acad_yr=' + acad_yr + '&sem=' + sem + '&category=' + category)
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
        requestBody.acad_yr = this.state.course.acad_yr;
        requestBody.sem = this.state.course.sem;
        requestBody.category = this.refs.category.value;
        requestBody.code = this.state.course.code;
        requestBody.type = this.state.course.type;
        requestBody.group = this.refs.group.value;
        requestBody.start_week = this.refs.start_week.value;
        requestBody.end_week = this.refs.end_week.value;
        requestBody.name = this.refs.name.value;
        
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
            if(json!=null){
                this.setState({
                    course: json
                });
            } else {
                alert('No record found in database, please try again.');
                return false;
            }
        });

    }

    render() {
        var mycourse = this.state.course;
        var myupdate = this.state.update;
        var mydate = this.state.dates;

        // record the course info and ease user input 
        var grp_list = [];

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
        
        mycourse.schedule.forEach(slot => {
            var grp_name = slot.group;

            // record the course info and ease user input 
            if(grp_list.indexOf(grp_name) === -1) {
                grp_list.push(grp_name);
            }
        
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
                input[w-1][slot._id]='----';
            });

            slot.scheduled_weeks.forEach(scheduling => {
                var assigneed_prof = scheduling.assignee;
                scheduling.week.forEach(w => {
                    input[w-1][slot._id] = assigneed_prof;
                }); 
            });
        });

        grp_list.sort();

        weekday.MON.sort(function(a,b){return (a.group>b.group) ? 1 : ((b.group>a.group) ? -1 : 0);});
        weekday.TUE.sort(function(a,b){return (a.group>b.group) ? 1 : ((b.group>a.group) ? -1 : 0);});
        weekday.WED.sort(function(a,b){return (a.group>b.group) ? 1 : ((b.group>a.group) ? -1 : 0);});
        weekday.THU.sort(function(a,b){return (a.group>b.group) ? 1 : ((b.group>a.group) ? -1 : 0);});
        weekday.FRI.sort(function(a,b){return (a.group>b.group) ? 1 : ((b.group>a.group) ? -1 : 0);});

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
                        <label>Enter the category: </label>
                        <select ref="category">
                            <option value="fulltime">Full Time</option>
                            <option value="parttime">Part Time</option>
                        </select>
                        <input className="form-control" type="submit" value="Find Timeslots" />
                    </form>
                </div>
                <div style={myupdate ? null : { display: 'none' }}>
                    {/* <div className="col-md-3"> */}
                    <div>
                        <h1>Update Teaching Assignment</h1>
                        <form className="form-group" id="assign" onSubmit={this.handleUpdate}>
                            <label>Enter a course group </label>
                            <select ref="group" required>
                                {grp_list.map((value, index) => <option key={index} value={value}>{value}</option>)}
                            </select>
                            <label>Assign the teaching weeks From </label>
                            <input className="form-control" type="text" ref="start_week" placeholder="e.g.1" required />
                            <label>To</label>
                            <input className="form-control" type="text" ref="end_week" placeholder="e.g.7" required />
                            <label>Assign a teaching staff name </label>
                            <input className="form-control" type="text" ref="name" placeholder="e.g.CLH" required />
                            <input className="form-control" type="submit" value="Assign a teaching staff" />
                        </form>
                    </div>
                    {/* <div className="col-md-9" id="table"> */}
                    <div id="table">
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