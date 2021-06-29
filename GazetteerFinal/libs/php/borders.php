<?php


ini_set('display_errors', 'On');
	error_reporting(E_ALL & ~E_NOTICE);

	$output = [];

	
    $executionStartTime = microtime(true);

    $countryData = json_decode(file_get_contents("../geoJson/countryBorders.geo.json"), true);

    $country = [];

    foreach ($countryData['features'] as $feature) {
        
        $info['name'] = $feature['properties']['name'];
        $info['code'] = $feature['properties']['iso_a2'];
        $info['polygon'] = $feature['geometry'];
        
        array_push($country, $info);
    }
   
    

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $country;



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
    


    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>