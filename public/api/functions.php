<?php

function sortByPriority($response, $prios) {
    $ordered = array();
    $length = count($response);
    for($i = 0; $i<$length; $i++){
        $highest = max($prios);
        $nextItem = array_filter($response, fn($project) => $project[8] === $highest);
        $nextProj;
        $curIndex;
        foreach($nextItem as $index => $proj){ //extract the project data and key (index from original $response array)
            $nextProj = $proj;
            $curIndex = $index;
        }
        array_splice($response, $curIndex, 1); //remove project from response based on projects position in array
        array_push($ordered, $nextProj);
        array_splice($prios, $curIndex, 1);
    }
    return $ordered;
};


function overviewToJSON($rawArray, $stringExcepArray, $cols){ //php array & array of columns that shouldn't be treated as strings & columns
    echo"[";
        foreach($rawArray as $row => $row_values){
            //start of project object
            echo "{";

            foreach($row_values as $col => $value){
                echo "\"" . $cols[$col] . "\": ";
                if($value !== ""){
                    if(count(array_filter($stringExcepArray, fn($i) => $i === $col)) === 1){ //no quotes on these -> no string
                        echo $value;
                    }else{
                        echo "\"" . $value . "\"";
                    }
                }else {
                    echo "\"\""; //value is empty
                }
                if($col !== array_key_last($row_values)){ //add comma if not last key-value pair in object
                    echo ", ";
                }
                //echo "<br/>";
            }

            echo "}"; //end of project object

            if($row !== array_key_last($rawArray)){ //add comma at end if not last object
                echo ", ";
            }
            //echo "<br/>";
        }
        echo "]";
};

function base64_url_encode($input) {
    return str_replace(["+", "/", "="], ["-", "_", ""], base64_encode($input));
}

function base64_url_decode($input) {
    return base64_decode(str_replace(["-", "_", ""], ["+", "/", "="], $input));
}

function get_jwt($key, $user, $hash, $admin) {
    $header = [
        "alg" => "HS512", 
        "typ" => "JWT",
    ];
    $cur_time = time();
    $payload = [
        "iss" => "jfgoldbach.de",
        "name" => $user,
        "pw_hash" => $hash,
        "iat" => $cur_time,
        "exp" => $cur_time + 900, //expires in 15 minutes
        "admin" => $admin
    ];
    $header = base64_url_encode(json_encode($header));
    $payload = base64_url_encode(json_encode($payload));
    $signature = base64_url_encode(hash_hmac('sha512', "$header.$payload", $key, true));
    $jwt = "$header.$payload.$signature";
    return $jwt;
}

function verify_jwt($jwt, $key) {
    $components = explode(".", $jwt);
    $valid = $components[2] === base64_url_encode(hash_hmac('sha512', "$components[0].$components[1]", $key, true))
                && json_decode(base64_url_decode($components[1]))->exp > time();
    return $valid;
}

function check_admin($jwt, $key) {
    $components = explode(".", $jwt);
    $isAdmin = json_decode(base64_url_decode($components[1]))->admin === true;
    return $isAdmin;
}

?>