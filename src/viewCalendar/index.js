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
            courses: [],
            schedule: []
        }
        this.handleSuggestSelected = this.handleSuggestSelected.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSendEmail = this.handleSendEmail.bind(this);
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
                var schedule_of_year = json.schedule.filter(ele => ele.acad_yr == acad_yr);
                var courses = schedule.courses.filter(ele => ele.teaching_weeks.length>0);
                this.setState({
                    courses: courses,
                    schedule: schedule_of_year
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

    handleSendEmail(event){
        event.preventDefault();

        // generate summary via calculation
        let sem_1_ft = [];
        let sem_1_pt = [];
        let sem_2_ft = [];
        let sem_2_pt = [];

        let work_load = 0;
        let paid_load = 0;
        let grand_total = 0;

        this.calculate(1, sem_1_ft, sem_1_pt);
        this.calculate(2, sem_2_ft, sem_2_pt);
        
        let temp1 = sem_1_ft.find(ele => ele.course == 'Sub-Total');
        let temp2 = sem_2_ft.find(ele => ele.course == 'Sub-Total');
        work_load = temp1.hour + temp2.hour;

        temp1 = sem_1_pt.find(ele => ele.course == 'Sub-Total');
        temp2 = sem_2_pt.find(ele => ele.course == 'Sub-Total');
        paid_load = temp1.hour + temp2.hour;

        grand_total = work_load + paid_load;

        /* email body 
            greeting */
        let html = '<p>Dear ' + this.state.prof.title + ' ' + this.state.prof.fullname + ',<br /><br />';
        html += 'The assigned courses are enclosed in the .ics file, please kindly refer to attachment. Moreover, the workload summary is provided as follows. <br /><br />';

        /* email body 
            summary */
        html += 'Summary of Contact Hours: <br /><br />';
        // sem 1 - workload
        html += '<table style="width:70%; margin: auto; text-align:center; border: 1px solid"><tbody>';
        html += '   <caption style="text-align:left"><b>Semester 1 - Work Load</caption>'
        html += '   <tr><th>SUBJECT</th><th>HOURS</th></tr>';
        sem_1_ft.map(ele => {
            html += '<tr><td>'+ele.course+'</td><td>'+ele.hour+'</td></tr>';
        });
        html += '</tbody></table><br /><br />';

        // sem 1 - paidload
        html += '<table style="width:70%; margin: auto; text-align:center; border: 1px solid"><tbody>';
        html += '   <caption style="text-align:left"><b>Semester 1 - Paid Load</caption>'
        html += '   <tr><th>SUBJECT</th><th>HOURS</th></tr>';
        sem_1_pt.map(ele => {
            html += '<tr><td>'+ele.course+'</td><td>'+ele.hour+'</td></tr>';
        });
        html += '</tbody></table><br /><br />';

        // sem 2 - workload
        html += '<table style="width:70%; margin: auto; text-align:center; border: 1px solid"><tbody>';
        html += '   <caption style="text-align:left"><b>Semester 2 - Work Load</caption>'
        html += '   <tr><th>SUBJECT</th><th>HOURS</th></tr>';
        sem_2_ft.map(ele => {
            html += '<tr><td>'+ele.course+'</td><td>'+ele.hour+'</td></tr>';
        });
        html += '</tbody></table><br /><br />';

        // sem 2 - paidload
        html += '<table style="width:70%; margin: auto; text-align:center; border: 1px solid"><tbody>';
        html += '   <caption style="text-align:left"><b>Semester 2 - Paid Load</caption>'
        html += '   <tr><th>SUBJECT</th><th>HOURS</th></tr>';
        sem_2_pt.map(ele => {
            html += '<tr><td>'+ele.course+'</td><td>'+ele.hour+'</td></tr>';
        });
        html += '</tbody></table><br /><br />';

        // sum up 
        html += 'In summary, <br />';
        html += '<ul><li>Work Load: '+work_load+' hrs</li>';
        html += '   <li>Paid Load: '+paid_load+' hr</li>';
        html += '   <li>Grand Total: '+grand_total+' hrs.</li></ul>';

        /* email body 
            signature */
        html += 'Thanks a lot! <br /><br />'
        html += 'Warmest Regard, <br />';
        html += 'EEE Undergraduate Programme Office <br /></p>';

        let requestBody = {
            sender: localStorage.getItem('email'),
            receiver: this.state.prof.email,
            subject: "Teaching Assignment for AY-" + this.state.acad_yr + " Sem-" + this.state.sem,
            text: "Dear " + this.state.prof.title + " " + this.state.prof.fullname + ",\n\n" + 
                    "The assigned courses are enclosed in the .ics file, so as the workload summary. Please kindly refer to attachment. \n\n" +
                    "Warmest Regards,\n" +
                    "Undergraduate Programme Office\n",
            html: html,
            attachments: [{
                filename: 'ClassSchedule.ics',
                content: this.generateICS()
            }]
        };

        fetch('/api/email', {
            method: 'POST',
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            redirect: "follow",
            referrer: "no-referrer",
            body: JSON.stringify(requestBody)
        }).then(function(result){
            return result.json();
        })
        .then(json => {
            alert(json.message);
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

    calculate(sem, ft, pt) {
        var schedule = this.state.schedule;
        console.log("SCHE" + JSON.stringify(schedule));
        var schedules = schedule.filter(ele => ele.sem == sem);
        console.log("course" + JSON.stringify(schedules));
        var sub_total_ft = 0;
        var sub_total_pt = 0;

        schedules.forEach(sche => {
            sche.courses.forEach(course => {
                var s_hr = parseInt(course.start_time.slice(0,2));  // e.g. 13
                var s_min = parseInt(course.start_time.slice(3,5)); // e.g. 30
                var e_hr = parseInt(course.end_time.slice(0,2));    // e.g. 14
                var e_min = parseInt(course.end_time.slice(3,5));   // e.g. 30
                
                var int_hr = e_hr - s_hr;
                var int_min = e_min - s_min;
                var total_hr = int_hr + int_min / 60.0; 

                var len = course.teaching_weeks.length;

                total_hr = total_hr * len;
    
                var title = course.code+'('+course.type+')';
    
                if(course.category == 'fulltime') {
                    var prev = ft.find(ele => ele.course == title);
                    if (prev != undefined){
                        // update 
                        prev.hour = prev.hour + total_hr;
                    } else {
                        // create new 
                        ft.push({course: title, hour: total_hr});
                    }
                    sub_total_ft = sub_total_ft + total_hr;
                } else {
                    var prev = pt.find(ele => ele.course == title);
                    if (prev != undefined){
                        // update 
                        prev.hour = prev.hour + total_hr;
                    } else {
                        // create new 
                        pt.push({course: title, hour: total_hr});
                    }
                    sub_total_pt = sub_total_pt + total_hr;
                }
            })
        })

        ft.sort(function(a,b) {return (a.course > b.course) ? 1 : ((b.course > a.course) ? -1 : 0);} );
        pt.sort(function(a,b) {return (a.course > b.course) ? 1 : ((b.course > a.course) ? -1 : 0);} );
        ft.push({course: 'Sub-Total', hour: sub_total_ft});
        pt.push({course: 'Sub-Total', hour: sub_total_pt});
        
        console.log('ft:' + JSON.stringify(ft));
        console.log('pt:' + JSON.stringify(pt));

    }

    render() {

        fetch('/api/search_prof')
        .then(function(prof_List){
            return prof_List.json();
        })
        .then(json => {
            if (json!=null){
                this.setState({
                    prof_list_for_search: json
                });
            }
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

        // convert 2018-08-13 to Aug-13
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        mydate.forEach(ele => {
            console.log(JSON.stringify(ele));
            // calc starting month name
            let start_mon = parseInt(ele.start_date.slice(5,7));
            start_mon = months[start_mon-1];       
            // calc ending month name     
            let end_mon = parseInt(ele.end_date.slice(5,7));
            end_mon = months[end_mon-1];
            input[ele.week-1].date = start_mon + ele.start_date.slice(7,10) + ' to ' + end_mon + ele.end_date.slice(7,10);
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
                    <TableHeaderColumn row='0' csvHeader={day} colSpan={weekday[day].length} headerAlign='center' dataAlign='center' width='110px'>{day}</TableHeaderColumn>
                );
                weekday[day].forEach(slot => {
                    var id = slot.id;
                    var time = slot.time;
                    var grp = slot.group;
                    var venue = slot.venue;
                    var header = time + ' ' + grp + ' ' + venue;
                    thc.push (
                        <TableHeaderColumn row='1' csvHeader={header} dataField={id} headerAlign='center' dataAlign='center' width='110px'>{time}<br />{grp}<br />{venue}</TableHeaderColumn>
                    );
                });
            }
        });

        // summary part 
        var sem_1_ft = [];
        var sem_1_pt = [];
        var sem_2_ft = [];
        var sem_2_pt = [];

        var work_load = 0;
        var paid_load = 0;
        var grand_total = 0;

        if (myupdate) {
            this.calculate(1, sem_1_ft, sem_1_pt);
            this.calculate(2, sem_2_ft, sem_2_pt);
            
            var temp1 = sem_1_ft.find(ele => ele.course == 'Sub-Total');
            var temp2 = sem_2_ft.find(ele => ele.course == 'Sub-Total');
            work_load = temp1.hour + temp2.hour;

            temp1 = sem_1_pt.find(ele => ele.course == 'Sub-Total');
            temp2 = sem_2_pt.find(ele => ele.course == 'Sub-Total');
            paid_load = temp1.hour + temp2.hour;

            grand_total = work_load + paid_load;
        }

        return (
            <div className='board'>
                <div id="info">
                    <h1 className="display-4">View Calendar</h1>
                    <p>You can find the teaching assignment schedule for a certain teaching staff, and download the calendar via <i>Download</i> portal. <br />
                    The .ics file can be then imported by major calendars including ios calendar and google calendar.</p>
                </div>
                <div className="col-6" id="container">
                    <h1 className="inside-form"> View Calendar </h1>
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
                        <h1 id="title">{myprof.teachingarea} - {myacad_yr} Semester {mysem} Teaching Assignment - {myprof.initial}</h1>
                        <button onClick={this.downloadCalendar}>
                            Download as .ics file 
                        </button>
                        <div id='table-container'>
                        <BootstrapTable ref='tab' data={input} options={options} keyField='id' exportCSV>
                        {thc}
                        </BootstrapTable>
                        </div>
                    </div>
                </div>
                <div className="col-md-9"  id="summary" style={myupdate ? null : { display: 'none' }}>
                    <h1 className="inside-form">Summary of Contact Hours for Lecturer - {this.state.prof_initial_selected}</h1>
                    <div id="summary-container">
                    <div className="d-flex flex-row" id="sem1">
                        <div className="p-2 col-4">
                        <h5>Semester 1</h5>
                        <table>
                            <tbody>
                            <tr><th>SUBJECT</th><th>HOURS</th></tr>
                            {
                                sem_1_ft.map(ele => 
                                    <tr><td>{ele.course}</td><td>{ele.hour}</td></tr>
                                )
                            }
                            </tbody>
                        </table>
                        </div><br /><br />
                        <div className="p-2 col-4">
                        <h5>Paid Load Sem 1</h5>
                        <table>
                            <tbody>
                            <tr><th>SUBJECT</th><th>HOURS</th></tr>
                            {
                                sem_1_pt.map(ele => 
                                    <tr><td>{ele.course}</td><td>{ele.hour}</td></tr>
                                )
                            }
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <div className="d-flex flex-row" id="sem2">
                        <div className="p-2 col-4">
                        <h5>Semester 2</h5>
                        <table>
                            <tr><th>SUBJECT</th><th>HOURS</th></tr>
                            {
                                sem_2_ft.map(ele => 
                                    <tr><td>{ele.course}</td><td>{ele.hour}</td></tr>
                                )
                            }
                        </table>
                        </div><br /><br />
                        <div className="p-2 col-4">
                        <h5>Paid Load Sem 2</h5>
                        <table>
                            <tr><th>SUBJECT</th><th>HOURS</th></tr>
                            {
                                sem_2_pt.map(ele => 
                                    <tr><td>{ele.course}</td><td>{ele.hour}</td></tr>
                                )
                            }
                        </table>
                        </div>
                    </div>
                    <div className="sum">
                        <h5>Work Load: {work_load} hrs</h5>
                        <h5>Paid Load: {paid_load} hrs</h5>
                        <h5>Grand Total: {grand_total} hrs</h5>
                        <button onClick={this.handleSendEmail}>Confirm to Send Email</button>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default ViewCalendar;