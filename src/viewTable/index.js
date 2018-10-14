import React, { Component } from 'react';
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

let sample_lec ={
    id: 1,
    acad_yr: 2018,
    sem: 1,
    code: "EE4483",
    type:"LEC", 
    schedule: [
        {         
            group: "LE",
            slots: [
                {
                    _id: 1,
                    teaching_weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13],
                    day: "T",            
                    start_time: "1030",
                    end_time: "1130",
                    venue: "LT28",
                    scheduled_weeks: [{
                        _id: 11,
                        week: [1,2,3,4,5,6,7],
                        assginee: 'CLH',
                    },
                    {
                        _id: 12,
                        week: [8,9,10,11,12,13],
                        assginee: 'TYP',
                    }]
                },
                {
                    _id: 2,
                    teaching_weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13],
                    day: "F",            
                    start_time: "1030",
                    end_time: "1130",
                    venue: "LT29",
                    scheduled_weeks: [{
                        _id: 21,
                        week: [1,2,3,4,5,6,7],
                        assginee: 'CLH',
                    },
                    {
                        _id: 22,
                        week: [8,9,10,11,12,13],
                        assginee: 'TYP',
                    }]
                }
            ]
        }
    ]
}

let sample_tut = {
    acad_yr: 2018,
    sem: 1,
    code: "EE4483",
    type:"TUT", 
    schedule: [
	    {   
            group: "FC1",   
            slots: [{
                _id: 1,
                teaching_weeks: [2,3,4,5,6,7,8,9,10,11,12,13],
                day: "M",
                start_time: "1330",
                end_time: "1430",            
		        venue: "TR+94"
            }]       
            
   	    },
	    {
            group: "FC2",   
            slots: [{
                _id: 2,
                teaching_weeks: [2,3,4,5,6,7,8,9,10,11,12,13],
                day: "T",
                start_time: "1530",
                end_time: "1630",            
		        venue: "TR+88"
            }]  
        },
		{      
            group: "FC3",   
            slots: [{
                _id: 3, 
                teaching_weeks: [2,3,4,5,6,7,8,9,10,11,12,13],
                day: "W",
                start_time: "1430",
                end_time: "1530",            
		        venue: "TR+95"
            }]   
        },
		{      
            group: "FC4",   
            slots: [{
                _id: 4,
                teaching_weeks: [2,3,4,5,6,7,8,9,10,11,12,13],
                day: "TH",
                start_time: "1430",
                end_time: "1530",            
		        venue: "TR+96"
            }]   
        },
		{       
            group: "FC5",   
            slots: [{
                _id: 5,
                teaching_weeks: [2,3,4,5,6,7,8,9,10,11,12,13],
                day: "F",
                start_time: "1430",
                end_time: "1530",            
		        venue: "TR+94"
            },
            {
                _id: 6,
                teaching_weeks: [2,3,4,5,6,7,8,9,10,11,12,13],
                day: "F",
                start_time: "1630",
                end_time: "1730",            
		        venue: "TR+96"
            }]   
        }
    ]
}

class ViewTable extends Component {

    render() {
        let input_tut = [];
        for (var i=1; i<14; i++) { 
            input_tut.push({id:i});
        }

        var weekday = {
            MON:[],
            TUE:[],
            WED:[],
            THU:[],
            FRI:[]
        };
        
        sample_lec.schedule.map(schedule => {
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
                    input_tut[w-1][grp_name]='NOT AVAILABLE';
                });
                
                if (typeof(slot.scheduled_weeks)!=='undefined'){
                    slot.scheduled_weeks.map(schedule => {
                        var assginee = schedule.assginee;
                        schedule.week.map( w => {
                            input_tut[w-1][grp_name]=assginee;
                        });
                    });
                } 
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
            <div>
            <h3>{sample_tut.acad_yr +' '+ sample_tut.code +' '+ sample_tut.type}</h3>
            <BootstrapTable ref='tab' data={input_tut} options={options} selectRow={selectRow} cellEdit={cellEdit} keyField='id'
                insertRow deleteRow exportCSV>
                {thc}
            </BootstrapTable>
            </div>
        );
    }
}

export default ViewTable