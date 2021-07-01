<?php


    ini_set('display_errors', 'On');
	error_reporting(E_ALL & ~E_NOTICE);

	
    $executionStartTime = microtime(true);

    $output = [];


    //Ltlngs

    $ch = curl_init('http://api.geonames.org/countrySubdivisionJSON?lat='.$_REQUEST['lat'].'&lng='.$_REQUEST['lng'].'&username=jckhdd95');
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
   

    $ltlngsResult=curl_exec($ch);

    curl_close($ch);

    $ltlngsDecode = json_decode($ltlngsResult,true);	

    $output['status']['name'] = "ok";
    $output['ltlngsData'] = $ltlngsDecode;

    //Country Name Data

    $countryData = json_decode(file_get_contents("../geoJson/countryBorders.geo.json"), true);

    $country = [];

    foreach ($countryData['features'] as $feature) {
        
        $info['name'] = $feature['properties']['name'];
        $info['code'] = $feature['properties']['iso_a2'];
        
       
        array_push($country, $info);
    }
   
    //Border Data
    
    $countryBorders = json_decode(file_get_contents("../geoJson/countryBorders.geo.json"), true);

    $border = [];
    $geoJSON = [];
    $countryVal = $_REQUEST['countryVal'];

    foreach ($countryBorders['features'] as $feature) {
        
       
       if($feature['properties']['iso_a2'] == $ltlngsDecode['countryCode']){
    
            $border = $feature;
         
       } 
       if($feature['properties']['iso_a2'] == $countryVal){
    
        $geoJSON = $feature;
     
   }
       
    }
    

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['borders']= $border;
    $output['geoJSON']= $geoJSON;
    $output['data'] = $country;
    
    

        header('Content-Type: application/json; charset=UTF-8');

        echo json_encode($output);
?>