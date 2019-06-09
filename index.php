<!DOCTYPE HTML>
<html lang="es">

<head>
	<title>Login</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
	<link rel="stylesheet" href="assets/css/main.css" />
	<link rel="stylesheet" href="assets/css/estilos.css" />
	<link href="assets/css/bootstrap.min.css" rel="stylesheet">
	<!--
		<script src="assets/js/jquery.min.js"></script>
	-->
	<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>

	<script src="assets/js/popper.min.js"></script>
	<script src="assets/js/bootstrap.min.js"></script>
	<style>
		body {
  		background: url('assets/images/background.png') no-repeat center center fixed;
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

	$detect = new Mobile_Detect();

  	if (isset($_POST['login'])) {
		$consulta = $dwes->prepare("SELECT Id_Login, Usuario, Clave FROM login");
		$consulta->execute();
		$errorLogin = TRUE;
		while ($login = $consulta->fetch()) {
			if ($login['Usuario'] == $_POST['usuario'] && $login['Clave'] == md5($_POST['pass'])) {
				$_SESSION['Login'] = $_POST['usuario'];
				setcookie('login', 'login', time()+5*60);
				$errorLogin = FALSE;
				if($detect->isMobile()==false){
					header("location: niveles.php");
				} else {
					header("location: movil.php");
				}
			} 
		}
		if ($errorLogin) {
			header("location: error.php");
		}
	}
?>
  <div class="container">
		<form action='<?php echo $_SERVER['PHP_SELF'];?>' method='post'>
			<div class="container">
				<div class="row">
					<div class="col-2"></div>
					<div id="conectar" class="col-8 form-group border border-dark text-center mx-auto d-block">
					<!--<img class="rounded mx-auto d-block" src="assets/images/logo.png" alt="Escudo Videojuego" />-->
						<img src="assets/images/logo.png" class="img-fluid" alt="Logo del Videojuego(THIxEF)">
		  				<label for="usuario"><b>Usuario</b></label>
						<input type="text" class="form-control" placeholder="Usuario" id="usuario" name="usuario" required><br>
      					<label for="pass"><b>Contraseña</b></label>
		  				<input type="password" class="form-control" placeholder="Contraseña" id="pass" name="pass" required><br>
		  				<button type="submit" class="form-control mx-auto d-block" name="login">Entrar</button>
						<a href='registrar.php'>Nuevo Jugador</a>
					</div>
					<div class="col-2"></div>
			</div>
			</div>
	</form>
	</div>
</body>

</html>
<?php
	if (isset($_GET['registrado'])) {
		echo '<div class="alert alert-warning alert-dismissible fade show" role="alert">
		<strong>¡Usuario registrado correctamente!</strong> Inicie sesión
		<span aria-hidden="true">&times;</span>
		</button>
	  </div>';
	}
?>