// Load the Visualization API and the corechart package, call the callback when ready
google.charts.load('current', { 'packages': ['corechart', 'table'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    var rawArray = [
        ['Aardvarks', 12, 'Nocturnal mammal native to Africa'],
        ['Badgers', 16, 'Eleven species, including <i>honey badger</i>'],
        ['Cougars', 22, 'Also known as the mountain lion, puma or panther'],
        ['Donkeys', 76, 'Used as a working animal for at least 5000 years'],
        ['Elephants', 7, 'Can weigh up to 15000 lb / 6800 kg ']
    ];
    var data = google.visualization.arrayToDataTable(rawArray, true);

    // designate column 2 as the tooltip
    data.setColumnProperty(2, 'role', 'tooltip');
    data.setColumnProperty(2, 'html', true);

    // chart options 
    var options = {
        legend: 'none',
        width: 500,
        tooltip: { isHtml: true}
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('divChart'));
    chart.draw(data, options);
}

