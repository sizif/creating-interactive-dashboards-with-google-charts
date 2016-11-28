// Load the Visualization API and packages
google.charts.load('current', { 'packages': ['corechart', 'controls'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    // animal heights in inches
    var rawArray = [
        ['Aardvarks', 24],
        ['Badgers', 10],
        ['Cougars', 30],
        ['Donkeys', 48],
        ['Elephants', 120]
    ];

    // convert to a data table - true param means first row is data rather than header
    var data = google.visualization.arrayToDataTable(rawArray, true);

    // create the dashboard object
    var container = new google.visualization.Dashboard(document.getElementById('divContainer'));

    // then the control object
    var filterControl = new google.visualization.ControlWrapper({
        controlType: 'NumberRangeFilter',
        containerId: 'divControl',
        options: {
            filterColumnIndex: 1
        }
    });

    // finally, the chart object
    var chart = new google.visualization.ChartWrapper({
        chartType: 'ColumnChart',
        containerId: 'divChart',
        options: {
            title: 'Animal heights in inches'
        }
    });

    container.bind(filterControl, chart);
    container.draw(data);

}
