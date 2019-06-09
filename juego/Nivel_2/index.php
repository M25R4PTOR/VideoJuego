<?php
    include_once("../../assets/php/bd.php");
	setlocale(LC_ALL,"es_ES");
    session_start();
    
     
    if(!isset($_SESSION['Login']) && !isset($_COOKIE['login'])){ 
        header("location: ../../error.php");
    }

    $consulta = $dwes->prepare('SELECT Desbloqueado FROM login_nivel WHERE Id_Nivel=2 AND Id_Login = (SELECT Id_Login FROM login WHERE Usuario=\''.$_SESSION['Login'].'\')');
    $consulta->execute();
    
    while ($desbloqueado = $consulta->fetch()) {
        if ($desbloqueado['Desbloqueado'] == '0') {
            header("location: ../../niveles.php");
        } 
    }
?>
<!doctype html> 
<html lang="en"> 
<head> 
    <meta charset="UTF-8" />
    <title>Nivel 2</title>
    <script type="text/javascript" src="phaser.min.js"></script>
    <script type="text/javascript" src="Escenas/juego.js"></script>
    <script type="text/javascript" src="Escenas/inicio.js"></script>
    <script type="text/javascript" src="Escenas/fin.js"></script>
    <script type="text/javascript" src="Escenas/derrota.js"></script>
    
    <script type="text/javascript" src="carga.js"></script>
    <style type="text/css">
        * {
            margin: 0;
            padding: 0;
        }

    </style>
	
	<meta name="viewport" content="initial-scale=1 user-scalable=0" />
</head>
<body>
    
    <div id="contenedor"></div>

</body>
</html>