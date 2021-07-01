<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL & ~E_NOTICE);

	$output = [];

	$executionStartTime = microtime(true);

    // Gets country info 

	$geoNamesUrl= 'http://api.geonames.org/countryInfoJSON?formatted=true' . '&country=' . $_REQUEST['country'] . '&username=jckhdd95&style=full';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$geoNamesUrl);

	$geoNamesResult=curl_exec($ch);
	
	curl_close($ch);

	$geoNamesDecode = json_decode($geoNamesResult,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['geoNamesData'] = $geoNamesDecode['geonames'];
	


	
	//Historic Sites


	$poiUrl= 'http://api.opentripmap.com/0.1/en/places/bbox?lon_min='.$geoNamesDecode['geonames'][0]['west'].'&lat_min='.$geoNamesDecode['geonames'][0]['south'].'&lon_max='.$geoNamesDecode['geonames'][0]['east'].'&lat_max='.$geoNamesDecode['geonames'][0]['north'].'&kinds=historic&limit=20&format=geojson&apikey=5ae2e3f221c38a28845f05b638a441ddaffffc8416314d17652dcc03';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$poiUrl);

	$poiResult=curl_exec($ch);
	
	curl_close($ch);

	$poiDecode = json_decode($poiResult,true);	

	$output['status']['name'] = "ok";
	$output['poiData'] = $poiDecode;

	//National Parks

	$natUrl= 'http://api.opentripmap.com/0.1/en/places/bbox?lon_min='.$geoNamesDecode['geonames'][0]['west'].'&lat_min='.$geoNamesDecode['geonames'][0]['south'].'&lon_max='.$geoNamesDecode['geonames'][0]['east'].'&lat_max='.$geoNamesDecode['geonames'][0]['north'].'&kinds=national_parks&limit=20&format=geojson&apikey=5ae2e3f221c38a28845f05b638a441ddaffffc8416314d17652dcc03';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$natUrl);

	$natResult=curl_exec($ch);
	
	curl_close($ch);

	$natDecode = json_decode($natResult,true);	

	$output['status']['name'] = "ok";
	$output['natData'] = $natDecode;
	
	
	
	//Gets weather info 

	$weatherUrl= 'http://api.openweathermap.org/data/2.5/weather?q=' . $geoNamesDecode['geonames'][0]['capital'] . '&appid=4c15e7bf85d06d1738d876c99d5e5b75';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$weatherUrl);

	$weatherResult=curl_exec($ch);
	
	curl_close($ch);

	$weatherDecode = json_decode($weatherResult,true);	

	$output['status']['name'] = "ok";
	$output['weatherData'] = $weatherDecode;

	//Gets weather forecast info 

	$weatherForUrl= 'http://api.openweathermap.org/data/2.5/forecast?q='. $geoNamesDecode['geonames'][0]['capital'] .'&appid=4c15e7bf85d06d1738d876c99d5e5b75';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$weatherForUrl);

	$weatherForResult=curl_exec($ch);
	
	curl_close($ch);

	$weatherForDecode = json_decode($weatherForResult,true);	

	$output['status']['name'] = "ok";
	$output['weatherForData'] = $weatherForDecode;


	//Gets Covid Cases

	$covidUrl = 'https://corona.lmao.ninja/v3/covid-19/countries/' . $geoNamesDecode['geonames'][0]['countryName'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$covidUrl);

	$covidResult=curl_exec($ch);
	
	curl_close($ch);

	$covidDecode = json_decode($covidResult,true);	

	$output['status']['name'] = "ok";
	$output['covidData'] = $covidDecode;

	
	//News
	$newsUrl = 'https://newsapi.org/v2/top-headlines?country='. $geoNamesDecode['geonames'][0]['countryCode'].'&apiKey=5ffd98b160de43e5bf9f8d2ef6b95134';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$newsUrl);

	$newsResult=curl_exec($ch);

	curl_close($ch);

	$newsDecode = json_decode($newsResult,true);	

	$output['status']['name'] = "ok";
	$output['newsData'] = $newsDecode;


	//Ltlngs

	$ltlngsUrl = 'http://api.geonames.org/countrySubdivisionJSON?lat='.$_REQUEST['lat'].'&lng='.$_REQUEST['lng'].'&username=jckhdd95';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$ltlngsUrl);

	$ltlngsResult=curl_exec($ch);

	curl_close($ch);

	$ltlngsDecode = json_decode($ltlngsResult,true);	

	$output['status']['name'] = "ok";
	$output['ltlngsData'] = $ltlngsDecode;



	//Gets Exchange Rates//

	$exRateUrl = 'https://openexchangerates.org/api/latest.json?app_id=1134e80133444ad7a74568f9e55c24dd';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$exRateUrl);

	$exRateResult=curl_exec($ch);
	
	curl_close($ch);

	$exRateDecode = json_decode($exRateResult,true);	


	
	$output['status']['name'] = "ok";
	$output['exRateData'] = $exRateDecode;  
	
	
	
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 


?>
