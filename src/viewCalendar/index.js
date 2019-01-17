import React, { Component } from 'react';
import './style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Autosuggest_Prof from '../Autosuggest_Prof';

const ics = require('ics');

const options = {
    exportCSVText: 'export to csv',
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
            prof_list_for_search: [],
            prof_initial_selected: String,
            prof : { schedule:[{acad_yr:Number, sem:Number, courses:[]}] },
            update: false,
            dates: [],
            acad_yr: Number,
            sem: Number, 
            courses: []
        }
        this.handleSuggestSelected = this.handleSuggestSelected.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSuggestSelected(event, {suggestionValue}){
        event.preventDefault();
        this.setState({
            prof_initial_selected: suggestionValue
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        var initial = this.state.prof_initial_selected;
        var acad_yr = this.refs.acad_yr.value;
        var sem = this.refs.sem.value;

        fetch('/api/teachers?initial=' + initial + '&acad_yr=' + acad_yr +'&sem=' + sem, {
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
                var schedule = json.schedule.find(ele => ele.acad_yr == this.state.acad_yr && ele.sem == this.state.sem);
                var courses = schedule.courses.filter(ele => ele.teaching_weeks.length>0);
                this.setState({courses: courses});
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

    download(content, fileName, contentType) {
        let a = document.createElement("a");
        let file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    downloadCalendar = () => {
        var icsContent = this.generateICS();
        console.log("ics Content: " + icsContent);
        var name = this.state.prof.initial;
        this.download(icsContent, name+".ics", "text/plain");
    };

    generateICS = () => {
        var courses = this.state.courses;
        let serialEvent = [];

        courses.forEach( course => {
            var day = course.day;
            var start_time = course.start_time;
            var end_time = course.end_time;
            var code = course.code;
            var type = course.type;
            var group = course.group;
            var venue = course.venue;
            course.teaching_weeks.forEach( week => {
                var date = this.getCourseDate(week, day);
                var event = {};
                event['start'] = [date.getFullYear(), date.getMonth()+1, date.getDate(), parseInt(start_time.slice(0,2)), parseInt(start_time.slice(3,5))];
                event['end'] = [date.getFullYear(), date.getMonth()+1, date.getDate(), parseInt(end_time.slice(0,2)), parseInt(end_time.slice(3,5))];
                event['title'] = code + " (" +type+ ")";
                event['description'] = "course: "+code+", type: "+type+", group: "+group;
                event['categories'] = ["NTU course"];
                event['location'] = venue;
                event['geo'] = { lat: 1.29027, lon: 103.851959 };
                event['status'] = "CONFIRMED";
                serialEvent.push(event);
            });
        });
        
        const { error, value } = ics.createEvents(serialEvent);
        if (!error) return value;
        return null;
    }

    getCourseDate(week, day) {
        var dates = this.state.dates;
        var start_date = dates[week-1].start_date;
        var course_date = new Date(start_date);
        switch (day) {
            case 'M': 
                break;
            case 'T':
                course_date.setDate(course_date.getDate()+1);
                break;
            case 'W':
                course_date.setDate(course_date.getDate()+2);
                break;  
            case 'TH':
                course_date.setDate(course_date.getDate()+3);
                break;
            case 'F':
                course_date.setDate(course_date.getDate()+4);
                break;
            default:
                console.log('courses.day is not in range of Monday to Friday..');
                break;
        }
        console.log("calculated course_date: " + course_date);
        return course_date;
    }

    render() {

        fetch('/api/search_prof')
        .then(function(prof_List){
            return prof_List.json();
        })
        .then(json => {
            this.setState({
                prof_list_for_search: json
            })
        });
        
        var myprof = this.state.prof;
        var mycourse = this.state.courses;
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
        });

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
            });
        });

        // sort array based on course time 
        // reference -> https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value?page=1&tab=votes#tab-top
        weekday.MON.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));
        weekday.TUE.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));
        weekday.WED.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));
        weekday.THU.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));
        weekday.FRI.sort((a,b) => (a.time > b.time) ? 1 : ((b.time > a.time) ? -1 : 0));

        Object.keys(weekday).forEach(day => {
            if (weekday[day].length>0){
                thc.push(
                    <TableHeaderColumn row='0' csvHeader={day} colSpan={weekday[day].length} headerAlign='center' dataAlign='center'>{day}</TableHeaderColumn>
                );
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
            <div className='board'>
                <div>
                    <h1> View Calendar </h1>
                    <form id="search" className="form-group" onSubmit={this.handleSubmit}>
                        <label>Enter a teaching staff name </label>
                        <Autosuggest_Prof profs={this.state.prof_list_for_search} handleSuggestSelected={this.handleSuggestSelected}/>
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
                        <button onClick={this.downloadCalendar}>
                            Download as .ics file 
                        </button>
                        <BootstrapTable ref='tab' data={input} options={options} selectRow={selectRow} cellEdit={cellEdit} keyField='id' exportCSV>
                        {thc}
                        </BootstrapTable>
                    </div>
                </div>
            </div>
        );
    }
}

export default ViewCalendar;