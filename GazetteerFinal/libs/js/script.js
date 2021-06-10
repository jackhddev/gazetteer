// Map Tile 

let mymap = L.map('mapid');

var Thunderforest_Neighbourhood = L.tileLayer('https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=68076b33f11346558149186795fcc243', {
    attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    apikey: '68076b33f11346558149186795fcc243',
    maxZoom: 22,

}).addTo(mymap);




//Gets Users Current Location

function getLocation() {

    $.ajax({
        url: 'libs/php/getCountryList.php',
        type: 'POST',
        dataType: 'JSON',
        success: (result) => {


            const successCallback = (position) => {

                fetch('https://extreme-ip-lookup.com/json/')
                    .then(res => res.json())
                    .then(response => {
                        for (let c = 0; c < result.data.length; c++) {

                            if (response.country === result.data[c].name && result.data[c].polygon.type === 'MultiPolygon') {


                                userBorder = L.geoJSON({ type: "MultiPolygon", coordinates: result.data[c].polygon.coordinates }, {

                                    weight: 3,

                                    color: 'green',

                                    fillColor: 'rgb(31, 82, 109)',

                                    fillOpacity: 0.25

                                });

                                userBorder.addTo(mymap);
                                mymap.fitBounds(userBorder.getBounds());


                                var redMarker = L.ExtraMarkers.icon({
                                    markerColor: 'orange-dark',
                                    shape: 'circle',
                                    prefix: 'fa'


                                });



                                $('select').val(result.data[c].code);
                                getCountryInfo(result.data[c].name);

                                markerfive = L.marker([position.coords.latitude, position.coords.longitude], { icon: redMarker }).bindTooltip('You Are Here!').addTo(mymap);


                            } else if (response.country === result.data[c].name && result.data[c].polygon.type === 'Polygon') {


                                userBorder = L.geoJSON({ type: "Polygon", coordinates: result.data[c].polygon.coordinates }, {

                                    weight: 3,

                                    color: 'green',

                                    fillColor: 'rgb(31, 82, 109)',

                                    fillOpacity: 0.25

                                });

                                userBorder.addTo(mymap);
                                mymap.fitBounds(userBorder.getBounds());


                                var redMarker = L.ExtraMarkers.icon({
                                    markerColor: 'orange-dark',
                                    shape: 'circle',
                                    prefix: 'fa'
                                });



                                $('select').val(result.data[c].code);
                                getCountryInfo(result.data[c].name);

                                markerfive = L.marker([position.coords.latitude, position.coords.longitude], { icon: redMarker }).bindTooltip('You Are Here!').addTo(mymap);


                            }
                        }
                    })
                    .catch((data, status) => {
                        console.log('Request failed');
                    });




            };
            const errorCallback = (error) => {
                console.error(error);
                alert('Your browser does not support geolocation');
            }
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);




        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.warn(jqXHR.responseText)
            console.log(errorThrown);

        }
    })
};

//Info Button
L.easyButton('<i class="material-icons icon">info</i>', function() {
    $('#myModal').fadeIn();
}, 'General Information').addTo(mymap);


//Weather Button
L.easyButton('<i class="material-icons icon">wb_sunny</i>', function() {
    $('#myModal2').fadeIn();
}, 'Weather Forecast').addTo(mymap);


//Currency Info
L.easyButton('<i class="material-icons icon">euro</i>', function() {
    $('#myModal4').fadeIn();
}, 'Currency Information').addTo(mymap);

//Covid Info Button
L.easyButton('<i class="material-icons icon">coronavirus</i>', function() {
    $('#myModal3').fadeIn();

    createCovidLayer();

}, 'Live Coronavirus Cases').addTo(mymap);


//Historic Sites Button
L.easyButton('<i class="material-icons icon">museum</i>', function() {
    historicSites();
}, 'Nearby Historic Sites').addTo(mymap);

//National Parks Button
L.easyButton('<i class="material-icons icon">landscape</i>', function() {
    nationalParks();
}, 'Nearby National Parks').addTo(mymap);


//Refresh Button
L.easyButton('<i class="material-icons icon">autorenew</i>', function() {
    window.location.reload();
}, 'Refresh').addTo(mymap);


//Closes Modals

$('body').click(function(event) {
    $(".modal").hide();
});

$("#closeButton").click(function() {
    $("#myModal").hide();

});

$("#closeButton2").click(function() {
    $("#myModal2").hide();

});

$("#closeButton3").click(function() {
    $("#myModal3").hide();
    //window.location.reload();

});

$("#closeButton4").click(function() {
    $("#myModal4").hide();

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
                selectCountry.append(`<option value=${country['code']} id =${country['code2']} name=${country['name']} >${country['name']}</option>`)
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
        url: 'libs/php/getCountryList.php',
        type: 'POST',
        dataType: 'JSON',
        data: {
            countryVal: $('#countryList').find(':selected').val(),

        },


        success: (result) => {

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



// Gets country info, weather and covid cases 

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


                marker = L.marker([geoNamesResult.covidData.countryInfo.lat, geoNamesResult.covidData.countryInfo.long]).bindTooltip(`<h2>${geoNamesResult.geoNamesData[0].countryName}</h2><h5>${geoNamesResult.geoNamesData[0].continentName}</h5>Population: ${numberWithCommas(geoNamesResult.geoNamesData[0].population)}</p>`).addTo(mymap);


                //Populates info button popup 

                $('.modal-title').html(`</b>${geoNamesResult.geoNamesData[0].countryName}</b>`);
                $('.modal-body').html(`<table>
                <th><img src=${geoNamesResult.covidData.countryInfo.flag} style="width:70%;"></th>
                <tr><td>Capital: ${geoNamesResult.geoNamesData[0].capital}</td></tr>
                <tr><td>Continent: ${geoNamesResult.geoNamesData[0].continentName}</td></tr> 
                <tr><td>Population: ${numberWithCommas(geoNamesResult.geoNamesData[0].population)}</td></tr>
                <tr><td>Languages: ${geoNamesResult.geoNamesData[0].languages}</td></tr>
                <tr><td>Country Code: ${geoNamesResult.geoNamesData[0].countryCode}</td></tr>
                <tr><td>Wiki:<a href="https://wikipedia.com/wiki/${geoNamesResult.geoNamesData[0].countryName}" target="_blank">Wikipedia Info</a></td></tr>
                </table`);

                //Populates weather button popup 
                $('#modal-title2').html(`</b>${geoNamesResult.geoNamesData[0].countryName}</b>`);
                $('#modal-body2').html(`<table>
                 <tr><td style="font-size:30px;" ><img src='http://openweathermap.org/img/wn/${geoNamesResult.weatherData.weather[0].icon}.png' style='width:60px; height:60px;'>${geoNamesResult.weatherData.weather[0].description}</td></tr>
                <tr><td><img src='./libs/images/temp.png' style='width:40px; height:40px;'>Temp: ${tempConvert(geoNamesResult.weatherData.main.temp).toFixed(0)}° Celcius</td></tr>
                <tr><td><img src='./libs/images/wind.png' style='width:40px; height:40px;'>Wind: ${geoNamesResult.weatherData.wind.speed} mph</td></tr>
                <tr><td style="font-size:20px;">Forecast:</td></tr>
                <tr><td style="font-size:12px;">${geoNamesResult.weatherForData.list[7].dt_txt}</td></tr>
                <tr><td style="font-size:12px;">${geoNamesResult.weatherForData.list[7].weather[0].description}</td></tr>
                <tr><td style="font-size:12px;">${tempConvert(geoNamesResult.weatherForData.list[7].main.temp).toFixed(0)}° Celcius</td></tr>
                <tr><td style="font-size:12px;">${geoNamesResult.weatherForData.list[15].dt_txt}</td></tr>
                <tr><td style="font-size:12px;">${geoNamesResult.weatherForData.list[15].weather[0].description}</td></tr>
                <tr><td style="font-size:12px;">${tempConvert(geoNamesResult.weatherForData.list[15].main.temp).toFixed(0)}° Celcius</td></tr>
      
                </table`);

                //Populates covid info button popup
                $('#modal-title3').html(`</b>${geoNamesResult.geoNamesData[0].countryName}</b>`);
                $('#modal-body3').html(`<table>
                <tr><td>Total Cases: ${numberWithCommas(geoNamesResult.covidData.cases)}</td></tr>
                <tr><td>Total Deaths: ${numberWithCommas(geoNamesResult.covidData.deaths)}</td></tr>
                <tr><td>Active Cases: ${numberWithCommas(geoNamesResult.covidData.active)}</td></tr>
                <tr><td>Critical: ${numberWithCommas(geoNamesResult.covidData.critical)}</td></tr>
                <tr><td>Tests: ${numberWithCommas(geoNamesResult.covidData.tests)}</td></tr>
                <tr><td>Recovered: ${numberWithCommas(geoNamesResult.covidData.recovered)}</td></tr>
                </table`);


                //Populates currency info button popup

                let = exRates = Object.keys(geoNamesResult.exRateData.rates);
                let = exRateVal = Object.values(geoNamesResult.exRateData.rates);


                $('#modal-title4').html(`</b>Currency Info</b>`);
                $('#modal-body4').html(`Currency: ${geoNamesResult.geoNamesData[0].currencyCode}<br>`);

                for (let t = 0; t < 200; t++) {
                    if (exRates[t] === geoNamesResult.geoNamesData[0].currencyCode) {

                        $('#modal-body4').append(`Current Exchange Rate: ${exRateVal[t]}`);
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
                    markerColor: 'yellow',
                    shape: 'circle',
                    prefix: 'fa'
                });

                let markerTwo = L.marker([placeLat, placeLong], { icon: yellMarker }).bindTooltip(`<h5>${placeName}</h5>`).addTo(mymap);

                document.getElementById("countryList").addEventListener("change", function() {
                    mymap.removeLayer(markerTwo);
                });
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
                    markerColor: 'green',
                    shape: 'circle',
                    prefix: 'fa'
                });

                let markerThree = L.marker([placeLat, placeLong], { icon: greenMarker }).bindTooltip(`<h5>${placeName}</h5>`).addTo(mymap);

                document.getElementById("countryList").addEventListener("change", function() {
                    mymap.removeLayer(markerThree);
                });

            }


        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.warn(jqXHR.responseText)
            console.log(errorThrown);
        }

    });

};



// Draws circles on map based on covid data 
const createCovidLayer = () => {

    $.ajax({
        url: "libs/php/countryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#countryList').find(':selected').val()
        },
        success: function(totalCovidResult) {


            for (let i = 0; i < totalCovidResult.totalCovidData.length; i++) {
                if (totalCovidResult.totalCovidData[i].deaths > 500000) {
                    let circle = L.circle([totalCovidResult.totalCovidData[i].countryInfo.lat, totalCovidResult.totalCovidData[i].countryInfo.long], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        radius: 2000000
                    }).addTo(mymap);
                    document.getElementById("countryList").addEventListener("change", function() {
                        mymap.removeLayer(circle);
                    })
                } else if (totalCovidResult.totalCovidData[i].deaths > 300000) {
                    let circle = L.circle([totalCovidResult.totalCovidData[i].countryInfo.lat, totalCovidResult.totalCovidData[i].countryInfo.long], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        radius: 1200000
                    }).addTo(mymap);
                    document.getElementById("countryList").addEventListener("change", function() {
                        mymap.removeLayer(circle);
                    })
                } else if (totalCovidResult.totalCovidData[i].deaths > 200000) {
                    let circle = L.circle([totalCovidResult.totalCovidData[i].countryInfo.lat, totalCovidResult.totalCovidData[i].countryInfo.long], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        radius: 900000
                    }).addTo(mymap);
                    document.getElementById("countryList").addEventListener("change", function() {
                        mymap.removeLayer(circle);
                    })
                } else if (totalCovidResult.totalCovidData[i].deaths > 100000) {
                    let circle = L.circle([totalCovidResult.totalCovidData[i].countryInfo.lat, totalCovidResult.totalCovidData[i].countryInfo.long], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        radius: 700000
                    }).addTo(mymap);
                    document.getElementById("countryList").addEventListener("change", function() {
                        mymap.removeLayer(circle);
                    })
                } else if (totalCovidResult.totalCovidData[i].deaths > 50000) {
                    let circle = L.circle([totalCovidResult.totalCovidData[i].countryInfo.lat, totalCovidResult.totalCovidData[i].countryInfo.long], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        radius: 600000
                    }).addTo(mymap);
                    document.getElementById("countryList").addEventListener("change", function() {
                        mymap.removeLayer(circle);
                    })
                } else {
                    let circle = L.circle([totalCovidResult.totalCovidData[i].countryInfo.lat, totalCovidResult.totalCovidData[i].countryInfo.long], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 0.5,
                        radius: 200000
                    }).addTo(mymap);
                    document.getElementById("countryList").addEventListener("change", function() {
                        mymap.removeLayer(circle);
                    })
                }

            };

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
$('document').ready(getLocation());
document.getElementById("countryList").addEventListener("change", getCountryInfo);