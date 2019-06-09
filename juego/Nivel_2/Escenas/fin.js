class Fin extends Phaser.Scene {
    constructor() {
        super({key: "Fin"});
    }

    preload(){
        // background doble
        this.load.image('background', './assets/background.png');
        this.load.image('middleground', './assets/middleground.png');

        this.load.image('instrucciones', './assets/instrucciones.png');

        this.load.bitmapFont('letras', './assets/bitmap/hyperdrive.png', './assets/bitmap/hyperdrive.xml');
    }

    create() {
		this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.crearBackground();

        this.crearPuntuacion();

        this.auxiliar=true;
        this.textoTitulo = this.add.bitmapText(gameSettings.gameWidth/2, gameSettings.gameHeight/2 - 50, 'letras', 'NIVEL COMPLETADO', 50).setOrigin(0.5);
        this.textoTitulo.setTint(0xff0000, 0xff0000, 0xff0000, 0xff0000);
        this.textoEnter = this.add.bitmapText(gameSettings.gameWidth/2, gameSettings.gameHeight/2 + 50, 'letras', 'Presiona ENTER para guardar resultados', 20).setOrigin(0.5);
        this.textoEnter.setTint(0xff0000);

        this.tweens.add({
			targets: this.textoEnter,
			props: {
				alpha:{
					value: 0,
					duration: 700
				}
			},
			repeat: -1,
			yoyo: true,
			ease: 'Sine.easeOut'
        });
        
        this.boton = this.input.keyboard.addKeys( { 'intro': Phaser.Input.Keyboard.KeyCodes.ENTER} );

    }

    update(){
        middleground.tilePositionX += 0.2;

        
        if (Phaser.Input.Keyboard.JustDown(this.boton.intro)) {
            location.replace("guardarResultados.php?puntos=" + gameSettings.puntos);
           
        }
    }

    crearBackground(){
		background = this.add.tileSprite(gameSettings.gameWidth/2, gameSettings.gameHeight/2, 256, 176, 'background').setScale(1.7, 1.6);
        middleground = this.add.tileSprite(gameSettings.gameWidth/2, gameSettings.gameHeight/2, 256, 176, 'middleground').setScale(1.7, 1.6);
    }
    
    crearPuntuacion(){
		texto = this.add.text(300, 0, 'Puntuación: '+ gameSettings.puntos, { fontFamily: 'Arial', fontSize: 14, color: '#ffffff', align: 'left' });
		texto.setScrollFactor(0);
	}
    
}