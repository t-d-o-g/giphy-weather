//darksky-key = 402f7c1f1f1e88f16325562fad349ab9
//gify-key = HcEkdzj7Hh7PCuX8qumUU5zJE06iNKTw
var weatherIcon = [
    "clear-day",
    "clear-night",
    "partly-cloudy-day",
    "partly-cloudy-night",
    "cloudy",
    "rain",
    "sleet",
    "snow",
    "wind",
    "fog"
], weatherBtn, rowNum, btnInRow, re;

screenWidth = $(window).width();
if (screenWidth < 576) {
    btnInRow = 2;
} else if (screenWidth < 768) {
    btnInRow = 3;
} else if ( screenWidth < 992) {
    btnInRow = 4;
} else {
    btnInRow = 5;
}

for (var i = 0; i < weatherIcon.length; i++) {
    rowNum = (i  - (i % btnInRow))/btnInRow;
    weatherBtn = $('<button>').addClass('btn btn-secondary btn-font-size');
    weatherBtn.text(prettify(weatherIcon[i]));
    $('#btn-row-'+rowNum).append(weatherBtn);
    // $('.btn-group').append(weatherBtn);
}

// https://codereview.stackexchange.com/questions/87221/change-case-of-string-replace-hyphens-with-spaces-and-capitalize-first-letter
function prettify(str) {
    return str.split('-').map(function capitalize(part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
    }).join(' ');
}