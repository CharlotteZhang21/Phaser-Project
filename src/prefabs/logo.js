import * as ContainerUtil from '../utils/container-util';

class Logo extends Phaser.Group {
    constructor(game, logoLayer) {
        super(game);

        this.logo = new Phaser.Sprite(this.game, 0, 0, 'logo');
        // this.logo.anchor.set(0.5);
        this.add(this.logo);
        this.logo.alpha = 0;
        ContainerUtil.fitInContainer(this.logo, "logo", 0.5, 0.5);
    }

    //Animates from "logo" container to "final-logo" container
    animate() {

        this.logo.alpha = 1;


        // if (this.game.global.windowHeight > this.game.global.windowWidth) {
        var initialScale = this.logo.scale.x;
        var initialY = this.logo.y;

        this.logo.scale.x = 0.01;
        this.logo.scale.y = 0.01;
        this.game.add.tween(this.logo.scale).to({
        	x: initialScale,
        	y: initialScale,
        }, 1000, Phaser.Easing.Back.Out, true, 0);
        this.logo.y += 200;
        this.game.add.tween(this.logo).to({
        	y: initialY
        }, 600, Phaser.Easing.Quadratic.Out, true, 0);
    }
}

export default Logo;