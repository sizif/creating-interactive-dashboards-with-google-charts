/*
  module1.js
*/

// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    // the raw data, in a JavaScript array
    var daysPerMonth = [
	    [new Date(2016, 0, 1), 31],
	    [new Date(2016, 1, 1), 29],
	    [new Date(2016, 2, 1), 31],
	    [new Date(2016, 3, 1), 30],
	    [new Date(2016, 4, 1), 31],
	    [new Date(2016, 5, 1), 30],
	    [new Date(2016, 6, 1), 31],
	    [new Date(2016, 7, 1), 31],
	    [new Date(2016, 8, 1), 30],
	    [new Date(2016, 9, 1), 31],
	    [new Date(2016, 10, 1), 30],
	    [new Date(2016, 11, 1), 31]
    ];

    // convert to a data table.  Final parameter = true means first row is data
    var data = google.visualization.arrayToDataTable(daysPerMonth, true);

    // chart options 
    var options = {
        title: 'Number of Days Per Month in 2016',
        animation: { startup: true, duration: 2000 },
        legend: { position: 'none' },
        width: 500,
        height: 350
    };

    var chart = new google.visualization.AreaChart(document.getElementById('divChart'));
    chart.draw(data, options);

}

// (1) First call the load() function, w/ params:
/*
1st param 'current' is version
2nd param is an object that has a property called 'packages', and the value of that property is an array of strings
The 'corechart' gives bar, column, line, area, pie and others...
*/

// (2) Next we tell the loader library to call the callback function when its ready to be used
/*
The callback fn has no params
The 1st thing we do is create the data that will be displayed

*/