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
   

class ViewTable extends Component {
    render() {
        return (
            <BootstrapTable data={course} options={options} selectRow={selectRow} cellEdit={cellEdit}
                insertRow deleteRow exportCSV>
                <TableHeaderColumn isKey dataField='id' rowSpan='4'>Course ID</TableHeaderColumn>
                <TableHeaderColumn row='0'>MON</TableHeaderColumn>
                <TableHeaderColumn row='1'>1030-1230</TableHeaderColumn>
                <TableHeaderColumn row='2'>TC01</TableHeaderColumn>
                <TableHeaderColumn row='3'>TR+67</TableHeaderColumn>
                <TableHeaderColumn row='0' colSpan='3'>TUE</TableHeaderColumn>
                <TableHeaderColumn row='1'>0930-1130</TableHeaderColumn>
                <TableHeaderColumn row='2'>TC02</TableHeaderColumn>
                <TableHeaderColumn row='3'>TR+67</TableHeaderColumn>
                <TableHeaderColumn row='1'>1330-1530</TableHeaderColumn>
                <TableHeaderColumn row='2'>TC03</TableHeaderColumn>
                <TableHeaderColumn row='3'>TR+67</TableHeaderColumn>
                <TableHeaderColumn row='1'>1530-1730</TableHeaderColumn>
                <TableHeaderColumn row='2'>TC04</TableHeaderColumn>
                <TableHeaderColumn row='3'>TR+67</TableHeaderColumn>
                <TableHeaderColumn row='0'>WED</TableHeaderColumn>
                <TableHeaderColumn row='1'>1030-1230</TableHeaderColumn>
                <TableHeaderColumn row='2'>TC05</TableHeaderColumn>
                <TableHeaderColumn row='3'>TR+67</TableHeaderColumn>
                <TableHeaderColumn row='0'>THUR</TableHeaderColumn>
                <TableHeaderColumn row='1'>1030-1230</TableHeaderColumn>
                <TableHeaderColumn row='2'>TC06</TableHeaderColumn>
                <TableHeaderColumn row='3'>TR+67</TableHeaderColumn>
                <TableHeaderColumn row='0'>FRI</TableHeaderColumn>
                <TableHeaderColumn row='1'>1030-1230</TableHeaderColumn>
                <TableHeaderColumn row='2'>TC07</TableHeaderColumn>
                <TableHeaderColumn row='3'>TR+67</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

export default ViewTable