<?php
    session_start();
    setcookie('login', 'login', time()-1);
    session_destroy();
?>
<!DOCTYPE HTML>
<html lang="es">

<head>
	<title>Error</title>
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
  		background: url('assets/images/background5.png') no-repeat center center fixed;
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

    <div class="container">
		<form action='<?php echo $_SERVER['PHP_SELF'];?>' method='post'>
		<div class="container">
			<div class="row">
				<div class="col-2"></div>
				<div id="conectar" class="col-8 form-group border border-dark text-center mx-auto d-block">
					<img src="assets/images/desconectado.png" class="img-fluid" alt="Desconectado">
				
					
					<a href="index.php" class="nav-link"><img src="assets/images/volver.png" class="img-fluid" alt="Volver"></a>
				</div>
				<div class="col-2"></div>
            </div>
			</div>
        </form>
	</div>

</body>
</html>