class Inicio extends Phaser.Scene {
    constructor() {
        super({key: "Inicio"});
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

        this.auxiliar=true;
        this.textoTitulo = this.add.bitmapText(gameSettings.gameWidth/2, gameSettings.gameHeight/2 - 50, 'letras', 'TUTORIAL', 60).setOrigin(0.5);
        this.textoTitulo.setTint(0xff0000, 0xff0000, 0xff0000, 0xff0000);
        this.textoEnter = this.add.bitmapText(gameSettings.gameWidth/2, gameSettings.gameHeight/2 + 50, 'letras', 'Presiona ENTER\n ESC para salir', 20).setOrigin(0.5);
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
        
        this.boton = this.input.keyboard.addKeys( { 'intro': Phaser.Input.Keyboard.KeyCodes.ENTER, 'salir': Phaser.Input.Keyboard.KeyCodes.ESC} );

    }

    update(){
        middleground.tilePositionX += 0.2;

        
        if (Phaser.Input.Keyboard.JustDown(this.boton.intro)) {
            if(this.auxiliar){
                this.textoTitulo.destroy();
                this.textoEnter.setY(this.textoEnter.y + 50);
                this.auxiliar=false;
                this.instruccionesFondo = this.add.image(gameSettings.gameWidth/2, gameSettings.gameHeight-100, 'instrucciones');
                this.textoControl = this.add.bitmapText(gameSettings.gameWidth/2, gameSettings.gameHeight/2 - 50, 'letras', 'CONTROLES', 75).setOrigin(0.5);
                this.textoControl.setTint(0xff0000, 0xff0000, 0xff0000, 0xff0000);
                this.textoDescripcion = this.add.bitmapText(gameSettings.gameWidth/2, gameSettings.gameHeight/2 + 40, 'letras', 'Utiliza el raton para ATACAR\n       W A S D  para moverte', 20).setOrigin(0.5);
                this.textoDescripcion.setTint(0xff0000, 0xff0000, 0xff0000, 0xff0000);
            }else{
                this.scene.remove('Inicio');
                this.scene.launch('Juego');
            }
           
        }

        if (Phaser.Input.Keyboard.JustDown(this.boton.salir)) {
            location.replace("../../niveles.php");
        }

    }

    crearBackground(){
		background = this.add.tileSprite(gameSettings.gameWidth/2, gameSettings.gameHeight/2, gameSettings.gameWidth, gameSettings.gameHeight, 'background');
        middleground = this.add.tileSprite(gameSettings.gameWidth/2, gameSettings.gameHeight/2, gameSettings.gameWidth, gameSettings.gameHeight, 'middleground');
    }
    
    
}