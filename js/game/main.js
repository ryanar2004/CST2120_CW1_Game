import GameScene from "./gameScene.js";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 450,
    parent: "gameContainer",
    backgroundColor: "#0b1020",

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: GameScene
};

const game = new Phaser.Game(config);
