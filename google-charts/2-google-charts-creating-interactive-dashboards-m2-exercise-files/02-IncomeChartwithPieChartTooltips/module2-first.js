// Load the Visualization API and the corechart package, and call the callback when it's ready
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(retrieveData);

function retrieveData() {
    var URL = 'https://docs.google.com/spreadsheets/d/1SL8zq3X1PtzaHFrc7JYZwvOJiQFANf17ygG_fyNHN0I/gviz/tq?gid=0';
    var query = 'SELECT A, B, C, D, E, F';  // letters must be capitalized
    getDataFromSheet(URL, query, handleOverallIncomeResponse);

}

function handleOverallIncomeResponse(response) {
    var data = response.getDataTable();

    // add a new column for the tooltip
    data.addColumn({
        type: 'string',
        role: 'tooltip'
    });

    var numRows = data.getNumberOfRows();
    var numCols = data.getNumberOfColumns();
    var tooltipColumnIndex = numCols - 1;

    data.setColumnProperty(tooltipColumnIndex, 'html', true);

    var view = new google.visualization.DataView(data);
    view.setColumns([0, 4, tooltipColumnIndex]);    // use just the date, the total, and our custom tooltip

    // use the hidden divTooltipChart to draw the pie chart for each row/date 
    var tooltipChart = new google.visualization.PieChart(document.getElementById('divTooltipChart'));

    // each row of data will get a custom HTML tooltip
    for (var i = 0; i < numRows; i++) {

        var theDate = data.getValue(i, 0);
        var dateString = monthName(theDate.getMonth()) + ' ' + theDate.getFullYear();
        var standardBikeSales = data.getValue(i, 1);
        var electricBikeSales = data.getValue(i, 2);
        var accessoriesSales = data.getValue(i, 3);
        var topSalesRep = data.getValue(i, 5);

        // draw a pie chart that drills down into the month's income sources
        var pieData = google.visualization.arrayToDataTable([
            ['Category', 'Amount'],
            ['Standard Bikes', standardBikeSales],
            ['Electric Bikes', electricBikeSales],
            ['Accessories', accessoriesSales]
        ]);

        var pieOptions = {
            title: 'Income By Category',
            height: 180,
            width: 240,
            legend: {
                position: 'right'
            },
            pieSliceText: 'none'   // show the actual value rather than percentage
        };

        // get the rendered chart via a call to getImageURI
        // when the chart is drawn, get a PNG of it and use it as a tooltip
        google.visualization.events.addListener(tooltipChart, 'ready', function () {
            // get a static image of the new chart, and add that as a tooltip to the main view
            var tooltipHtml =
            '<div style="border: 3px solid black; padding: 0px; ">' +
                '<img src="' + tooltipChart.getImageURI() + '">' +
                '<style>' +
                    '.tiptab { border: 1px solid black; border-collapse: collapse;  }' +
                    '.td { font-family: Helvetica, Arial; font-size: 0.9em; padding: 5px;}' +
                '</style>' +
                '<div style="width: 200px; margin-top: 0; margin-left: auto; margin-right: auto; padding: 10px; padding-top: 0;">' +
                    '<span style="font-weight: bold; ">' + dateString + ':</span><br/><br/>' +
                    '<table class="tiptab">' +
                    '<tr><td class="td">Standard Bikes</td><td class="td">$' + standardBikeSales.commaSeparated() + '</td></tr>' +
                    '<tr><td class="td">Electric Bikes</td><td class="td">$' + electricBikeSales.commaSeparated() + '</td></tr>' +
                    '<tr><td class="td">Accessories</td>   <td class="td">$' + accessoriesSales.commaSeparated() + '</td></tr>' +
                    '</table><br/>' +
                    '<b>Top Sales Rep:</b> ' + topSalesRep + '<br/>' +
                '</div>' +
            '</div>';
            data.setCell(i, tooltipColumnIndex, tooltipHtml);
        });

        // draw into the temp div - this will trigger the 'ready' event handled above
        tooltipChart.draw(pieData, pieOptions);

        // chart options
        var options = {
            title: 'Income',
            height: 500,
            legend: { position: 'top', maxLines: 3 },
            vAxis: {
                minValue: 0,
                format: 'currency'
            },
            chartArea: {
                left: '10%',
                width: '88%'
            },
            tooltip: {
                isHtml: true,
                ignoreBounds: false
            }
        };

        var chart = new google.visualization.AreaChart(document.getElementById('divIncomeOverTime'));
        chart.draw(view, options);

    }
}

function getDataFromSheet(URL, queryString, callback) {
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

// Misc functions 
Number.prototype.commaSeparated = function () {
    var n = this;
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function monthName(n) {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', "Jul", 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][n];
}
