/*
  module1-3.js
*/

// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    // get the DataTable that has the data in the incorrect format first, simulating
    // what would happen if we called a web service that didn't return the results 
    // as we needed them
    var dataTableBadFormat = getRawData();

    // create a new data table with the data reorganized for use in a pie chart
    var convertedData = prepareDataTableForPieChart(dataTableBadFormat);

    // chart options 
    var options = {
        title: 'Number of Animals Spotted',
        pieSliceText: 'percentage',
        legend: { position: 'top', maxLines: 3 },
        height: 350
    };

    var chart = new google.visualization.PieChart(document.getElementById('divChart'));
    chart.draw(convertedData, options);

}

function prepareDataTableForPieChart(data) {
    // create another data table 
    var finalData = new google.visualization.DataTable();

    // two columns, since that's what a pie chart needs
    finalData.addColumn('string');
    finalData.addColumn('number');

    // add X empty rows, where X is the number of columns in the original table
    var numSrcColumns = data.getNumberOfColumns();
    finalData.addRows(numSrcColumns);

    // now loop over and copy into the correct format
    // (1) IN ESSENCE, we're taking data out of the original table col by col and inserting it into a new data table row by row
    for (var i = 0; i < numSrcColumns; i++) {
        var label = data.getValue(0, i);
        var value = data.getValue(1, i);

        finalData.setValue(i, 0, label);
        finalData.setValue(i, 1, value);
    }

    return finalData;
}

function getRawData() {
    // this function is a stand-in for what would normally be a call to a web
    // service.  Here we are simulating getting data from some service that
    // is not in the format we need
    var badJSarray = [
        ['Aardvarks', 'Badgers', 'Cougars', 'Donkeys', "Elephants"],
        [12, 16, 22, 102, 2]
    ];

    // convert to a data table.  Final parameter = true means first row is data
    return google.visualization.arrayToDataTable(badJSarray, true);
}
