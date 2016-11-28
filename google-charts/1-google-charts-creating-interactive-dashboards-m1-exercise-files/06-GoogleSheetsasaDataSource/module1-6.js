/*  module1-6.js  */

// Load the Visualization API and the corechart and table packages
google.charts.load('current', { 'packages': ['corechart', 'table'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(retrieveData);

function retrieveData() {
    var URL = 'https://docs.google.com/spreadsheets/d/1SL8zq3X1PtzaHFrc7JYZwvOJiQFANf17ygG_fyNHN0I/gviz/tq?gid=0';
    var query = new google.visualization.Query(URL);

    var queryString = 'select A, B, C, D, E';
    query.setQuery(queryString);

    query.send(gotResponse);

}

function gotResponse(response) {
    // pull the data table out of the response object
    var dataTable = response.getDataTable();

    // and chart as normal
    var chart = new google.visualization.Table(document.getElementById('divChart'));
    chart.draw(dataTable, {});

}