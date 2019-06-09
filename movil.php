<!DOCTYPE HTML>
<html lang="es">

<head>
	<title>Login</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
	<link rel="stylesheet" href="assets/css/main.css" />
	<link rel="stylesheet" href="assets/css/estilos.css" />
	<link href="assets/css/bootstrap.min.css" rel="stylesheet">
	<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
	<script src="assets/js/popper.min.js"></script>
	<script src="assets/js/bootstrap.min.js"></script>
	<style>
		body {
  			background: url('assets/images/background3.png') no-repeat center center fixed;
  			-webkit-background-size: cover;
  			-moz-background-size: cover;
  			background-size: cover;
  			-o-background-size: cover;
		}

		#conectar{
			background-color: #ffffff;
		}
	</style>
</head>

<body class="is-preload" >
<?php
	include_once("assets/php/bd.php");
	include_once("assets/php/Mobile_Detect.php");
	setlocale(LC_ALL,"es_ES");
	session_start();
	
	if(!isset($_SESSION['Login']) && !isset($_COOKIE['login'])){ 
		header("location: error.php");
	}
	
	if (isset($_POST['Salir'])) {
		setcookie('login', 'login', time()-1);
		session_destroy();
		header("location: desconexion.php");
	}
?>
	<div class="container">
		<form action='<?php echo $_SERVER['PHP_SELF'];?>' method='post'>
		<div class="container">
			<div class="row">
				<div id="conectar" class="col-12 form-group border border-dark text-center mx-auto d-block">
					<!--<img class="rounded mx-auto d-block" src="assets/images/logo.png" alt="Escudo Videojuego" />-->
					<img src="assets/images/puntuaciones.png" class="img-fluid" alt="Puntuaciones">
					<br><br>
					<?php
						$consulta = $dwes->prepare("SELECT Usuario, Tipo_Login, SUM(Puntuacion) FROM login_nivel n, login l WHERE n.Id_Login = l.Id_Login GROUP BY Usuario ORDER BY Puntuacion DESC LIMIT 6");
						$consulta->execute();
						while ($opciones = $consulta->fetch()) {
							if($opciones['Tipo_Login']=='U'){	
								if($opciones['Usuario'] == $_SESSION['Login']){
									echo "<h5 class='rojo' id=".$opciones['Usuario'].">".$opciones['Usuario']." tiene un total de  ".$opciones['SUM(Puntuacion)']." Puntos</h5>";
								} else {
									echo "<h5 id=".$opciones['Usuario'].">".$opciones['Usuario']." tiene un total de  ".$opciones['SUM(Puntuacion)']." Puntos</h5>";
								}
							}
						}
					?>
					<br>
					<button type="submit" class="form-control mx-auto d-block" name="Salir">Cerrar sesi&oacute;n</button>
				</div>
			</div>
			</div>
		</form>
	</div>
</body>

</html>