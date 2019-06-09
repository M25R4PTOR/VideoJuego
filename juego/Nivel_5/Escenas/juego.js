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
		this.load.image('middleground', './assets/middleground.png');
		

        // Animaciones Jugador
        this.load.multiatlas('ladron', 'assets/ladron.json', 'assets');
		//Disparo
		this.load.image("disparo", "assets/shuriken.png");
		//Numero de Armas
		this.load.image('armasRestantes', './assets/numArmas.png');
        // Animaciones Boss
		this.load.multiatlas('sombra', './assets/enemigos/sombra.json', 'assets/enemigos');
		this.load.multiatlas('calavera', './assets/enemigos/calavera.json', 'assets/enemigos');
		
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

		if(player.x >= 508 && gameSettings.activarBoss){
			this.crearBoss();
			this.cerrarEntrada();
			this.temporizadorAtaques();
		}

		if(player.y > 208){
			player.y = 207;
		}

		if (Phaser.Input.Keyboard.JustDown(cursors.salir)) {
            location.replace("../../niveles.php");
        }

		this.fondoParaleloYRotacion();
 		
    }
	
	crearBackground(){
		background = this.add.tileSprite(gameSettings.gameWidth/2, gameSettings.gameHeight/2, gameSettings.gameWidth, gameSettings.gameHeight, 'background');
        background.setScrollFactor(0);
        middleground = this.add.tileSprite(gameSettings.gameWidth/2, gameSettings.gameHeight/2, gameSettings.gameWidth, gameSettings.gameHeight, 'middleground');
		middleground.setScrollFactor(0);
	}
	
	fondoParaleloYRotacion(){
		if(gameSettings.camScrollX < this.cameras.main.scrollX){
			middleground.tilePositionX += 0.5;
			background.tilePositionX += 0.2;
			gameSettings.camScrollX = this.cameras.main.scrollX;
		} else if (gameSettings.camScrollX > this.cameras.main.scrollX){
			middleground.tilePositionX -= 0.5;
			background.tilePositionX -= 0.2;
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
        groundLayer = mapa.createDynamicLayer('Nivel5', groundTiles, 0, 0);
        // the player will collide with this layer
      	groundLayer.setCollision([2, 3, 4, 5, 6, 7, 23, 24, 25, 39, 55, 71, 87, 103, 119, 135, 151, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 327, 343, 359, 375, 391, 407, 423, 439, 455, 471, 480, 481, 482, 483, 484, 485, 486, 487, 503, 504, 505, 506, 507, 508, 509, 510, 511]);
    
        // set the boundaries of our game world
        this.physics.world.bounds.width = groundLayer.width;
        this.physics.world.bounds.height = groundLayer.height;
	} 
	
	ajustarCamara(){
		// set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, mapa.widthInPixels, mapa.heightInPixels);
        // make the camera follow the player
        this.cameras.main.startFollow(player);
		this.cameras.main.setRoundPixels(true);
		
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

        var frameNames2 = this.anims.generateFrameNames('ladron', {
            start: 30, end: 39, zeroPad: 0,
            prefix: 'ladron-', suffix: '.png'
        });
		this.anims.create({ key: 'atacar', frames: frameNames2, frameRate: 10, repeat: -1 });
		
		var frameNames3 = this.anims.generateFrameNames('sombra', {
            start: 0, end: 12, zeroPad: 0,
            prefix: 'sombra-', suffix: '.png'
        });
		this.anims.create({ key: 'boss', frames: frameNames3, frameRate: 10, repeat: 0 });

		var frameNames4 = this.anims.generateFrameNames('sombra', {
            start: 13, end: 17, zeroPad: 0,
            prefix: 'sombra-', suffix: '.png'
        });
		this.anims.create({ key: 'bossParado', frames: frameNames4, frameRate: 10, repeat: -1 });

		var frameNames5 = this.anims.generateFrameNames('calavera', {
            start: 0, end: 7, zeroPad: 0,
            prefix: 'calavera-', suffix: '.png'
        });
        this.anims.create({ key: 'calaveraMovimiento', frames: frameNames5, frameRate: 10, repeat: -1});
		
		this.anims.create({
            key: 'caminarMomia',
			frames: this.anims.generateFrameNumbers('momia', { start: 0, end: 17 }),
			//frames: this.anims.generateFrameNumbers('momia', { frames: [ 0, 17 ] }),
            frameRate: 10,
            repeat: -1
        });

		
	}
	
	crearJugador(){
		// create the player sprite    
        player = this.physics.add.sprite(100, 50, 'ladron');
        player.setBounce(0.2); // our player will bounce from items
        player.setCollideWorldBounds(true); // don't go out of the map    
        
        // small fix to our player images, we resize the physics body object slightly
		player.body.setSize(player.width-15, player.height);
        
        // player will collide with the level tiles 
		this.physics.add.collider(groundLayer, player, this.sonidoSuelo, null, this);
		
		numArmas = this.add.tileSprite(40, 40, 132, 132, 'armasRestantes').setScale(0.4);
        numArmas.setScrollFactor(0);
	}

	cerrarEntrada(){
		groundLayer.putTileAtWorldXY(310, 308, 80);
		groundLayer.putTileAtWorldXY(310, 308, 79);
	}

	crearBoss(){
		boss = this.physics.add.group({
			allowGravity: true
		});

		boss.add(new Enemigo(this, 710, 208, 'sombra', 10).setScale(1.5), true);

		boss.children.iterate(function (child) {
		
			child.setImmovable();
			child.setCollideWorldBounds(true);
			child.setBounce(0.1, 0.1);
			child.anims.play('boss', true);
		});
		
		this.physics.add.collider(groundLayer, boss);
		this.physics.add.collider(boss, armas, this.matarBoss, null, this);
		this.physics.add.overlap(boss, player, this.colisionEnemigo, null, this);
		gameSettings.activarBoss = false;
	}

	crearEnemigosAuto(){
		enemigos = this.physics.add.group({
			allowGravity: false
		});

		if(gameSettings.bossDerecha){
			enemigos.add(new Enemigo(this, 700, Phaser.Math.Between(140, 220), 'calavera', 1), true);

			enemigos.children.iterate(function (child) {
				child.setCollideWorldBounds(true);
				child.setBounce(0.1, 0.1);
				child.setVelocityX(gameSettings.velocidadDisparo * -1);
				child.anims.play('calaveraMovimiento', true);
				child.flipX = false;
        	});
		} else {
			enemigos.add(new Enemigo(this, 365, Phaser.Math.Between(140, 220), 'calavera', 1), true);

			enemigos.children.iterate(function (child) {
				child.setCollideWorldBounds(true);
				child.setBounce(0.1, 0.1);
				child.setVelocityX(gameSettings.velocidadDisparo);
				child.anims.play('calaveraMovimiento', true);
				child.flipX = true;
        	});
		}
		
		this.physics.add.overlap(enemigos, player, this.colisionEnemigo, null, this);
		this.physics.add.collider(enemigos, armas, this.matarBoss, null, this);
	}
	
	crearControles(){
		//cursors = this.input.keyboard.createCursorKeys();
		cursors = this.input.keyboard.addKeys( {'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S, 'salir': Phaser.Input.Keyboard.KeyCodes.ESC} );
	}
	
	fisicaCuchillos(){
		armas = this.physics.add.group();

		this.physics.add.collider(armas, groundLayer, this.cuchilloSuelo, null, this);
	}

    cuchilloSuelo (armas, groundLayer){
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
				//velocityFromRotation(angle, 600, velocity);
				velocityFromRotation(angle, 400, velocity);
				this.shuriken = armas.create(player.x, player.y, 'disparo').setScale(0.15);
				this.shuriken.setVelocity(velocity.x, velocity.y);
				this.shuriken.setCollideWorldBounds(true);   
				this.shuriken.allowGravity = false;
				this.shuriken.setBounce(1);
				this.shuriken.setAngularVelocity(1000);
				gameSettings.numCuchillos-=1;
				this.audioAttack.play();
				this.animacionSalidaArma();
			}
		}, this);		
	}

	colisionEnemigo(boss, player){
		this.audioKill.play();
		gameSettings.gameOver = true;
	}

	matarBoss(boss, armas){
		this.tweens.add({
			targets: boss,
			props: {
				alpha: {
					value: 0,
					duration: 300
				}
			},
			yoyo: true,
			ease: 'Power1'
		});
		this.audioHurt.play();
		boss.vida-=1;
		gameSettings.vidaBoss -= 1;
		if(boss.vida<=0){
			if(boss.monstruo=='sombra'){
				gameSettings.puntos += 100;
				gameSettings.puntos += 300;
				this.scene.remove('Juego');
        		this.scene.launch('Fin');	
			}else{
				gameSettings.puntos+=20;
				boss.destroy();
			}
			texto.setText('Puntuación: '+gameSettings.puntos);
				
		}
		armas.destroy();
		this.animacionEntradaArma();
		this.audioAttack.stop();
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

	sonidoSuelo(groundLayer, player){
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

	temporizadorAtaques(){
		this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.crearEnemigosAuto, callbackScope: this, loop: true });
	}

	crearPuntuacion(){
		texto = this.add.text(300, 0, 'Puntuación: 0', { fontFamily: 'Arial', fontSize: 14, color: '#ffffff', align: 'left' });
		texto.setScrollFactor(0);
	}
}