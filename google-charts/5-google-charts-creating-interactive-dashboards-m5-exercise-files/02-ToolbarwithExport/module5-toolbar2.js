// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(retrieveData);

function retrieveData() {
    var URL = 'https://docs.google.com/spreadsheets/d/1SL8zq3X1PtzaHFrc7JYZwvOJiQFANf17ygG_fyNHN0I/gviz/tq?gid=192555712&headers=1';
    var query = 'select A, B, C, D, E';
    GetDataFromSheet(URL, query, handleExpensesOverTime);
}

function handleExpensesOverTime(response) {

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

    var chart = new google.visualization.ChartWrapper({
        chartType: 'AreaChart',
        containerId: 'divExpensesOverTimeChart',
        options: areaChartOptions,
        dataTable: data
    });

    chart.draw();

    SetupToolbar();
}

function SetupToolbar() {

    // which radio button is selected?
    var dataToExportURL = document.querySelector('input[name="rdoDataDownload"]:checked').value;

    // for jQuery, do this:
    // var dataToExportURL = $("input[name='rdoDataDownload']:checked").val();

    // now set up the toolbar with those URLs
    var toolbarContainer = document.getElementById('divToolbar');
    var toolbarEntries = [
        {
            type: 'csv',
            datasource: dataToExportURL
        },
        {
            type: 'html',
            datasource: dataToExportURL
        }
    ];

    google.visualization.drawToolbar(toolbarContainer, toolbarEntries);

}


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