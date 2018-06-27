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
], weatherBtn, rowNum, btnInRow, re, stillSrcArr = [], gifSrcArr = [], key = 'HcEkdzj7Hh7PCuX8qumUU5zJE06iNKTw';

screenWidth = $(window).width();
if (screenWidth < 500) {
    btnInRow = 2;
} else if (screenWidth < 800) {
    btnInRow = 4;
} else if ( screenWidth < 1000) {
    btnInRow = 4;
} else {
    btnInRow = 5;
}

for (var i = 0; i < weatherIcon.length; i++) {
    rowNum = (i  - (i % btnInRow))/btnInRow;
    weatherBtn = $('<button>').addClass('btn btn-secondary btn-font-size');
    weatherBtn.text(prettify(weatherIcon[i]));
    $('#btn-row-' + rowNum).append(weatherBtn);
}

// https://codereview.stackexchange.com/questions/87221/change-case-of-string-replace-hyphens-with-spaces-and-capitalize-first-letter
function prettify(str) {
    return str.split('-').map(function capitalize(part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
    }).join(' ');
}

function toggleImg (img) {
    var imgNum = img.attr('id').match(/\d+/)[0];
    var imgType = img.attr('id').substr(0, img.attr('id').indexOf('-'));

    if (imgType === 'still') {
        img.attr('id', 'gif-img-' + imgNum)
        img.attr('src', gifSrcArr[imgNum]);
    } else {
        img.attr('id', 'still-img-' + imgNum)
        img.attr('src', stillSrcArr[imgNum]);
    }
}

$('.btn').on('click', function () {
    $this = $(this);
    $this.blur();
    var query = $this.text();

    $('#img-row').empty();

    $.ajax({
        url: 'https://api.giphy.com/v1/gifs/search?api_key=' + key + '&q=' + query + '&limit=10&offset=0&rating=G&lang=en',
        method: 'GET' 
    }).then(function (res) {
        var stillImgSrc, gifSrc, stillImg;
        stillSrcArr = [], gifSrcArr = [];

        for (var i = 0; i < res.data.length; i++) {
            stillImgSrc = res.data[i].images.fixed_height_small_still.url;
            gifSrc = res.data[i].images.fixed_height_small.url;

            stillSrcArr.push(stillImgSrc);
            gifSrcArr.push(gifSrc);

            stillImg = $('<img>').attr({'src': stillImgSrc, 'alt': query + ' Still Img', 'id':'still-img-' + [i]});
            $('#img-row').append(stillImg);
        }
    });
});

$('#img-row').on('click', '[id*="-img-"]', function () {
    $this = $(this);
    toggleImg($this);
})