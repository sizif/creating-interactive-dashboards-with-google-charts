
// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart', 'controls'] });

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawCharts);

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

//------------------------------------------------------------------------------

function drawCharts() {
    var URL, query;

    // overall income: area chart, over time
    URL = 'https://docs.google.com/spreadsheets/d/1SL8zq3X1PtzaHFrc7JYZwvOJiQFANf17ygG_fyNHN0I/gviz/tq?headers=1';
    query = 'SELECT A, B, C, D, E, F';  // letters must be capitalized
    GetDataFromSheet(URL, query, handleOverallIncomeResponse);

    // sales by model
    // Note format of URL - this is critical.  The docs are wrong, you don't copy the URL, because that usually includes the EDIT
    // at the end.  Instead, add "/gviz/tq?" at the end
    URL = 'https://docs.google.com/spreadsheets/d/1SL8zq3X1PtzaHFrc7JYZwvOJiQFANf17ygG_fyNHN0I/gviz/tq?gid=1130516301&headers=1';
    query = 'select A, B, C, D, E ORDER BY F DESC';
    GetDataFromSheet(URL, query, handleSalesByModelResponse);

    // get expenses and show in area chart over time            
    URL = 'https://docs.google.com/spreadsheets/d/1SL8zq3X1PtzaHFrc7JYZwvOJiQFANf17ygG_fyNHN0I/gviz/tq?gid=192555712&headers=1';
    query = 'select A, B, C, D, E';
    GetDataFromSheet(URL, query, handleExpensesOverTime);

    // sales by region can use the more vertical table, since doing a GROUP BY works well with the pie chart            
    URL = 'https://docs.google.com/spreadsheets/d/1SL8zq3X1PtzaHFrc7JYZwvOJiQFANf17ygG_fyNHN0I/gviz/tq?gid=1124504831&headers=1';
    query = 'select A, B, sum(C) Group by A, B';
    GetDataFromSheet(URL, query, handleSalesByRegion);

}

//------------------------------------------------------------------------------

function prepareDataTableForPieChart(data, labelArray) {
    // this function takes an existing data table with one row of data, and 
    // returns another data table formatted for use with a Pie Chart
    var finalData = new google.visualization.DataTable();
    finalData.addColumn('string');
    finalData.addColumn('number');

    var numCols = data.getNumberOfColumns();
    for (var i = 0; i < numCols; i++) {
        finalData.addRow([labelArray[i], data.getValue(0, i)]);
    }
    return finalData;
}

//------------------------------------------------------------------------------

function handleOverallIncomeResponse(response) {
    var data = response.getDataTable();
    
    // add a new column for the tooltip
    data.addColumn({
        type: 'string',
        role: 'tooltip'
    });

    var numRows = data.getNumberOfRows();
    var numCols = data.getNumberOfColumns();
    var tooltipColumnIndex = numCols -1;

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
                
        // when the chart is drawn, get a PNG of it and use it as a tooltip
        google.visualization.events.addListener(tooltipChart, 'ready', function() {
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
                    '<tr><td class="td">Standard Bikes</td><td class="td">$' +  standardBikeSales.commaSeparated() + '</td></tr>' +
                    '<tr><td class="td">Electric Bikes</td><td class="td">$' + electricBikeSales.commaSeparated() + '</td></tr>' +
                    '<tr><td class="td">Accessories</td>   <td class="td">$' + accessoriesSales.commaSeparated() + '</td></tr>' +
                    '</table><br/>' +
                    '<b>Top Sales Rep:</b> ' + topSalesRep + '<br/>' +
                '</div>' +
            '</div>';
            data.setCell(i, tooltipColumnIndex, tooltipHtml );
        });

        // draw into the temp div - this will trigger the 'ready' event handled above
        tooltipChart.draw(pieData, pieOptions);
    }
    
    // chart options
    var options = {
        title: 'Monthly Income',
        height: 350,
        legend: { position: 'top', maxLines: 3 },
        vAxis: { 
            minValue: 0,
            format: 'currency'
        },
        chartArea: { left: '15%', width: '85%'},
        tooltip: { 
            isHtml: true,
            ignoreBounds: false
         }
    };
    
    var chart = new google.visualization.AreaChart(document.getElementById('divIncomeOverTime'));
    chart.draw(view, options);
}

//------------------------------------------------------------------------------

function handleExpensesOverTime(response) {

    var data = response.getDataTable();
    
    var container = new google.visualization.Dashboard(document.getElementById('divExpensesOverTimeContainer'));
    
    var rangeControl = new google.visualization.ControlWrapper({
        controlType: 'ChartRangeFilter',
        containerId: 'divExpensesRangeSlider',
        options: {
            filterColumnIndex: 0,
            ui: {
                chartType: 'AreaChart',
                chartOptions: {
                    height: 50,
                    isStacked: true,
                    vAxis: { minValue: 0 },
                    chartArea: { left: '5%', width: '100%' }
                },
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
        chartArea: { left: '15%', width: '80%' }
    };
    
    var chart = new google.visualization.ChartWrapper({
        chartType: 'AreaChart',
        containerId: 'divExpensesOverTime',
        options: areaChartOptions
    });
       
    container.bind(rangeControl, chart);
    container.draw(data);
}

//------------------------------------------------------------------------------

// Not used any more
function handleExpensesByCategory(response) {
    var rawdata = response.getDataTable();
    var data = prepareDataTableForPieChart(rawdata, ['Parts', 'Labor', 'Marketing', 'Overhead']);
    var options = {
        title: 'Expenses By Category',
        pieSliceText: 'percentage',
        legend: { position: 'top', maxLines: 3 },
        height: 350
    };
    var chart = new google.visualization.PieChart(document.getElementById('divExpensesByCategory'));
    chart.draw(data, options);
}

//------------------------------------------------------------------------------

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
            var rowInfo = data.getFilteredRows([  // this returns a list of rows, but for this filter, there will only be 1 row
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
            selectedValues: ['NorthCentral', 'SouthEast', 'NorthEast', 'West']
        }
    });

    var chart = new google.visualization.ChartWrapper({
        chartType: 'ColumnChart',
        containerId: 'divSalesByRegion',
        options: {
            height: 400,
            title: 'Bike Sales By Region',
            legend: { position: 'top', maxLines: 3 },
            chartArea: { left: '10%', width: '85%'}
        }
    });

    container.bind(salesRegionControl, chart);
    container.draw(chartData);
}

//------------------------------------------------------------------------------

function handleSalesByModelResponse(response) {

    var salesByModelData = response.getDataTable();
    
    var options = {
        title: 'Sales By Bicycle Model',
        height: 350,
        legend: { position: 'top', maxLines: 3 },
        chartArea: { left: '15%', width: '80%'},
        isStacked: true
    };
    
    var salesByModelChart = new google.visualization.BarChart(document.getElementById('divSalesByModel'));
    salesByModelChart.draw(salesByModelData, options);

    google.visualization.events.addListener(salesByModelChart, 'select', function () {
        // which model and region got clicked on?  getSelection() returns an array of selected items 
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
            GetDataFromSheet(URL, query, showPopupSalesForModelInRegion);
        }
    });
}

function showPopupSalesForModelInRegion(response) {
        
    var detailData = response.getDataTable();

    var options = {
        height: 300,
        width: 870,
        chartArea: { left: '5%', width: '92%' },
        legend: { position: 'none' },
        vAxis: {
            gridlines: {
                color: 'transparent'
            }
        },
        hAxis: {
            gridlines: {
                color: 'transparent'
            }
        }
    };
    
    var chart = new google.visualization.ColumnChart(document.getElementById('divDetailChart'));
    chart.draw(detailData, options);

    // now display the dialog using Bootstrap
    $("#divDetailPopup").modal();

}

//------------------------------------------------------------------------------

// Misc functions 
Number.prototype.commaSeparated = function() {
    var n = this;
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function monthName(n) {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', "Jul", 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][n];
}

