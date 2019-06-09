<?php
    try {
        $opciones = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
        $dwes = new PDO('mysql:host=localhost;dbname=fct_daw', 'root', '', $opciones);
    } catch (PDOException $p) {
        exit("Error: ".$p->getMessage()."<br />");
    }
?>