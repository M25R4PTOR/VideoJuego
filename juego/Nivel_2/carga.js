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

        if(texture == 'calavera'){
            this.setScale(0.2);
        }
        
        //this.setBounce(0.1, 0.1);
        this.setCollideWorldBounds(true);

        this.body.onWorldBounds = true;

    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if(this.monstruo=='calavera'){
            this.setVelocityX(-100);
            this.anims.play('calaveraMovimiento', true);
            if(this.x<10){
                this.destroy();
            }
        }

        if(this.monstruo=='murcielago'){
            var distanciaX = Math.abs(player.x - this.x);
            var distanciaY = Math.abs(player.y - this.y);

            if(distanciaX < 150 && distanciaX > 5){
                if(player.x < this.x){
                    this.setVelocityX(-100);
                    this.anims.play('murcielagoMovimiento', true);
                    this.flipX = true;
                }else if(player.x > this.x){
                    this.setVelocityX(100);
                    this.anims.play('murcielagoMovimiento', true);
                    this.flipX = false;
                }

                if(player.y < this.y){
                    this.setVelocityY(-50);
                }else if(player.y > this.y){
                    this.setVelocityY(50);
                }else{
                    this.setVelocityY(0);
                }
            } else {
                this.setVelocityX(0);
                this.anims.play('murcielagoParado', true);
            }
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
var terreno;
var background;
var middleground;
var player;
var cursors;
var armas;
var numArmas;
var enemigos;
var texto;