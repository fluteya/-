var prompt = require('prompt-sync')();
var fs = require('fs');
const { List } = require('immutable');
const { parse } = require('csv-parse');
const { finished } = require('stream');
const { resolve } = require('path');

const Welcome_message = "Welcome to the UQ Lakes station bus tracker!";
const first_Q = "What date will you depart UQ Lakes station by bus?";
const first_err = "Incorrect date format. Please use YYYY-MM-DD";
const second_Q = "What time will you depart UQ Lakes station by bus?";
const second_err ="Incorrect time format. Please use HH:mm";
const three_Q = "What Bus Route would you like to take?";
const three_err = "Please enter a valid option for a bus route.";
const four_Q = "Would you like to search again?";
const four_err = "Please enter a valid option.";
const final = "Thanks for using the UQ Lakes station bus tracker!";
const path = ['static-data/calendar.txt','static-data/calendar_dates.txt','static-data/routes.txt','static-data/stop_times.txt','static-data/stops.txt','static-data/trips.txt']
const rout = ["Show All Routes", '66', '192', '169', '209', '29', 'P332', '139', '28'];
const calendar = [1];
const immu_calendar = List(calendar);
const test = List([...immu_calendar,2]);
const calendar_dates = [];
const routes = [];
const stop_times = [];
const stop = [];
const trips = [];
//console.log(test);P
function get_data(file_name) {
    //try {
    return new Promise((resolve) =>{
        const data =  fs.createReadStream(file_name);
        var records = [];
        let parser = data.pipe(parse({}));
        parser.on('readable',function() { 
            let record;
            while ((record = parser.read()) !== null) {
                records.push(record);
            }
           
        }
    );
    parser.on('end',function(){ resolve(records)});
});}
        
        
  //  }
   // catch{
     //   console.log("wrong file_name")
    //}
    get_data("static_data/calendar.txt").then((data)=>console.log(data));
    
    

//console.log(records);