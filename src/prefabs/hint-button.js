import * as ContainerUtil from '../utils/container-util';

class HintButton extends Phaser.Group {
	constructor(game, wordGrid){
		super(game);
		this.wordGrid = wordGrid;
		this.createButton();
	}

	createButton() {
		this.button = new Phaser.Sprite(this.game, 0, 0, 'hint-button');
		this.add(this.button);
		this.button.inputEnabled = true;
		this.button.input.useHandCursor = true;
		this.button.events.onInputDown.add(function() {
			this.wordGrid.highlightNextWord();
		}, this);
		ContainerUtil.fitInContainer(this, 'hint-button');
	}

	animate() {
		this.game.add.tween(this).to({
			alpha: 0
		}, 200, Phaser.Easing.Quadratic.InOut, true, 0);
	}
}

export default HintButton;