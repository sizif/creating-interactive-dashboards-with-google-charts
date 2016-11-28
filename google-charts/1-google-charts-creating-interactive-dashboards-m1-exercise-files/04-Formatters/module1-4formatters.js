// Load the Visualization API and the corechart package.
google.charts.load('45', { 'packages': ['corechart', 'table'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    // the raw data
    var rawArray = [
        ['Aardvarks', 12],
        ['Badgers', 16],
        ['Cougars', -22],
        ['Donkeys', 76],
        ['Elephants', 2]
    ];

    // convert JS array to a data table
    var data = google.visualization.arrayToDataTable(rawArray, true);

    // create the formatter, passing some configuration options
    var formatter = new google.visualization.NumberFormat({
        prefix: '$',
        negativeColor: 'red',
        negativeParens: true
    });

    // apply the formatter to the data
    formatter.format(data, 1);

    // chart options 
    var options = {
        width: 300,
        height: 150
    };

    var chart = new google.visualization.Table(document.getElementById('divChart'));
    chart.draw(data, options);
}
