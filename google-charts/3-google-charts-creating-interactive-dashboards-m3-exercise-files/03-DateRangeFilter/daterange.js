// Load the Visualization API and the required packages
google.charts.load('current', { 'packages': ['corechart', 'controls'] });
google.charts.setOnLoadCallback(retrieveData);

function retrieveData() {
    // get expenses and show in area chart over time            
    var URL = 'https://docs.google.com/spreadsheets/d/1SL8zq3X1PtzaHFrc7JYZwvOJiQFANf17ygG_fyNHN0I/gviz/tq?gid=192555712&headers=1';
    var query = 'select A, B, C, D, E';
    GetDataFromSheet(URL, query, handleExpensesOverTime);
}

function handleExpensesOverTime(response) {

    var data = response.getDataTable();    

    var container = new google.visualization.Dashboard(
        document.getElementById('divExpensesOverTimeContainer'));

    var filterControl = new google.visualization.ControlWrapper({
        controlType: 'DateRangeFilter',
        containerId: 'divExpensesRangeSlider',
        options: {
            filterColumnIndex: 0,
            ui: {
                label: '',
                format: { pattern: "MMM yyyy" },
            }
        }
    });

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
        options: areaChartOptions
    });

    container.bind(filterControl, chart);
    container.draw(data);
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