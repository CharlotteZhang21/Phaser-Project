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
import * as AnimationUtil from '../utils/animations-util';

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


        this.fxLayer = new Phaser.Group(this.game);
        // this.tooltipsLayer = this.game.add.group();

        // this.goal = new Goal(this.game, 3);
        this.background = new Background(this.game);
        this.game.add.existing(this.background);

        // this.game.onWordComplete.add(this.onWordComplete, this);
        this.game.onBoardComplete.add(this.onBoardComplete, this);

        this.ctaLayer = new Phaser.Group(this.game);
        this.game.add.existing(this.ctaLayer)

        this.winMessage = new WinMessage(this.game);
        this.game.add.existing(this.winMessage);

        this.logo = new Logo(this.game);
        this.game.add.existing(this.logo);

        this.cta = new CtaButton(this.game, this.ctaLayer, this.winMessage, this.logo);
        this.game.add.existing(this.cta);

        this.cookieWord = new CookieWord(this.game);
        this.game.add.existing(this.cookieWord);

        this.wordGrid = new WordGrid(this.game, this.cta);
        this.game.add.existing(this.wordGrid);

        this.cookiePan = new CookiePan(this.game, this.cookieWord, this.wordGrid);
        this.game.add.existing(this.cookiePan);

        // this.tooltipLayer = this.game.add.group();
        this.wordGrid.animateTitle();

        this.hintButton = new HintButton(this.game, this.cookiePan, this.wordGrid);
        this.game.add.existing(this.hintButton);

        

        this.game.world.sendToBack(this.fxLayer);
        this.game.world.sendToBack(this.background);
        // this.game.world.bringToTop(this.cta);
        this.game.world.bringToTop(this.ctaLayer);


        this.game.time.events.loop(5000, function(){
            this.spawnCookies();
        }, this);
        this.game.world.bringToTop(this.cookiePan);
        this.game.world.bringToTop(this.winMessage);
        this.game.world.bringToTop(this.logo);

        var waitForAutoplay = 2500;
        // if (this.game.global.windowWidth > this.game.global.windowHeight){
        //     waitForAutoplay = 2400;
        // }
        this.game.time.events.add(waitForAutoplay, function() {
            if (!this.game.global.tutorialCanceled) {
                this.cookiePan.handFollowWord(PiecSettings.hint[0]);
            }
        }, this);

        this.game.time.events.add(3000, function(){
            this.hintButton.show();

        }, this);

        if(PiecSettings.autoPlay != null)
            this.game.global.idleTimer = this.game.time.events.add(PiecSettings.autoPlay, function() {
                console.log(PiecSettings.autoPlay);
                this.endCard();
            }, this);


        if (PiecSettings.timer !== undefined && PiecSettings.timer) {
            this.game.time.events.add(PiecSettings.timerDuration, function() {
                document.getElementById("vungle-close").className = "";
            }, this);
        }else {
            document.getElementById("vungle-close").className = "";
        }
    }

    resize() {
        // resize code here
        // location.reload();
    }

    render() {
        // render code here
    }

    spawnCookies() {
        for (var i = 0; i < 4; i++) {
            var spriteName = 'star-particle';
            // var spriteName = Math.random() > 0.45 ? 'star-cookie' : 'box-cookie-full';
            // spriteName = Math.random() > 0.95 ? 'cherry' : spriteName;

            var cookie = new Phaser.Sprite(this.game, 0, 0, spriteName);
            cookie.scale.x = this.game.global.windowWidth * (Math.random()+1) * 0.1/ cookie.width;
            cookie.scale.y = cookie.scale.x;
            cookie.anchor.set(0.5);

            cookie.x = this.game.global.windowWidth * Math.random() * window.devicePixelRatio;
            cookie.y = this.game.global.windowHeight * Math.random() * window.devicePixelRatio;

            cookie.angle = Math.random() * 90 - 45;

            cookie.alpha = 0.5 + (Math.random() + 0.5);

            var duration = 7000;
            // var dissapearAfter = 4000;

            // AnimationsUtil.spawnAndDissapear(this.game, cookie, duration + Math.random() * 100, i * 800, dissapearAfter + 1000 * Math.random(), Phaser.Easing.Quadratic.InOut);
            AnimationUtil.spawnAndFalling(this.game, cookie, duration + Math.random() * 100, i * 1000, Phaser.Easing.Quadratic.InOut); 
            // cookie.alpha = 0;


            this.fxLayer.add(cookie);

            cookie.sendToBack();
        }

    }

    onBoardComplete() {
        this.hintButton.animate();
        this.winMessage.showWinMessage();
        this.winMessage.spawnStars('celebration-1');
        this.winMessage.spawnStars('celebration-2');   
        this.game.time.events.add(800, function() {
            this.wordGrid.animate();
            
            this.game.time.events.add(400, function() {
                // this.cta.showDecos();
            }, this);
            this.game.time.events.add(1000, function() {
                this.cta.animate();
                this.game.time.events.add(200, function() {
                    this.logo.animate();
                }, this);
                if (PiecSettings.asoi !== undefined && PiecSettings.asoi == true) {
                    this.game.time.events.add(1000, function() {
                        doSomething('download');
                    }, this);
                }
            }, this);
        }, this);
        // this.game.time.events.add(600, function() {
            
        // }, this);
    }

    endCard() {
        this.hintButton.animate();
        this.wordGrid.animate();
        this.cookiePan.animate();
        this.cta.animate();
        this.game.time.events.add(200, function() {
            this.logo.animate();
        }, this);        
        // }, this);
    }

}

export default Endcard;