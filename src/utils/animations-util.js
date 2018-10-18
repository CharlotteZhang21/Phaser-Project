export function onLoop(sprite, animation) {
    if (sprite.loopReverse) {
        sprite.animations.currentAnim.isReversed = true;
    }
    if (animation.loopCount != 0 && animation.loopCount === sprite.numberOfLoops) {
        if (!sprite.persistent) {
            animation.loop = false;
            sprite.alpha = 0;
        }
    }
}

export function playAnimation(game, sprite, delay, speed, loopReverse) {
    sprite.loopReverse = loopReverse;
    sprite.speed = speed;
    if (sprite.loopReverse) {
        game.time.events.add(delay, function() {
            sprite.alpha = 1;
            sprite.animations.play('animation', speed, false);
            sprite.animations.currentAnim.onComplete.add(onComplete, this);
        });
    } else {
        game.time.events.add(delay, function() {
            sprite.alpha = 1;
            sprite.animations.play('animation', speed, true);
        });
    }
}

export function onComplete(sprite, animation) {
    sprite.animations.currentAnim.isReversed = !sprite.animations.currentAnim.isReversed;
    sprite.animations.play('animation', sprite.speed, false);
}

export function playAnimations(spritesheet, xPositions, yPositions, delays, loops, anchor, speed, scale, persistent, container, game, layer) {
    // console.log("play animations");
    var containerWidth = container.offsetWidth * window.devicePixelRatio;
    var containerHeight = container.offsetHeight * window.devicePixelRatio;
    var containerX = container.offsetLeft * window.devicePixelRatio;
    var containerY = container.offsetTop * window.devicePixelRatio;

    var hUnit = containerWidth / 100;
    var vUnit = containerHeight / 100;

    var animations = [];

    for (var i = 0; i < xPositions.length; i++) {
        var sprite = game.add.sprite(containerX + xPositions[i] * hUnit, containerY + yPositions[i] * vUnit, spritesheet);
        layer.add(sprite);
        sprite.anchor.set(anchor);
        sprite.animations.add('animation');
        sprite.alpha = 0;
        sprite.persistent = persistent;
        playAnimation(game, sprite, delays[i], speed, false);
        sprite.scale.x = (containerWidth * scale[i] / 100) / sprite.width;
        sprite.scale.y = sprite.scale.x;
        animations.push(sprite);
        if (loops != null) {
            sprite.numberOfLoops = loops[i];
            sprite.animations.currentAnim.onLoop.add(onLoop, this);
        }
    }

    return animations;
}

export function spawnAndDissapear(game, cookie, duration, delay, dissapearAfter, ease) {

    var initialScale = cookie.scale.x;
    cookie.scale.x = 0.01;
    cookie.scale.y = 0.01;
    game.time.events.add(delay, function() {
        game.add.tween(cookie.scale).to({
            x: initialScale,
            y: initialScale,
        }, duration, Phaser.Easing.Back.Out, true, 0).onComplete.add(function() {
            game.time.events.add(dissapearAfter, function() {
                game.add.tween(cookie).to({
                    alpha : 0
                }, duration, Phaser.Easing.Quadratic.In, true, 0).onComplete.add(function() {
                    cookie.destroy();
                }, this);
            }, this);
        }, this);
    }, this);
}

// leaves falling
export function spawnAndFalling(game, star, duration, delay, ease) {
    star.y = -100 - Math.random() * 100;
    var targetY = game.global.windowHeight * 1.1 * window.devicePixelRatio;
    
    var targetX = game.global.windowWidth * window.devicePixelRatio * 0.5 * Math.random();
    
    var targetAngle = 360 + 360 * Math.random() * 2;
    
    var tween = game.add.tween(star).to({
        x: [targetX * (1 + Math.random())],
        y: targetY,
        angle: targetAngle
    }, duration, ease, true, delay).onComplete.add(function(){
        star.destroy();
    }, this);
    return tween;
}


export function starFloatWithDelayCustom2(game, star, finalX, finalY, finalScale, duration, delay, ease) {
    game.time.events.add(delay, function() {
        star.alpha = 1;
        game.add.tween(star).to({
            // alpha: 0,
            y: finalY,
            x: finalX,
        }, duration, ease, true, 0);
        game.add.tween(star.scale).to({
            x: finalScale,
            y: finalScale
        }, duration, ease, true, 0);
    }, this);

    game.time.events.add(9000 + delay, function() {
        game.add.tween(star).to({
            alpha: 0,
        }, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
        game.time.events.add(1000, function() {
            star.destroy();
        }, this);
    }, this);
}

export function starFloatWithDelayCustom(game, star, finalX, finalY, finalScale, duration, delay, ease) {
    game.time.events.add(delay, function() {
        star.alpha = 0;
        game.add.tween(star).to({
            alpha: [0.5, 1, 0],
            y: finalY,
            x: finalX,
            angle: 180,
        }, duration, ease, true, 0);
        game.add.tween(star.scale).to({
            x: finalScale,
            y: finalScale
        }, duration, ease, true, 0);
    }, this);
}

export function starFloatWithDelay(game, star, finalX, finalY, finalScale, duration, delay) {
    this.starFloatWithDelayCustom(game, star, finalX, finalY, finalScale, duration, delay, Phaser.Easing.Quadratic.Out);
}

export function burstAndFalling(game, star, burstX, burstY, initialX, initialY, finalScale, duration, delay) {
    var targetY = game.global.windowHeight * 1.1 * window.devicePixelRatio;
    var targetX = game.global.windowWidth * window.devicePixelRatio * 0.5 * Math.random();
    
    var fallingPointX = burstX * 2 - initialX;
    var fallingPointY = burstY > initialY? burstY * 2 - initialY : initialY;

    var targetAngle = 360 + 360 * Math.random() * 2;
    var fallingSpeed = 2000 + 1000 * Math.random();
    game.time.events.add(delay, function() {
        star.alpha = 0;

        game.add.tween(star).to({  
            alpha: [0.5, 1],
            x: [burstX],
            angle: 180 + 180 * Math.random(),
        }, duration * 2, Phaser.Easing.Back.out, true, 0)
        .onComplete.add(function(){
            game.add.tween(star).to({
                x: [fallingPointX],
                angle: targetAngle,
            }, fallingSpeed, Phaser.Easing.Linear.Out, true, delay).onComplete.add(function(){
                // star.destroy();
            }, this);
        })

        game.add.tween(star).to({  
            y: [burstY],
        }, duration, Phaser.Easing.Back.out, true, 0)
        .onComplete.add(function(){
            game.add.tween(star).to({
                y: [targetY],
            }, fallingSpeed, Phaser.Easing.Linear.Out, true, delay).onComplete.add(function(){
                star.destroy();
            }, this);
        })


        game.add.tween(star.scale).to({
            x: finalScale,
            y: finalScale
        }, duration, Phaser.Easing.Quadratic.Out, true, 0);
        

    }, this);
}
