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
            course: { schedule: [] }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        event.preventDefault();
        var code = this.refs.code.value;
        var type = this.refs.type.value;

        fetch('/api/courses?code=' + code + '&type=' + type).then(function (data) {
            return data.json();
        }).then(json => {
            this.setState({
                course: json
            });
        });
    }

    render() {
        var mycourse = this.state.course;

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
                        break;
                }

                var not_available = [1,2,3,4,5,6,7,8,9,10,11,12,13].filter(e => !slot.teaching_weeks.includes(e));

                not_available.forEach (w => {
                    input[w-1][grp_name]='NOT AVAILABLE';
                });

                slot.scheduled_weeks.forEach(scheduling => {
                    var assigneed_prof = scheduling.assignee;
                    scheduling.week.forEach( w => {
                        input[w-1][grp_name]=assigneed_prof;
                    }); 
                });
            });
        });

        var thc =[];
        thc.push(
            <TableHeaderColumn row='0' dataField='id' rowSpan='2' csvHeader='Teaching Week' headerAlign='center' dataAlign='center'>Teaching<br />Week</TableHeaderColumn>
        );

        Object.keys(weekday).forEach(day => {
            if (weekday[day].length>0){
                thc.push(
                    <TableHeaderColumn row='0' csvHeader={day} colSpan={weekday[day].length} headerAlign='center' dataAlign='center'>{day}</TableHeaderColumn>
                )
                weekday[day].forEach(slot => {
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
            <div id="course-container">
                <div className="col-md-3">
                    <h1> Find Timeslots</h1>
                    <form id="search" className="form-group" onSubmit={this.handleSubmit}>
                        <label>Enter a course code </label>
                        <input className="form-control" type="text" ref="code" placeholder="e.g.EE4483" required />
                        <label>Enter a class type </label>
                        <input className="form-control" type="text" ref="type" placeholder="e.g.LEC" required />
                        <input className="form-control" type="submit" value="Find Timeslots" />
                    </form>
                </div>
                <div className="col-md-9">
                    <h1>{mycourse.acad_yr} {mycourse.code} {mycourse.type}</h1>
                    <BootstrapTable ref='tab' data={input} options={options} selectRow={selectRow} cellEdit={cellEdit} keyField='id'
                        insertRow deleteRow exportCSV>
                    {thc}
                    </BootstrapTable>
                </div>
            </div>
        );
    }
}

export default FindTimeSlots;
