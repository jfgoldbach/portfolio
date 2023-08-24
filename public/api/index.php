<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

function errorHandler(
    int $errno,
    string $errstr,
    ?string $file = null,
    ?int $line = null
) {
    echo "#" . $errno . ": " . $errstr . " in " . $file . " on line " . $line . "\n";
};

set_error_handler('errorHandler', E_ALL);

//error_reporting(0);

/* // Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
    // you want to allow, and if so:
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        // may also be using PUT, PATCH, HEAD etc
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
} */


$mysqli = require __DIR__ . "/db_connection.php";
$JWT_KEY = require __DIR__ . "/jwt_key.php";
require __DIR__ . "/functions.php";

$method = $_SERVER['REQUEST_METHOD'];
$type = $_GET['type'];
$user_ip = $_SERVER['REMOTE_ADDR'];
$headers = getallheaders();

$msg_invalid = "Invalid access token.";
$msg_missing = "Access token is missing.";



switch ($method) {
    case "GET":
        switch ($type) {
                //GET without jwt

            case "test":
                echo "hello";
                break;


            case "guestToken":
                $jwt = get_jwt($JWT_KEY, "Guest", "-", false);
                if ($jwt) {
                    echo $jwt;
                    http_response_code(200);
                } else {
                    die("Error while getting jwt token.");
                    http_response_code(400);
                }
                break;

            case "attempts":
                $sql = "SELECT attempts FROM remarkable_ips WHERE ip = '{$user_ip}'";
                $result = $mysqli->query($sql)->fetch_assoc();
                if (empty($result["attempts"])) {
                    echo "[0, \"{$user_ip}\"]";
                    http_response_code(200);
                } else {
                    echo "[{$result["attempts"]}, \"{$user_ip}\"]";
                    http_response_code(200);
                }
                break;


            default:
                $jwt;
                //check for jwt in header
                if(isset($headers["jwt"])) {
                    $jwt = $headers["jwt"];
                } else {
                    http_response_code(400);
                    die("JWT expected in header, but couldn't be found.");
                }
                if ($jwt) {
                    $valid = verify_jwt($jwt, $JWT_KEY);
                    if ($valid) {
                        switch ($type) {
                                //GET with jwt

                            case "login":
                                $sql = sprintf(
                                    "SELECT * FROM user WHERE user = '%s'",
                                    $mysqli->real_escape_string($_GET["user"]) //to prevent injection of code
                                );
                                $result = $mysqli->query($sql);
                                $user = $result->fetch_assoc();
                                if (!empty($user)) {
                                    if (password_verify($_GET["password"], $user["password_hash"])) {
                                        //correct password
                                        $sql = "UPDATE remarkable_ips SET attempts  = 0, remark = 'Logged in successfully as admin' WHERE ip = '{$user_ip}'"; //update if there is an entry
                                        $mysqli->query($sql);
                                        $jwt = get_jwt($JWT_KEY, $user["user"], $user["password_hash"], true);
                                        echo $jwt;
                                        http_response_code(200);
                                    } else {
                                        //wrong password
                                        $sql = "SELECT * FROM remarkable_ips WHERE ip = '{$user_ip}'";
                                        $ip_info = $mysqli->query($sql)->fetch_assoc();
                                        if (empty($ip_info)) {
                                            //insert entry
                                            $sql = "INSERT INTO remarkable_ips (ip, attempts, remark) VALUES ('{$user_ip}', 1, 'Entered wrong login credentials')";
                                            $mysqli->query($sql);
                                        } else {
                                            //update entry
                                            $attempts = $ip_info["attempts"] + 1;
                                            $sql = "UPDATE remarkable_ips SET attempts  = {$attempts}, remark = 'Entered wrong login credentials' WHERE ip = '{$user_ip}'";
                                            $mysqli->query($sql);
                                        }
                                        http_response_code(404);
                                    }
                                } else {
                                    $sql = "SELECT * FROM remarkable_ips WHERE ip = '{$user_ip}'";
                                    $ip_info = $mysqli->query($sql)->fetch_assoc();
                                    if (empty($ip_info)) {
                                        //insert entry
                                        $sql = "INSERT INTO remarkable_ips (ip, attempts, remark) VALUES ('{$user_ip}', 1, 'Entered wrong login credentials')";
                                        $mysqli->query($sql);
                                    } else {
                                        //update entry
                                        $attempts = $ip_info["attempts"] + 1;
                                        $sql = "UPDATE remarkable_ips SET attempts  = {$attempts}, remark = 'Entered wrong login credentials' WHERE ip = '{$user_ip}'";
                                        $mysqli->query($sql);
                                    }
                                    http_response_code(404); //could also bee 500 but this would gave away info about the username
                                }
                                break;


                            case "adminPanel":
                                $sql = "SELECT content FROM pages WHERE name = 'admin_panel'";
                                $response = $mysqli->query($sql);
                                $result = $response->fetch_assoc();
                                if ($result["content"]) {
                                    echo $result["content"];
                                    http_response_code(200);
                                } else {
                                    echo "Error in db entry.";
                                    http_response_code(500);
                                }
                                break;


                            case "ap_content":
                                $page = $_GET["page"];
                                $protected = null;
                                $sql = "SELECT content FROM pages WHERE name = 'admin_panel'";
                                $response = $mysqli->query($sql);
                                $result = $response->fetch_assoc();
                                $data = json_decode($result["content"]);
                                //search in admin panel config, if the requested page is protected:
                                foreach ($data->navigation as $section) {
                                    foreach ($section->items as $item) {
                                        if ($item->path === $page) {
                                            $protected = $item->admin_only;
                                            break;
                                        }
                                    }
                                    if ($protected !== null) {
                                        break;
                                    }
                                }

                                $admin = check_admin($jwt, $JWT_KEY);

                                if (!$protected || ($protected && $admin)) {
                                    $sql = "SELECT content FROM pages WHERE name = '" . $page . "'";
                                    $response = $mysqli->query($sql);
                                    $result = $response->fetch_assoc();
                                    if ($result) {
                                        echo $result["content"];
                                    } else {
                                        echo "Invalid page name.";
                                        http_response_code(404);
                                    }
                                } else {
                                    echo "Access denied.";
                                    http_response_code(403);
                                }
                                break;


                            case "ap_category":
                                switch ($_GET["category"]) {
                                    case "landingpage":
                                        $sql = "SELECT content FROM pages WHERE name = ''";
                                }
                                break;


                            case "landingpage":
                                $sql = "SELECT content FROM pages WHERE name = 'landingpage'";
                                $response = $mysqli->query($sql);
                                $result = $response->fetch_assoc();
                                echo $result["content"];
                                break;


                            case "style":
                                $sql = "SELECT content FROM styles WHERE name = '" . $_GET["name"] . "'";
                                $response = $mysqli->query($sql);
                                $result = $response->fetch_assoc();
                                echo $result["content"];
                                break;


                            case "single":
                                $cols = array("id", "name", "info", "preview", "link", "skillcards", "liveLink", "githubLink", "sections");

                                $id = $_GET['id'] != null ? $_GET['id'] : 1;

                                $table = "";
                                if(isset($_GET['category'])){
                                    $table = $_GET['category'];
                                } else {
                                    http_response_code(400);
                                    die("A category needs to be provided.");
                                }

                                $sql = "SELECT " . implode(",", $cols) . " FROM " . $table . " WHERE id = " . $id . ";";
                                $result = $mysqli->query($sql);
                                $response = $result->fetch_assoc();

                                echo "{";
                                foreach ($response as $col => $value) {
                                    echo "\"" . $col . "\": ";
                                    if ($col === "skillcards" || $col === "sections" || $col === "preview") { //skillcards and sections arent strings
                                        if ($value !== "") {
                                            echo $value;
                                        } else {
                                            echo "\"\""; //value is empty, replace it with two quotes
                                        }
                                    } else {
                                        echo "\"" . $value . "\"";
                                    }
                                    if ($col !== array_key_last($response)) { //only add comma when not on last index
                                        echo ", ";
                                    }
                                };
                                echo "}";
                                break;


                            case "all_overview":
                                $cols = array("id", "name", "info", "link", "thumbnail", "video", "skillcards", "description", "priority");
                                $sql = "SELECT " . implode(",", $cols) . " FROM projects;";
                                $result = $mysqli->query($sql);
                                $response = $result->fetch_all();

                                //sorting the response by priority:
                                function priority($project)
                                {
                                    return $project[8]; //cant access key of original object, only index
                                }

                                $prios = array_map("priority", $response);
                                $ordered = sortByPriority($response, $prios); //order

                                //start whole object
                                $stringExcepts = [0, 6, 7];
                                overviewToJSON($ordered, $stringExcepts, $cols);
                                break;


                            case "game_overview":
                                $cols = array("id", "name", "info", "link", "thumbnail", "video", "skillcards", "description", "priority");
                                $sql = "SELECT " . implode(",", $cols) . " FROM gameProjs;";
                                $result = $mysqli->query($sql);
                                $response = $result->fetch_all();

                                //sorting the response by priority:
                                function priority($project)
                                {
                                    return $project[8]; //cant access key of original object, only index
                                }

                                $prios = array_map("priority", $response);
                                $ordered = sortByPriority($response, $prios); //order

                                //start whole object
                                $stringExcepts = [0, 6, 7, 8];
                                overviewToJSON($ordered, $stringExcepts, $cols);
                                break;
                            
                            case "footer_content":
                                $sql = "SELECT content FROM pages WHERE name = 'footer'";
                                $result = $mysqli->query($sql);
                                $response = $result->fetch_all();
                                echo($response[0][0]);
                                break;

                            case "imprint":
                                $sql = "SELECT content FROM pages WHERE name = 'imprint'";
                                $result = $mysqli->query($sql);
                                $response = $result->fetch_all();
                                echo($response[0][0]);
                                break;
                        
                            case "privacy_policy":
                                $sql = "SELECT content FROM pages WHERE name = 'privacy_policy'";
                                $result = $mysqli->query($sql);
                                $response = $result->fetch_all();
                                echo ($response[0][0]);
                                break;


                            case "models":
                                $cols = array("id", "name", "thumbnail", "path", "vertices");
                                $sql = "SELECT * FROM models;";
                                $result = $mysqli->query($sql);
                                $response = $result->fetch_all();

                                $stringExcepts = [0, 4];
                                overviewToJSON($response, $stringExcepts, $cols);
                                break;


                            default:
                                echo "Method not found.";
                                http_response_code(400);
                                break;
                        }
                    } else {
                        //provided GET jwt is invalid
                        echo $msg_invalid;
                        http_response_code(400);
                    }
                } else {
                    //no GET jwt has been provided
                    echo $msg_invalid;
                    http_response_code(400);
                }
        }
        break;


    case "POST":
        switch ($type) {


            case "ap_update":
                $jwt = $headers["jwt"];

                if ($jwt) {
                    $changes;
                    //Convert provided "changes" object into associative array
                    try {
                        $changes = json_decode($headers["changes"], true);
                    } catch (Exception $e) {
                        die("Transmitted content hasn't the right format: " . $e);
                        http_response_code(400);
                    }
                    $valid = verify_jwt($jwt, $JWT_KEY) && check_admin($jwt, $JWT_KEY);

                    if ($valid) {
                        //jwt is valid, try to create and query the request
                        $sql = "UPDATE pages SET content = JSON_REPLACE(content, ";

                        function createResult($path, $value, $mysqli, $escape, $isArray){
                            $result = ""; //finish statement
                            if(isset($escape) && $escape){
                                $value = $mysqli->real_escape_string($value);
                            }
                            if($isArray) {
                                $result = "'$." . $path . "', JSON_ARRAY('" . $value . "')";
                            } else if (gettype($value) === "string") {
                                $result = "'$." . $path . "', '" . $value . "'";
                            } else {
                                $result = "'$." . $path . "', " . $value;
                            }
                            return $result;
                        }


                        function createBranch($next, $path, $mysqli){
                            if (gettype($next) === "array") {
                                if (isset($next[0]) && $next[0] === "adoptArray") {
                                    $value = $next;
                                    array_shift($value); //removes adoptArray flag
                                    $value = json_encode($value);
                                    return createResult($path, $value, $mysqli, false, true);
                                } else {
                                    $stick = "";
                                    foreach ($next as $key => $value) {
                                        $prevAdded = $path . "." . $key; //concat with following key
                                        $stick .= createBranch($value, $prevAdded, $mysqli);
                                        if (!($key === array_key_last($next))) {
                                            $stick .=  ", "; //seperator
                                        }
                                    }
                                    return $stick;
                                }
                            } else {
                                return createResult($path, $next, $mysqli, true, false);
                            }
                        }


                        foreach ($changes as $key => $value) {
                            $sql .= createBranch($value, $key, $mysqli); //adding selector for json file
                            if ($key === array_key_last($changes)) {
                                $sql .= ")"; //closing argument
                            } else {
                                $sql .= ", "; //adding seperator if not last entry
                            }
                        }

                        echo ($sql);
                        try {
                            $mysqli->query($sql);
                            http_response_code(200);
                            echo ("Sucessfully updated");
                        } catch(Exception $e) {
                            http_response_code(500);
                            die("Database query wasn't successful: " . $e);
                        }
                    } else {
                        http_response_code(403);
                        die("No permission to update the database.");
                    }
                } else {
                    http_response_code(400);
                    die("Access token is missing.");
                }
                break;
        }
        break;
};

$mysqli->close();
//echo phpinfo()