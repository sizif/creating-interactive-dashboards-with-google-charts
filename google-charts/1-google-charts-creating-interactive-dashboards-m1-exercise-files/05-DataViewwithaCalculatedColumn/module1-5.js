/*  module1-5.js  */

// Load the Visualization API and the corechart and table packages
google.charts.load('current', { 'packages': ['corechart', 'table'] });
// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    // start with too much data
    var tooMuchData = [
        ['Date', 'Count', 'Misc String', 'Another'],
        [new Date(2016, 0, 1), 100, 'a string', 'another'],
        [new Date(2016, 5, 5), 200, 'more data', ''],
        [new Date(2016, 10, 11), 300, 'ignore this column', 'N/A'],
        [new Date(2017, 2, 5), 150, 'still more data', 'more here'],
        [new Date(2017, 6, 6), 210, 'a string', ''],
        [new Date(2017, 9, 20), 70, 'a string', '']
    ];

    // convert JS array to Data Table - row 0 is for header data
    var dataTable = google.visualization.arrayToDataTable(tooMuchData);

    // now create a DataView that only uses columns 0 and 1 from the table
    var dataView = new google.visualization.DataView(dataTable);

    // select which columns of the data table we want in the view and add a calculated column
    dataView.setColumns([0, 1, { calc: getNumDays, type: 'number', label: 'Num Days Elapsed' }]);

    // and then pick only those rows with a date in 2017
    var rowsWeNeed = dataTable.getFilteredRows([
        {
            column: 0,
            minValue: new Date(2017, 0, 1)
        }
    ]);
    dataView.setRows(rowsWeNeed);

    var chart = new google.visualization.Table(document.getElementById('divChart'));
    chart.draw(dataView, {});

}

function getNumDays(dataTable, rowIndex) {
    var cellValue = dataTable.getValue(rowIndex, 0);    // get the date from the row
    var baseDate = new Date(2017, 0, 1);     // Jan 1, 2017
    return Math.abs(Math.round((baseDate - cellValue) / (1000 * 60 * 60 * 24))); // divide by number of days
}