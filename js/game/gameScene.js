import Player from "./player.js";
import LevelManager from "./levelManager.js";

export default class GameScene extends Phaser.Scene {

    constructor() {
        super("GameScene");
    }

    
    preload() {
        /*loads the player sprite sheet*/

        this.load.spritesheet("player", "images/player-spritesheet.png", {
        frameWidth: 32,
        frameHeight: 32
        });


        this.load.audio("collectSound", "sounds/collect.wav");
        this.load.audio("levelSound", "sounds/level-complete.wav");

    }


    create(data = {}) {

        this.level = data.level || 1;
        this.score =data.score || 0;


        

        if (!this.anims.exists("playerWalk")) {

            this.anims.create({
                key: "playerWalk",
                frames: this.anims.generateFrameNumbers("player", {

                    start: 0,
                    end: 3
                }),
                frameRate: 8,
                repeat: -1

            });
        }


        this.player = new Player(this);

        /*storing the number of data collected*/
        this.dataCollected = 0;

        
        /*setting up the level*/

        this.levelManager = new LevelManager(this, this.level);

        /* Create the data fragments*/
        this.dataItems = this.levelManager.createDataItems();

        /* get the total number of fragments*/
        this.totalData = this.dataItems.length;

        /*creating the walls*/
        this.walls = this.levelManager.createWalls();

        
        /*creating the exit here*/

        this.exit = this.add.rectangle(740, 225, 36, 50, 0x666666);

        this.add.text(740, 180, "EXIT", {
            fontSize: "16px",
            color: "#ffffff"
        }).setOrigin(0.5);

        this.exitUnlocked = false;
        this.levelComplete = false;

        this.timeLeft = 10;

        document.getElementById("timer").textContent = this.timeLeft;

        this.time.addEvent({
            delay: 1000,
            repeat: 9,
            callback: () => {

                if (this.levelComplete) {
                    return;
                }

                this.timeLeft--;
                document.getElementById("timer").textContent = this.timeLeft;

                if (this.timeLeft === 0) {

                    this.finishLevel(false);
                }
            }
        });

        /*and then update game info according to users progress*/

        document.getElementById("level").textContent = this.level;
        document.getElementById("score").textContent = this.score;
        document.getElementById("dataCollected").textContent = 0;
        document.getElementById("dataTotal").textContent = this.totalData;
        document.getElementById("gameMessage").textContent = "";
        
       /* restart button */

       const restartButton = document.getElementById("restartButton");

       restartButton.onclick = () => {
        
        /*restart from Level 1 with zero points*/
        this.scene.restart({
            level: 1,
            score: 0
        });

       }; 


    }

    update(time, delta) {
        if (this.levelComplete) {
            return;
        }

        this.player.move(delta, this.walls);


        /*checking if the player collects any data*/

        for (const data of this.dataItems) {

            if (data.active &&
                Math.abs(this.player.x - data.x) < 23 &&
                Math.abs(this.player.y - data.y) < 23) {

                /*remove the collected data*/

                data.destroy();

                /*play the collection sound*/

                this.sound.play("collectSound", { volume: 0.4});

                /*increase score*/
                this.score += 100;
                this.dataCollected += 1;

                /*update the HTML*/
                document.getElementById("score").textContent = this.score;
                document.getElementById("dataCollected").textContent = this.dataCollected;

                /*cwheck if all data has been collected*/
                
                /*unlock the exit when all data is collected*/

                if (this.dataCollected === this.totalData) {
                    this.exitUnlocked = true;

                    this.exit.setFillStyle(0x28a745);
                    document.getElementById("gameMessage").textContent =
                    "All data collected! Reach the green exit.";
                }

                
            }
        }

        
        /* checking if the player reaches the exit */

        if (this.exitUnlocked &&
            Math.abs(this.player.x - this.exit.x) < 33 &&
            Math.abs(this.player.y - this.exit.y) < 40) {

            this.finishLevel(true);


        }


    }

    finishLevel(reachedExit) {

        if (this.levelComplete) {
            return;
        }

        this.levelComplete = true;

        /*play the level completion sound*/

        this.sound.play("levelSound", { volume: 1 });

        if (reachedExit) {

            this.score += 500;
            document.getElementById("score").textContent = this.score;
        }

        if (this.level < 3) {

            this.scene.restart({ level: this.level + 1, score: this.score });
        
        } else {
            
            /*getting the logged in user*/

            const currentUser = JSON.parse( localStorage.getItem("cyberEscapeCurrentUser") || "null");

            if (currentUser) {

                /* getting the saved scores from local storage*/

                const scores = JSON.parse(localStorage.getItem("cyberEscapeScores") || "[]");

                
                const playerScore = scores.find(player =>
                    player.userId === currentUser.id
                );

                if (playerScore) {
                    
                    if (this.score > playerScore.score) {
                        playerScore.score = this.score;
                    }

                } else {
                    
                    /*saving a new playyers score */

                    scores.push({
                        userId: currentUser.id,
                        username: currentUser.username,
                        score: this.score
                    });

                }

                /* saving scored in local storage */
                
                localStorage.setItem("cyberEscapeScores", JSON.stringify(scores));

            }

   
            document.getElementById("gameMessage").textContent = "Game finished! Final score: " + this.score;

        }

    }

}



            


 
