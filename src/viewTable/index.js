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

var course = [
    {
        id: 1,
        acad_yr: 2018,
        "sem": 1,
        code: "EE4483",
        "type":"LEC", 
        "schedule": [
            {         
                    "group": "LE",
                    "slots": [
                        {
                            "teaching_weeks": [1,2,3,4,5,6,7,8,9,10,11,12,13],
                            "day": "T",            
                            "start_time": "1030",
                            "end_time": "1130",
                            "venue": "LT28"
                        },
                        {
                            "teaching_weeks": [1,2,3,4,5,6,7,8,9,10,11,12,13],
                            "day": "F",            
                            "start_time": "1030",
                            "end_time": "1130",
                            "venue": "LT29"
                        }
                    ]
            }
        ]
    },
]


var input =[
    {id:1, tc01:'JCC', tc02: 'ZYP', tc03:'GBH', tc04: 'LWL', tc05:'ZYP', tc06:'LKT', tc07:'CCH'},
    {id:2, tc01:'JCC', tc02: 'ZYP', tc03:'GBH', tc04: 'LWL', tc05:'ZYP', tc06:'LKT', tc07:'CCH'},
    {id:3, tc01:'JCC', tc02: 'ZYP', tc03:'GBH', tc04: 'LWL', tc05:'ZYP', tc06:'LKT', tc07:'CCH'},
]
   

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

export default ViewTable