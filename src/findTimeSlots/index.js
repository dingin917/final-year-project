import React, { Component } from 'react';
import './style.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Autosuggest_Course from '../Autosuggest_Course';
import Autosuggest_Prof from '../Autosuggest_Prof';

const options = {
    exportCSVText: 'Export to csv',
    saveText: 'save',
    closeText: 'close'
};

const selectRow = {
    mode: 'checkbox',
    bgColor: 'rgb(238, 193, 213)'
};

const cellEditProp = {
    mode: 'click',
    blurToSave: true,
    beforeSaveCell: onBeforeSaveCell, // a hook for before saving cell
    afterSaveCell: onAfterSaveCell  // a hook for after saving cell
};

function onAfterSaveCell(row, cellName, cellValue) {
    alert(`Save cell ${cellName} with value ${cellValue}`);

    let rowStr = '';
    for (const prop in row) {
        rowStr += prop + ': ' + row[prop] + '\n';
    }

    alert('Thw whole row :\n' + rowStr);
}

function onBeforeSaveCell(row, cellName, cellValue) {
    // You can do any validation on here for editing value,
    // return false for reject the editing
    return true;
}


class FindTimeSlots extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            course: { schedule: [] },
            update: false,
            dates: [],
            year: 2019,
            sem: 1,
            course_list_for_search: [],
            course_code_selected: String,
            prof_list_for_search: [],
            prof_initial_selected_for_update: String,
            prof_initial_selected_for_handover: String
        }
        this.handleYearChange = this.handleYearChange.bind(this);
        this.handleSemSelected = this.handleSemSelected.bind(this);
        this.handleSuggestSelected = this.handleSuggestSelected.bind(this);
        this.handleSuggestSelected_update = this.handleSuggestSelected_update.bind(this);
        this.handleSuggestSelected_handover = this.handleSuggestSelected_handover.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleHandover = this.handleHandover.bind(this);
    }
    handleYearChange(event) {
        event.preventDefault();
        this.setState({
            year: this.refs.myacad_yr.value
        });
        fetch('/api/search_course?acad_yr=' + this.refs.myacad_yr.value + '&sem=' + this.state.sem)
        .then(function(courseList){
            return courseList.json();
        })
        .then(json => {
            this.setState({
                course_list_for_search: json
            })
        });
    }
    handleSemSelected(event) {
        event.preventDefault();
        this.setState({
            sem: this.refs.mysem.value
        });
        fetch('/api/search_course?acad_yr=' + this.state.year + '&sem=' + this.refs.mysem.value)
        .then(function(courseList){
            return courseList.json();
        })
        .then(json => {
            this.setState({
                course_list_for_search: json
            })
        });
    }
    handleSuggestSelected(event, {suggestionValue}){
        event.preventDefault();
        this.setState({
            course_code_selected: suggestionValue
        });
    }
    handleSuggestSelected_update(event, {suggestionValue}){
        event.preventDefault();
        this.setState({
            prof_initial_selected_for_update: suggestionValue
        });
    }
    handleSuggestSelected_handover(event, {suggestionValue}){
        event.preventDefault();
        this.setState({
            prof_initial_selected_for_handover: suggestionValue
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        console.log("\nyear for search: " + this.state.year);
        console.log("\nsem for search: " + this.state.sem);
        var acad_yr = this.refs.myacad_yr.value;
        var sem = this.refs.mysem.value;
        var category = this.refs.category.value;
        var code = this.state.course_code_selected;
        console.log("\nCODE FROM AUTOSUGGEST: "+code);
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
        
        // validate before request for update
        var updating_week = [];
        for (var i=parseInt(this.refs.start_week.value); i<=parseInt(this.refs.end_week.value); i++){
            updating_week.push(i);
        }

        var schedule = this.state.course.schedule.find(ele => ele.group == this.refs.group.value);

        if (schedule.unscheduled_weeks != null && updating_week.every(ele => schedule.unscheduled_weeks.indexOf(ele) > -1)) {
            var week = schedule.unscheduled_weeks.filter(ele => updating_week.indexOf(ele)<0);
            var scheduled_weeks = schedule.scheduled_weeks.find(e => e.assignee == this.state.prof_initial_selected_for_update);
            if (scheduled_weeks != null) {
                updating_week = updating_week.concat(scheduled_weeks.week);
            }
            var requestBody = {};
            requestBody.acad_yr = this.state.course.acad_yr;
            requestBody.sem = this.state.course.sem;
            requestBody.category = this.refs.category.value;
            requestBody.code = this.state.course.code;
            requestBody.type = this.state.course.type;
            requestBody.group = this.refs.group.value;
            requestBody.week = updating_week;
            requestBody.name = this.state.prof_initial_selected_for_update;

            // reference -> https://stackoverflow.com/questions/31087237/mongodb-pull-unset-with-multiple-conditions
            requestBody.weeks = week;
            
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
                    console.log("Updated Course: \n" + this.state.course);
                } else {
                    alert('No record found in database, please try again.');
                    return false;
                }
            });
        } 
        else {
            alert('The weeks you seleted are not all available to update, please try again.');
            return false;
        }
    }
    handleHandover(event){
        event.preventDefault();
        // validate before request for update
        var updating_week = [];
        for (var i=parseInt(this.refs.newstart_week.value); i<=parseInt(this.refs.newend_week.value); i++){
            updating_week.push(i);
        }

        var schedule = this.state.course.schedule.find(ele => ele.group === this.refs.newgroup.value);

        if (schedule.unscheduled_weeks == null || updating_week.every(ele => schedule.unscheduled_weeks.indexOf(ele)<0)) {
            var affected_assign = schedule.scheduled_weeks.filter(ele => ele.week.some(e => updating_week.indexOf(e)>-1));            
            affected_assign.forEach(assign => {
                var w = assign.week;
                for (var i=0; i<w.length; i++){
                    if(updating_week.indexOf(w[i])>-1){
                        // set to 0 temporarily and delete later
                        w[i] = 0;
                    }
                }

                // delete elements with value = 0 from week array 
                for(var i=w.length-1; i>=0; i--) {
                    if(w[i] === 0) {
                       w.splice(i, 1);
                    }
                }
                console.log("updated weeks \n" + JSON.stringify(w));
            });
            console.log("affected_assign \n" + JSON.stringify(affected_assign));

            // update the [course] and [prof] db schema with affected profile  
            var affected_prof = Array.from(new Set(affected_assign.map(e => e.assignee)));
            affected_prof.push(this.state.prof_initial_selected_for_handover);

            var find_schedule = schedule.scheduled_weeks.find(e => e.assignee === this.state.prof_initial_selected_for_handover);
            var updated_week = [];
            if(find_schedule!=undefined){
                var existing_week = find_schedule.week;
                updated_week = updating_week.concat(existing_week);
            } else {
                updated_week = updating_week;
            }

            affected_assign.push({'assignee': this.state.prof_initial_selected_for_handover, 'week': updated_week});

            affected_prof.forEach(prof => {
                var requestBody = {};
                var scheduled_weeks = affected_assign.find(e => e.assignee === prof);
                console.log(scheduled_weeks);
                if (!scheduled_weeks.hasOwnProperty('week')){
                    scheduled_weeks.week = [];
                }
            
                requestBody.name = prof;
                requestBody.acad_yr = this.state.course.acad_yr;
                requestBody.sem = this.state.course.sem;
                requestBody.code = this.state.course.code;
                requestBody.type = this.state.course.type;
                requestBody.category = this.refs.category.value;
                requestBody.group = this.refs.newgroup.value;
                requestBody.week = scheduled_weeks.week; // updated 
                fetch('/api/courses/handover', {
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
                        console.log("Updated Course - Final \n" + JSON.stringify(json));
                    } else {
                        alert('Error occurred when updating database, please try again.');
                        return false;
                    }
                });
            });
        } else {
            alert('The weeks you seleted are not all available to handover, please try again.');
            return false;
        }
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
                var length_for_calc = weekday[day].length;
                thc.push(
                    <TableHeaderColumn row='0' csvHeader={day} colSpan={weekday[day].length} headerAlign='center' dataAlign='center' width='110px'>{day}</TableHeaderColumn>
                )
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

        return (
            <div className='board'>
                <div>
                    <h1> Find Timeslots</h1>
                    <form id="search" className="form-group" onSubmit={this.handleSubmit}>
                        <label>Enter academic year</label>
                        <input className="form-control" type="text" ref="myacad_yr" placeholder="e.g.2018" onChange={this.handleYearChange} required />
                        <label>Enter semester</label>
                        <select ref="mysem" onChange={this.handleSemSelected} required>
                            <option value="1">semester 1</option>
                            <option value="2">semester 2</option>
                        </select>
                        <label>Enter a course code </label>
                        <Autosuggest_Course courses={this.state.course_list_for_search} handleSuggestSelected={this.handleSuggestSelected}/>
                        <label>Enter a class type </label>
                        <select ref="mytype" required>
                            <option value="LEC">Lecture</option>
                            <option value="TUT">Tutorial</option>
                            <option value="LAB">Laboratory</option>
                        </select>
                        <label>Enter the category: </label>
                        <select ref="category" required>
                            <option value="fulltime">Full Time</option>
                            <option value="parttime">Part Time</option>
                        </select>
                        <input className="form-control" type="submit" value="Find Timeslots" />
                    </form>
                </div>
                <div style={myupdate ? null : { display: 'none' }}>
                    {/* <div className="col-md-3"> */}
                    <div id="assign">
                        <h1>Update Teaching Assignment</h1>
                        <form className="form-group" onSubmit={this.handleUpdate}>
                            <label>Enter a course group </label>
                            <select ref="group" required>
                                {grp_list.map((value, index) => <option key={index} value={value}>{value}</option>)}
                            </select>
                            <label>Assign the teaching weeks From </label>
                            <input className="form-control" type="text" ref="start_week" placeholder="e.g.1" required />
                            <label>To</label>
                            <input className="form-control" type="text" ref="end_week" placeholder="e.g.7" required />
                            <label>Assign a teaching staff name </label>
                            <Autosuggest_Prof profs={this.state.prof_list_for_search} handleSuggestSelected={this.handleSuggestSelected_update}/>
                            <input className="form-control" type="submit" value="Assign a teaching staff" />
                        </form>
                    </div>
                    <div id="handover">
                        <h1>Handover Assignment</h1>
                        <form className="form-group" onSubmit={this.handleHandover}>
                            <label>Enter a course group </label>
                            <select ref="newgroup" required>
                                {grp_list.map((value, index) => <option key={index} value={value}>{value}</option>)}
                            </select>
                            <label>Handover the teaching weeks <br/> From </label>
                            <input className="form-control" type="text" ref="newstart_week" placeholder="e.g.1" required />
                            <label>To</label>
                            <input className="form-control" type="text" ref="newend_week" placeholder="e.g.7" required />
                            <label>Assign a new teaching staff name </label>
                            <Autosuggest_Prof profs={this.state.prof_list_for_search} handleSuggestSelected={this.handleSuggestSelected_handover}/>
                            <input className="form-control" type="submit" value="Assign a teaching staff" />
                        </form>
                    </div>
                    {/* <div className="col-md-9" id="table"> */}
                    <div id="table">
                        <h1>{mycourse.code}</h1>
                        <h1>Academic Year {mycourse.acad_yr} &nbsp; &nbsp; Semester {mycourse.sem}</h1>
                        <h1>Teaching Assignment Form - {mycourse.type}</h1>
                        <div id='table-container'>
                            <BootstrapTable ref='tab' data={input} options={options} selectRow={selectRow} cellEdit={cellEditProp} keyField='id' exportCSV>
                            {thc}
                            </BootstrapTable>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FindTimeSlots;