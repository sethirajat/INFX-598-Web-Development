"Use strict";

var mymap = L.map('map').setView([47.6062, -122.3321], 13);
// This is the url for getting the most recent 911 dispatches
var SourceUrl = "https://data.seattle.gov/resource/grwu-wqtk.json?$where=datetime is not null&$order=datetime desc&$limit=500"

// Extending the Icon class to create our own class of icons
// Extra credit step
var CrimeIcon = L.Icon.extend({
    options: {
        iconSize:     [38, 50],
        shadowSize:   [20, 35],
        iconAnchor:   [22, 94],
        popupAnchor:  [-3, -76]
    }
});

// Creating custom icons for using as markers in different dispatch types. 
var fireIcon = new CrimeIcon({iconUrl: 'images/fire.png'});
var ambulanceIcon = new CrimeIcon({iconUrl: 'images/ambulance.png'});
var firstaidIcon = new CrimeIcon({iconUrl: 'images/firstaid.png'});
var crimesceneIcon = new CrimeIcon({iconUrl: 'images/crimescene.png'});

// function to fetch data from the site
function Getdata() {
    jQuery.getJSON(SourceUrl)
        .then(onSearchResults, onSearchError);
}

Getdata();
// refreshing the data every 1 minute.
// extra credit step
nIntervId = setInterval(Getdata, 60000);

        
function onSearchResults(data) {
    console.log(data[0]);
    data.forEach(addMarker);
    
}

function addMarker(obj) {
    
    //console.log(obj);
    popString = "ADDRESS: " + obj.address + "\n, DATE and TIME: " + obj.datetime + "\n, TYPE OF DISPATCH: " + obj.type;
    var icon_to_use;
    // choosing the icon based on dispatch type
    switch (obj.type) {
        case "Medic Response":
            icon_to_use = ambulanceIcon;
            break;
        case "Auto Fire Alarm":
        case "Fire in Building":
            icon_to_use = fireIcon;
            break;
        case "Aid Response":
            icon_to_use = firstaidIcon;
            break;
        default:
            icon_to_use = crimesceneIcon;
    }
    // some of the records did not have coordinates, like a dumpster fire. Not adding
    // markers for such dispatches
    if (obj.latitude != null){
        createMarker(obj.latitude, obj.longitude, popString, icon_to_use);
    }
    
}

function createMarker(lat, long, pop, icn) {
    var marker = L.marker([lat, long], {icon: icn }).addTo(mymap);
    marker.bindPopup(pop);
    //console.log(lat);
}

function onSearchError(response) {
    alert(response.responseJSON.error.message);
    //console.log(response);
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicmFqYXRzZXRoaSIsImEiOiJjaW9kbGEwZWMwMDlidWRtM3RrazVmcXNrIn0.d4U5h0TgvHNuH0j2J_eDzw'
}).addTo(mymap);

function onGetPos(position) {
    addhomemarker(position.coords.latitude, position.coords.longitude);
}

function onErrorPos(err) {
    //console.log(err)
    addhomemarker();
}
// asking for users geolocation
//Extra credit
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(onGetPos, onErrorPos);
}
else {
    addhomemarker();
}

// this is a function to add a marker at the users location if the user agrees
// to share location or the default coordinates for seattle will be used.
function addhomemarker(lat = 47.6062, lang = -122.3321 ){
    var marker = L.marker([lat,lang]).addTo(mymap);
    marker.bindPopup("<p>This is your current location</p>").openPopup();
}
