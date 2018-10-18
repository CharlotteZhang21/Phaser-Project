import * as Util from '../utils/util';
import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class WinMessage extends Phaser.Group {
	constructor(game) {
		super(game);
	}

	showWinMessage(){

		// this.winMessage = new Phaser.Sprite(this.game, 0, 0, 'puzzle-solved');
		// this.winMessage.angle = 10;
		// this.winMessage.anchor.set(0.5, 0.5);
		// this.add(this.winMessage);

		// ContainerUtil.fitInContainerAnchorAtCenter(this.winMessage, 'win-message');
		var containerName = 'win-message';
        var fontWeight = 'bold',
            fontSize = ContainerUtil.getContainerHeight(containerName) || 100,
            fontFamily = PiecSettings.fontFamily,
            fontColor = ['#fff'],
            fontStroke = null,
            strokeThickness = null,
            fontShadow = null;

        var style = {
            font: fontWeight + " " + fontSize + "px " + fontFamily,
        	align: "center", 
        	// boundsAlignV: "middle",
        	wordWrap: true
        };

        this.winMessage = new Phaser.Text(this.game, 0, 0, 'LEVEL\nCOMPLETE', style);
        ContainerUtil.fitInContainer(this.winMessage, containerName, 0.5, 0.5);

        this.winMessage.angle = 10;
        var gradient = this.winMessage.context.createLinearGradient(0, 0, 0, this.winMessage.height);

        if (fontColor !== undefined && fontColor.length > 0) {
            for (var i = 0; i < fontColor.length; i++) {
                var index = i / fontColor.length;
                gradient.addColorStop(index, fontColor[i]);
            }
        }
        this.winMessage.fill = gradient;
        this.add(this.winMessage);

        // return textField;



		var finalScale = this.winMessage.scale.x;

		this.game.add.tween(this.winMessage).to({
			angle: 0
		}, 600, Phaser.Easing.Back.Out, true, 200);

		this.winMessage.scale.x = finalScale * .01;
		this.winMessage.scale.y = finalScale * .01;

		this.game.add.tween(this.winMessage.scale).to({
			x: finalScale,
			y: finalScale,
		}, 500, Phaser.Easing.Back.Out, true, 0);

		this.game.time.events.add(900, function() {
			this.game.add.tween(this.winMessage.scale).to({
				x: finalScale * 3,
				y: finalScale * 3,
			}, 500, Phaser.Easing.Back.In, true, 0);
			this.game.add.tween(this.winMessage).to({
				alpha: [1,0],
				angle: -10
			}, 500, Phaser.Easing.Back.In, true, 0);
		}, this);

	}

	spawnStars(container) {
        for (var i = 0; i < 50; i++) {
            var starOrParticle = Math.random() > 0.4 ? 'confetti-1' : 'confetti-2';
            var star = new Phaser.Sprite(this.game, 0, 0, starOrParticle);

            var width = ContainerUtil.getContainerWidth(container);
            var x = ContainerUtil.getContainerX(container);
            var y = ContainerUtil.getContainerY(container);

            this.add(star);
            star.anchor.set(0.5);
            star.scale.x = width * .3 / star.width * (Math.random());
            star.scale.y = star.scale.x;

            star.x = x;
            star.y = y;

            star.alpha = 0;

            var initialScale = star.scale.x;
            var initialY = star.y;
            var initialX = star.x;

            var angle = Math.random() * 360;
            var radius = (width + width * Math.random()) * .5;

            var finalX = radius * Math.cos(angle * Math.PI / 180) + initialX;
            var finalY = radius * Math.sin(angle * Math.PI / 180) + initialY;


            // var finalX = initialX + letter.width * 1.5 * (Math.random() > 0.5 ? 1 : -1);
            // var finalY = initialY - Math.random() * 100 - 200;
            var finalScale = initialScale * Math.random();

            var delay = i * 10;
            var duration = Math.random() * 300 + 300;

            AnimationsUtil.burstAndFalling(this.game, star, finalX, finalY, initialX, initialY, finalScale, duration, delay);
        }
    }

	
}

export default WinMessage;