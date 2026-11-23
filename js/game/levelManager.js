
/*managing the game levels */

export default class LevelManager {

    constructor(scene, level) {
        this.scene = scene;
        this.level = level;
    }

    /*creating data fragments*/

    createDataItems() {

        let positions = [];

        if (this.level === 1) {

            positions = [
                [100, 120],
                [300, 180],
                [650, 140],
                [180, 330],
                [650, 330]
            ];

        } else if (this.level === 2) {

            positions = [
                [100, 120],
                [250, 200],
                [650, 120],
                [180, 330],
                [600, 330],
                [450, 120],
                [500, 300]
            ];

        } else if (this.level === 3) {

            positions = [
                [100, 100],
                [155, 290],
                [320, 185],
                [450, 200],
                [680, 110],
                [630, 340],
                [420, 350],
                [300, 350],
                [700, 330]
            ];

        }

        const dataItems = [];

        for (const position of positions) {
            const data = this.scene.add.rectangle(
                position[0], position[1], 16, 16, 0xa855f7
            );

            dataItems.push(data);
        }

        return dataItems;
    }

    /* creating walls */

    createWalls() {

        const walls = [];

        if (this.level === 2) {

            walls.push(
                this.scene.add.rectangle(350, 170, 20, 170, 0x65758b),
                this.scene.add.rectangle(520, 250, 160, 20, 0x65758b)
            );

        } else if (this.level === 3) {

            walls.push(
                this.scene.add.rectangle(250, 180, 20, 180, 0x65758b),
                this.scene.add.rectangle(520, 300, 20, 180, 0x65758b),
                this.scene.add.rectangle(400, 120, 170, 20, 0x65758b)
            );

        }

        return walls;
    }

}
