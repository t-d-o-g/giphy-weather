var weatherConditions = {
    clearDay: {
        name: 'Clear Day',
        img: undefined 
    },
    clearNight: {
        name: 'Clear Night',
        img: undefined 
    },
    clearCloudyDay: {
        name: 'Clear Cloudy Day',
        img: undefined 
    },
    partlyCloudyNight: {
        name: 'Partly Cloudy Night',
        img: undefined 
    },
    cloudy: {
        name: 'Cloudy',
        img: undefined 
    },
    rain:  {
        name: 'Rain',
        img: undefined 
    },
    sleet: {
        name: 'Sleet',
        img: undefined 
    }, 
    snow: {
        name: 'Snow',
        img: undefined 
    },
    wind: {
        name: 'Wind',
        img: undefined 
    },
    fog: {
        name: 'Fog',
        img: undefined 
    }
}, weatherBtn, rowNum, btnInRow, re, imgKey, query, selectedImg, stillSrcArr = [], gifSrcArr = [], apiKey = 'HcEkdzj7Hh7PCuX8qumUU5zJE06iNKTw';

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
for (var key in weatherConditions) {
    rowNum = (counter  - (counter % btnInRow))/btnInRow;
    weatherBtn = $('<button>').addClass('btn btn-secondary btn-font-size weather-btn');
    weatherBtn.text(weatherConditions[key].name);
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
    selectedImgKey = $this.text().charAt(0).toLowerCase() + $this.text().replace(/\s/g, '').slice(1);
    query = $this.text() + ' Weather';

    $('#search-copy').text('Choose your favorite ' + query.toLowerCase() + ' gif.');
    $('#search-input').show();
    $('#search-input').val('');
    $('#search-input').attr('placeholder', query);
    $('#submit-search-btn').show();

    if (weatherConditions[selectedImgKey].img === undefined) {
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
    } else {
        var selectedGif = $(weatherConditions[selectedImgKey].img);

        $('#img-row').empty();
        $('#select-gif-btn').hide();
        $('#img-row').append(selectedGif);
    }
});

$('#img-row').on('click', '[id*="-img-"]', function () {
    $this = $(this);
    selectedGif($this);
});

$('#select-gif-btn').on('click', function () {
    weatherConditions[selectedImgKey].img = $this;
    var stills = $('[id^="still-img-"]');
    var gifs = $('[id^="gif-img-"]');

    if (gifs.length > 0) {
        for (var i = 0; i < stills.length; i++) {
            $(stills[i]).hide();
        }
        $('#select-gif-btn').hide();
    }
});