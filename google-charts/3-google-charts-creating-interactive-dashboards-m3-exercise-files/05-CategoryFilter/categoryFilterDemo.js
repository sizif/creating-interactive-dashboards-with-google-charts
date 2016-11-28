// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart', 'controls'] });
google.charts.setOnLoadCallback(retrieveData);

function retrieveData() {
    var URL = 'https://docs.google.com/spreadsheets/d/1SL8zq3X1PtzaHFrc7JYZwvOJiQFANf17ygG_fyNHN0I/gviz/tq?gid=1124504831&headers=1';
    var query = 'select A, B, sum(C) Group by A, B';
    GetDataFromSheet(URL, query, handleSalesByRegion);
}

function handleSalesByRegion(response) {
    var data = response.getDataTable();

    // for our chart we need to create a datatable such that:
    // column 0 is the sales region
    // column 1 is # sold of bike model A
    // column 2 is # sold of bike model B
    // etc.

    // inbound data from our query looks like this:
    // <model> <region> <# sales for this combo>

    // get a list of all of the different models
    var bikeModels = data.getDistinctValues(0);

    // get list of sales regions
    var regions = data.getDistinctValues(1);

    // create our datatable and set up the columns
    var chartData = new google.visualization.DataTable();
    chartData.addColumn({
        type: 'string',
        label: 'Sales Region'
    });
    for (col = 0; col < bikeModels.length; col++) {
        chartData.addColumn({
            type: 'number',
            label: bikeModels[col]
        });
    }

    // and populate
    for (row = 0; row < regions.length; row++) {
        chartData.addRow();
        chartData.setValue(row, 0, regions[row]);

        for (col = 0; col < bikeModels.length; col++) {

            // find the number of sales for this combination of model + region by filtering
            var rowInfo = data.getFilteredRows([
                {
                    column: 0,
                    value: bikeModels[col]
                },
                {
                    column: 1,
                    value: regions[row]
                }
            ]);

            var rowNumForCombo = rowInfo[0];
            var numSales = data.getValue(rowNumForCombo, 2);
            chartData.setValue(row, col + 1, numSales);
        }
    }

    var container = new google.visualization.Dashboard(document.getElementById('divSalesByRegionContainer'));

    var salesRegionControl = new google.visualization.ControlWrapper({
        controlType: 'CategoryFilter',
        containerId: 'divSalesRegionCategoryPicker',
        options: {
            filterColumnIndex: 0,
            ui: {
                selectedValuesLayout: 'belowStacked',
                label: '',
                caption: 'Choose regions',
                allowNone: false
            },
        },
        state: {
            selectedValues: regions
        }
    });

    var chart = new google.visualization.ChartWrapper({
        chartType: 'ColumnChart',
        containerId: 'divSalesByRegion',
        options: {
            height: 400,
            title: 'Bike Sales By Region',
            legend: { position: 'top', maxLines: 3 },
            chartArea: { left: '10%', width: '85%' }
        }
    });

    container.bind(salesRegionControl, chart);
    container.draw(chartData);
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