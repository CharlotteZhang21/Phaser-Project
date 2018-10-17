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

        this.fxLayer = new Phaser.Group(this.game);
        this.game.world.bringToTop(this.fxLayer);
        this.fxLayer.x = this.x;
        this.fxLayer.y = this.y;
        this.fxLayer.scale.x = this.scale.x;
        this.fxLayer.scale.y = this.scale.y

        // console.log(this.wordsToBoxCookies);

        this.completedWords = 0;

        this.idleAnimate(this.targetWords[PiecSettings.goals[this.completedWords]]);   
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

    idleAnimate(group){
        // console.log(group);
        for(var i = 0; i < group.children.length; i++){
            var scale = group.children[i].scale.x;
            this.game.add.tween(group.children[i].scale).to({
                x: [scale * 0.9, scale],
                y: [scale * 0.9, scale]
            }, 500, Phaser.Easing.Linear.InOut, true, i * 100).repeat(-1, 1000);
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
            this.game.global.tutorialCanceled = false;
            if(++this.completedWords == PiecSettings.goals.length){

                this.game.onBoardComplete.dispatch();
            }else {
                this.idleAnimate(this.targetWords[PiecSettings.goals[this.completedWords]]);  
            }
        },this);

        var correctWord = this.correctWords[word];

        var correctWordBg = correctWord.children[0];
        var correctWordText = correctWord.children[1];

        this.spawnStars(correctWordBg);

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

    getCompletedWordNum(){
        console.log(this.completedWords)
        return this.completedWords;
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


    spawnStars(letter) {
        for (var i = 0; i < 20; i++) {
            var starOrParticle = Math.random() > 0.4 ? 'star-particle' : 'spark-particle';
            var star = new Phaser.Sprite(this.game, 0, 0, starOrParticle);
            this.fxLayer.add(star);
            star.anchor.set(0.5);
            star.scale.x = letter.width * .3 / star.width * (Math.random());
            star.scale.y = star.scale.x;

            star.x = letter.x;
            star.y = letter.y;

            star.alpha = 0;

            var initialScale = star.scale.x;
            var initialY = star.y;
            var initialX = star.x;

            var angle = Math.random() * 360;
            var radius = (letter.width + letter.width * Math.random()) * .5;

            var finalX = radius * Math.cos(angle * Math.PI / 180) + initialX;
            var finalY = radius * Math.sin(angle * Math.PI / 180) + initialY;

            // var finalX = initialX + letter.width * 1.5 * (Math.random() > 0.5 ? 1 : -1);
            // var finalY = initialY - Math.random() * 100 - 200;
            var finalScale = initialScale * Math.random();

            var delay = i * 10;
            var duration = Math.random() * 300 + 1800;

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