class Juego extends Phaser.Scene {
   
    
    constructor() {
        super({key: "Juego", active: false});
    }

    preload() {

        // Mapa creado con Tiled en formato JSON
        this.load.tilemapTiledJSON('mapa', './assets/mapa.json');
        // tiles in spritesheet 
        this.load.spritesheet('tileset', './assets/tileset.png', {frameWidth: 16, frameHeight: 16});
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

		//Enemigos
		this.load.spritesheet('momia', 'assets/enemigos/momia.png', { frameWidth: 37, frameHeight: 45 });
        this.load.multiatlas('murcielago', 'assets/enemigos/murcielago.json', 'assets/enemigos');
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

		this.crearBoss();

		this.crearControles();
    
        this.ajustarCamara();
		
		this.crearEnemigos();

		this.temporizadorEnemigos();
		

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
		background = this.add.tileSprite(gameSettings.gameWidth/2, gameSettings.gameHeight/2, 384, 224, 'background').setScale(1.2);
        background.setScrollFactor(0);
        middleground = this.add.tileSprite(gameSettings.gameWidth/2, gameSettings.gameHeight/2, 384, 224, 'middleground').setScale(1.2);
		middleground.setScrollFactor(0);
		numArmas = this.add.tileSprite(40, 40, 132, 132, 'armasRestantes').setScale(0.4);
        numArmas.setScrollFactor(0);
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
        var groundTiles = mapa.addTilesetImage('tileset');
        // create the ground layer
		terreno = mapa.createStaticLayer('Nivel4', groundTiles, 0, 0);

		terreno.setCollision([98, 99, 116, 117, 118, 119, 144, 145, 146, 147, 160, 161, 162]);
		terreno.setTileIndexCallback([148, 149, 157, 129, 156], this.colisionesMapa, this);

        // Extremos del mundo
        this.physics.world.bounds.width = terreno.width;
        this.physics.world.bounds.height = terreno.height;
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
        player = this.physics.add.sprite(350, 224, 'ladron');
        player.setBounce(0.2); // our player will bounce from items
        player.setCollideWorldBounds(true); // don't go out of the map    
        
        // small fix to our player images, we resize the physics body object slightly
		player.body.setSize(player.width-15, player.height);
        
        // player will collide with the level tiles 
        this.physics.add.collider(terreno, player, this.sonidoSuelo, null, this);
	}

	crearBoss(){
		boss = this.physics.add.sprite(0, 100, 'sombra').setScale(3.5);
		boss.anims.play('boss', true);
		boss.flipX = true;
		boss.setCollideWorldBounds(true);
		this.physics.add.collider(terreno, boss);
		this.physics.add.collider(boss, armas, this.dispararAlBoss, null, this);
		this.physics.add.collider(boss, player, this.tocarBoss, null, this);
		this.physics.add.collider(boss, enemigos, this.enemigosBoss, null, this);
		this.tweens.add({
			targets: boss,
			props: {
				x: {
					value: 2345,
					duration: 25000
				}
			},
			delay: 5000,
			ease: 'Power1'
		});
	}

	enemigosBoss(boss, enemigos){
		enemigos.destroy();
	}

	tocarBoss(boss, player){
		this.audioKill.play();
		gameSettings.gameOver = true;
	}

	dispararAlBoss(boss, armas){
		this.cuchilloSuelo(armas, terreno);
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
            start: 0, end: 17, zeroPad: 0,
            prefix: 'sombra-', suffix: '.png'
        });
        this.anims.create({ key: 'boss', frames: frameNames3, frameRate: 10, repeat: 0, delay: 1000 });
		
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


		this.anims.create({
            key: 'caminarMomia',
			frames: this.anims.generateFrameNumbers('momia', { start: 0, end: 17 }),
			//frames: this.anims.generateFrameNumbers('momia', { frames: [ 0, 17 ] }),
            frameRate: 10,
            repeat: -1
        });

		
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

	colisionEnemigo(enemigos, player){
		this.audioKill.play();
		gameSettings.gameOver = true;
	}

	matarEnemigo(enemigos, armas){
		this.audioHurt.play();
		enemigos.vida-=1;
		if(enemigos.vida<=0){
			enemigos.destroy();	
			if(enemigos.monstruo=='momia'){
				gameSettings.puntos += 20;
			}else{
				gameSettings.puntos += 50;
			}
			
			texto.setText('Puntuación: '+gameSettings.puntos);
		}
		armas.destroy();
		this.animacionEntradaArma();
		this.audioAttack.stop();
	}

	crearEnemigos(){
		enemigos = this.physics.add.group({
			allowGravity: false
		});

		enemigos.add(new Enemigo(this, 734, 40, 'murcielago', 1), true);
		enemigos.add(new Enemigo(this, 887, 80, 'murcielago', 1), true);
		enemigos.add(new Enemigo(this, 1250, 50, 'murcielago', 1), true);
		enemigos.add(new Enemigo(this, 1750, 40, 'murcielago', 1), true);
		enemigos.add(new Enemigo(this, 2015, 40, 'murcielago', 1), true);
		enemigos.add(new Enemigo(this, 2210, 130, 'murcielago', 1), true);
		enemigos.add(new Enemigo(this, 894, 224, 'momia', 1), true);
		enemigos.add(new Enemigo(this, 1240, 224, 'momia', 1), true);
		enemigos.add(new Enemigo(this, 1600, 224, 'momia', 1), true);

		enemigos.children.iterate(function (child) {
        
			child.setCollideWorldBounds(true);
			child.setBounce(0.1, 0.1);
			
			if(child.monstruo == 'murcielago'){
				child.body.setSize(child.width-15, child.height-15);
			}else{
				child.body.setSize(child.width-15, child.height);
			}
        
        });
		
		this.physics.add.collider(enemigos, armas, this.matarEnemigo, null, this);
		this.physics.add.overlap(enemigos, player, this.colisionEnemigo, null, this);

		this.portal = this.add.sprite(2190, 224, 'portal').setScale(0.2);
		this.portal.anims.play('portalMovimiento', true);
	}
	
	crearEnemigosAuto(){
		enemigos = this.physics.add.group({
			allowGravity: false
		});

    	enemigos.add(new Enemigo(this, 2185, 224, 'momia', 1), true);

		enemigos.children.iterate(function (child) {
        
			child.setCollideWorldBounds(true);
			child.setBounce(0.1, 0.1);
			child.body.setSize(child.width-15, child.height);
        
        });
		
		this.physics.add.collider(enemigos, armas, this.matarEnemigo, null, this);
		this.physics.add.overlap(enemigos, player, this.colisionEnemigo, null, this);
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

		if(sprite===boss){
			if(tile.index === 157 || tile.index === 129 || tile.index === 156){
				this.tweens.add({
					targets: boss,
					props: {
						scaleX: {
							value: 1,
							duration: 1000
						},
						scaleY: {
							value: 1,
							duration: 1000
						},
						alpha: {
							value: 0.2,
							duration: 1000
						}
					},
					repeat: 1,
					yoyo: true,
					ease: 'Power1',
					onComplete: () => this.fin()
				});
			}
		}
		
	}

	fin(){
		this.scene.remove('Juego');
        this.scene.launch('Fin');
	}

	temporizadorEnemigos(){
		this.timedEvent = this.time.addEvent({ delay: 2000, callback: this.crearEnemigosAuto, callbackScope: this, loop: true });
	}

	crearPuntuacion(){
		texto = this.add.text(300, 0, 'Puntuación: 0', { fontFamily: 'Arial', fontSize: 14, color: '#ffffff', align: 'left' });
		texto.setScrollFactor(0);
	}
}