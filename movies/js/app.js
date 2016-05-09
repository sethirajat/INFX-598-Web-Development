/**
 * app.js
 * main application script for the movies challenge
 * add code here to calculate the various metrics
 * required by the challenge, and add them to the
 * tables already created in index.html
 * the array of movies is available via the global
 * variable `movies` (see data/movies-2015.js)
 */
"use strict";
// calculating average gross sales for each distinct genre
var distinctGenres = {};

function addgenre(record) {
    var stats = distinctGenres[record.genre];
    if (stats == undefined) {
        stats = {sum:0, count:0, average: 0};
        distinctGenres[record.genre] = stats;
    }
    
    stats.sum += record.gross;
    stats.count++;
    stats.average = stats.sum/stats.count;
}

movies.forEach(addgenre);
// Sorting the newly created object distinctGenres according to average gross sales
function comparebyaveragegross(rec1,rec2) {
    var stat1 = distinctGenres[rec1];
    var stat2 = distinctGenres[rec2];
    return stat2.average - stat1.average; 
    
}

var genre_keys = Object.keys(distinctGenres);
genre_keys.sort(comparebyaveragegross);




// create elements to display
var tbody = document.querySelector("#gross-genre");


function createTableCell(value) {
    var td = document.createElement("TD");
    td.textContent = value;
    return td;
}


function  addRow(record) {
    var tr = document.createElement("TR");
    tr.appendChild(createTableCell(record));
    var currency_string = numeral(distinctGenres[record].average).format('$0,0.00');
    var td_avg = createTableCell(currency_string);
    td_avg.style.textAlign = "right";
    tr.appendChild(td_avg);
    //tr.appendChild(createTableCell(currency_string));
    
    tbody.appendChild(tr);
}

genre_keys.forEach(addRow);

// These are the extra credit steps below

var distinctRatings = {};

function addrating(record) {
    var stats = distinctRatings[record.rating];
    if (stats == undefined) {
        stats = {sum:0, count:0, average: 0};
        distinctRatings[record.rating] = stats;
    }
    
    stats.sum += record.tickets;
    stats.count++;
    stats.average = stats.sum/stats.count;
}

movies.forEach(addrating);
// Sorting the newly created object distinctRatings according to average ticket sales
function comparebyaveragetickets(rec1,rec2) {
    var stat1 = distinctRatings[rec1];
    var stat2 = distinctRatings[rec2];
    return stat2.average - stat1.average; 
    
}

var rating_keys = Object.keys(distinctRatings);
rating_keys.sort(comparebyaveragetickets);




// create elements to display
var tbody1 = document.querySelector("#tickets-rating");

function  addRow1(record) {
    var tr = document.createElement("TR");
    tr.appendChild(createTableCell(record));
    var ticket_string = numeral(distinctRatings[record].average).format('0,0');
    var ticket_avg = createTableCell(ticket_string);
    ticket_avg.style.textAlign = "right";
    tr.appendChild(ticket_avg);
        
    tbody1.appendChild(tr);
}

rating_keys.forEach(addRow1);



