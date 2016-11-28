// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(retrieveData);

function retrieveData() {
    // sales by model
    var URL = 'https://docs.google.com/spreadsheets/d/1SL8zq3X1PtzaHFrc7JYZwvOJiQFANf17ygG_fyNHN0I/gviz/tq?gid=1130516301&headers=1';
    var query = 'select A, B, C, D, E ORDER BY F DESC';
    getDataFromSheet(URL, query, handleSalesByModelResponse);

}

function handleSalesByModelResponse(response) {
    var salesByModelData = response.getDataTable();

    var options = {
        title: 'Sales By Model: Standard Bikes',
        height: 350,
        legend: { position: 'top', maxLines: 3 },
        isStacked: true
    };

    var salesByModelChart = new google.visualization.BarChart(document.getElementById('divSalesByModel'));
    salesByModelChart.draw(salesByModelData, options);

    // click event handler: determine model & region, then make another query for detailed data
    google.visualization.events.addListener(salesByModelChart, 'select', function () {
        var selectedItems = salesByModelChart.getSelection();

        for (var i = 0; i < selectedItems.length; i++) {

            // each selected object has a .row and/or .column property, which are the row and column of the underlying data table
            var selectedItem = selectedItems[i];
            var row = selectedItem.row;
            var col = selectedItem.column;

            // get the model name, which is in column 0
            var modelName = salesByModelData.getValue(row, 0);

            // get the sales region, which is a header 
            var salesRegion = salesByModelData.getColumnLabel(col);

            // now retrieve all of the sales for that model, in that region
            var URL = 'https://docs.google.com/spreadsheets/d/1SL8zq3X1PtzaHFrc7JYZwvOJiQFANf17ygG_fyNHN0I/gviz/tq?gid=1124504831&headers=1';
            var query = "select D, C Where A = '" + modelName + "' and B = '" + salesRegion + "'";
            getDataFromSheet(URL, query, showPopupSalesForModelInRegion);
        }
    });
}

function showPopupSalesForModelInRegion(response) {

    var detailData = response.getDataTable();

    var options = {
        height: 300,
        width: 550,
        legend: { position: 'none' },
        vAxis: {
            gridlines: { color: 'transparent' }
        },
        hAxis: {
            gridlines: { color: 'transparent' },
            slantedText: true
        }
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('divDetailChart'));
    chart.draw(detailData, options);

    // now display the dialog using Bootstrap
    $("#divDetailPopup").modal();

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
