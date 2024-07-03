const prompt = require('prompt-sync')();
const csv = require('csv-parse');
const fs = require('fs');

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
const calendar = [];
const calendar_dates = [];
let routes = [];
let stop_times = [];
const stops = [];
let trips = [];

/*
This function read the CSV File
@path:the path of csv file
@return:the content of csv file in string format
*/
function read_file(path) { 
return fs.readFileSync(path, 'utf8');
}

/*
This function use csv parser to convert csv stings into array
@cv: the string in csv format
@records:the array to reveal a csv file
*/
function csv_par(cv, records) {
return new Promise((resolve) => csv.parse(cv, {delimiter:",",
columns:true}
).on('readable', function(){
    let record; while ((record = this.read()) !== null) {
      records.push(record);
    }
  }).on('end', function(){resolve()}))
}


async function main() {

let calendarr = read_file(path[0]);
let calendar_datess = read_file(path[1]);
let routess = read_file(path[2]);
let timess = read_file(path[3]);
let stopss = read_file(path[4]);
let tripss = read_file(path[5]);
await(csv_par(calendarr,calendar), csv_par(calendar_datess,calendar_dates), 
csv_par(routess,routes), csv_par(timess,stop_times), csv_par(stopss,stops), 
csv_par(tripss,trips));//convert all needed csv file into array
const UQ_stop = stops.filter(stop => stop.stop_name.includes("UQ Lakes"));
const UQ_id = UQ_stop.map(stop => stop.stop_id);//get the stop_id of uq stations

routes = routes.filter(r => rout.includes(r.route_short_name)).map(r => {return {route_id:r.route_id, 
    route_short_name:r.route_short_name, route_long_name:r.route_long_name}})
trips = trips.map(t => {
    return {route_id:t.route_id, service_id:t.service_id, trip_id: t.trip_id, 
        trip_headsign:t.trip_headsign}});
stop_times = stop_times.filter(time => UQ_id.includes(time.stop_id)).map(r => {return {trip_id:r.trip_id, 
    arrival_time:r.arrival_time, departure_time:r.departure_time, stop_id:r.stop_id}});
stop_times = stop_times.map (time => {
    if(time.arrival_time == null) {
        time.arrival_time = time.departure_time;
    } return time;
})//if arrival time is null, let it equal to departure time.
//detete some useless attributes and use uq stations'id filter out the tuple will be used. 

var check = "yes";
console.log(Welcome_message);
while (check != "no" && check != "n") {
    var date = prompt(first_Q);
    while(check_date(date) == false) {
        console.log(first_err);
        date = prompt(first_Q);

}   
    let time = prompt(second_Q);
    while(check_time(time) == false) {
        console.log(second_err);
        time = prompt(second_Q);
    }
    console.log("1 - show all routes\n2 - 66\n3 - 192\n4 - 169\n5 - 209\n6 - 29\n7 - P332\n8 - 139\n9 - 28");
    
    var route = prompt(three_Q);
    if (check_route(route) == false) {
        console.log(three_err);
    } else {ans (date,time,route);}
    check = prompt(four_Q);
    while(check_check(check) == false) {
        console.log(four_err);
        check = prompt(four_Q);
    }
}
console.log(final);//the code above is about user prompt and output

/*
check the format of date input by user
@date: user input
@return:true if in the correct format YY:MM:DD or false.
*/
function check_date(date) {
    let a = date.split("-");
    if(a.length == 3) {
        if(a[0].length == 4 && a[1].length == 2 && a[2].length == 2) {
            let b = a[0] + a[1] + a[2];
            if(b.split("").every(char => !isNaN(char))) {
                c = parseInt(a[1]);
                d = parseInt(a[2]);
                if (c > 0 && c <= 12 && d >= 1 && d <= 31) {
                    return true;
                }
             }
        }
    }
    return false;
}

/*
this function check the format of time input by user
@time:user input
@return:return true if user input in format HH:mm, or return false
*/
function check_time(time) {
    let a = time.split(":");
    if (a.length == 2) {
        if (a[0].length == 2 && a[1].length == 2) {
            let b = a[0] + a[1];
            if(b.split("").every(char => !isNaN(char))) {
                c = parseInt(a[0]);
                d = parseInt(a[1]);
                if (c >= 0 && c <= 24 && d >= 0 && d <= 59) {
                    return true;
                }
            }
        }
    }
    return false;
}

/*
check the format of option of route input by user
@route:the route option input by user
@return:true if the input is between 1-9, or false
*/
function check_route(route) {
    a = ["1", '2', '3', '4', '5', '6', '7', '8', '9'];
    if(a.includes(route)) {
        return true;
    }
    return false;
}

/*
check the format of yes and no answered by user
@check:user input
@return:true if the input is in [y,n,yes,no], or false
*/
function check_check(check) {
    if (check == "yes" || check =="no" || check == "n" || check == "y") {
        return true;
    }
    return false;
}
}

/*
this function capture the user input, use some methods to output the answer
@date,time,route: the user input
@return:nothing,but will print out a table, which is the answer
*/
function ans(date,time,route) {
let answer = [];
let ro = routes;

if (route != "1") {
    let option = parseInt(route);
    option = option - 1;
    route = rout[option]
   
    ro = routes.filter(r => r.route_short_name == route);
}//convert the route option into route


let tmerger = merge(trips, ro, "route_id")
let smergetr = merge(stop_times, tmerger, "trip_id")
let final_merge = merge(smergetr, calendar, "service_id");
//merge mutiple csv array to get a array which contain all needed information
final_merge = final_merge.filter(t => time_check(time, t.arrival_time)); 
//check time to filter out some tuples

final_merge = final_merge.filter(t => date_check(date, t.start_date, 
    t.end_date, t.monday, t.tuesday, t.wednesday, t.thursday, t.friday,
    t.saturday, t.sunday, t.service_id));//check date to filter out some tuples
final_merge = final_merge.map(tuple => {return {
    "Route short name":tuple.route_short_name,
    "Route long name":tuple.route_long_name, 
    "Service ID":tuple.service_id, "Heading Sign":tuple.trip_headsign,
    "Scheduled Arrival Time": tuple.arrival_time, 
    "Live Arrival Time":"No Live Data", "Live Position":"No Live Data"}})
console.table(final_merge)//output answer

/*
according to the time input by user, if the A_time is in 10 min return true.
@time:the time input by user
@A_time:bus arrival time
@return:true if arrival within 10 min of the user input or false
*/
function time_check(time, A_time) {
    let t = time.split(":")
    let t2 = A_time.split(":");
    let time1 = new Date();
    time1.setHours(parseInt(t[0]),parseInt(t[1]))
    let time2 = new Date();
    time2.setHours(parseInt(t[0]), parseInt(t[1]) + 10);
    let time3 = new Date();
    time3.setHours(parseInt(t2[0]), parseInt(t2[1]));

    if (time3 >= time1 && time3 <= time2) {
        return true;
    } else {
        return false;
    }
}

/*
merge two array
@a:array a
@b:array b
@common: their common header, like foreign key
@return: merged array
*/
function merge(a, b, com) {
    return a.map(tuple1 => {
    let relate = b.find(tuple2 => tuple1[com] == tuple2[com]); 
    
    if (relate) {
        let {[com]:removed, ...rest} = relate;
        return {...tuple1, ...rest}
    } else { return null; }
    }).filter(tuple3 => tuple3 != null);
}

/*
check if the bus server on the specific date
@date: user input
@start_date: the start_date of bus service
@end_date: the end_day of bus service
@mon - sun: 1 if bus run on that day(monday...), or 0
@service_id: the service id, mainly used in calendar.txt and calendar_date.txt
@return: true if bus run on that date or false
*/
function date_check(date, start_date, end_date, mon, tue, wen, thu, fri, sat, sun, service_id) {
    let d = date.split("-");
    let d1 = d.join("");
    let status =true;
    let week_to_compare;
    let date1 = new Date(parseInt(d[0]),parseInt(d[1]) - 1, parseInt(d[2]));// change string format into date
    const week = date1.getDay();
    if (week == 0) {
        week_to_compare = sun;
    } else if (week == 1) {
        week_to_compare = mon;
    } else if (week == 2) {
        week_to_compare = tue
    } else if (week == 3) {
        week_to_compare == wen;
    } else if (week == 4) {
        week_to_compare = thu
    } else if (week == 5) {
        week_to_compare == fri
    } else if (week == 6) {
        week_to_compare = sat
    }//get the day(Monday...) of user input
    let start = convert_Date(start_date);
    let end = convert_Date(end_date);
    if (date1 >= start && date1 <= end && week_to_compare == "1") {
        status = true;
    } else {
        status = false;
   }
    h = calendar_dates.find(dat => dat.service_id == service_id && dat.date == d1);
    if (h) {
        if (h.exception_type == "2") {
            status = false
        } else if (h.exception_type == "1") {
            status = true;
        } //check excpetion
    }
    return status;
}

/*
convert date string into Date()
@date:date string like 20230909
@return: a new Date()
*/
function convert_Date(date) {
    let year = parseInt(date.substring(0,4));
    let month = parseInt(date.substring(4,6)) - 1;
    let day = parseInt(date.substring(6,8));
    let d = new Date(year,month,day);
    return d;
}
}
main();