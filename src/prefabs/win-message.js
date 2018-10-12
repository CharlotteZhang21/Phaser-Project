import * as Util from '../utils/util';
import * as ContainerUtil from '../utils/container-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class WinMessage extends Phaser.Group {
	constructor(game) {
		super(game);

		// this.showWinMessage();
	}

	showWinMessage(){

		this.winMessage = new Phaser.Sprite(this.game, 0, 0, 'puzzle-solved');
		this.winMessage.angle = 10;
		this.winMessage.anchor.set(0.5, 0.5);
		this.add(this.winMessage);

		ContainerUtil.fitInContainerAnchorAtCenter(this.winMessage, 'win-message');

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
	
}

export default WinMessage;