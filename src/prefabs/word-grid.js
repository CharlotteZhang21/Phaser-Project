import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class WordGrid extends Phaser.Group {
    constructor(game, cta) {
        super(game);
        this.cta = cta;

        this.game.global.inputLocked = false;

        this.targetWords = {};
        this.correctWords = {}; // it's the words that shows after the transition
        this.categoryTitle = this.createTitle();


        this.createPlaceHolder();
        // this.preFillWords();

        // ContainerUtil.fitInContainer(this, "tiles-area");

        // this.fxLayer = new Phaser.Group(this.game);
        // this.game.world.bringToTop(this.fxLayer);
        // this.fxLayer.x = this.x;
        // this.fxLayer.y = this.y;
        // this.fxLayer.scale.x = this.scale.x;
        // this.fxLayer.scale.y = this.scale.y

        // console.log(this.wordsToBoxCookies);

        this.completedWords = 0;
    }


    createTitle() {
        var containerName = 'game-category';
        var fontWeight = 'bold',
            fontSize = ContainerUtil.getContainerHeight(containerName),
            fontFamily = PiecSettings.fontFamily,
            fontColor = ['#fff'],
            fontStroke = null,
            strokeThickness = null,
            fontShadow = null;

        var style = {
            font: fontWeight + " " + fontSize + "px " + fontFamily,
        };

        var textField = new Phaser.Text(this.game, 0, 0, PiecSettings.gameCategory, style);
        ContainerUtil.fitInContainer(textField, containerName, 0.5, 0.5);
        var gradient = textField.context.createLinearGradient(0, 0, 0, textField.height);

        if (fontColor !== undefined && fontColor.length > 0) {
            for (var i = 0; i < fontColor.length; i++) {
                var index = i / fontColor.length;
                gradient.addColorStop(index, fontColor[i]);
            }
        }
        textField.fill = gradient;
        this.add(textField);

        return textField;
    }

    animateTitle(){
        var originalX = this.categoryTitle.x,
            originalY = this.categoryTitle.y;
        var originalScale = this.categoryTitle.scale.x;

        var startingContainer = 'game-category-start';
        
        ContainerUtil.fitInContainer(this.categoryTitle, startingContainer, 0.5, 0.5);
        this.categoryTitle.alpha = 0;
        this.game.add.tween(this.categoryTitle).to({alpha: 1}, 500, Phaser.Easing.Quadratic.InOut, true, 0);
        this.game.add.tween(this.categoryTitle).to({x: originalX, y: originalY}, 500, Phaser.Easing.Quadratic.InOut, true, 1000);
        this.game.add.tween(this.categoryTitle.scale).to({x: [originalScale * 1.2, originalScale], y: [originalScale * 1.2, originalScale]}, 800, Phaser.Easing.Quadratic.InOut, true, 1000);
    }

    createPlaceHolder() {
        

        for (var i = 0; i < PiecSettings.goals.length; i++) {
            
            var targetWordGrp = new Phaser.Group(this.game);
            var containerName = 'tiles-area-' + (i+1);
            var circleSize = ContainerUtil.getContainerHeight(containerName);
            // var panelX = ContainerUtil.getContainerX(containerName);
            // var panelY = ContainerUtil.getContainerY(containerName);
            var length = PiecSettings.goals[i].length;

            var circleDistance = 0;


            var correctWord = this.createCorrectWords(containerName, PiecSettings.goals[i]);
            this.correctWords[PiecSettings.goals[i]] = correctWord;

            for(var h = 0; h < length; h++) {
                
                var background = this.game.add.graphics(0, 0);
                var backgroundColor = "0x000";
                // if (PiecSettings.colorPalette !== undefined && PiecSettings.colorPalette.wordBoxDefault !== undefined) {
                //     backgroundColor = PiecSettings.colorPalette.wordBoxDefault;
                // }
                
                background.beginFill(backgroundColor);
                background.drawCircle(0, 0, circleSize);
                
                background.alpha = 0.5;
                background.x += h * circleSize + circleDistance + circleSize / 2;
                background.y += circleSize/2;


                background.key = PiecSettings.goals[i].charAt(h);
            
                targetWordGrp.add(background);

                
            }

            ContainerUtil.fitInContainerHeight(targetWordGrp, containerName);
            targetWordGrp.alpha = 0;
            this.game.add.tween(targetWordGrp).to({alpha: 1}, 1000, Phaser.Easing.Quadratic.InOut, true, 1000 + i * 100);
            this.targetWords[PiecSettings.goals[i]] = targetWordGrp;
            
        }   

        
    }

    getPlaceHoldersCoordinates(word, childrenIndex){

        var coordinate = {
            x: this.targetWords[word].x + this.targetWords[word].children[childrenIndex].x,
            y: this.targetWords[word].y + this.targetWords[word].children[childrenIndex].y,
            w: this.targetWords[word].children[childrenIndex].width,
            h: this.targetWords[word].children[childrenIndex].height,
        }

        return coordinate;
    }

    createCorrectWords(containerName, text){

        var wordGrp = new Phaser.Group(this.game);

        var wordBg = new Phaser.Sprite(this.game, 0, 0, 'wordGrid-bg');
        wordBg.anchor.set(0.5);
        ContainerUtil.fitInContainerHeight(wordBg, containerName, 0.5, 0.5);

        wordGrp.add(wordBg);
        var fontWeight = 'bold',
            fontSize = wordGrp.height * 0.8,
            fontFamily = PiecSettings.fontFamily,
            fontColor = ['#fff'];

        // console.log(fontSize);
        var style = {
            font: fontSize + 'px ' + fontFamily
        };


        var wordText = new Phaser.Text(this.game, 0, 0, text, style);
        wordText.anchor.set(0.5);
        wordText.x = wordBg.x;
        wordText.y = wordBg.y;

        // ContainerUtil.fitInContainer(wordText, containerName, 0.5, 0.5);
        var gradient = wordText.context.createLinearGradient(0, 0, 0, wordText.height);

        if (fontColor !== undefined && fontColor.length > 0) {
            for (var i = 0; i < fontColor.length; i++) {
                var index = i / fontColor.length;
                gradient.addColorStop(index, fontColor[i]);
            }
        }
        wordText.fill = gradient;
        
        wordGrp.add(wordText);

        this.add(wordGrp);
        wordGrp.alpha = 0;

        return wordGrp;
    }

    turnGrid(word){
       
        var grid = this.targetWords[word];
         // console.log(grid);
        this.game.add.tween(grid).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true, 100)
        .onComplete.add(function(){
            
        },this);

        var correctWord = this.correctWords[word];

        var correctWordBg = correctWord.children[0];
        var correctWordText = correctWord.children[1];
        var scale1 = correctWordBg.scale.x;
        var scale2 = correctWordText.scale.x;

        this.game.add.tween(correctWord).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 0);
        this.game.add.tween(correctWordBg.scale).to({
            x: [scale1 * 1.25, scale1],
            y: [scale1 * 1.25, scale1],
        }, 500, Phaser.Easing.Linear.None, true, 0);
        this.game.add.tween(correctWordText.scale).to({
            x: [scale2 * 1.25, scale2],
            y: [scale2 * 1.25, scale2],
        }, 500, Phaser.Easing.Linear.None, true, 0);
        
    }

    highlightNextWord() {
        var word = this.getNextUnsolvedWord();
        console.log(word);
        var boxCookies = this.wordsToBoxCookies[word];
        for (var i = 0; i < boxCookies.length; i++) {
            if (boxCookies[i].letter.alpha < 1) {
                this.game.add.tween(boxCookies[i].letter).to({
                    alpha: 0.4,
                }, 400, Phaser.Easing.Quadratic.InOut, true, 0);
                var initialScale = boxCookies[i].initialLetterScale;
                this.game.add.tween(boxCookies[i].letter.scale).to({
                    x: [initialScale * 1.25, initialScale],
                    y: [initialScale * 1.25, initialScale],
                }, 600, Phaser.Easing.Quadratic.InOut, true, 0);
            }
        }
    }

    getNextUnsolvedWord() {
        for (var property in this.wordsToBoxCookies) {
            if (this.wordsToBoxCookies.hasOwnProperty(property)) {
                var boxCookies = this.wordsToBoxCookies[property];
                for (var i = 0; i < boxCookies.length; i++) {
                    if (!boxCookies[i].revealed) {
                        return property;
                    }
                }
            }
        }
        return false;
    }

    createWords() {
        this.accrossWords = this.createWordsAccross();
        this.downWords = this.createWordsDown();
    }

    preFillWords() {
        for (var i = 0; i < PiecSettings.preFilledWords.length; i++) {
            if (this.wordsToBoxCookies[PiecSettings.preFilledWords[i]]) {
                var boxCookies = this.wordsToBoxCookies[PiecSettings.preFilledWords[i]];
                for (var j = 0; j < boxCookies.length; j++) {
                    this.revealBoxCookieNoAnimation(boxCookies[j]);
                }
            }
        }
    }

    createWordsAccross() {
        var words = [];
        for (var i = 0; i < PiecSettings.words.accross.length; i++) {
            var xCoord = PiecSettings.words.accross[i][0];
            var yCoord = PiecSettings.words.accross[i][1];
            var word = PiecSettings.words.accross[i][2];
            words[i] = this.createAccrossWord(word, xCoord, yCoord);
        }
        return words;
    }

    createWordsDown() {
        var words = [];
        for (var i = 0; i < PiecSettings.words.down.length; i++) {
            var xCoord = PiecSettings.words.down[i][0];
            var yCoord = PiecSettings.words.down[i][1];
            var word = PiecSettings.words.down[i][2];
            words[i] = this.createDownWord(word, xCoord, yCoord);
        }
        return words;
    }

    createAccrossWord(word, x, y) {
        var wordLetters = [];
        for (var i = 0; i < word.length; i++) {
            var letter = word[i];
            var boxCookie = new Phaser.Sprite(this.game, 0, 0, 'box-cookie-empty');
            boxCookie.anchor.set(0.5);

            this.scaleBoxCookie(boxCookie);
            boxCookie.x = i * boxCookie.width + x * boxCookie.width + boxCookie.width / 2;
            boxCookie.y = y * boxCookie.height + boxCookie.height / 2;
            this.centerBoxCookieVertAndHor(boxCookie);

            this.add(boxCookie);
            this.addLetterToBoxCookie(boxCookie, letter);

            wordLetters[i] = boxCookie;
            this.coordsToBoxCookie[(x + i) + "," + y] = boxCookie;
            // console.log("COOKIE at " + (x + i) + ", " + y + " - " + letter);
            if (this.isPreFilled(x + i, y)) {
                this.revealBoxCookieNoAnimation(boxCookie);
            }
        }
        this.wordsToBoxCookies[word] = wordLetters;
        return wordLetters;
    }

    addLetterToBoxCookie(boxCookie, letterName) {
        if (PiecSettings.useAlternativeAssetForSolvedLetters) {
            letterName += "-2";
        }
        var letter = new Phaser.Sprite(this.game, 0, 0, letterName);
        letter.anchor.set(0.5);

        var letterScaleInBoxCookie = 0.75;
        if (PiecSettings.letterScaleInBoxCookie !== undefined) {
            letterScaleInBoxCookie = PiecSettings.letterScaleInBoxCookie;
        }

        letter.scale.x = boxCookie.width / letter.width * letterScaleInBoxCookie;
        letter.scale.y = letter.scale.x;
        letter.x = boxCookie.x;
        letter.y = boxCookie.y;
        letter.alpha = 0;

        this.add(letter);
        boxCookie.letter = letter;
        boxCookie.revealed = false;
        boxCookie.initialLetterScale = letter.scale.x;
    }

    evaluateWord(word) {
        var boxCookies = this.wordsToBoxCookies[word];
        if (boxCookies) {
            if (this.hasWordBeenRevealed(word)) {
                return "repeated";
            }
            this.revealWord(word);
            this.completedWords++;
            return "correct";
        }
        return "incorrect";
    }

    allLettersRevealed() {
        for (var property in this.coordsToBoxCookie) {
            if (this.coordsToBoxCookie.hasOwnProperty(property)) {
                var boxCookie = this.coordsToBoxCookie[property];
                if (!boxCookie.revealed) {
                    return false;
                }
            }
        }
        return true;
    }

    revealWord(word) {
        var boxCookies = this.wordsToBoxCookies[word];
        for (var i = 0; i < boxCookies.length; i++) {
            this.revealBoxCookieWithDelay(boxCookies[i], i * 170);
        }
    }

    hasWordBeenRevealed(word) {
        var boxCookies = this.wordsToBoxCookies[word];
        for (var i = 0; i < boxCookies.length; i++) {
            if (boxCookies[i].letter.alpha != 1) {
                return false;
            }
        }
        return true;
    }

    revealBoxCookieWithDelay(boxCookie, delay) {

        boxCookie.revealed = true;

        this.game.time.events.add(delay + 300, function() {
            this.spawnStars(boxCookie);
        }, this);

        this.game.time.events.add(delay, function() {

            this.game.time.events.add(20, function() {
                this.revealBoxCookieNoAnimation(boxCookie);
            }, this);

            var initialScale = boxCookie.scale.x;

            var tween = this.game.add.tween(boxCookie.scale).to({
                x: [initialScale * 1.7, initialScale * 0.8, initialScale, initialScale],
                y: [initialScale * 1.7, initialScale * 0.8, initialScale, initialScale]
            }, 1500, Phaser.Easing.Quadratic.Out, true, 0);

            var initialScale2 = boxCookie.letter.scale.x;
            this.game.add.tween(boxCookie.letter.scale).to({
                x: [initialScale2 * 1.7, initialScale2 * 0.8, initialScale2, initialScale2],
                y: [initialScale2 * 1.7, initialScale2 * 0.8, initialScale2, initialScale2]
            }, 1500, Phaser.Easing.Quadratic.Out, true, 0);

        }, this);
    }

    revealBoxCookieNoAnimation(boxCookie) {
        boxCookie.revealed = true;
        boxCookie.letter.alpha = 1;
        boxCookie.loadTexture('box-cookie-full', false, 0);
    }

    createDownWord(word, x, y) {
        var wordLetters = [];
        for (var i = 0; i < word.length; i++) {

            var boxCookieExisting = this.coordsToBoxCookie[x + "," + (y + i)];

            if (!boxCookieExisting) {
                var letter = word[i];
                var boxCookie = new Phaser.Sprite(this.game, 0, 0, 'box-cookie-empty');
                boxCookie.anchor.set(0.5);

                this.scaleBoxCookie(boxCookie);
                boxCookie.x = x * boxCookie.width + boxCookie.width / 2;
                boxCookie.y = y * boxCookie.height + i * boxCookie.height + boxCookie.height / 2;
                this.centerBoxCookieVertAndHor(boxCookie);

                this.add(boxCookie);
                this.addLetterToBoxCookie(boxCookie, letter);

                wordLetters[i] = boxCookie;
                this.coordsToBoxCookie[x + "," + (y + i)] = boxCookie;

                console.log("COOKIE at (" + x + ", " + (y + i) + ") - " + letter);
                // console.log(this.coordsToBoxCookie);

                if (this.isPreFilled(x, y + i)) {
                    boxCookie.letter.alpha = 1;
                    boxCookie.loadTexture('box-cookie-full', false, 0);
                }
            } else { //It already exists, so we just copy the reference!
                wordLetters[i] = boxCookieExisting;
            }
        }
        this.wordsToBoxCookies[word] = wordLetters;
        return wordLetters;
    }

    isPreFilled(x, y) {
        for (var i = 0; i < PiecSettings.preFilledLettersCoordinates.length; i++) {
            if (x == PiecSettings.preFilledLettersCoordinates[i][0] &&
                y == PiecSettings.preFilledLettersCoordinates[i][1]) {
                return true;
            }
        }
    }

    scaleBoxCookie(boxCookie) {
        boxCookie.scale.x = this.width * 0.85 / PiecSettings.wordsGridWidth / boxCookie.width;
        boxCookie.scale.y = boxCookie.scale.x;
    }

    centerBoxCookieVertAndHor(boxCookie) {
        boxCookie.x += (this.width - boxCookie.width * PiecSettings.wordsGridWidth) / 2;
        boxCookie.y += (this.background.height - boxCookie.height * PiecSettings.wordsGridHeight) / 2;
        //Recenter with anchor point!
        boxCookie.x -= (this.background.width * (0.5 - PiecSettings.boardAnchor[0])) / 2;
        boxCookie.y -= (this.background.height * (0.5 - PiecSettings.boardAnchor[1])) / 2;
    }

    playAnimationOnWord(x, y) {
        for (var i = 0; i < PiecSettings.words[x].length; i++) {
            var letter = this.words[x][i];
            if (i == y) {
                var burst = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[0], this.fxLayer);
                burst.anchor.set(0.5);
                burst.scale.x = letter.letterBackground.width / burst.width * 3;
                burst.scale.y = burst.scale.x;
                burst.x = letter.x + letter.letterBackground.width / 2;
                burst.y = letter.y + letter.letterBackground.height / 2;
                letter.letterText.alpha = 1;
            } else {
                this.burstBlueWithDelay(letter, Math.abs(y - i) * 150 + 500);
            }
        }
    }

    playRedAnimationOnWord(x, y) {
        for (var i = 0; i < PiecSettings.words[x].length; i++) {
            var letter = this.words[x][i];
            this.turnLetterRedWithDelay(letter, Math.abs(y - i) * 50 + 300);
            this.removeRedFromLetterWithDelay(letter, Math.abs(y - i) * 50 + 300 + 800);
            this.deleteLetter(letter, 1000);
        }
        this.game.time.events.add(1500, function() {
            this.moveCursorToBeginningOfWord(x);
            this.game.global.inputLocked = false;
        }, this);
    }

    turnLetterRedWithDelay(letter, delay) {
        this.game.time.events.add(delay, function() {
            letter.letterBackground.loadTexture('tile-wrong', 0, false);
            // letter.letterBackground.tint = 0xEC6B66;
            if (PiecSettings.wordsLettersMissing[letter.xCoord][letter.yCoord] == "?") {
                letter.letterText.fill = "#9D9CC7";
                letter.letterText.alpha = 1;
            }
        }, this);
    }

    removeRedFromLetterWithDelay(letter, delay) {
        this.game.time.events.add(delay, function() {
            letter.letterBackground.loadTexture(this.getTileImage(letter.xCoord, letter.yCoord), 0, false);
        }, this);
    }

    deleteLetter(letter, delay) {
        this.game.time.events.add(delay, function() {
            if (PiecSettings.wordsLettersMissing[letter.xCoord][letter.yCoord] == "?") {
                letter.letterText.text = "";
            }
        }, this);
    }

    burstWithDelayOnPosition(delay, animation, x, y, scale) {
        this.game.time.events.add(delay, function() {
            var burst = CustomPngSequencesRenderer.playPngSequence(this.game, animation, this.fxLayer);
            burst.anchor.set(0.5);
            burst.scale.x = scale;
            burst.scale.y = scale;
            burst.x = x;
            burst.y = y;
        }, this);
        this.game.world.bringToTop(this.fxLayer);
    }

    burstWithDelay(letter, delay, animation) {
        this.game.time.events.add(delay, function() {
            var burst = CustomPngSequencesRenderer.playPngSequence(this.game, animation, this.fxLayer);
            burst.anchor.set(0.5);
            burst.scale.x = letter.letterBackground.width / burst.width * 3.65;
            burst.scale.y = burst.scale.x;
            burst.x = letter.x + letter.letterBackground.width / 2;
            burst.y = letter.y + letter.letterBackground.height / 2;
            this.game.time.events.add(delay / 2, function() {
                letter.letterText.alpha = 1;
            }, this);
        }, this);
    }

    burstBlueWithDelay(letter, delay) {
        this.burstWithDelay(letter, delay, PiecSettings.pngAnimations[1]);
    }
    burstYellowWithDelay(letter, delay) {
        this.burstWithDelay(letter, delay, PiecSettings.pngAnimations[2]);
    }

    danceVerticalLetters() {
        for (var i = 0; i < this.words.length; i++) {
            for (var j = 0; j < this.words[i].length; j++) {
                if (PiecSettings.wordsColoring[i][j] == "#") {
                    var letter = this.words[i][j];
                    this.danceLetter(letter.letterText, 1000);
                    this.burstWithDelay(letter, Math.abs(Math.round((this.words.length - 1) / 2) - i) * 150 + 500, PiecSettings.pngAnimations[2]);
                }
            }
        }
    }

    flyVerticalLetters() {
        var offsetIndex = 0;
        for (var i = 0; i < this.words.length; i++) {
            for (var j = 0; j < this.words[i].length; j++) {
                if (PiecSettings.wordsColoring[i][j] == "#") {
                    var letter = this.words[i][j];
                    var finalX = this.cta.button.x - this.cta.button.width / 2 + this.cta.button.width * 0.1 + this.cta.button.width * 0.1 * (offsetIndex + 1);
                    var finalY = this.cta.button.y - letter.height / 4;

                    this.flyLetterWithDelay(letter, finalX, finalY, offsetIndex * 50);
                    var burst = this.burstWithDelayOnPosition(800 + offsetIndex * 50, PiecSettings.pngAnimations[1], finalX, finalY, 2.5);
                }
            }
            offsetIndex++;
        }
    }

    spawnStarsOnVerticalWord() {
        for (var i = 0; i < this.words.length; i++) {
            for (var j = 0; j < this.words[i].length; j++) {
                if (PiecSettings.wordsColoring[i][j] == "#") {
                    this.spawnStars(this.words[i][j]);
                }
            }
        }
    }

    danceLetter(letter, duration) {
        this.game.add.tween(letter).to({
            angle: [-10, 10, -10, 0],
        }, duration, Phaser.Easing.Quadratic.InOut, true, 0);
    }

    flyLetterWithDelay(letter, finalX, finalY, delay) {
        this.game.time.events.add(delay, function() {
            this.flyLetter(letter, finalX, finalY);
        }, this);
    }

    flyLetter(letter, finalX, finalY) {
        var letterClone = new Phaser.Group(this.game);

        var letterBackground = new Phaser.Sprite(this.game, 0, 0, this.getTileImage(letter.xCoord, letter.yCoord));
        letterBackground.scale.x = letter.letterBackground.scale.x;
        letterBackground.scale.y = letter.letterBackground.scale.y;
        letterBackground.x = letter.letterBackground.x;
        letterBackground.y = letter.letterBackground.y;
        letterClone.add(letterBackground);

        letterClone.x = letter.x;
        letterClone.y = letter.y;

        var style = {
            font: this.fontSize + "px " + PiecSettings.fontFamily
        };
        var letterText = new Phaser.Text(this.game, 0, 0, PiecSettings.wordsLettersMissing[letter.xCoord][letter.yCoord] == "?" ? " " : PiecSettings.words[letter.xCoord][letter.yCoord], style);
        letterText.anchor.set(0.5);
        letterText.fill = "#001b80";
        letterText.x = letter.letterText.x;
        letterText.y = letter.letterText.y;

        letterText.scale.x = letter.letterText.scale.x;
        letterText.scale.y = letter.letterText.scale.y;

        letterClone.add(letterText);

        this.game.world.bringToTop(letterClone);
        this.game.world.bringToTop(this.fxLayer);

        var initialScale = letterClone.scale.x;

        var flyTween = this.game.add.tween(letterClone).to({
            x: finalX,
            y: finalY,
        }, 1000, Phaser.Easing.Quadratic.InOut, true, 0);

        this.game.add.tween(letterClone.scale).to({
            x: initialScale * .5,
            y: initialScale * .5,
        }, 1000, Phaser.Easing.Quadratic.InOut, true, 0);

        flyTween.onComplete.add(function() {
            letterClone.destroy();
        }, this);
    }

    playAnimationOnBoard() {
        for (var i = 0; i < this.words.length; i++) {
            for (var j = 0; j < this.words[i].length; j++) {
                var letter = this.words[i][j];
                if (PiecSettings.wordsColoring[i][j] != "#") {
                    this.burstYellowWithDelay(letter, i * 150 + j * 150);
                } else {
                    this.raiseLetter(letter);
                }
            }
        }
    }

    raiseLetter(letter) {

        this.game.world.bringToTop(letter);

        var letterXBackground = letter.letterBackground.x;
        var letterYBackground = letter.letterBackground.y;

        var initialScaleBackground = letter.letterBackground.scale.x;
        var initialWidth = letter.letterBackground.width;
        var initialHeight = letter.letterBackground.height;

        this.game.add.tween(letter.letterBackground.scale).to({
            x: initialScaleBackground * 1.1,
            y: initialScaleBackground * 1.1
        }, 1000, Phaser.Easing.Quadratic.InOut, true);

        this.game.add.tween(letter.letterBackground).to({
            x: letterXBackground + initialWidth / 2 - initialWidth * 1.1 / 2,
            y: letterYBackground + initialHeight / 2 - initialHeight * 1.1 / 2 - (3 - letter.xCoord) * initialHeight * 0.07,
        }, 1000, Phaser.Easing.Quadratic.InOut, true);

        var letterXText = letter.letterText.x;
        var letterYText = letter.letterText.y;

        var initialScaleText = letter.letterText.scale.x;
        var initialWidthText = letter.letterText.width;
        var initialHeightText = letter.letterText.height;

        this.game.add.tween(letter.letterText.scale).to({
            x: initialScaleText * 1.1,
            y: initialScaleText * 1.1
        }, 1000, Phaser.Easing.Quadratic.InOut, true);

        this.game.add.tween(letter.letterText).to({
            x: letterXBackground + initialWidth / 2 - initialWidth * 1.1 / 2 + initialWidth * 1.1 / 2,
            y: letterYBackground + initialHeight / 2 - initialHeight * 1.1 / 2 - (3 - letter.xCoord) * initialHeight * 0.07 + initialHeight * 1.1 / 2,
        }, 1000, Phaser.Easing.Quadratic.InOut, true);

    }

    spawnStars(letter) {
        for (var i = 0; i < 20; i++) {
            var starOrParticle = Math.random() > 0.4 ? 'star-particle' : 'spark-particle';
            var star = new Phaser.Sprite(this.game, 0, 0, starOrParticle);
            this.fxLayer.add(star);
            star.anchor.set(0.5);
            star.scale.x = letter.width * .45 / star.width * (Math.random());
            star.scale.y = star.scale.x;

            star.x = letter.x;
            star.y = letter.y;

            star.alpha = 0;

            var initialScale = star.scale.x;
            var initialY = star.y;
            var initialX = star.x;

            var angle = Math.random() * 360;
            var radius = (letter.width + letter.width * Math.random()) * .75;

            var finalX = radius * Math.cos(angle * Math.PI / 180) + initialX;
            var finalY = radius * Math.sin(angle * Math.PI / 180) + initialY;

            // var finalX = initialX + letter.width * 1.5 * (Math.random() > 0.5 ? 1 : -1);
            // var finalY = initialY - Math.random() * 100 - 200;
            var finalScale = initialScale * Math.random();

            var delay = i * 10;
            var duration = Math.random() * 300 + 800;

            AnimationsUtil.starFloatWithDelay(this.game, star, finalX, finalY, finalScale, duration, delay);
        }
    }

    animate() {
        var initialY = this.y;
        this.game.add.tween(this).to({
            y: -this.height * 1.1,
        }, 1200, Phaser.Easing.Quadratic.InOut, true, 200);
    }

}

export default WordGrid;