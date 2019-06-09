class Momia extends Phaser.Physics.Arcade.Sprite {

    constructor (scene, x, y, texture, vida)
    {
        super(scene, x, y, texture, vida);

        //this.play('caminarMomia');
        this.vida = vida;
        this.setTexture(texture);
        this.setPosition(x, y);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //this.setScale(0.5);
        //this.setBounce(0.1, 0.1);
        this.setCollideWorldBounds(true);

        this.body.onWorldBounds = true;

        this.setVelocity(-100, 0);

    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        //this.setVelocityX(-100);
        if(player.x < this.x){
            this.setVelocityX(-100);
			this.anims.play('caminarMomia', true);
			this.flipX = true;
        }else if (player.x > this.x){
            this.setVelocityX(100);
			this.anims.play('caminarMomia', true);
			this.flipX = false;
        }
    }

}

var gameSettings = {
    camScrollX: 0,
	gameWidth: 430,
    gameHeight: 272,
    numCuchillos: 1,
    puntos: 0,
    gameOver: false
}

var config = {
    type: Phaser.AUTO,
    scale: {
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
var momias;
var boss;
var texto;