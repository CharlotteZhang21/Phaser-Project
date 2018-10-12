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
        // this.letterWidth = 0;
    }

    createBox() {
        this.background = this.game.add.graphics(0, 0);
        this.backgroundColor = PiecSettings.highlightColor;
        if (PiecSettings.colorPalette !== undefined && PiecSettings.colorPalette.wordBoxDefault !== undefined) {
            this.backgroundColor = PiecSettings.colorPalette.wordBoxDefault;
        }
        this.background.beginFill(this.backgroundColor);

        

        this.background.drawRoundedRect(0, 0, 1, 120, 90);
        this.background.alpha = 0;
        this.background.anchor.set(0.5);
        this.add(this.background);
        this.boxHeight = this.background.height;
        //TODO, Add gradient colour to the box
        this.coloredBox = this.game.add.graphics(0, 0);
        this.add(this.coloredBox);
    }

    updateBox(word) {
        console.log(word);
        this.alpha = 1;
        this.clearLetters();

        // for (var i = 0; i < word.length; i++) {
        //     var letterAssetName = word[i];

        var fontWeight = 'bold',
            fontSize,
            fontFamily = PiecSettings.fontFamily,
            fontColor = [PiecSettings.fontColor],
            fontStroke = null,
            strokeThickness = null,
            fontShadow = null,
            anchorX = 0.5,
            anchorY = 0.5;

        var fontStyle =  PiecSettings.stackLetterStyle;

        fontWeight = fontStyle.fontWeight;
        fontSize = this.boxHeight * 0.6;
        fontFamily = fontStyle.fontFamily;
        fontColor = fontStyle.color;
        fontStroke = fontStyle.stroke || null;
        strokeThickness = fontStyle.strokeThickness || null;
        fontShadow = fontStyle.shadow || null;
        anchorX = fontStyle.anchor.x || .5;
        anchorY = fontStyle.anchor.y || .5;

        

        var style = {
            font: fontWeight + " " + fontSize + "px " + fontFamily,
        };
        this.text = new Phaser.Text(this.game, 0, 0, word, style);
        this.text.anchor.set(0.5);
        // this.text.scale.y = this.background.height / this.text.height;
        // this.text.scale.x = this.text.scale.y;


        this.background.clear();

        this.background.beginFill(this.backgroundColor);
        this.background.drawRoundedRect(0, 0, this.text.width * 1.5, this.boxHeight, 90);
        this.background.alpha = 0.95;
        this.background.anchor.set(0.5);

        this.text.x = this.background.width / 2;
        this.text.y = this.background.height / 2;

        var gradient = this.text.context.createLinearGradient(0, 0, 0, this.text.height);

        if (fontColor !== undefined && fontColor.length > 0) {
            for (var i = 0; i < fontColor.length; i++) {
                var index = i / fontColor.length;
                gradient.addColorStop(index, fontColor[i]);
            }
        }
        this.text.fill = gradient;

        this.add(this.text);
        //     this.letters.push(letter);
        // }
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

        if(this.text != null)
            this.text.destroy();
        this.background.clear();
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