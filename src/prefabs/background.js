class Background extends Phaser.Group {
    constructor(game) {
        super(game);
        this.createBackground();
    }

    createBackground() {
        var background = new Phaser.Sprite(this.game, 0, 0, 'background');

        this.add(background);

        var initialWidth = this.width;
        var initialHeight = this.height;

        if (this.game.global.windowHeight > this.game.global.windowWidth) {

            this.scale.x = (this.game.global.windowHeight * window.devicePixelRatio) / this.height * 1.05;
            this.scale.y = this.scale.x;
            if (this.game.global.windowWidth * window.devicePixelRatio > this.width) {
                this.scale.x = this.game.global.windowWidth * window.devicePixelRatio / initialWidth;
                this.scale.y = this.scale.x;
            }
            this.x = this.game.global.windowWidth * window.devicePixelRatio / 2 - this.width / 2;
            this.y = this.game.global.windowHeight * window.devicePixelRatio / 2 - this.height / 2;
        } else {
            this.scale.x = (this.game.global.windowWidth * window.devicePixelRatio) / this.width * 1.05;
            this.scale.y = this.scale.x;
            if (this.height < this.game.global.windowHeight * window.devicePixelRatio) {
                //Stretch it through the other side
                this.scale.y = (this.game.global.windowHeight * window.devicePixelRatio) / this.width * 1.05;
                this.scale.x = this.scale.y;
            }
            this.x = this.game.global.windowWidth * window.devicePixelRatio / 2 - this.width / 2;
            this.y = this.game.global.windowHeight * window.devicePixelRatio / 2 - this.height / 2;
        }
    }

}

export default Background;