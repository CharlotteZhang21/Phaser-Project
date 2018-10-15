import Logo from '../prefabs/logo';
import DarkOverlay from '../prefabs/dark-overlay';
import Background from '../prefabs/background';
import CtaButton from '../prefabs/cta-button';
import WinMessage from '../prefabs/win-message';
import WordGrid from '../prefabs/word-grid';
import CookiePan from '../prefabs/cookie-pan';
import CookieWord from '../prefabs/cookie-word';
import HintButton from '../prefabs/hint-button';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class Endcard extends Phaser.State {

    constructor() {
        super();
    }

    create() {

        // this.game.global.tutorialCanceled = false;

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.global.windowWidth = document.body.clientWidth;
        this.game.global.windowHeight = document.body.clientHeight;

        // this.tooltipsLayer = this.game.add.group();

        // this.goal = new Goal(this.game, 3);
        this.background = new Background(this.game);
        this.game.add.existing(this.background);

        // this.game.onWordComplete.add(this.onWordComplete, this);
        // this.game.onBoardComplete.add(this.onBoardComplete, this);

        this.ctaLayer = new Phaser.Group(this.game);
        this.game.add.existing(this.ctaLayer)

        // this.winMessage = new WinMessage(this.game);
        // this.game.add.existing(this.winMessage);

        this.logo = new Logo(this.game);
        this.game.add.existing(this.logo);

        // this.cta = new CtaButton(this.game, this.ctaLayer, this.winMessage, this.logo);
        // this.game.add.existing(this.cta);

        this.cookieWord = new CookieWord(this.game);
        this.game.add.existing(this.cookieWord);

        this.wordGrid = new WordGrid(this.game, this.cta);
        this.game.add.existing(this.wordGrid);

        this.cookiePan = new CookiePan(this.game, this.cookieWord);
        this.game.add.existing(this.cookiePan);

        // this.tooltipLayer = this.game.add.group();

        // this.hintButton = new HintButton(this.game, this.wordGrid);
        // this.game.add.existing(this.hintButton);
        this.game.world.sendToBack(this.background);
        // this.game.world.bringToTop(this.cta);
        this.game.world.bringToTop(this.ctaLayer);
        // this.game.world.bringToTop(this.cookieWord);
        // this.game.world.bringToTop(this.winMessage);
        // this.game.world.bringToTop(this.logo);

        // this.darkOverlay = new DarkOverlay(this.game);
        // this.game.add.existing(this.darkOverlay);

        // this.game.world.bringToTop(this.tooltipLayer);

        // this.game.global.tutorialCanceled = false;

        // // this.tooltip.moveHandToItem(this.game.global.items[8]);
        // var waitForAutoplay = 3800;
        // if (this.game.global.windowWidth > this.game.global.windowHeight){
        //     waitForAutoplay = 2400;
        // }
        // this.game.time.events.add(waitForAutoplay, function() {
        //     if (!this.game.global.tutorialCanceled) {
        //         this.background.playInitialHandTutorial();
        //     }
        // }, this);

        // this.game.time.events.add(3800, function() {
        //     this.cta.animate();
        //     this.goal.hide();
        //     this.background.zoomOutBackground();
        //     this.darkOverlay.show();
        //     this.game.time.events.add(500, function() {
        //         this.winMessage.showWinMessage();
        //         this.logo.animate();
        //     }, this);
        // }, this);

        if (PiecSettings.timer !== undefined) {
            this.game.time.events.add(4000, function() {
                document.getElementById("vungle-close").className = "visible";
            }, this);
        }
    }

    resize() {
        // resize code here
        // location.reload();
    }

    render() {
        // render code here
    }

    // onGridComplete() {
    //     this.cta.solveWordOnCta();
    //     this.game.world.bringToTop(this.darkOverlay);
    //     this.game.world.bringToTop(this.winMessage);
    //     this.game.world.bringToTop(this.logo);
    //     this.game.world.bringToTop(this.ctaLayer);
    //     this.game.world.bringToTop(this.wordGrid.fxLayer);
    //     this.game.time.events.add(900, function() {
    //         //Show win message!
    //         this.winMessage.showWinMessage();
    //         this.darkOverlay.show();
    //         this.cta.animate();
    //     }, this);
    // }

    // onWordComplete(word) {
    //     var evaluationResult = this.wordGrid.evaluateWord(word);
    //     if (evaluationResult == "correct") {
    //         console.log("correct word!");
    //         var pathColor = "0x44AD12";
    //         if (PiecSettings.colorPalette !== undefined && PiecSettings.colorPalette.correct !== undefined) {
    //             pathColor = PiecSettings.colorPalette.correct;
    //         }
    //         this.cookiePan.changePathColor(pathColor);
    //         this.cookiePan.fadePath();
    //         this.cookiePan.bounceLetters(word);

    //         this.cookieWord.colorBox(word, pathColor);
    //         this.cookieWord.fadeBox();

    //         if (this.wordGrid.allLettersRevealed()) {
    //             this.game.onBoardComplete.dispatch();
    //         }
    //     } else if (evaluationResult == "incorrect") {
    //         var pathColor = "0xe3442d";
    //         if (PiecSettings.colorPalette !== undefined && PiecSettings.colorPalette.incorrect !== undefined) {
    //             pathColor = PiecSettings.colorPalette.incorrect;
    //         }
    //         console.log("incorrect word!");
    //         this.cookiePan.changePathColor(pathColor);
    //         this.cookiePan.fadePath();

    //         this.cookieWord.colorBox(word, pathColor);
    //         this.cookieWord.fadeBox();

    //     } else if (evaluationResult == "repeated") {
    //         var pathColor = "0xf6a200";
    //         if (PiecSettings.colorPalette !== undefined && PiecSettings.colorPalette.repeated !== undefined) {
    //             pathColor = PiecSettings.colorPalette.repeated;
    //         }
    //         console.log("repeated word");
    //         this.cookiePan.changePathColor(pathColor);
    //         this.cookiePan.fadePath();

    //         this.cookieWord.colorBox(word, pathColor);
    //         this.cookieWord.fadeBox();

    //     }
    // }

    // onBoardComplete() {
    //     this.hintButton.animate();
    //     this.game.time.events.add(800, function() {
    //         this.wordGrid.animate();
    //         this.cookiePan.animate();
    //         this.game.time.events.add(400, function() {
    //             this.cta.showDecos();
    //         }, this);
    //         this.game.time.events.add(1000, function() {
    //             this.cta.animate();
    //             this.game.time.events.add(200, function() {
    //                 this.logo.animate();
    //             }, this);
    //             if (PiecSettings.asoi !== undefined && PiecSettings.asoi == true) {
    //                 this.game.time.events.add(1000, function() {
    //                     doSomething('download');
    //                 }, this);
    //             }
    //         }, this);
    //     }, this);
    //     this.game.time.events.add(600, function() {
    //         this.winMessage.showWinMessage();
    //     }, this);
    // }

}

export default Endcard;