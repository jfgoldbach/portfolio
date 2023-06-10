<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");


$mysqli = require __DIR__ . "/db_connection.php";
$JWT_KEY = require __DIR__ . "/jwt_key.php";

$method = $_SERVER['REQUEST_METHOD'];
$type = $_GET['type'];
$user_ip = $_SERVER['REMOTE_ADDR'];
$headers = getallheaders();


$msg_invalid = "Invalid access token.";
$msg_missing = "Access token is missing.";


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



switch($method){
    case "GET":
        switch($type){

            case "test":
                break;


            case "login":
                $sql = sprintf("SELECT * FROM user WHERE user = '%s'", 
                                $mysqli->real_escape_string($_GET["user"])); //to prevent injection of code
                $result = $mysqli->query($sql);
                $user = $result->fetch_assoc();
                if($user){
                    if (password_verify($_GET["password"], $user["password_hash"])){
                        $jwt = get_jwt($JWT_KEY, $user["user"], $user["password_hash"], true);
                        echo $jwt;
                        http_response_code(200);
                    } else {
                        //echo "false";
                        //$sql = sprintf("SELECT remark FROM remarkable_ips WHERE ip = '%s'", $user_ip);
                        //$result = $mysqli->query($sql);
                        //print_r($user_ip);
                        http_response_code(404);
                    }
                }
                break;


            case "guestToken":
                $jwt = get_jwt($JWT_KEY, "Guest", "-", false);
                if($jwt){
                    echo $jwt;
                    http_response_code(200);
                } else {
                    die("Error while getting jwt token.");
                    http_response_code(400);
                }
                break;

            
            case "adminPanel":
                $jwt = $headers["jwt"];
                if($jwt){
                    $valid = verify_jwt($jwt, $JWT_KEY);
                    if($valid){
                        $sql = "SELECT content FROM pages WHERE name = 'admin_panel'";
                        $response = $mysqli->query($sql);
                        $result = $response->fetch_assoc();
                        if($result["content"]){
                            echo $result["content"];
                            http_response_code(200);
                        } else {
                            echo "Error in db entry.";
                            http_response_code(500);
                        }
                        
                    } else {
                        echo $msg_invalid;
                        http_response_code(400);
                    }
                } else {
                    echo $msg_invalid;
                    http_response_code(400);
                }
                break;

        
            case "ap_category":
                switch($_GET["category"]){
                    case "landingpage":
                        $sql = "SELECT content FROM pages WHERE name = ''";
                }
                break;

            
            case "landingpage":
                $jwt = $headers["jwt"];
                if($jwt){
                    $valid = verify_jwt($jwt, $JWT_KEY);
                    if($valid){
                        $sql = "SELECT content FROM pages WHERE name = 'landingpage'";
                        $response = $mysqli->query($sql);
                        $result = $response->fetch_assoc();
                        echo $result["content"];
                    } else {
                        die("Invalid access token.");
                    }
                } else {
                    die("Access token is missing.");
                    http_response_code(400);
                }
                break;

            case "style":
                $jwt = $headers["jwt"];
                if($jwt){
                    $valid = verify_jwt($jwt, $JWT_KEY);
                    if($valid){
                        $sql = "SELECT content FROM styles WHERE name = '" . $_GET["name"] . "'";
                        $response = $mysqli->query($sql);
                        $result = $response->fetch_assoc();
                        echo $result["content"];
                    } else {
                        die("Invalid access token.");
                    }
                } else {
                    die("Access token is missing.");
                    http_response_code(400);
                }
                break;


            case "single": //get data for article
                $jwt = $headers["jwt"];
                if($jwt){
                    $valid = verify_jwt($jwt, $JWT_KEY);
                    if($valid){
                        $cols = array("id","name","info","preview","link","skillcards","liveLink","githubLink","sections");
                        $id = $_GET['id'] != null ? $_GET['id'] : 1;
                        $sql = "SELECT " . implode(",", $cols) . " FROM projects WHERE id = " . $id . ";";
                        $result = $mysqli->query($sql);
                        $response = $result->fetch_assoc();

                        echo "{";
                        foreach($response as $col => $value){
                            echo "\"" . $col . "\": ";
                            if($col === "skillcards" || $col === "sections" ||$col === "preview"){ //skillcards and sections arent strings
                                if($value !== ""){
                                    echo $value;
                                } else {
                                    echo "\"\""; //value is empty, replace it with two quotes
                                }
                            }else{
                                echo "\"" . $value . "\"";
                            }
                            if($col !== array_key_last($response)){ //only add comma when not on last index
                                echo ", ";
                            }
                        };
                        echo "}";
                        //echo $result["content"];

                    } else {
                        die("Invalid access token.");
                        http_response_code(400);
                    }
                } else {
                    die("Access token is missing.");
                    http_response_code(400);
                }
                break;



            case "all_overview": //get data to preview articles
                $jwt = $headers["jwt"];
                if($jwt){
                    $valid = verify_jwt($jwt, $JWT_KEY);
                    if($valid){
                        $cols = array("id","name","info","link","thumbnail","video","skillcards","description","priority");
                        $sql = "SELECT " . implode(",", $cols) . " FROM projects;";
                        $result = $mysqli->query($sql);
                        $response = $result->fetch_all();

                        //sorting the response by priority:
                        function priority($project) {
                            return $project[8]; //cant access key of original object, only index
                        }

                        $prios = array_map("priority", $response);
                        $ordered = sortByPriority($response, $prios); //order

                        //start whole object
                        $stringExcepts = [0, 6, 7];
                        overviewToJSON($ordered, $stringExcepts, $cols);
                    } else {
                        die("Invalid access token.");
                        http_response_code(400);
                    }
                } else {
                    die("Access token is missing.");
                    http_response_code(400);
                }
                
                break;



            case "game_overview":
                $jwt = $headers["jwt"];
                if($jwt){
                    $valid = verify_jwt($jwt, $JWT_KEY);
                    if($valid){
                        $cols = array("id","name","info","link","thumbnail","video","skillcards","description","priority");
                        $sql = "SELECT " . implode(",", $cols) . " FROM gameProjs;";
                        $result = $mysqli->query($sql);
                        $response = $result->fetch_all();

                        //sorting the response by priority:
                        function priority($project) {
                            return $project[8]; //cant access key of original object, only index
                        }

                        $prios = array_map("priority", $response);
                        $ordered = sortByPriority($response, $prios); //order

                        //start whole object
                        $stringExcepts = [0, 6, 7, 8];
                        overviewToJSON($ordered, $stringExcepts, $cols);
                    } else {
                        die("Invalid access token.");
                        http_response_code(400);
                    }
                } else {
                    die("Access token is missing.");
                    http_response_code(400);
                }
                break;


            case "models":
                $cols = array("id", "name", "thumbnail", "path", "vertices");
                $sql = "SELECT * FROM models;";
                $result = $mysqli->query($sql);
                $response = $result->fetch_all();

                $stringExcepts = [0, 4];
                overviewToJSON($response, $stringExcepts, $cols);
                break;
            


            case "ap_content":
                $jwt = $headers["jwt"];
                $page = $_GET["page"];
                if($jwt){
                    $valid = verify_jwt($jwt, $JWT_KEY);
                    if($valid){
                        $protected = null;
                        $sql = "SELECT content FROM pages WHERE name = 'admin_panel'";
                        $response = $mysqli->query($sql);
                        $result = $response->fetch_assoc();
                        $data = json_decode($result["content"]);
                        //search in admin panel config, if the requested page is protected:
                        foreach($data->navigation as $section){
                            foreach($section->items as $item){
                                if($item->path === $page){
                                    $protected = $item->admin_only;
                                    break;
                                }
                            }
                            if($protected !== null){
                                break;
                            }
                        }

                        $admin = check_admin($jwt, $JWT_KEY);

                        if(!$protected || ($protected && $admin)){
                            $sql = "SELECT content FROM pages WHERE name = '" . $page . "'";
                            $response = $mysqli->query($sql);
                            $result = $response->fetch_assoc();
                            if($result){
                                echo $result["content"];
                            } else {
                                echo "Invalid page name.";
                                http_response_code(404);
                            }
                        } else {
                            echo "Access denied.";
                            http_response_code(403);
                        }
                            
                    } else {
                        echo "Invalid access token.";
                    }
                } else {
                    echo "Access token is missing.";
                    http_response_code(400);
                }  
            break;


            default:
                echo "Method not found.";
                http_response_code(400);
                break;
        }
        break;


    case "POST":
        switch($type){
            case "ap_update":
                $jwt = $headers["jwt"];
                if($jwt){
                    $content = $headers["content"];
                    $valid = verify_jwt($jwt, $JWT_KEY) && check_admin($jwt, $JWT_KEY);
                    if($valid){
                        if(is_object(json_decode($content))){
                            $sql = "UPDATE pages SET content='" . $content . "' WHERE name ='" . $_GET["row"] . "'";
                            if($mysqli->query($sql)){
                                echo("Sucessfully updated");
                                http_response_code(200);
                            } else{
                                die("Error");
                            }
                        } else {
                            die("Sent content is not an object");
                            http_response_code(400);
                        }
                    } else {
                        die("No permission to update the database.");
                        http_response_code(403);
                    }
                } else {
                    die("Access token is missing.");
                    http_response_code(400);
                }
                break;
        }
        break;
};

$mysqli->close();
//echo phpinfo()
?>