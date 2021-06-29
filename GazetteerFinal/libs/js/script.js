// Map Tile 

let mymap = L.map('mapid');


var layer1 = L.tileLayer('https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=68076b33f11346558149186795fcc243', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    apikey: '68076b33f11346558149186795fcc243',
    maxZoom: 22,


}).addTo(mymap);

var layer2 = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 17
});







//Marker Cluster
let histMark = L.markerClusterGroup();
let parksMark = L.markerClusterGroup();
var historic = L.layerGroup([histMark]);
var parks = L.layerGroup([parksMark]);


mymap.addLayer(historic);
mymap.addLayer(parks);


var baseLayers = {
    "Map": layer1,
    "Satellite": layer2

};

var overlayData = {
    "Historic Sites": historic,
    "National Parks": parks
};


L.control.layers(baseLayers, overlayData).addTo(mymap);



//Buttons

$('#infobutton').click(function() {
    $('#myModal').fadeIn();
});

$('#weatherbutton').click(function() {
    $('#myModal2').fadeIn();
});

$('#virusbutton').click(function() {
    $('#myModal3').fadeIn();
});

$('#newsbutton').click(function() {
    $('#myModal4').fadeIn();
});



//Closes Modals

$('#mapid').click(function(event) {
    $("#myModal").fadeOut();
    $('#myModal2').fadeOut();
    $('#myModal3').fadeOut();
    $('#myModal4').fadeOut();
});


//Location 

$('document').ready(function getLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {

        let lat = position.coords.latitude;
        let lng = position.coords.longitude;



        $.ajax({
            url: 'libs/php/borders.php',
            type: 'POST',
            data: {
                lat: lat,
                lng: lng
            },
            dataType: 'JSON',
            success: (result) => {



                for (let q = 0; q < result.data.length; q++) {

                    if (result.data[q].name === result.ltlngsData.countryName && result.data[q].polygon.type === 'MultiPolygon') {

                        userBorder = L.geoJSON({ type: "MultiPolygon", coordinates: result.data[q].polygon.coordinates }, {

                            weight: 3,

                            color: 'green',

                            fillColor: 'rgb(31, 82, 109)',

                            fillOpacity: 0.25
                        })

                        userBorder.addTo(mymap);
                        mymap.fitBounds(userBorder.getBounds());

                        $('select').val(result.ltlngsData.countryCode);
                        getCountryInfo(result.data[q].name);
                        historicSites();
                        nationalParks();

                    }
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.warn(jqXHR.responseText)
                console.log(errorThrown);

            }
        })


    })
});

// Select Country Element

const getCountryList = () => {

    $.ajax({
        url: 'libs/php/getCountryList.php',
        type: 'POST',
        dataType: 'JSON',
        success: (result) => {

            const selectCountry = $('#countryList');

            result['data'].forEach(country => {
                selectCountry.append(`<option value=${country['code']} name=${country['name']} >${country['name']}</option>`)
            });



        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.warn(jqXHR.responseText)
            console.log(errorThrown);

        }
    })
};



// Draws Borders

$('select').change(function drawGeoJson() {

    $.ajax({
        url: 'libs/php/borders.php',
        type: 'POST',
        dataType: 'JSON',
        data: {
            countryVal: $('#countryList').find(':selected').val(),

        },



        success: (result) => {
            historicSites();
            nationalParks();


            countryVal = $('#countryList').find(':selected').val();


            for (let i = 0; i < result.data.length; i++) {

                if (countryVal === result.data[i].code && result.data[i].polygon.type === "Polygon") {



                    geoLayer = L.geoJSON({ type: "Polygon", coordinates: result.data[i].polygon.coordinates }, {

                        weight: 3,

                        color: 'purple',

                        fillColor: 'purple',

                        fillOpacity: 0.25

                    });

                    geoLayer.addTo(mymap);
                    mymap.fitBounds(geoLayer.getBounds());



                } else if (countryVal === result.data[i].code && result.data[i].polygon.type === "MultiPolygon") {


                    geoLayer = L.geoJSON({ type: "MultiPolygon", coordinates: result.data[i].polygon.coordinates }, {

                        weight: 3,

                        color: 'purple',

                        fillColor: 'purple',

                        fillOpacity: 0.25

                    });

                    geoLayer.addTo(mymap);
                    mymap.fitBounds(geoLayer.getBounds());

                }

            }

        },


        error: (jqXHR, textStatus, errorThrown) => {
            console.warn(jqXHR.responseText)
            console.log(errorThrown);

        }
    })

});




//Inserts Commas For Large Numbers
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Kelvins To Celcius

function tempConvert(y) {

    return y - 273.15;

}

//Seconds To Date
function toDateTime(secs) {
    var t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    return t;
}



// Gets country info, weather, news and covid cases 

function getCountryInfo() {

    $.ajax({
        url: "libs/php/countryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#countryList').find(':selected').val()
        },
        success: function(geoNamesResult) {

            if (geoNamesResult.status.name == 'ok') {


                //Sets marker info

                var redMarker = L.ExtraMarkers.icon({
                    icon: "fa-solid fa-info",
                    markerColor: 'orange-dark',
                    shape: 'circle',
                    prefix: 'fa'


                });
                marker = L.marker([geoNamesResult.covidData.countryInfo.lat, geoNamesResult.covidData.countryInfo.long], { icon: redMarker }).bindTooltip(`<h1>${geoNamesResult.geoNamesData[0].countryName}</h1><h2>${geoNamesResult.geoNamesData[0].continentName}</h2><h3>Population: ${numberWithCommas(geoNamesResult.geoNamesData[0].population)}</h3>`).addTo(mymap);


                //Populates info button popup 

                $('.modal-title').html(geoNamesResult.geoNamesData[0].countryName);
                $('.modal-image').html(`<img src='${geoNamesResult.covidData.countryInfo.flag}' style = 'width:50%;'>`);
                $('#capital').html(geoNamesResult.geoNamesData[0].capital);
                $('#continent').html(geoNamesResult.geoNamesData[0].continentName);
                $('#population').html(numberWithCommas(geoNamesResult.geoNamesData[0].population));
                $('#countrycode').html(geoNamesResult.geoNamesData[0].countryCode);
                $('#wiki').html(`<a href="https://wikipedia.com/wiki/${geoNamesResult.geoNamesData[0].countryName}" target="_blank">Wikipedia Info</a></td></tr>`);


                //Populates weather button popup 

                let dt = new Date(geoNamesResult.weatherForData.list[7].dt_txt);
                let day = dt.getDay();
                let dayName;
                if (day === 0) {
                    dayName = 'Sun';
                }
                if (day === 1) {
                    dayName = 'Mon';
                }
                if (day === 2) {
                    dayName = 'Tues';
                }
                if (day === 3) {
                    dayName = 'Wed';
                }
                if (day === 4) {
                    dayName = 'Thur';
                }
                if (day === 5) {
                    dayName = 'Fri';
                }
                if (day === 6) {
                    dayName = 'Sat';
                }
                let dt2 = new Date(geoNamesResult.weatherForData.list[15].dt_txt);
                let day2 = dt2.getDay();
                let dayName2;
                if (day2 === 0) {
                    dayName2 = 'Sun';
                }
                if (day2 === 1) {
                    dayName2 = 'Mon';
                }
                if (day2 === 2) {
                    dayName2 = 'Tues';
                }
                if (day2 === 3) {
                    dayName2 = 'Wed';
                }
                if (day2 === 4) {
                    dayName2 = 'Thur';
                }
                if (day2 === 5) {
                    dayName2 = 'Fri';
                }
                if (day2 === 6) {
                    dayName2 = 'Sat';
                }



                $('#modal-title2').html(geoNamesResult.geoNamesData[0].countryName);
                $('#city').html(geoNamesResult.geoNamesData[0].capital);
                $('#weatherimg').html(`<img src='http://openweathermap.org/img/wn/${geoNamesResult.weatherData.weather[0].icon}.png' style='width:20%; '><br>${geoNamesResult.weatherData.weather[0].description}`);
                $('#temp').html(`${tempConvert(geoNamesResult.weatherData.main.temp).toFixed(0)}° Celcius`);
                $('#day').html(dayName);
                $('#dayimg').html(`<img src='http://openweathermap.org/img/wn/${geoNamesResult.weatherForData.list[7].weather[0].icon}.png' style='width:30%;  padding-bottom:10px; position:relative; left:35%;'><span style='font-size:75%;'>${tempConvert(geoNamesResult.weatherForData.list[7].main.temp).toFixed(0)}° Celcius</span>`);
                $('#day2').html(dayName2);
                $('#day2img').html(`<img src='http://openweathermap.org/img/wn/${geoNamesResult.weatherForData.list[15].weather[0].icon}.png' style='width:30%;  padding-bottom:10px;  position:relative; left:35%;'><span style='font-size:75%;'>${tempConvert(geoNamesResult.weatherForData.list[15].main.temp).toFixed(0)}° Celcius</span>`);




                //Populates covid info button popup
                $('#modal-title3').html(geoNamesResult.geoNamesData[0].countryName);
                $('#total').html(numberWithCommas(geoNamesResult.covidData.cases));
                $('#deaths').html(numberWithCommas(geoNamesResult.covidData.deaths));
                $('#active').html(numberWithCommas(geoNamesResult.covidData.active));
                $('#critical').html(numberWithCommas(geoNamesResult.covidData.critical));
                $('#tests').html(numberWithCommas(geoNamesResult.covidData.tests));
                $('#recovered').html(numberWithCommas(geoNamesResult.covidData.recovered));

                //Populates News popup

                $('#news1').html(`<a href='${geoNamesResult.newsData.articles[0].url}' target='_blank'><img src ='${geoNamesResult.newsData.articles[0].urlToImage}' style='width:70%;'></a><br> ${geoNamesResult.newsData.articles[0].title} `);
                $('#news2').html(`<a href='${geoNamesResult.newsData.articles[1].url}' target='_blank'><img src ='${geoNamesResult.newsData.articles[1].urlToImage}' style='width:70%;'></a><br> ${geoNamesResult.newsData.articles[1].title} `);
                $('#news3').html(`<a href='${geoNamesResult.newsData.articles[2].url}' target='_blank'><img src ='${geoNamesResult.newsData.articles[2].urlToImage}' style='width:70%;'></a><br> ${geoNamesResult.newsData.articles[2].title} `);
                $('#news4').html(`<a href='${geoNamesResult.newsData.articles[3].url}' target='_blank'><img src ='${geoNamesResult.newsData.articles[3].urlToImage}' style='width:70%;'></a><br> ${geoNamesResult.newsData.articles[3].title} `);
                $('#news5').html(`<a href='${geoNamesResult.newsData.articles[4].url}' target='_blank'><img src ='${geoNamesResult.newsData.articles[4].urlToImage}' style='width:70%;'></a><br> ${geoNamesResult.newsData.articles[4].title} `);
                $('#news6').html(`<a href='${geoNamesResult.newsData.articles[5].url}' target='_blank'><img src ='${geoNamesResult.newsData.articles[5].urlToImage}' style='width:70%;'></a><br> ${geoNamesResult.newsData.articles[5].title} `);
                $('#news7').html(`<a href='${geoNamesResult.newsData.articles[6].url}' target='_blank'><img src ='${geoNamesResult.newsData.articles[6].urlToImage}' style='width:70%;'></a><br> ${geoNamesResult.newsData.articles[6].title} `);
                $('#news8').html(`<a href='${geoNamesResult.newsData.articles[7].url}' target='_blank'><img src ='${geoNamesResult.newsData.articles[7].urlToImage}' style='width:70%;'></a><br> ${geoNamesResult.newsData.articles[7].title} `);
                $('#news9').html(`<a href='${geoNamesResult.newsData.articles[8].url}' target='_blank'><img src ='${geoNamesResult.newsData.articles[8].urlToImage}' style='width:70%;'></a><br> ${geoNamesResult.newsData.articles[8].title} `);
                $('#news10').html(`<a href='${geoNamesResult.newsData.articles[9].url}' target='_blank'><img src ='${geoNamesResult.newsData.articles[9].urlToImage}' style='width:70%;'></a><br> ${geoNamesResult.newsData.articles[9].title} `);



                //Populates exchange rate 

                let = exRates = Object.keys(geoNamesResult.exRateData.rates);
                let = exRateVal = Object.values(geoNamesResult.exRateData.rates);





                for (let t = 0; t < 200; t++) {
                    if (exRates[t] === geoNamesResult.geoNamesData[0].currencyCode) {

                        $('#exchrt').html(`${Math.round(exRateVal[t] * 100) / 100} ${geoNamesResult.geoNamesData[0].currencyCode}`);

                    }
                }


            } else {
                alert('error!');
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.warn(jqXHR.responseText)
            console.log(errorThrown);
        }

    });


};




//Gets Nearby Historic Sites
function historicSites() {

    $.ajax({
        url: "libs/php/countryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#countryList').find(':selected').val()
        },
        success: function(geoNamesResult) {


            for (let m = 0; m < geoNamesResult.poiData.features.length; m++) {

                let placeLat = geoNamesResult.poiData.features[m].geometry.coordinates[1];
                let placeLong = geoNamesResult.poiData.features[m].geometry.coordinates[0];
                let placeName = geoNamesResult.poiData.features[m].properties.name;


                var yellMarker = L.ExtraMarkers.icon({
                    icon: "fa-solid fa-landmark",
                    markerColor: 'yellow',
                    shape: 'circle',
                    prefix: 'fa'
                });

                markerTwo = L.marker([placeLat, placeLong], { icon: yellMarker }).bindTooltip(`<h1>${placeName}</h1>`);
                histMark.addLayer(markerTwo);



            }


        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.warn(jqXHR.responseText)
            console.log(errorThrown);
        }

    });

};

//Gets Nearby National Parks
function nationalParks() {

    $.ajax({
        url: "libs/php/countryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#countryList').find(':selected').val()
        },
        success: function(geoNamesResult) {


            for (let m = 0; m < geoNamesResult.natData.features.length; m++) {

                let placeLat = geoNamesResult.natData.features[m].geometry.coordinates[1];
                let placeLong = geoNamesResult.natData.features[m].geometry.coordinates[0];
                let placeName = geoNamesResult.natData.features[m].properties.name;


                var greenMarker = L.ExtraMarkers.icon({
                    icon: "fa-solid fa-tree",
                    markerColor: 'green',
                    shape: 'circle',
                    prefix: 'fa'
                });

                markerThree = L.marker([placeLat, placeLong], { icon: greenMarker }).bindTooltip(`<h1>${placeName}</h1>`);
                parksMark.addLayer(markerThree);


            }


        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.warn(jqXHR.responseText)
            console.log(errorThrown);
        }

    });

};





//Updates Border Polygons & Markers
$('select').change(function removeBorder() {
    mymap.removeLayer(geoLayer);
    mymap.removeLayer(marker);

});




// Function calls
$('document').ready(getCountryList());
document.getElementById("countryList").addEventListener("change", getCountryInfo);