import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class CtaButton extends Phaser.Group {
    constructor(game, ctaLayer, winMessage, logo) {
        super(game);

        this.ctaLayer = ctaLayer;
        this.winMessage = winMessage;
        this.logo = logo;

        // if (this.game.global.windowWidth < this.game.global.windowHeight) {
        //     this.createBackground();
        // }

        this.fxLayer = new Phaser.Group(this.game);

        this.button = new Phaser.Sprite(this.game, 0, 0, 'cta', 0);
        this.initialCtaWidth = this.button.width;
        this.button.anchor.set(0.5, 0.5);

        ContainerUtil.fitInContainer(this.button, "cta-container");

        this.ctaLayer.add(this.button);

        this.button.bringToTop();
        this.game.world.bringToTop(this.ctaLayer);

        this.button.x += this.button.width / 2;
        this.button.y += this.button.height / 2;

        this.button.inputEnabled = true;
        this.button.input.useHandCursor = true;
        this.button.events.onInputDown.add(function() {
            doSomething('download');
        });

        // this.showDecos();
    }

    createTip() {
        this.tip = new Phaser.Sprite(this.game, 0, 0, 'tip');
        this.tip.anchor.set(0.5);
        this.add(this.tip);
        this.tip.scale.x = this.background.width * 0.67 / this.tip.width;
        this.tip.scale.y = this.tip.scale.x;
        this.tip.y = this.button.y + this.button.height * 0.2;
        this.tip.x = this.button.x + this.tip.width / 2 - this.button.width * 0.25;
    }

    showTip() {
        var initialY = this.tip.y;
        this.game.add.tween(this.tip).to({
            y: initialY - this.button.height,
        }, 700, Phaser.Easing.Quadratic.InOut, true, 0);

        this.game.time.events.add(2500, function() {
            this.game.add.tween(this.tip).to({
                y: initialY
            }, 700, Phaser.Easing.Quadratic.InOut, true, 0);
        }, this);
    }

    createBackground() {
        var container = document.getElementById("cta-background");
        var containerWidth = container.offsetWidth * window.devicePixelRatio;
        var containerHeight = container.offsetHeight * window.devicePixelRatio;
        var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
        var containerY = container.getBoundingClientRect().top * window.devicePixelRatio

        var myBitmap = new Phaser.BitmapData(this.game, 'myBitmap', containerWidth, containerHeight);
        var grd = myBitmap.context.createLinearGradient(0, 0, 0, containerHeight);
        grd.addColorStop(0, "#4835c4");
        grd.addColorStop(0.1, "#412cad");
        grd.addColorStop(0.5, "#362288");
        grd.addColorStop(1, "#362288");
        myBitmap.context.fillStyle = grd;
        myBitmap.context.fillRect(0, 0, containerWidth, containerHeight);

        this.background = this.game.add.sprite(containerX, containerY, myBitmap, null, this);
        console.log(this.x + ", " + this.y);
    }

    fitInContainer() {
        this.container = document.getElementById("cta-container");
        this.containerWidth = this.container.offsetWidth * window.devicePixelRatio;
        this.containerHeight = this.container.offsetHeight * window.devicePixelRatio;
        var containerX = this.container.getBoundingClientRect().left * window.devicePixelRatio;
        var containerY = this.container.getBoundingClientRect().top * window.devicePixelRatio;

        this.x = containerX;
        this.y = containerY;

        this.scale.x = this.containerWidth / this.button.width;
        this.scale.y = this.scale.x;
    }

    animate() {

        var finalContainer = document.getElementById("cta-container-final");
        var finalContainerWidth = finalContainer.offsetWidth * window.devicePixelRatio;
        var finalContainerX = finalContainer.getBoundingClientRect().left * window.devicePixelRatio;
        var finalContainerY = finalContainer.getBoundingClientRect().top * window.devicePixelRatio;

        console.log(finalContainerWidth);
        var newScale = finalContainerWidth / this.initialCtaWidth;
        var initialScale = this.button.scale.x;

        var positionTween = this.game.add.tween(this.button).to({ x: finalContainerX + this.button.width / initialScale * newScale / 2, y: finalContainerY + this.button.height / initialScale * newScale / 2 }, 1100, Phaser.Easing.Back.Out, true, 0);
        var scaleTween = this.game.add.tween(this.button.scale).to({ x: newScale, y: newScale }, 900, Phaser.Easing.Quadratic.InOut, true, 0);
        // this.spawnStars();
        this.spawnCookies();

        this.game.time.events.add(1100, function() {
            this.startPulseIdleAnimation();
        }, this);
    }

    startPulseIdleAnimation() {

        this.buttonOver = new Phaser.Sprite(this.game, 0, 0, 'cta-2');
        this.buttonOver.anchor.set(0.5, 0.5);
        this.buttonOver.x = this.button.x;
        this.buttonOver.y = this.button.y;
        this.buttonOver.scale.x = this.button.width / this.buttonOver.width;
        this.buttonOver.scale.y = this.buttonOver.scale.x;
        this.ctaLayer.add(this.buttonOver);

        this.buttonOver.alpha = 0;

        var initialScale = this.buttonOver.scale.x;

        var pulseTween = this.game.add.tween(this.buttonOver).to({ alpha: 1 }, 600, Phaser.Easing.Quadratic.InOut, true, 600).loop().yoyo(true, 0);
        this.game.add.tween(this.buttonOver.scale).to({ x: initialScale * 1.05, y: initialScale * 1.05 }, 600, Phaser.Easing.Quadratic.InOut, true, 600).loop().yoyo(true, 0);
        this.game.add.tween(this.button.scale).to({ x: initialScale * 1.05, y: initialScale * 1.05 }, 600, Phaser.Easing.Quadratic.InOut, true, 600).loop().yoyo(true, 0);

        this.game.time.events.add(200, function() {
            // this.spawnStars();
            this.spawnCookies();
        }, this);

        pulseTween.onLoop.add(function() {
            this.game.time.events.add(200, function() {
                // this.spawnStars();
                this.spawnCookies();
            }, this);
        }, this);

    }

    createCtaArrow() {
        if (this.game.global.windowWidth > this.game.global.windowHeight) {
            var ctaArrow = this.game.add.sprite(0, 0, 'arrow-landscape');
            ctaArrow.scale.x = this.width / ctaArrow.width * .7;
            ctaArrow.scale.y = ctaArrow.scale.x;
            ctaArrow.x = this.x - this.width - ctaArrow.width / 3;
            ctaArrow.y = this.y + this.height / 2 - ctaArrow.height / 2;
            var tween = this.game.add.tween(ctaArrow).to({ x: ctaArrow.x + ctaArrow.width * 0.1 }, 700, Phaser.Easing.Quadratic.Out, true, 0, 0, true).loop();
        } else {
            var ctaArrow = this.game.add.sprite(0, 0, 'arrow-portrait');
            ctaArrow.scale.x = this.width / ctaArrow.width * .45;
            ctaArrow.scale.y = ctaArrow.scale.x;
            ctaArrow.x = this.x + this.width / 2 - ctaArrow.width / 2;
            ctaArrow.y = this.y - this.height - ctaArrow.height / 1.9;
            var tween = this.game.add.tween(ctaArrow).to({ y: ctaArrow.y + ctaArrow.height * 0.1 }, 700, Phaser.Easing.Quadratic.Out, true, 0, 0, true).loop();
        }
    }

    solveWordOnCta() {
        this.button.loadTexture('cta', 0, false);
    }

    spawnStars() {
        for (var i = 0; i < 30; i++) {
            var star = new Phaser.Sprite(this.game, 0, 0, 'star-particle');
            this.fxLayer.add(star);

            star.anchor.set(0.5);
            star.scale.x = this.button.width / star.width * (Math.random() * .4);
            star.scale.y = star.scale.x;

            star.x = this.button.x + Math.random() * this.button.width / 2 * (Math.random() > 0.5 ? 1 : -1);
            star.y = this.button.y;

            star.alpha = 0;

            var initialScale = star.scale.x;
            var initialY = star.y;
            var initialX = star.x;

            var finalXMultiplier = 0.3;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalXMultiplier = 0.75;
            } else {
                if (this.game.global.windowWidth >= 768) {
                    finalXMultiplier = 0.5;
                }
            }

            var finalX = initialX + this.button.width * finalXMultiplier * (Math.random() > 0.5 ? 1 : -1);
            var finalYMultiplier = 7.25;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalYMultiplier = 4.25;
                if (this.game.global.windowWidth >= 768) {
                    finalYMultiplier = 6;
                }
            } else {
                if (this.game.global.windowWidth >= 768) {
                    finalYMultiplier = 9;
                }
            }
            var finalY = initialY - Math.random() * this.button.height * finalYMultiplier;
            var finalScale = initialScale * Math.random();

            var delay = i * 5 + 600;
            var duration = Math.random() * 1200 + 2000;

            AnimationsUtil.starFloatWithDelayCustom2(this.game, star, finalX, finalY, finalScale, duration, delay, Phaser.Easing.Quadratic.Out);
        }
        this.game.world.bringToTop(this.fxLayer);
        this.game.world.bringToTop(this.ctaLayer);
        this.game.world.bringToTop(this.winMessage);
        this.game.world.bringToTop(this.logo);
    }

    spawnCookies() {
        for (var i = 0; i < 4; i++) {
            var spriteName = 'star-cookie';
            // var spriteName = Math.random() > 0.45 ? 'star-cookie' : 'box-cookie-full';
            // spriteName = Math.random() > 0.95 ? 'cherry' : spriteName;

            var cookie = new Phaser.Sprite(this.game, 0, 0, spriteName);
            cookie.scale.x = this.button.width * .15 * (Math.random() * 0.25 + 0.5) / cookie.width;
            cookie.scale.y = cookie.scale.x;
            cookie.anchor.set(0.5);

            cookie.x = this.game.global.windowWidth * Math.random() * window.devicePixelRatio;
            cookie.y = this.game.global.windowHeight * Math.random() * window.devicePixelRatio;

            cookie.angle = Math.random() * 90 - 45;

            var duration = 800;
            var dissapearAfter = 4000;

            AnimationsUtil.spawnAndDissapear(this.game, cookie, duration + Math.random() * 100, i * 800, dissapearAfter + 1000 * Math.random(), Phaser.Easing.Quadratic.InOut);

            // cookie.alpha = 0;

            this.fxLayer.add(cookie);
        }
    }

    showDecos() {
        var deco1 = new Phaser.Sprite(this.game, 0, 0, 'deco1');
        this.add(deco1);

        var deco2 = new Phaser.Sprite(this.game, 0, 0, 'deco2');
        this.add(deco2);

        var deco3 = new Phaser.Sprite(this.game, 0, 0, 'deco3');
        this.add(deco3);

        ContainerUtil.fitInContainer(deco1, 'deco-01');
        ContainerUtil.fitInContainer(deco2, 'deco-02');
        ContainerUtil.fitInContainer(deco3, 'deco-03');

        var deco1Y = deco1.y;
        var deco2X = deco2.x;
        var deco3X = deco3.x;

        deco1.y -= deco1.height;
        deco2.x += deco2.width;
        deco3.x -= deco3.width;

        this.game.add.tween(deco1).to({
            y: deco1Y
        }, 1000, Phaser.Easing.Quadratic.InOut, true, 0);

        this.game.add.tween(deco2).to({
            x: deco2X
        }, 1100, Phaser.Easing.Quadratic.InOut, true, 0);

        this.game.add.tween(deco3).to({
            x: deco3X
        }, 1200, Phaser.Easing.Quadratic.InOut, true, 0);
    }

}

export default CtaButton;