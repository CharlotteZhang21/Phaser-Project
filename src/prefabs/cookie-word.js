import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class CookieWord extends Phaser.Group {
    constructor(game) {
        super(game);

        this.letters = [];

        this.createBox();

        ContainerUtil.fitInContainerHeight(this, 'cookie-word');
        this.initialX = this.x;
        this.letterWidth = 0;
    }

    createBox() {
        this.background = this.game.add.graphics(0, 0);
        this.backgroundColor = "0xEBEECC";
        if (PiecSettings.colorPalette !== undefined && PiecSettings.colorPalette.wordBoxDefault !== undefined) {
            this.backgroundColor = PiecSettings.colorPalette.wordBoxDefault;
        }
        this.background.beginFill(this.backgroundColor);
        this.background.drawRoundedRect(0, 0, 1, 120, 90);
        this.background.alpha = 0;
        this.background.anchor.set(0.5);
        this.add(this.background);

        this.coloredBox = this.game.add.graphics(0, 0);
        this.add(this.coloredBox);
    }

    updateBox(word) {
        this.alpha = 1;
        this.clearLetters();

        for (var i = 0; i < word.length; i++) {
            var letterAssetName = word[i];

            if (PiecSettings.useAlternativeAssetForSolvedLetters) {
                letterAssetName = word[i] + "-2";
            }

            var letter = new Phaser.Sprite(this.game, 0, 0, letterAssetName);
            letter.anchor.set(0.5, 0);
            this.add(letter);
            letter.scale.y = 0.65 * this.background.height / letter.height;
            letter.scale.x = letter.scale.y;
            if (i == 0) {
                this.letterWidth = letter.width;
            }
            letter.y += this.background.height * .175;
            letter.x = 30 + this.letterWidth * i + this.letterWidth / 2;
            this.letters.push(letter);
        }

        this.background.clear();
        if (this.coloredBox != null)
        	this.coloredBox.clear();

        this.background.beginFill(this.backgroundColor);
        this.background.drawRoundedRect(0, 0, 60 + word.length * this.letterWidth, 120, 90);
        this.background.alpha = 0.95;
        this.background.anchor.set(0.5);

        this.x = this.initialX - this.width/2;
    }

    fadeBox() {
        var tween = this.game.add.tween(this).to({
            alpha: 0,
        }, 700, Phaser.Easing.Quadratic.InOut, true, 0);

        tween.onComplete.add(function() {
            this.clearLetters();
        }, this);
    }

    clearLetters() {
        for (var i = 0; i < this.letters.length; i++) {
            this.letters[i].destroy();
        }
        this.letters = [];
    }

    colorBox(word, color) {
        console.log("coloring box");
        this.coloredBox.clear();
        this.coloredBox.beginFill(color);
        this.coloredBox.drawRoundedRect(0, 0, 60 + word.length * this.letterWidth, 120, 90);
        this.coloredBox.anchor.set(0.5);
        this.coloredBox.alpha = 0;
        this.game.add.tween(this.coloredBox).to({
            alpha: 0.7
        }, 300, Phaser.Easing.Quadratic.InOut, true, 0);
    }
}

export default CookieWord;