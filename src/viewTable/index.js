import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const options = {
   // exportCSVText: 'export to csv',
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
                    teaching_weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13],
                    day: "T",            
                    start_time: "1030",
                    end_time: "1130",
                    venue: "LT28"
                },
                {
                    teaching_weeks: [1,2,3,4,5,6,7,8,9,10,11,12,13],
                    day: "F",            
                    start_time: "1030",
                    end_time: "1130",
                    venue: "LT29"
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
                id: 6,
                teaching_weeks: [2,3,4,5,6,7,8,9,10,11,12,13],
                day: "F",
                start_time: "1630",
                end_time: "1730",            
		        venue: "TR+96"
            }]   
        }
    ]
}

// re-format data into input type for bootstraptable
let input_tut = [];
for (var i=1; i<14; i++) { 
    input_tut.push({id:i});
}

let input =[
    {id:1, tc01:'JCC', tc02: 'ZYP', tc03:'GBH', tc04: 'LWL', tc05:'ZYP', tc06:'LKT', tc07:'CCH'},
    {id:2, tc01:'JCC', tc02: 'ZYP', tc03:'GBH', tc04: 'LWL', tc05:'ZYP', tc06:'LKT', tc07:'CCH'},
    {id:3, tc01:'JCC', tc02: 'ZYP', tc03:'GBH', tc04: 'LWL', tc05:'ZYP', tc06:'LKT', tc07:'CCH'},
]

// construct bootstraptable html 
let group = [];


class ViewTable extends Component {

    render() {
        var weekday = {
            MON:[],
            TUE:[],
            WED:[],
            THU:[],
            FRI:[]
        };
        
        sample_tut.schedule.map(schedule => {
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
            });
        });
        var thc =[];
        thc.push(
            <TableHeaderColumn row='0' dataField='id' rowSpan='2'>Teaching<br />Week</TableHeaderColumn>
        );
        Object.keys(weekday).map(day => {
            if (weekday[day].length>0){
                thc.push(
                    <TableHeaderColumn row='0' csvHeader={day} colSpan={weekday[day].length}>{day}</TableHeaderColumn>
                )
                weekday[day].map(slot => {
                    var time = slot.time;
                    var grp = slot.group;
                    var venue = slot.venue;
                    var header = time + ' ' + grp + ' ' + venue;
                    console.log(header);
                    thc.push (
                        <TableHeaderColumn row='1' csvHeader={header}>{time}<br />{grp}<br />{venue}</TableHeaderColumn>
                    );
                });
            }
            
        });
        return (
            <div>
            <BootstrapTable ref='tab' data={input_tut} options={options} selectRow={selectRow} cellEdit={cellEdit} keyField='id'
                insertRow deleteRow>
                {thc}
            </BootstrapTable>
            </div>
        );
    }
}

/*
class ViewTable extends Component {
    render() {
        return (
            <BootstrapTable ref='table1' data={input} options={options} selectRow={selectRow} cellEdit={cellEdit}
                insertRow deleteRow exportCSV>
                <TableHeaderColumn row='0' isKey dataField='id' rowSpan='2' csvHeader='Teaching Week'>Teaching<br />Week</TableHeaderColumn>
                <TableHeaderColumn row='0' csvHeader='MON'>MON</TableHeaderColumn>
                <TableHeaderColumn row='1' csvHeader='1030-1230 TC01 TR+67' dataField='tc01'>1030-1230<br />TC01<br />TR+67</TableHeaderColumn>
                <TableHeaderColumn row='0' csvHeader='TUE' colSpan='3'>TUE</TableHeaderColumn>
                <TableHeaderColumn row='1' csvHeader='TC02' dataField='tc02'>0930-1130<br />TC02<br />TR+67</TableHeaderColumn>
                <TableHeaderColumn row='1' csvHeader='TC03' dataField='tc03'>1330-1530<br />TC03<br />TR+67</TableHeaderColumn>
                <TableHeaderColumn row='1' csvHeader='TC04' dataField='tc04'>1530-1730<br />TC04<br />TR+67</TableHeaderColumn>
                <TableHeaderColumn row='0' csvHeader='WED'>WED</TableHeaderColumn>
                <TableHeaderColumn row='1' csvHeader='TC05' dataField='tc05'>1030-1230<br />TC05<br />TR+67</TableHeaderColumn>
                <TableHeaderColumn row='0' csvHeader='THUR'>THUR</TableHeaderColumn>
                <TableHeaderColumn row='1' csvHeader='TC06' dataField='tc06'>1030-1230<br />TC06<br />TR+67</TableHeaderColumn>
                <TableHeaderColumn row='0' csvHeader='FRI'>FRI</TableHeaderColumn>
                <TableHeaderColumn row='1' csvHeader='TC07' dataField='tc07'>1030-1230<br />TC07<br />TR+67</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}
*/

export default ViewTable