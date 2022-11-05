<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$server = "sql859.main-hosting.eu"; //"sql859.main-hosting.eu" in development, "localhost" in production
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

switch($method){
    case "GET":
        $id = $_GET['id'] != null ? $_GET['id'] : 1;
        $sql = "SELECT id,name,info,link,skillcards,liveLink,githubLink,sections FROM projects WHERE id = " . $id . ";";
        $result = $con->query($sql);
        $response = $result->fetch_array(MYSQLI_ASSOC);

        //echo "{\"id\": 1, \"name\": \"test\"}";
        echo "{";
        foreach($response as $col => $value){
            echo "\"" . $col . "\": ";
            if($col === "skillcards" || $col === "sections"){ //skillcards and sections arent string
                if($value !== ""){
                    echo $value;
                } else {
                    echo "\"\""; //value is empty, replace it with two quotes
                }
            }else{
                echo "\"" . $value . "\"";
            }
            if($col != array_key_last($response)){ //only add comma when not on last index
                echo ", ";
            }
        };
        echo "}";
        //print_r($response);
        //echo $response['sections'];
        break;
};

$con->close();
//echo phpinfo()
?>