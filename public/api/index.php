<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$server = "localhost"; //"sql859.main-hosting.eu" in development, "localhost" in production
$user = "Julian";
$password = "4@pS:R3+Pg";
$database = "PortfolioData";
$prefix = "u979606964_";

$con = new mysqli($server, $prefix . $user, $password, $prefix . $database);

if ($con -> connect_errno){
    echo "Conntection failed: " . $con -> connect_error;
    die();
}else {
    //echo "Connected successfully on '" . $server  . "' to database '" . $database . "' <br/>";
};



$method = $_SERVER['REQUEST_METHOD'];
$type = $_GET['type'];

switch($method){
    case "GET":
        switch($type){
            case "single": //get data for article
                $id = $_GET['id'] != null ? $_GET['id'] : 1;
                $sql = "SELECT id,name,info,link,skillcards,liveLink,githubLink,sections FROM projects WHERE id = " . $id . ";";
                $result = $con->query($sql);
                $response = $result->fetch_assoc();

                //echo "{\"id\": 1, \"name\": \"test\"}";
                echo "{";
                foreach($response as $col => $value){
                    echo "\"" . $col . "\": ";
                    if($col === "skillcards" || $col === "sections"){ //skillcards and sections arent strings
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
                //print_r($response);
                //echo $response['sections'];
                break;


            case "all_overview": //get data to preview articles
                //echo "type: " . $type . "<hr/><br/><br/>";
                $cols = array("id","name","info","link","thumbnail","video","skillcards","description","priority");
                $sql = "SELECT id,name,info,link,thumbnail,video,skillcards,description,priority FROM projects;";
                $result = $con->query($sql);
                $respone = $result->fetch_all();
                //print_r($respone);

                //start whole object
                echo"[";
                foreach($respone as $row => $row_values){
                    //start individual project object
                    echo "{";
                    foreach($row_values as $col => $value){
                        echo "\"" . $cols[$col] . "\": ";
                        if($value !== ""){
                            if($col == 0 || $col == 6 || $col == 7){ //no quotes on "id", "skillcards" and "description"
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
                    echo "}";
                    if($row !== array_key_last($respone)){ //add comma at end if not last object
                        echo ", ";
                    }
                    //echo "<br/>";
                }
                echo "]";
                break;
        }
        break;
        
};

$con->close();
//echo phpinfo()
?>