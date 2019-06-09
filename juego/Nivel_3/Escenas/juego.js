class Juego extends Phaser.Scene {
   
    
    constructor() {
        super({key: "Juego", active: false});
    }

    preload() {

        // Mapa creado con Tiled en formato JSON
        this.load.tilemapTiledJSON('mapa', './assets/mapa.json');
        // tiles in spritesheet 
        this.load.spritesheet('tiles', './assets/tiles.png', {frameWidth: 16, frameHeight: 16});
        // background doble
        this.load.image('background', './assets/background.png');
		
        // Animaciones Jugador
        this.load.multiatlas('ladron', 'assets/ladron.json', 'assets');
		//Disparo
		this.load.image("disparo", "assets/shuriken.png");
		//Numero de Armas
		this.load.image('armasRestantes', './assets/numArmas.png');
		//Puerta
		this.load.image('puerta', './assets/puerta.png');

		//Enemigos
		this.load.multiatlas('murcielago', 'assets/enemigos/murcielago.json', 'assets/enemigos');
		this.load.multiatlas('calavera', 'assets/enemigos/calavera.json', 'assets/enemigos');
		this.load.multiatlas('esqueleto', 'assets/enemigos/esqueleto.json', 'assets/enemigos');

		this.load.multiatlas('portal', 'assets/enemigos/portal.json', 'assets/enemigos');

		// Musica de fondo
		this.load.audio("fondo", "./assets/sounds/fondo.ogg")
		// Sonido animaciones
		this.load.audio("attack", "./assets/sounds/giroArma.mp3");
    	this.load.audio("hurt", "./assets/sounds/hurt.ogg");
		this.load.audio("salto1", "./assets/sounds/salto1.mp3");
		this.load.audio("salto2", "./assets/sounds/salto2.mp3");
    	this.load.audio("muerte", "./assets/sounds/player_death.wav");

    }
    
    create() {
		this.cargarAudio();
		
		this.crearBackground();

		this.crearEntorno();

		this.crearPuntuacion();

		this.crearJugador();
		
		this.lanzarCuchillo();
	
		this.fisicaCuchillos();

		this.crearAnimaciones();

		this.crearControles();
    
        this.ajustarCamara();
		
		this.crearEnemigos();

		this.temporizadorEnemigos();
		
		this.physics.world.on('worldbounds', this.onWorldBounds);
    }

    update(time, delta) {
		if (gameSettings.gameOver){
			this.physics.pause();

			this.scene.remove('Juego');
            this.scene.launch('Derrota');
		}
		
        if (cursors.left.isDown)
        {
            player.body.setVelocityX(-200);
            player.anims.play('caminar', true);
            player.flipX = true;
        }
        else if (cursors.right.isDown)
        {
            player.body.setVelocityX(200);
            player.anims.play('caminar', true);
			player.flipX = false;

        } else {
            player.body.setVelocityX(0);
            player.anims.play('parado', true);
        }

        if (cursors.up.isDown && player.body.onFloor())
        {
			this.salto1.play();
            player.body.setVelocityY(-200);        
		}
		
		if (Phaser.Input.Keyboard.JustDown(cursors.salir)) {
            location.replace("../../niveles.php");
        }


		this.fondoParaleloYRotacion();
 		
    }
	
	crearBackground(){
		background = this.add.tileSprite(gameSettings.gameWidth/2, gameSettings.gameHeight/2, 960, 304, 'background');
		background.setScrollFactor(0);
	}
	
	fondoParaleloYRotacion(){
		if(gameSettings.camScrollX < this.cameras.main.scrollX){
			background.tilePositionX += 0.5;
			gameSettings.camScrollX = this.cameras.main.scrollX;
		} else if (gameSettings.camScrollX > this.cameras.main.scrollX){
			background.tilePositionX -= 0.5;
			gameSettings.camScrollX = this.cameras.main.scrollX;
		}

		if(numArmas){
			numArmas.rotation += 0.05;
		}
    }
	
	crearEntorno(){
		// load the map 
        mapa = this.make.tilemap({key: 'mapa'});
    
        // tiles for the ground layer
        var groundTiles = mapa.addTilesetImage('tiles');
        // create the ground layer
		terreno = mapa.createStaticLayer('Nivel3', groundTiles, 0, 0);

		terreno.setCollision([123, 132, 175, 184, 227, 236, 279, 288, 293, 300, 316, 317, 318, 320, 321, 322, 323, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 345, 352, 540, 541, 543, 544, 546, 547, 549, 550, 552, 553, 555, 556, 558, 559, 561, 562, 595, 605, 647, 657, 699, 709]);

        // Extremos del mundo
        this.physics.world.bounds.width = terreno.width;
		this.physics.world.bounds.height = terreno.height;
		
		numArmas = this.add.tileSprite(40, 40, 132, 132, 'armasRestantes').setScale(0.4);
        numArmas.setScrollFactor(0);
	} 
	
	ajustarCamara(){
		// set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, mapa.widthInPixels, mapa.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(player);
		this.cameras.main.setRoundPixels(true);
		
	}
	
	crearJugador(){
		// create the player sprite    
        player = this.physics.add.sprite(21, 220, 'ladron');
        player.setBounce(0.2); // our player will bounce from items
		player.setCollideWorldBounds(true);   
		player.body.onWorldBounds = true; 
        
        // small fix to our player images, we resize the physics body object slightly
		player.body.setSize(player.width-15, player.height);
        
        // player will collide with the level tiles 
        this.physics.add.collider(terreno, player, this.sonidoSuelo, null, this);
	}

	
	crearAnimaciones() {
		var frameNames = this.anims.generateFrameNames('ladron', {
            start: 70, end: 79, zeroPad: 0,
            prefix: 'ladron-', suffix: '.png'
        });
        this.anims.create({ key: 'caminar', frames: frameNames, frameRate: 10, repeat: -1 });

        var frameNames1 = this.anims.generateFrameNames('ladron', {
            start: 0, end: 9, zeroPad: 0,
            prefix: 'ladron-', suffix: '.png'
        });
        this.anims.create({ key: 'parado', frames: frameNames1, frameRate: 10, repeat: -1 });

		var frameNames2 = this.anims.generateFrameNames('esqueleto', {
            start: 1, end: 8, zeroPad: 0,
            prefix: 'skeleton-', suffix: '.png'
        });
        this.anims.create({ key: 'esqueletoMovimiento', frames: frameNames2, frameRate: 10, repeat: -1 });


		var frameNames3 = this.anims.generateFrameNames('calavera', {
            start: 0, end: 7, zeroPad: 0,
            prefix: 'calavera-', suffix: '.png'
        });
        this.anims.create({ key: 'calaveraMovimiento', frames: frameNames3, frameRate: 10, repeat: -1});
		
		var frameNames4 = this.anims.generateFrameNames('murcielago', {
            start: 1, end: 3, zeroPad: 0,
            prefix: 'murcielago-', suffix: '.png'
        });
        this.anims.create({ key: 'murcielagoParado', frames: frameNames4, frameRate: 10, repeat: 0});

		var frameNames5 = this.anims.generateFrameNames('murcielago', {
            start: 5, end: 7, zeroPad: 0,
            prefix: 'murcielago-', suffix: '.png'
        });
		this.anims.create({ key: 'murcielagoMovimiento', frames: frameNames5, frameRate: 10, repeat: 0});
		
		var frameNames6 = this.anims.generateFrameNames('portal', {
            start: 0, end: 8, zeroPad: 0,
            prefix: 'portal-', suffix: '.png'
        });
        this.anims.create({ key: 'portalMovimiento', frames: frameNames6, frameRate: 10, repeat: -1});
		
	}
	
	crearControles(){
		cursors = this.input.keyboard.addKeys( {'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S, 'salir': Phaser.Input.Keyboard.KeyCodes.ESC} );
	}
	
	fisicaCuchillos(){
		armas = this.physics.add.group();
		this.physics.add.collider(armas, terreno, this.cuchilloSuelo, null, this);
	}

    cuchilloSuelo (armas, terreno){
        if (armas) {
			armas.destroy();
			this.animacionEntradaArma();
			this.audioAttack.stop();
        }
    }
	
	lanzarCuchillo(){			
		
		var BetweenPoints = Phaser.Math.Angle.BetweenPoints;
		var SetToAngle = Phaser.Geom.Line.SetToAngle;
		var velocityFromRotation = this.physics.velocityFromRotation;
		
		var velocity = new Phaser.Math.Vector2();
		var line = new Phaser.Geom.Line();
		this.input.on('pointerup', function (pointer) {
			if (gameSettings.numCuchillos == 1 && numArmas.x == 40 && numArmas.alpha == 1){
				pointer.x = pointer.x + gameSettings.camScrollX;
				var angle = BetweenPoints(player, pointer);
				
				SetToAngle(line, player.x, player.y, angle, 128);
				velocityFromRotation(angle, 400, velocity);
				this.shuriken = armas.create(player.x, player.y, 'disparo').setScale(0.15);
				this.shuriken.setVelocity(velocity.x, velocity.y);
				//this.shuriken.setCollideWorldBounds(true);   
				this.shuriken.allowGravity = false;
				this.shuriken.setBounce(1);
				this.shuriken.setAngularVelocity(1000);
				gameSettings.numCuchillos-=1;
				this.audioAttack.play();
				this.animacionSalidaArma();
			}
		}, this);		
	}

	colisionEnemigo(enemigos, player){
		this.audioKill.play();
		gameSettings.gameOver = true;
	}

	matarEnemigo(enemigos, armas){
		this.audioHurt.play();
		enemigos.vida-=1;
		if(enemigos.vida<=0){
			enemigos.destroy();	
			if(enemigos.monstruo=='esqueleto'){
				gameSettings.puntos += 40;
			}else if(enemigos.monstruo=='murcielago'){
				gameSettings.puntos += 50;
			}else{
				gameSettings.puntos += 20;
			}
			
			texto.setText('Puntuación: '+gameSettings.puntos);		
		}
		armas.destroy();
		this.animacionEntradaArma();
		this.audioAttack.stop();
	}

	crearEnemigos(){
		enemigos = this.physics.add.group({
			allowGravity: true
		});

		enemigos.add(new Enemigo(this, 424, 176, 'esqueleto', 1), true);
		enemigos.add(new Enemigo(this, 887, 127, 'esqueleto', 1), true);
		enemigos.add(new Enemigo(this, 1924, 143, 'esqueleto', 1), true);

		enemigos.children.iterate(function (child) {
        
			child.setCollideWorldBounds(true);
			child.setBounce(0.1, 0.1);
        
		});

		this.physics.add.collider(enemigos, terreno);
		this.physics.add.collider(enemigos, armas, this.matarEnemigo, null, this);
		this.physics.add.overlap(enemigos, player, this.colisionEnemigo, null, this);

		enemigosVoladores = this.physics.add.group({
			allowGravity: false
		});

		enemigosVoladores.add(new Enemigo(this, 664, 80, 'murcielago', 1), true);
		enemigosVoladores.add(new Enemigo(this, 987, 50, 'murcielago', 1), true);
		enemigosVoladores.add(new Enemigo(this, 1194, 50, 'murcielago', 1), true);
		enemigosVoladores.add(new Enemigo(this, 1294, 185, 'murcielago', 1), true);
		enemigosVoladores.add(new Enemigo(this, 1457, 70, 'murcielago', 1), true);

		enemigosVoladores.children.iterate(function (child) {
        
			child.setCollideWorldBounds(true);
			child.setBounce(0.1, 0.1);
        
		});
		
		this.physics.add.collider(enemigosVoladores, terreno);
		this.physics.add.collider(enemigosVoladores, armas, this.matarEnemigo, null, this);
		this.physics.add.overlap(enemigosVoladores, player, this.colisionEnemigo, null, this);

		this.portal = this.physics.add.sprite(2380, 220, 'portal').setScale(0.2);
		this.physics.add.collider(this.portal, terreno);
		this.physics.add.overlap(this.portal, player, this.fin, null, this);
		this.portal.anims.play('portalMovimiento', true);

	}

	crearEnemigosAuto(){
		enemigos = this.physics.add.group({
			allowGravity: false
		});

    	enemigos.add(new Enemigo(this, Phaser.Math.Between(1628, 2121), 256, 'calavera', 1), true);

		enemigos.children.iterate(function (child) {
		
			
			child.setCollideWorldBounds(true);
			child.setBounce(0.1, 0.1);
        
        });
		
		this.physics.add.collider(enemigos, armas, this.matarEnemigo, null, this);
		this.physics.add.overlap(enemigos, player, this.colisionEnemigo, null, this);
	}

	onWorldBounds(body){
		var cuerpo = body.gameObject; 
		if(cuerpo===player){
			if(cuerpo.y >= 250){
				gameSettings.gameOver = true;
			}
			
		}
	}

	cargarAudio(){
		//Musica Fondo
		this.fondo = this.sound.add("fondo", {loop: true, volume: 0.5});
		this.fondo.play();
		//Daño Enemigo
		this.audioHurt = this.sound.add("hurt", {loop: false, volume: 0.5});
		//Muerte jugador
		this.audioKill = this.sound.add("muerte", {loop: false, volume: 0.5});
		//Ataque jugador
		this.audioAttack = this.sound.add("attack", {loop: true, volume: 0.2});
    	//Salto jugador
		this.salto1 = this.sound.add("salto1", {loop: false, volume: 1});
		//Tocar suelo
		this.salto2 = this.sound.add("salto2", {loop: false, volume: 0.5});
	}

	sonidoSuelo(terreno, player){
		this.salto2.play();
	}

	animacionSalidaArma(){
		this.tweens.add({
			targets: numArmas,
			props: {
				x: {
					value: 240,
					duration: 1000
				},
				alpha:{
					value: 0,
					duration: 1000
				}
			},
			//repeat: -1,
			yoyo: false,
			ease: 'Sine.easeOut',
			onComplete: () => this.animacionEntradaArma()
		});
	}

	animacionEntradaArma(){
		if(numArmas.x==240){
			this.tweens.add({
				targets: numArmas,
				props: {
					x: {
						value: 40,
						duration: 1
					},
					alpha:{
						value: 1,
						duration: 1000
					}
				},
				//repeat: -1,
				yoyo: false,
				ease: 'Sine.easeOut',
				onComplete: () => gameSettings.numCuchillos+=1
			});
		}		
	}

	colisionesMapa(sprite, tile){
		if(sprite===player){
			console.log('Tile: ' + tile.index + '\nSprite: ' + sprite.x + '\nJugador: ' + player.x);
			this.audioKill.play();
			gameSettings.gameOver = true;
		}
		
	}

	fin(){
		gameSettings.puntos += 300;
		this.scene.remove('Juego');
        this.scene.launch('Fin');
	}

	temporizadorEnemigos(){
		this.timedEvent = this.time.addEvent({ delay: 250, callback: this.crearEnemigosAuto, callbackScope: this, loop: true });
	}

	crearPuntuacion(){
		texto = this.add.text(300, 0, 'Puntuación: 0', { fontFamily: 'Arial', fontSize: 14, color: '#ffffff', align: 'left' });
		texto.setScrollFactor(0);
	}
}