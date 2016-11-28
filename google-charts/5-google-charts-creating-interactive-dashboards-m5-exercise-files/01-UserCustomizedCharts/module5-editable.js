// Load the Visualization API 
google.charts.load('44', { 'packages': ['charteditor'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(retrieveData);

function retrieveData() {
    var URL = 'https://docs.google.com/spreadsheets/d/1SL8zq3X1PtzaHFrc7JYZwvOJiQFANf17ygG_fyNHN0I/gviz/tq?gid=192555712&headers=1';
    var query = 'select A, B, C, D, E';
    GetDataFromSheet(URL, query, drawExpensesOverTime);
}

var chart;

function drawExpensesOverTime(response) {

    var data = response.getDataTable();

    var areaChartOptions = {
        title: 'Monthly Expenses',
        height: 300,
        isStacked: true,
        legend: { position: 'top', maxLines: 3 },
        vAxis: {
            minValue: 0,
            format: 'currency',
        },
        chartArea: { height: 250 },
    };

    chart = new google.visualization.ChartWrapper({
        chartType: 'AreaChart',
        containerId: 'divExpensesOverTimeChart',
        options: areaChartOptions,
        dataTable: data
    });

    chart.draw();
}

function showChartEditor() {

    // create the configuration editor object
    var chartEditor = new google.visualization.ChartEditor();

    // tell it how to handle the OK button in the configuration dialog
    google.visualization.events.addListener(chartEditor, 'ok',
        function () {

            var theChart = chartEditor.getChartWrapper();

            // when we switch the style, we need to reset our width 
            theChart.setOption('width', 1000);

            // and then draw it
            theChart.draw();

        });

    // and now show the configuration dialog, associating it with the chart object
    chartEditor.openDialog(chart);

}



//------------------------------------------------------------------------------

function GetDataFromSheet(URL, queryString, callback) {
    var query = new google.visualization.Query(URL);
    query.setQuery(queryString);
    query.send(gotResponse);

    function gotResponse(response) {
        if (response.isError()) {
            console.log(response.getReasons());
            alert('Error in query: ' + response.getMessage() + " " + response.getDetailedMessage());
            return;
        }
        if (response.hasWarning()) {
            console.log(response.getReasons());
            alert('Warning from query: ' + response.getMessage() + " " + response.getDetailedMessage());
            return;
        }
        callback(response);
    }
}

