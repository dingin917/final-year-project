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

class ViewCalendar extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            prof : { courses:[] },
            update: false,
            dates: [],
            acad_yr: Number,
            sem: Number
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        event.preventDefault();
        var initial = this.refs.initial.value;
        var acad_yr = this.refs.acad_yr.value;
        var sem = this.refs.sem.value;

        fetch('/api/teachers?initial=' + initial, {
            method: 'GET',
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            redirect: "follow",
            referrer: "no-referrer"
        }).then(function (data) {
            return data.json();
        }).then(json => {
            if (json!= null){
                this.setState({
                    prof: json,
                    acad_yr: acad_yr,
                    sem: sem,
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

    render() {
        var myprof = this.state.prof;
        var mycourse = this.state.prof.courses;
        var myupdate = this.state.update;
        var mydate = this.state.dates;
        var myacad_yr = this.state.acad_yr;
        var mysem = this.state.sem;

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
        
        mycourse.forEach(slot => {
        
            switch (slot.day) {
                case 'M': 
                    weekday.MON.push({time:slot.start_time+'-'+slot.end_time, group: slot.group, venue:slot.venue, id:slot._id});
                    break;
                case 'T':
                    weekday.TUE.push({time:slot.start_time+'-'+slot.end_time, group: slot.group, venue:slot.venue, id:slot._id});
                    break;
                case 'W':
                    weekday.WED.push({time:slot.start_time+'-'+slot.end_time, group: slot.group, venue:slot.venue, id:slot._id});
                    break;  
                case 'TH':
                    weekday.THU.push({time:slot.start_time+'-'+slot.end_time, group: slot.group, venue:slot.venue, id:slot._id});
                    break;
                case 'F':
                    weekday.FRI.push({time:slot.start_time+'-'+slot.end_time, group: slot.group, venue:slot.venue, id:slot._id});
                    console.log('id - ' + slot._id);
                    break;
                default:
                    console.log('courses.day is not in range of Monday to Friday..');
                    break;
            }
            
            slot.teaching_weeks.forEach(week => {
                //input[week-1][slot._id] = {code: slot.code, type:slot.type, group: slot.group, venue:slot.venue};
                input[week-1][slot._id] = slot.code + '(' + slot.type + ')';
            })
        });

        // sort array based on course time 
        weekday.MON.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));
        weekday.TUE.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));
        weekday.WED.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));
        weekday.THU.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));
        weekday.FRI.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));

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
                    <h1> View Calendar </h1>
                    <form id="search" className="form-group" onSubmit={this.handleSubmit}>
                        <label>Enter a teaching staff name </label>
                        <input className="form-control" type="text" ref="initial" placeholder="e.g.SP" required />
                        <label>Enter academic year</label>
                        <input className="form-control" type="text" ref="acad_yr" placeholder="e.g.2018" required />
                        <label>Enter semester</label>
                        <input className="form-control" type="text" ref="sem" placeholder="e.g.1" required />
                        <input className="form-control" type="submit" value="Find Schedule" />
                    </form>
                </div>
                <div id="course-container" style={myupdate ? null : { display: 'none' }}>
                    <div className="col-md-9" id="table">
                        <h1>{myprof.teachingarea} - {myacad_yr} Semester {mysem} Teaching Assignment - {myprof.initial}</h1>
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

export default ViewCalendar;