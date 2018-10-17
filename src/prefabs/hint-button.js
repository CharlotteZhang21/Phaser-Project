import * as ContainerUtil from '../utils/container-util';

class HintButton extends Phaser.Group {
	constructor(game, cookiePan, wordGrid){
		super(game);
		this.wordGrid = wordGrid;
		this.cookiePan = cookiePan;
		this.createButton();
		this.alpha = 0;
	}

	createButton() {
		this.button = new Phaser.Sprite(this.game, 0, 0, 'hint-button');
		this.add(this.button);
		this.button.inputEnabled = true;
		this.button.input.useHandCursor = true;
		this.button.events.onInputDown.add(function() {
			// this.game.global.tutorialCanceled = false;
			var completedWordNum = this.wordGrid.getCompletedWordNum();
			var hintIndex = completedWordNum;
			this.cookiePan.handFollowWord(PiecSettings.hint[hintIndex]);
		}, this);
		ContainerUtil.fitInContainer(this, 'hint-button', 0.5, 0.5);
	}

	show() {
		this.game.add.tween(this).to({
			alpha: 1
		}, 200, Phaser.Easing.Quadratic.InOut, true, 0);
	}

	animate() {
		this.game.add.tween(this).to({
			alpha: 0
		}, 200, Phaser.Easing.Quadratic.InOut, true, 0);
	}
}

export default HintButton;