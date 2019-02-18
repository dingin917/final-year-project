import React, { Component } from 'react';
import './style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Autosuggest_Venue from '../Autosuggest_Venue';

const options = {
    exportCSVText: 'export to csv',
    saveText: 'save',
    closeText: 'close'
};

class RoomUtil extends Component {

    constructor(props) {
        super(props);
        this.state = {
            generate: false,
            venueUtil: [{'acad_yr': Number, 'sem': Number, 'venue': String, 'scheduled_time': []}],
            dates: [],
            acad_yr: Number,
            sem: Number,
            venue_list_for_search: [],
            venue_selected: String
        };
        this.handleYearChange = this.handleYearChange.bind(this);
        this.handleSemChange = this.handleSemChange.bind(this);
        this.handleSuggestSelected = this.handleSuggestSelected.bind(this);
        this.handleGenerateCalendar = this.handleGenerateCalendar.bind(this);
    }

    handleYearChange(event){
        event.preventDefault();
        this.setState({
            acad_yr: this.refs.acad_yr.value
        });
        if(this.state.sem){
            fetch('/api/search_venue?acad_yr=' + this.refs.acad_yr.value + '&sem=' + this.state.sem, {
                method: 'GET',
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                redirect: "follow",
                referrer: "no-referrer"
            }).then(function(data) {
                return data.json();
            }).then(json => {
                this.setState({
                    venue_list_for_search: json
                });
            })
        }
    }


    handleSemChange(event){
        event.preventDefault();
        this.setState({
            sem: this.refs.sem.value
        });
        if(this.state.acad_yr){
            fetch('/api/search_venue?acad_yr=' + this.state.acad_yr + '&sem=' + this.refs.sem.value, {
                method: 'GET',
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                redirect: "follow",
                referrer: "no-referrer"
            }).then(function(data) {
                return data.json();
            }).then(json => {
                this.setState({
                    venue_list_for_search: json
                });
            })
        }
    }

    handleSuggestSelected(event, {suggestionValue}){
        event.preventDefault();
        this.setState({
            venue_selected: suggestionValue
        });
    }

    handleGenerateCalendar(event) {
        event.preventDefault();

        fetch('/api/venue/util?venue=' + this.state.venue_selected + '&acad_yr=' + this.state.acad_yr +'&sem=' + this.state.sem, {
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
            if (json != null){

                this.setState({
                    generate: true,
                    venueUtil: json
                });

                fetch('/api/dates?acad_yr=' + this.state.acad_yr +'&sem=' + this.state.sem)
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

        let generate = this.state.generate;
        let venueUtil = this.state.venueUtil;
        let dates = this.state.dates;

        // format input as id=(week-1) for each column 
        let input = [];
        for (let i=1; i<14; i++) { 
            input.push({id:i, date:""});
        }

        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        dates.forEach(ele => {
            console.log(JSON.stringify(ele));
            // calc starting month name
            let start_mon = parseInt(ele.start_date.slice(5,7));
            start_mon = months[start_mon-1];       
            // calc ending month name     
            let end_mon = parseInt(ele.end_date.slice(5,7));
            end_mon = months[end_mon-1];
            input[ele.week-1].date = start_mon + ele.start_date.slice(7,10) + ' to ' + end_mon + ele.end_date.slice(7,10);
       });

        let thc = [];

        // prepare feeding data to the calendar table 
        if(generate){
            thc.push(
                <TableHeaderColumn row='0' dataField='id' rowSpan='2' csvHeader='Teaching Week' headerAlign='center' dataAlign='center'>Teaching<br />Week</TableHeaderColumn>
            );
        
            thc.push(
                <TableHeaderColumn row='0' dataField='date' rowSpan='2' csvHeader='Dates' headerAlign='center' dataAlign='center'>Date</TableHeaderColumn>
            );
        
            let weekday = {
                MON:[],
                TUE:[],
                WED:[],
                THU:[],
                FRI:[]
            }; 

            venueUtil.scheduled_time.forEach(slot => {
                switch (slot.day) {
                    case 'M': 
                        weekday.MON.push({time:slot.start_time+'-'+slot.end_time, group: slot.group, course:slot.course+'-'+slot.courseType, id:slot._id});
                        break;
                    case 'T':
                        weekday.TUE.push({time:slot.start_time+'-'+slot.end_time, group: slot.group, course:slot.course+'-'+slot.courseType, id:slot._id});
                        break;
                    case 'W':
                        weekday.WED.push({time:slot.start_time+'-'+slot.end_time, group: slot.group, course:slot.course+'-'+slot.courseType, id:slot._id});
                        break;  
                    case 'TH':
                        weekday.THU.push({time:slot.start_time+'-'+slot.end_time, group: slot.group, course:slot.course+'-'+slot.courseType, id:slot._id});
                        break;
                    case 'F':
                        weekday.FRI.push({time:slot.start_time+'-'+slot.end_time, group: slot.group, course:slot.course+'-'+slot.courseType, id:slot._id});
                        break;
                    default:
                        console.log('ERROR: scheduled_time.day is not in range of Monday to Friday.\n');
                        break;
                }

                slot.week.forEach(w => {
                    //input[week-1][slot._id] = {code: slot.code, type:slot.type, group: slot.group, venue:slot.venue};
                    input[w-1][slot._id] = 'BOOKED';
                });
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
                        <TableHeaderColumn row='0' csvHeader={day} colSpan={weekday[day].length} headerAlign='center' dataAlign='center' width='110px'>{day}</TableHeaderColumn>
                    );
                    weekday[day].forEach(slot => {
                        let id = slot.id;
                        let time = slot.time;
                        let course = slot.course;
                        let grp = slot.group;
                        
                        let header = time + ' ' + course + ' ' + grp;
                        thc.push (
                            <TableHeaderColumn row='1' csvHeader={header} dataField={id} headerAlign='center' dataAlign='center' width='110px'>{time}<br />{course}<br />{grp}</TableHeaderColumn>
                        );
                    });
                }
            });
        }   

        return (
            <div className='board'>
                <div id='info'>
                    <h1 className="display-4">View Room Utilization</h1>
                    <p>Similar to the course calendar and Prof’s calendar, with <i>Time</i> in X-axis and <i>Week</i> in Y-axis, 
                        the teaching activity (course code + course type + group) in the cell will be displayed. <br />
                        This is useful to book or identify (lab space/LT/TRs) for new or additional classes or conducting quizzes.</p>
                </div>
                <div className="col-6" id="container">
                    <h1 className="inside-form"> View Room Utilization </h1>
                    <form id="search" className="form-group" onSubmit={this.handleGenerateCalendar}>
                        <label>Enter academic year</label>
                        <input className="form-control" type="text" ref="acad_yr" placeholder="e.g.2018" onChange={this.handleYearChange} required />
                        <label>Enter semester</label>
                        <input className="form-control" type="text" ref="sem" placeholder="e.g.2" onChange={this.handleSemChange} required />
                        <label>Enter a venue </label>
                        <Autosuggest_Venue venues={this.state.venue_list_for_search} handleSuggestSelected={this.handleSuggestSelected} />
                        <input className="form-control" type="submit" value="Find Schedule" />
                    </form>
                </div>
                <div className="calendar-container" style={generate ? null : { display: 'none' }}>
                    <div className="col-md-11" id="table">
                        <h1 id="title"> Academic Year {venueUtil.acad_yr} Semester {venueUtil.sem} Room Utilization - {venueUtil.venue}</h1>
                        <div id='table-container'>
                            <BootstrapTable ref='tab' data={input} options={options} keyField='id' exportCSV>
                                {thc}
                            </BootstrapTable>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default RoomUtil;