class Enemigo extends Phaser.Physics.Arcade.Sprite {

    constructor (scene, x, y, texture, vida)
    {
        super(scene, x, y, texture, vida);

        this.vida = vida;
        this.monstruo = texture;
        this.setTexture(texture);
        this.setPosition(x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);

        this.body.onWorldBounds = true;

        if(texture == 'sombra'){
            this.body.setSize(this.width-15, this.height);
            this.on('animationcomplete', this.animacionParado, this);
        }else if(texture == 'calavera'){
            this.setScale(0.2);
        }
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if(this.monstruo == 'sombra'){
            if(this.alpha==0){
                if(this.x > player.x){
                    this.x=355;
                    this.flipX = true;
                    gameSettings.bossDerecha = false;
                }else{
                    this.x=710;
                    this.flipX = false;
                    gameSettings.bossDerecha = true;
                }
            }
        } else if (this.monstruo == 'calavera'){
            if (this.x < 328 || this.x > 750){
                this.destroy();
            }
        }
    }

    animacionParado(animation, frame){
		this.play('bossParado', true);
	}
}

var gameSettings = {
    camScrollX: 0,
	gameWidth: 430,
    gameHeight: 272,
    numCuchillos: 1,
    puntos: 0,
    vidaBoss: 10,
    velocidadDisparo: 100,
    activarBoss: true,
    bossDerecha: true,
    gameOver: false
}

var config = {
    type: Phaser.AUTO,
	//type: Phaser.CANVAS,
    scale: {
        //mode: Phaser.Scale.ENVELOP,
        //mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'contenedor',
        width: gameSettings.gameWidth,
        height: gameSettings.gameHeight
    },
	pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [Inicio, Juego, Fin, Derrota]
};

new Phaser.Game(config);
var mapa;
var groundLayer;
var background;
var middleground;
var player;
var cursors;
var armas;
var numArmas;
var boss;
var enemigos;
var texto;