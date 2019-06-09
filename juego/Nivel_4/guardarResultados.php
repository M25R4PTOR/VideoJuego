<?php
    include_once("../../assets/php/bd.php");
	setlocale(LC_ALL,"es_ES");
    session_start();
    
     
    if(!isset($_SESSION['Login']) && !isset($_COOKIE['login'])){ 
        header("location: index.php");
    }

    $consulta = $dwes->prepare('SELECT Desbloqueado, Puntuacion FROM login_nivel WHERE Id_Nivel=4 AND Id_Login = (SELECT Id_Login FROM login WHERE Usuario=\''.$_SESSION['Login'].'\')');
    $consulta->execute();
    $guardado = true;
    while ($desbloqueado = $consulta->fetch()) {
        $auxPuntos = (int)$_GET['puntos'];
        $auxPuntuacion = (int)$desbloqueado['Puntuacion'];
        if (($desbloqueado['Desbloqueado'] == '0') || ($auxPuntos <= $auxPuntuacion)) {
            $guardado = false;
        } 
    }

    if($guardado){
        $actualizacion= $dwes->prepare('UPDATE login_nivel SET Fecha_Guardado=NOW(), Desbloqueado=1, Puntuacion='.$_GET['puntos'].' WHERE Id_Nivel=4 AND Id_Login = (SELECT Id_Login FROM login WHERE Usuario=\''.$_SESSION['Login'].'\')');
        $actualizacion->execute();

        $actualizacion= $dwes->prepare('UPDATE login_nivel SET  Desbloqueado=1 WHERE Id_Nivel=5 AND Id_Login = (SELECT Id_Login FROM login WHERE Usuario=\''.$_SESSION['Login'].'\')');
        $actualizacion->execute();

        header("location: ../../niveles.php?guardado=".$_GET['puntos']."&nivel=4");
    }else{
        header("location: ../../niveles.php");
    }
?>
<!doctype html> 
<html lang="en"> 
<head> 
    <meta charset="UTF-8" />
    <title>Nivel 4</title>
    <style type="text/css">
        * {
            margin: 0;
            padding: 0;
        }

    </style>
	
	<meta name="viewport" content="initial-scale=1 user-scalable=0" />
</head>
<body>
    <h1>Partida Guardada Exitosamente!</h1>
    <div id="contenedor"></div>

</body>
</html>