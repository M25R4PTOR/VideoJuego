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
  		background: url('assets/images/background1.png') no-repeat center center fixed;
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
				<div class="col-2"></div>
				<div id="conectar" class="col-8 form-group border border-dark text-center mx-auto d-block">
					<!--<img class="rounded mx-auto d-block" src="assets/images/logo.png" alt="Escudo Videojuego" />-->
					<h3>Bienvenido <?php echo $_SESSION['Login']; ?></h3>
					<br>
					<div class="row">
						<?php
                    	    $consulta = $dwes->prepare('SELECT Desbloqueado, Nombre, Puntuacion, Enlace FROM login_nivel ln, nivel n WHERE ln.Id_Nivel = n.Id_Nivel AND ln.Id_Login = (SELECT Id_Login FROM Login WHERE Usuario = "'.$_SESSION['Login'].'")');
                    	    $consulta->execute();
                    	    while ($opciones = $consulta->fetch()) {

								if ($opciones['Desbloqueado'] == '1') {
									if (!empty($opciones['Puntuacion'])) {
										echo "<a class=\"col-md-6\" href='juego/".$opciones['Enlace']."/'>"."<img src=\"assets/images/".$opciones['Enlace'].".png\" class=\"img-fluid\" alt=\"Logo del Videojuego(THIxEF)\"><br>".$opciones['Nombre']." (".$opciones['Puntuacion']." Puntos actualmente)</a></br>";
									} else {
										echo "<a class=\"col-md-6\" href='juego/".$opciones['Enlace']."/'>"."<img src=\"assets/images/".$opciones['Enlace'].".png\" class=\"img-fluid\" alt=\"Logo del Videojuego(THIxEF)\"><br>".$opciones['Nombre']." (Sin puntuar actualmente)</a></br>";
									}		
								} else {
									echo "<a class=\"col-md-6\" href=''>"."<img src=\"assets/images/".$opciones['Enlace'].".png\" style=\"filter: grayscale(100%);\" class=\"img-fluid\" alt=\"Logo del Videojuego(THIxEF)\"><br>".$opciones['Nombre']." (Bloqueado actualmente)</a></br>";
								}

                    	    }
						?>
					</div>
					<br>
					<button type="submit" class="form-control mx-auto d-block" name="Salir">Cerrar sesi&oacute;n</button>
					
				</div>
				<div class="col-2"></div>
            </div>
			</div>
        </form>
	</div>
</body>

</html>
<?php
	if(isset($_GET['guardado'])){
		echo '<div class="alert alert-warning alert-dismissible fade show" role="alert">
		<strong>¡Partida guardada exitosamente!</strong>
		<a class="twitter-share-button" href="https://twitter.com/intent/tweet?text=He completado el Nivel '.$_GET['nivel'].' de THIxEF con '.$_GET['guardado'].' Puntos!" data-size="large">Twittear</a>
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
		<span aria-hidden="true">&times;</span>
		</button>
	  </div>';
	}
	
?>