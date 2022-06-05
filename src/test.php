<?php
    $host = 'localhost';
    $user = 'zptmxj';
    $pw = 'D1e2w3q!!';
    $dbName = 'zptmxj';
    
    $conn = mysqli_connect($host, $user, $pw, $dbName);
        
    $sql = "SELECT * FROM tttt";
    $result = mysqli_query($conn, $sql);    
    $row = mysqli_fetch_array($result);

    $list_array = array("uid" =>$row['uid'],
                        "name" =>$row['name'],
                        "testing" => $row['testing']);

    $result_array = json_encode($list_array);
    
    echo $result_array;
    
?>