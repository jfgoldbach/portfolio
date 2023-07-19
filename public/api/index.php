<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");


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
                $jwt = $headers["jwt"];
                if ($jwt) {
                    $valid = verify_jwt($jwt, $JWT_KEY);
                    if ($valid) {
                        switch ($type) {
                            //GET with jwt

                            case "login":
                                $sql = sprintf(
                                    "SELECT * FROM user WHERE user = '%s'",
                                    $mysqli->real_escape_string($_GET["user"])
                                ); //to prevent injection of code
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
                                $sql = "SELECT " . implode(",", $cols) . " FROM projects WHERE id = " . $id . ";";
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
                    $content = $headers["content"];
                    $valid = verify_jwt($jwt, $JWT_KEY) && check_admin($jwt, $JWT_KEY);
                    if ($valid) {
                        if (is_object(json_decode($content))) {
                            $sql = "UPDATE pages SET content='" . $content . "' WHERE name ='" . $_GET["row"] . "'";
                            if ($mysqli->query($sql)) {
                                echo ("Sucessfully updated");
                                http_response_code(200);
                            } else {
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