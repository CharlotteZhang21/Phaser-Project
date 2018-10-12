import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class CookiePan extends Phaser.Group {
    constructor(game, cookieWord) {
        super(game);
        // this.cookieWord = cookieWord;

        // this.height = ContainerUtil.getContainerHeight('board-background');
        // this.width = ContainerUtil.getContainerWidth('board-background');
        // this.x = ContainerUtil.getContainerX('board-background');
        // this.y = ContainerUtil.getContainerY('board-background');

        this.containerName = 'board-background';

        this.blockArray = [];
        // ContainerUtil.fitInContainer(this, 'board-background');

        this.createStacks();
    }

    createStacks(){

        var wordArray = PiecSettings.words;

        var row = wordArray.length, column = wordArray[0].length;

        var blockWidth = ContainerUtil.getContainerWidth(this.containerName)/column,
            blockHeight = 0;


        var panelX = ContainerUtil.getContainerX(this.containerName),
            panelY = ContainerUtil.getContainerY(this.containerName);


        for (var i = 0; i < row; i++) {
            var blockY = i * blockHeight;
            for (var j = 0; j < column; j++) {
                var blockX = panelX + j * blockWidth, // j is the coloumn
                    blockY = panelY + i * blockHeight; // i is the row

                var block = this.createLetters(wordArray[i][j], blockWidth, blockX, blockY);
                if(blockHeight == 0){
                    blockHeight = block.height;
                }
                this.blockArray.push(block);
                this.game.world.bringToTop(block);

            }
          

        }
    }


    createLetters(letter, blockWidth, blockX, blockY) {

        var blockLayerGrp = new Phaser.Group(this.game);

        //create background,
        var letterBg = new Phaser.Sprite(this.game, 0, 0, 'letterBg');
        blockLayerGrp.add(letterBg);
        letterBg.scale.x = blockWidth / letterBg.width;
        letterBg.scale.y =  letterBg.scale.x;
        //create highlight
        var letterHighlight = new Phaser.Sprite(this.game, 0, 0, 'letterHighlight');
        blockLayerGrp.add(letterHighlight);
        letterHighlight.scale.x = blockWidth / letterHighlight.width;
        letterHighlight.scale.y =  letterHighlight.scale.x;
        letterHighlight.alpha = 0;
        //create letter

        if(letter != '-'){
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
            // fontSize = this.counterBackground.height * fontStyle.fontSize || this.counterBackground.height * 0.5;
            fontSize = letterBg.height * 0.5;
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
             // console.log(fontFamily);

            var textField = new Phaser.Text(this.game, 0, 0, letter, style);
            // textField.scale.x = letterBg.width * 0.8 / textField.width;
            // textField.scale.y = textField.scale.x;
            textField.anchor.set(0.5);
            textField.x = letterBg.width * 0.5 ;
            textField.y = letterBg.height * 0.6;

            blockLayerGrp.add(textField);
        }
        
        blockLayerGrp.x = blockX;
        blockLayerGrp.y = blockY;

        // this.textField.anchor.set(anchorX, anchorY);
        // this.textField.align = 'center';
        // this.textField.padding.set(fontSize / 2, 0);

        // var gradient = this.textField.context.createLinearGradient(0, 0, 0, this.height);

        // if (fontColor !== undefined && fontColor.length > 0) {
        //     for (var i = 0; i < fontColor.length; i++) {
        //         var index = i / fontColor.length;
        //         gradient.addColorStop(index, fontColor[i]);
        //     }
        // }

        return blockLayerGrp;

        // this.textField.fill = gradient;

        // ContainerUtil.fitInContainerAnchorAtCenter(this.textField, "board-background");
    }

    // createHand() {
    //     this.hand = new Phaser.Sprite(this.game, 0, 0, 'hand');
    //     this.hand.anchor.set(0.85, 0.85);
    //     this.hand.angle = -15;
    //     if (this.game.global.windowWidth < this.game.global.windowHeight) {
    //         this.hand.scale.x = this.background.width * .18 / this.hand.width;
    //         this.hand.scale.y = this.hand.scale.x;
    //     } else {
    //         this.hand.scale.x = this.background.width * .27 / this.hand.width;
    //         this.hand.scale.y = this.hand.scale.x;
    //     }
    //     this.add(this.hand);

    //     this.handInitialScale = this.hand.scale.x;

    //     if (PiecSettings.autoPlay !== undefined && PiecSettings.autoPlay == true)
    //         this.handFollowWord(PiecSettings.autoPlayWord);
    // }

    // handFollowWord(word) {

    //     this.moveHandDuration = 450;

    //     for (var i = 0; i < word.length; i++) {
    //         if (i == 0) {
    //             this.moveHandToBeforePress(this.lettersToCookies[word[i]]).onComplete.add(function() {
    //                 this.pressHand(this.lettersToCookies[word[0]]);
    //             }, this);
    //         } else {
    //             this.moveHandToWithDelay(this.lettersToCookies[word[i]], 900 + this.moveHandDuration * i);
    //         }
    //     }
    //     this.unpressHandAndMoveOutWithDelay(900 + this.moveHandDuration * word.length);
    //     this.game.time.events.add(900 + this.moveHandDuration * word.length, function() {
    //         this.onUpTutorial();
    //     }, this);
    //     this.game.time.events.add(900 + this.moveHandDuration * word.length + 1000, function() {
    //         this.handTutorial = false;
    //         this.inputLocked = false;
    //         this.hand.destroy();
    //     }, this);
    // }

    // pressHand(cookie) {

    //     this.handTutorial = true;

    //     var tween = this.game.add.tween(this.hand.scale).to({
    //         x: this.handInitialScale * .9,
    //         y: this.handInitialScale * .9,
    //     }, 650, Phaser.Easing.Quadratic.InOut, true, 0);

    //     var initialX = this.hand.x;
    //     var initialY = this.hand.y;
    //     this.game.add.tween(this.hand).to({
    //         angle: [-40, -50, -50],
    //         // y: [initialY, initialY + 20, initialY + 20],
    //         // x: [initialX + 10, initialX + 30, initialX + 30],
    //     }, 650, Phaser.Easing.Quadratic.InOut, true, 0);

    //     this.game.time.events.add(700, function() {
    //         this.onInputDownLetterTutorial(cookie);
    //     }, this);

    //     return tween;
    // }

    // unpressHandAndMoveOutWithDelay(delay) {
    //     this.game.time.events.add(delay, function() {
    //         this.game.add.tween(this.hand.scale).to({
    //             x: this.handInitialScale,
    //             y: this.handInitialScale,
    //         }, 400, Phaser.Easing.Quadratic.InOut, true, 0);

    //         this.game.add.tween(this.hand).to({
    //             angle: -5,
    //             x: this.game.global.windowWidth * window.devicePixelRatio * this.scale.x + this.hand.width * 1.5,
    //         }, 800, Phaser.Easing.Quadratic.InOut, true, 200);
    //     }, this);
    // }

    // moveHandToWithDelay(cookie, delay) {
    //     this.game.time.events.add(delay, function() {
    //         this.moveHandTo(cookie);
    //     }, this);
    // }

    // moveHandToBeforePress(cookie) {
    //     var tween = this.game.add.tween(this.hand).to({
    //         x: cookie.x + this.hand.width * .9,
    //         y: cookie.y + this.hand.height * .1,
    //     }, 700, Phaser.Easing.Quadratic.InOut, true, 0);
    //     this.game.add.tween(this.hand).to({
    //         angle: -50,
    //     }, 700, Phaser.Easing.Quadratic.InOut, true, 0);
    //     return tween;
    // }

    // moveHandTo(cookie) {
    //     var tween = this.game.add.tween(this.hand).to({
    //         x: cookie.x + this.hand.width,
    //         y: cookie.y + this.hand.height * .2,
    //     }, this.moveHandDuration, Phaser.Easing.Sinusoidal.InOut, true, 0);
    //     return tween;
    // }

    createBackground() {

        // var spriteName = this.game.global.windowWidth > this.game.global.windowHeight ? 'board-background-landscape' : 'board-background';
        // this.background = new Phaser.Sprite(this.game, 0, 0, 'pan');
        // this.add(this.background);
        // ContainerUtil.fitInContainer(this, "board-background");
        // this.background.angle = -90;
        // this.background.y += this.background.height;
    }

    // initializeLetters() {
    //     for (var i = 0; i < this.game.global.loadedLetters.length; i++) {
    //         console.log("added letter " + this.game.global.loadedLetters[i]);
    //         var letter = new Phaser.Sprite(this.game, 0, 0, this.game.global.loadedLetters[i]);
    //         letter.anchor.set(0.5);
    //         letter.x += this.background.width * PiecSettings.panAnchor[0];
    //         letter.y += this.background.height * PiecSettings.panAnchor[1];

    //         //Position them in a circle!!
    //         var angle = 360 / this.game.global.loadedLetters.length * i;
    //         var radius = this.background.height;

    //         if (this.game.global.windowHeight > this.game.global.windowWidth) {
    //             radius *= PiecSettings.panRadius;
    //         } else {
    //             radius *= PiecSettings.panRadiusLandscape;
    //         }

    //         letter.x += radius * Math.cos(angle * Math.PI / 180);
    //         letter.y += radius * Math.sin(angle * Math.PI / 180);

    //         var randomAngle = Math.random() * 20 - 10;
    //         letter.angle = randomAngle;
    //         letter.character = this.game.global.loadedLetters[i];

    //         letter.inputEnabled = true;
    //         letter.events.onInputDown.add(this.onInputDownLetter, this);
    //         // letter.events.onInputOver.add(this.onInputOverLetter, this);

    //         this.lettersToCookies[letter.character] = letter;

    //         letter.initialScale = letter.scale.x;

    //         this.add(letter);
    //     }
    // }

    // updatePath() {
    //     this.graphics.clear();
    //     if (this.handTutorial)
    //         this.bezierCurveRight = false;
    //     else
    //         this.bezierCurveRight = false;

    //     this.graphics.lineStyle(20, this.lineColor, 1);

    //     var prevX, prevY;

    //     for (var i = 0; i < this.letters.length; i++) {
    //         if (this.handTutorial && (i == 1 || i == 2)) {
    //             this.bezierCurveRight = false;
    //         }
    //         var cookie = this.lettersToCookies[this.letters[i]];
    //         if (i == 0) {
    //             this.graphics.moveTo(cookie.x, cookie.y);
    //         } else {
    //             this.drawLineToPoint(prevX, prevY, cookie.x, cookie.y);
    //         }
    //         prevX = cookie.x;
    //         prevY = cookie.y;
    //     }

    //     if (this.wordStarted) {
    //         if (this.handTutorial && (i == 1 || i == 2)) {
    //             this.bezierCurveRight = false;
    //         }
    //         this.drawLineToPoint(prevX, prevY, this.mouseX, this.mouseY);
    //     }

    //     for (var i = 0; i < this.letters.length; i++) {
    //         var cookie = this.lettersToCookies[this.letters[i]];
    //         if (PiecSettings.circleLetter !== undefined && PiecSettings.circleLetter == true) {
    //             this.graphics.beginFill(this.lineColor, 1);
    //             this.graphics.drawCircle(cookie.x, cookie.y, cookie.width * 1.2);
    //         }
    //     }
    // }

    // changePathColor(color) {
    //     this.lineColor = color;
    // }

    // bounceLetters(word) {
    //     for (var i = 0; i < word.length; i++) {
    //         var cookie = this.lettersToCookies[word[i]];
    //         if (cookie) {
    //             var initialScale = cookie.initialScale;
    //             this.game.add.tween(cookie.scale).to({
    //                 x: [initialScale * 1.06, initialScale * 0.94, initialScale * 1.06, initialScale],
    //                 y: [initialScale * 1.06, initialScale * 0.94, initialScale * 1.06, initialScale]
    //             }, 1000, Phaser.Easing.Linear.None, true, 0);
    //         }
    //     }
    // }

    // fadePath() {
    //     this.game.add.tween(this.graphics).to({
    //         alpha: 0
    //     }, 300, Phaser.Easing.Quadratic.InOut, true, 400).onComplete.add(function() {
    //         this.clearPath();
    //         this.graphics.alpha = 1;
    //         this.inputLocked = false;
    //     }, this);
    // }

    // clearPath() {
    //     this.graphics.clear();
    //     this.letters = "";
    // }

    // drawStraightPoint(newX, newY) {
    //     this.graphics.lineTo(newX, newY);
    // }

    // drawLineToPoint(prevX, prevY, newX, newY) {
    //     if (PiecSettings.connectionLine == "curved") {
    //         if (this.bezierCurveRight) {
    //             this.graphics.bezierCurveTo(prevX, prevY, newX, prevY, newX, newY);
    //             this.bezierCurveRight = false;
    //         } else {
    //             this.graphics.bezierCurveTo(prevX, prevY, prevX, newY, newX, newY);
    //             this.bezierCurveRight = true;
    //         }
    //     } else {
    //         this.graphics.lineTo(newX, newY);
    //     }
    // }

    // //Word finished!
    // onUp() {
    //     if (!this.handTutorial) {
    //         this.wordStarted = false;
    //         if (this.letters != "") {
    //             console.log("on word complete!");
    //             this.game.onWordComplete.dispatch(this.letters);
    //             this.inputLocked = true;
    //             this.letters = "";
    //         }
    //     }
    // }

    // onUpTutorial() {
    //     this.wordStarted = false;
    //     if (this.letters != "") {
    //         this.game.onWordComplete.dispatch(this.letters);
    //         this.inputLocked = true;
    //     }
    // }

    // isInputOverLetter(mouseX, mouseY) {
    //     for (var property in this.lettersToCookies) {
    //         if (this.lettersToCookies.hasOwnProperty(property)) {
    //             var letterCookie = this.lettersToCookies[property];
    //             if (this.isBetweenValues(mouseX, letterCookie.x - letterCookie.width / 2 * 1.2, letterCookie.x + letterCookie.width / 2 * 1.2) &&
    //                 (this.isBetweenValues(mouseY, letterCookie.y - letterCookie.height / 2 * 1.2, letterCookie.y + letterCookie.height / 2 * 1.2))) {
    //                 return letterCookie;
    //             }
    //         }
    //     }
    //     return null;
    // }

    // isBetweenValues(value, min, max) {
    //     if (value > min && value < max) {
    //         return true;
    //     }
    //     return false;
    // }

    // scaleLetterUp(letter) {
    //     var initialScale = letter.initialScale;
    //     this.game.add.tween(letter.scale).to({
    //         x: initialScale * 1.05,
    //         y: initialScale * 1.05,
    //     }, 200, Phaser.Easing.Quadratic.InOut, true, 0);
    // }
 
    // //Word started
    // onInputDownLetter(letter) {
    //     if (!this.inputLocked && !this.handTutorial) {
    //         this.wordStarted = true;
    //         this.letters += letter.character;
    //         this.cookieWord.updateBox(this.letters);

    //         var pathColor = "0xfffffff";
    //         if (PiecSettings.colorPalette !== undefined && PiecSettings.colorPalette.default !== undefined) {
    //             pathColor = PiecSettings.colorPalette.default;
    //         }
    //         this.changePathColor(pathColor);
    //         this.graphics.alpha = 1;
    //         this.scaleLetterUp(letter);
    //     } else {
    //         console.log("input locked!");
    //     }
    // }

    // onInputDownLetterTutorial(letter) {
    //     if (!this.inputLocked) {
    //         this.wordStarted = true;
    //         this.letters += letter.character;
    //         this.cookieWord.updateBox(this.letters);

    //         var pathColor = "0xfffffff";
    //         if (PiecSettings.colorPalette !== undefined && PiecSettings.colorPalette.default !== undefined) {
    //             pathColor = PiecSettings.colorPalette.default;
    //         }
    //         this.changePathColor(pathColor);
            
    //         this.graphics.alpha = 1;
    //         this.scaleLetterUp(letter);
    //     } else {
    //         console.log("input locked!");
    //     }
    // }

    // update() {
    //     if (!this.handTutorial) {
    //         this.mouseX = (this.game.input.x - this.x) / this.scale.x;
    //         this.mouseY = (this.game.input.y - this.y) / this.scale.y;
    //     } else {
    //         this.mouseX = this.hand.x - this.hand.width * .9;
    //         this.mouseY = this.hand.y - this.hand.width * .4;
    //     }
    //     var letterCookieOver = this.isInputOverLetter(this.mouseX, this.mouseY);
    //     if (letterCookieOver != null &&
    //         this.wordStarted && this.letters.indexOf(letterCookieOver.character) == -1) {
    //         this.letters += letterCookieOver.character;
    //         this.cookieWord.updateBox(this.letters);
    //         this.scaleLetterUp(letterCookieOver);
    //     }
    //     this.updatePath();
    // }

    // animate() {
    //     this.inputLocked = true;
    //     if (this.game.global.windowHeight > this.game.global.windowWidth) {
    //         this.game.add.tween(this).to({
    //             x: [-this.width],
    //         }, 1400, Phaser.Easing.Quadratic.InOut, true, 0);
    //     } else {
    //         this.game.add.tween(this).to({
    //             x: [this.game.global.windowWidth * window.devicePixelRatio + this.width],
    //         }, 1400, Phaser.Easing.Quadratic.InOut, true, 0);
    //     }

    // }
}

export default CookiePan;