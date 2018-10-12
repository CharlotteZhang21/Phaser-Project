import * as ContainerUtil from '../utils/container-util';

class SelectionMenu extends Phaser.Group {
	constructor(game) {
		super(game);

		this.optionButtons = [];
		this.optionButtonsContent = [];
		this.selectedOption = -1;
		
		this.background = new Phaser.Sprite(this.game, 0, 0, "box-bg");
		ContainerUtil.resizeToSizeOfContainer(this.background, "selection-menu");

		if (this.game.global.windowWidth < this.game.global.windowHeight) {
			this.x = this.game.global.windowWidth/2 * window.devicePixelRatio - this.background.width/2;
			this.y = this.game.global.windowHeight * window.devicePixelRatio * .8 - this.background.height;
			this.initialY = this.y;
			this.y = this.initialY + this.game.global.windowHeight * window.devicePixelRatio;
		} else {
			this.background.angle = 90;
			this.x = this.game.global.windowWidth * window.devicePixelRatio - this.background.height/1.3;
			this.y = this.game.global.windowHeight * window.devicePixelRatio / 2 - this.background.width / 2;
			this.initialY = this.y;
			this.y = this.initialY + this.game.global.windowHeight * window.devicePixelRatio;
		}
		this.add(this.background);

	}

	playTutorialHand() {
		this.hand = new Phaser.Sprite(this.game, 0, 0, "hand");
		if (this.game.global.windowWidth < this.game.global.windowHeight) {
			this.hand.x = this.hand.width + this.background.width/2;
			this.hand.y = this.hand.height - this.background.height * 1.5;
		} else {
			this.hand.x = this.hand.width - this.background.width;
			this.hand.y = this.hand.height + this.background.height;
		}

        this.hand.anchor.set(.9);
		this.hand.scale.x = this.background.width / this.hand.width * 0.3;
		this.hand.scale.y = this.hand.scale.x;
		this.hand.alpha = 0;
		this.add(this.hand);

		this.showHand();
		this.moveHandToOption(0, 700);
		this.game.time.events.add(700, function() {
			if (!this.game.global.tutorialCanceled) {
				this.tapHand();
				this.game.time.events.add(400, function() {
					this.game.global.items[7].optionSelected(0);
					this.selectOption(0);
				}, this);
			} else {
				this.hand.alpha = 0;
			}
		}, this);
		this.game.time.events.add(1300, function() {
			if (!this.game.global.tutorialCanceled) {
				this.moveHandToOption(1, 500);
				this.game.time.events.add(600, function() {
					this.tapHand();
					this.game.time.events.add(400, function() {
						this.selectOption(1);
						this.game.global.items[7].optionSelected(1);

						this.game.time.events.add(500, function() {
							this.hideHand();
							this.game.global.tutorialCanceled = true;
						}, this);
					}, this);
				}, this);
			} else {
				this.hand.alpha = 0;
			}
		}, this);
	}

	tapHand() {
		this.game.add.tween(this.hand).to({
			angle: [10,5,-5,-5,0]
		}, 700, Phaser.Easing.Quadratic.InOut, true, 0);

		var initialScale = this.hand.scale.x;

		this.game.add.tween(this.hand.scale).to({
			x: [initialScale, initialScale, initialScale * .9,initialScale * .9, initialScale],
			y: [initialScale, initialScale, initialScale * .9,initialScale * .9, initialScale],
		}, 700, Phaser.Easing.Quadratic.InOut, true, 0);
	}

	showHand() {
		this.game.add.tween(this.hand).to({alpha: 1}, 300, Phaser.Easing.Quadratic.InOut, true, 0);
	}

	hideHand() {
		this.game.add.tween(this.hand).to({alpha: 0}, 300, Phaser.Easing.Quadratic.InOut, true, 0);
	}

	moveHandToOption(num, duration) {
		this.game.add.tween(this.hand).to({
			x: this.optionButtons[num].x  + this.hand.width * .9,
			y: this.optionButtons[num].y + this.hand.height * .9,
		}, duration, Phaser.Easing.Quadratic.InOut, true, 0);
	}


	launchSelectionMenu(item) {

		this.show();

		//Remove any previous buttons
		for (var i = 0; i < this.optionButtons.length; i++) {
			this.optionButtons[i].destroy();
			this.optionButtonsContent[i].destroy();
		}
		this.optionButtons = [];
		this.optionButtonsContent = [];

		this.associatedItem = item;
		for (var i = 0; i < item.options.length; i++) {
			var option = new Phaser.Sprite(this.game, 0, 0, "unselected");
			this.optionButtonWidth = option.width;
			option.anchor.set(0.5);
			option.scale.x = this.background.width / item.options.length / option.width * .85;
			option.scale.y = option.scale.x;
			if (this.game.global.windowWidth < this.game.global.windowHeight) { //Portrait
				option.x = option.width * i + .075 * this.background.width + option.width/2;
				option.y = (this.background.height - option.height)/2 + option.height/2;
			} else { //Landscape
				option.x = - this.background.height / 2;
				option.y = option.height * i + .075 * this.background.width + option.height/2;
			}
			this.optionButtonScale = option.scale.x;
			this.add(option);

			option.inputEnabled = true;
			option.input.useHandCursor = true;
			option.numOption = i;
			option.events.onInputDown.add(function(button) {
				item.optionSelected(button.numOption);
				this.selectOption(button.numOption);
				this.game.global.tutorialCanceled = true;
			}, this);

			this.optionButtons.push(option);

			var optionSprite = item.itemConfig.options[i];
			if (item.itemConfig.optionIcons !== undefined) {
				optionSprite = item.itemConfig.optionIcons[i];
			}
			var optionContent = new Phaser.Sprite(this.game, 0, 0, optionSprite);
			optionContent.scale.x = this.background.width / item.options.length / optionContent.width * .85;
			if (item.itemConfig.optionsScale !== undefined) {
				optionContent.scale.x *= item.itemConfig.optionsScale;
			}
			optionContent.scale.y = optionContent.scale.x;
			optionContent.anchor.set(0.5);
			if (item.itemConfig.optionsAnchor !== undefined) {
				optionContent.anchor.set(item.itemConfig.optionsAnchor[0], item.itemConfig.optionsAnchor[1]);
			}
			optionContent.x = option.x;
			optionContent.y = option.y;
			this.add(optionContent);

			this.optionButtonsContent.push(optionContent);
		}

		if (this.okButton != null)
			this.okButton.destroy();

		this.okButton = new Phaser.Sprite(this.game, 0, 0, "ok-button");
		this.okButton.anchor.set(0.5);
		ContainerUtil.resizeToSizeOfContainer(this.okButton, "ok-button");
		if (this.game.global.windowWidth < this.game.global.windowHeight) {
			this.okButton.x = this.background.width/2;
			this.okButton.y -= this.okButton.height/3;
		} else {
			this.okButton.x = this.background.height/2 - this.okButton.width/3.8;
			this.okButton.y = this.okButton.height/2;
		}

		this.okButtonScale = this.okButton.scale.x;
		this.add(this.okButton);

		this.okButton.inputEnabled = true;
		this.okButton.input.useHandCursor = true;
		this.okButton.events.onInputDown.add(function() {
			this.game.add.tween(this.okButton.scale).to({
				x: 0.01,
				y: 0.01,
			}, 200, Phaser.Easing.Back.In, true, 0);
			this.game.time.events.add(200, function() {
				this.game.onFinishedItem.dispatch(this.associatedItem.afterThisPlay);
			}, this);
		}, this);

		this.okButton.alpha = 0;
		this.okButton.inputEnabled = false;
	}

	hide() {
		this.game.add.tween(this).to({
			y: this.initialY + this.game.global.windowHeight * window.devicePixelRatio,
		}, 500, Phaser.Easing.Quadratic.InOut, true, 0);
	}

	show() {
		this.game.add.tween(this).to({
			y: this.initialY,
		}, 1000, Phaser.Easing.Back.Out, true, 0);
	}

	selectOption(num) {

		this.optionButtons[num].loadTexture("selected", 0, false);

		this.optionButtons[num].scale.x = this.optionButtonScale;
		this.optionButtons[num].scale.y = this.optionButtonScale;

		this.game.add.tween(this.optionButtons[num].scale).to({
			x: this.optionButtonScale * .8,
			y: this.optionButtonScale * .8,
		}, 100, Phaser.Easing.Linear.None, true, 0).yoyo(true);

		for (var i = 0; i < this.optionButtons.length; i++) {
			if (i != num) {
				this.unselectOption(i);
			}
		}

		this.okButton.inputEnabled = true;
		var finalScale = this.okButtonScale;
		this.okButton.scale.x = 0.01;
		this.okButton.scale.y = 0.01;
		if (this.game.global.windowWidth < this.game.global.windowHeight) {
			this.okButton.x = this.optionButtons[num].x;
		} else {
			this.okButton.y = this.optionButtons[num].y;
		}
		this.okButton.alpha = 1;

		this.game.add.tween(this.okButton.scale).to({
			x: finalScale,
			y: finalScale,
		}, 500, Phaser.Easing.Elastic.Out, true, 0);

		this.selectedOption = num;
	}

	unselectOption(num) {
		this.optionButtons[num].loadTexture("unselected", 0, false);
	}
}

export default SelectionMenu;