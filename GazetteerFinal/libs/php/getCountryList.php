<?php

    $executionStartTime = microtime(true);

    $countryData = json_decode(file_get_contents("../geoJson/countryBorders.geo.json"), true);

    $country = [];

    foreach ($countryData['features'] as $feature) {
        
        $info['code'] = $feature['properties']['iso_a2'];
        //$info['code2'] = $feature['properties']['iso_a3'];
        $info['name'] = $feature['properties']['name'];
      
        array_push($country, $info);
    }
    usort($country, function ($item1, $item2) { 
        return $item1['name'] <=> $item2['name'];
    });
    

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $country;

    


    


    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);
?>