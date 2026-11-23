
/*player class */

export default class Player extends Phaser.GameObjects.Sprite {

    constructor(scene) {

        /*using sprite sheet to create the player*/
        super(scene, 400, 225, "player", 0);

        scene.add.existing(this);

        /*keyboard controls*/
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keys = scene.input.keyboard.addKeys("W,A,S,D");

    }

    /*move the player*/
    move(delta, walls) {

        const oldX = this.x;
        const oldY = this.y;

        const speed = 200 * delta / 1000;

        if (this.cursors.left.isDown || this.keys.A.isDown) {
            this.x -= speed;
        }
        else if (this.cursors.right.isDown || this.keys.D.isDown) {
            this.x += speed;
        }

        if (this.cursors.up.isDown || this.keys.W.isDown) {
            this.y -= speed;
        }
        else if (this.cursors.down.isDown || this.keys.S.isDown) {
            this.y += speed;
        }

        /*aimating the character when moving*/

        if (this.x !== oldX || this.y !== oldY) {
            if (!this.anims.isPlaying) {
                this.play("playerWalk");
            }


        } else {

            /*to stop the animation when not moving*/

            this.anims.stop();
            this.setFrame(0);


        }
        

        /* to keep the player inside the game*/
        this.x = Phaser.Math.Clamp(this.x, 15, 785);
        this.y = Phaser.Math.Clamp(this.y, 15, 435);

        /* have to stop the player going through walls*/
        for (const wall of walls) {

            const touchingX = Math.abs(this.x - wall.x) <
                (this.width + wall.width) / 2;

            const touchingY = Math.abs(this.y - wall.y) <
                (this.height + wall.height) / 2;

            if (touchingX && touchingY) {
                this.x = oldX;
                this.y = oldY;
                break;
            }
        }

    }

}
