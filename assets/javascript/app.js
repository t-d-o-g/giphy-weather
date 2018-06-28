var weatherIcons = {
    "Clear Day": '',
    "Clear Night": '',
    "Partly Cloudy Day": '',
    "Partly Cloudy Night": '',
    "Cloudy": '',
    "Rain": '',
    "Sleet": '',
    "Snow": '',
    "Wind": '',
    "Fog": ''
}, weatherBtn, rowNum, btnInRow, re, imgKey, query, stillSrcArr = [], gifSrcArr = [], apiKey = 'HcEkdzj7Hh7PCuX8qumUU5zJE06iNKTw';

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

var counter = 0;
for (var key in weatherIcons) {
    rowNum = (counter  - (counter % btnInRow))/btnInRow;
    weatherBtn = $('<button>').addClass('btn btn-secondary btn-font-size weather-btn');
    weatherBtn.text(key);
    $('#btn-row-' + rowNum).append(weatherBtn);
    counter++;
}

function selectedGif (img) {
    var imgNum = img.attr('id').match(/\d+/)[0];
    var imgType = img.attr('id').substr(0, img.attr('id').indexOf('-'));
    var gifs = $('[id^="gif-img-"]');

    if (gifs.length > 0) {
        var gifNum = $(gifs[0]).attr('id').match(/\d+/)[0];
        $(gifs[0]).attr('id', 'still-img-' + gifNum)
        $(gifs[0]).attr('src', stillSrcArr[gifNum]);
    }

    if (imgType === 'still') {
        img.attr('id', 'gif-img-' + imgNum)
        img.attr('src', gifSrcArr[imgNum]);
    } else {
        img.attr('id', 'still-img-' + imgNum)
        img.attr('src', stillSrcArr[imgNum]);
    }
}

$('#submit-search-btn').on('click', function () {
    if ($('#search-input').val() !== '' ) {
        query = $('#search-input').val();
    }

    $('#img-row').empty();
    $('#select-gif-btn').show();
    $.ajax({
        url: 'https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&q=' + query + '&limit=10&offset=0&rating=G&lang=en',
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

$('.weather-btn').on('click', function () {
    $this = $(this);
    $this.blur();
    query = $this.text() + ' Weather';

    $('#search-copy').text('Choose your favorite ' + query.toLowerCase() + ' gif.');
    $('#search-input').show();
    $('#search-input').val('');
    $('#search-input').attr('placeholder', query);
    $('#submit-search-btn').show();
    $('#select-gif-btn').show();

    $('#img-row').empty();

    $.ajax({
        url: 'https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&q=' + query + '&limit=10&offset=0&rating=G&lang=en',
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
    selectedGif($this);
});

$('#select-gif-btn').on('click', function () {
    weatherIcons[query] = $this;
    console.log(weatherIcons);
    var stills = $('[id^="still-img-"]');

    if (stills.length > 0) {
        for (var i = 0; i < stills.length; i++) {
            $(stills[i]).hide();
        }
        $('#select-gif-btn').hide();
    }
});