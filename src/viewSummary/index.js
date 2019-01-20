import React, { Component } from 'react';
import './style.css';
import Autosuggest_Prof from '../Autosuggest_Prof';

class ViewSummary extends Component {

    constructor(props) {
        super(props);
        this.state = {
            prof_list_for_search: [],
            prof_initial_selected: String,
            prof: { schedule: [{ courses:[ {code: String, type: String}]}] },
            acad_yr: Number,
            view: false
        };
        this.handleSuggestSelected = this.handleSuggestSelected.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.calculate = this.calculate.bind(this);
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

        fetch('/api/teachers/profile?initial=' + initial, {
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
            if (json != null) {
                var schedule_of_year = json.schedule.filter(ele => ele.acad_yr == acad_yr);
                this.setState({
                    prof: json,
                    schedule: schedule_of_year,
                    acad_yr: acad_yr,
                    view: true,
                });
            } else {
                alert("No record found in database, please try another one.");
                return false;
            }
        });
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
            this.setState({
                prof_list_for_search: json
            })
        });

        var prof = this.state.prof;
        var view = this.state.view;
        var sem_1_ft = [];
        var sem_1_pt = [];
        var sem_2_ft = [];
        var sem_2_pt = [];

        var work_load = 0;
        var paid_load = 0;
        var grand_total = 0;

        if (view) {
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
            <div id="prof-course-container" className='board'>
                <div id="info">
                    <h1 className="display-4">View Summary</h1>
                    <p>You can find the teaching assignment summary for a certain teaching staff via <i>View</i> portal. <br />
                    The total teaching hours and payload will be automatically calculated.</p>
                </div>
                <h1> View Summary of Contact Hours </h1>
                <form id="search" className="form-group" onSubmit={this.handleSubmit}>
                    <label>Enter a teaching staff name </label>
                    <Autosuggest_Prof profs={this.state.prof_list_for_search} handleSuggestSelected={this.handleSuggestSelected}/>
                    <label>Enter the academic year </label>
                    <input className="form-control" type="text" ref="acad_yr" placeholder="e.g.2018" required />
                    <input className="form-control" type="submit" value="View Summary" />
                </form>
                <div style={view ? null : { display: 'none' }}>
                    <h1>Summary of Contact Hours for Lecturer - {prof.initial}</h1>
                    <div className="sem1">
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
                        </table><br /><br />
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
                    <div className="sem2">
                        <h5>Semester 2</h5>
                        <table>
                            <tr><th>SUBJECT</th><th>HOURS</th></tr>
                            {
                                sem_2_ft.map(ele => 
                                    <tr><td>{ele.course}</td><td>{ele.hour}</td></tr>
                                )
                            }
                        </table><br /><br />
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
                    <dib className="sum">
                        <h5>Work Load: {work_load} hrs</h5>
                        <h5>Paid Load: {paid_load} hrs</h5>
                        <h5>Grand Total: {grand_total} hrs</h5>
                    </dib>
                </div>
            </div>
        );
    }
}

export default ViewSummary;
