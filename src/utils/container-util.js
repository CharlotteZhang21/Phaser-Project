export function bestFit(object, containerName, anchorX = 0, anchorY = 0) {
    var container = document.getElementById(containerName);
    var containerWidth = container.offsetWidth * window.devicePixelRatio;
    var containerHeight = container.offsetHeight * window.devicePixelRatio;
    var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
    var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

    if (object.anchor !== undefined) {
        object.anchor.x = anchorX;
        object.anchor.y = anchorY
    }

    object.x = containerX + containerWidth * anchorX;
    object.y = containerY + containerHeight * anchorY;

    var initialScale = object.scale.x;

    object.scale.x = containerWidth / (object.width / object.scale.x);
    object.scale.y = object.scale.x;

    if (object.height > containerHeight) {
        object.scale.x = initialScale;
        object.scale.y = initialScale;

        object.scale.y = containerHeight / (object.height / object.scale.y);
        object.scale.x = object.scale.y;
    }

}
export function fitInContainer(object, containerName, anchorX = 0, anchorY = 0) {
    var container = document.getElementById(containerName);
    var containerWidth = container.offsetWidth * window.devicePixelRatio;
    var containerHeight = container.offsetHeight * window.devicePixelRatio;
    var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
    var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

    if (object.anchor !== undefined) {
        object.anchor.x = anchorX;
        object.anchor.y = anchorY;
    }

    object.x = containerX + containerWidth * anchorX;
    object.y = containerY + containerHeight * anchorY;
    object.scale.x = containerWidth / (object.width / object.scale.x);
    object.scale.y = object.scale.x;
}

export function fitInContainerHeight(object, containerName, anchorX = 0, anchorY = 0) {
	var container = document.getElementById(containerName);
	var containerWidth = container.offsetWidth * window.devicePixelRatio;
	var containerHeight = container.offsetHeight * window.devicePixelRatio;
	var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
	var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

    if (object.anchor !== undefined) {
        object.anchor.x = anchorX;
        object.anchor.y = anchorY;
    }

	object.x = containerX + containerWidth * anchorX;
	object.y = containerY + containerHeight * anchorY;
	object.scale.y = containerHeight / object.height;
	object.scale.x = object.scale.y;
}

export function fitInContainerAnchorAtCenter(object, containerName) {
	fitInContainer(object, containerName);
	object.x += object.width/2;
	object.y += object.height/2;
}

export function getContainerY(containerName) {
	var container = document.getElementById(containerName);
	return container.getBoundingClientRect().top * window.devicePixelRatio;
}

export function getContainerX(containerName) {
	var container = document.getElementById(containerName);
	return container.getBoundingClientRect().left * window.devicePixelRatio;
}

export function getContainerWidth(containerName) {
	var container = document.getElementById(containerName);
	return container.offsetWidth * window.devicePixelRatio;
}

export function getContainerHeight(containerName) {
	var container = document.getElementById(containerName);
	return container.offsetHeight * window.devicePixelRatio;
}

export function resizeToSizeOfContainer(object, containerName) {
	var container = document.getElementById(containerName);
	var containerWidth = container.offsetWidth * window.devicePixelRatio;
	var containerHeight = container.offsetHeight * window.devicePixelRatio;
	object.scale.x = containerWidth / object.width;
	object.scale.y = object.scale.x;
}

export function moveToContainer(sprite, newContainer, delay, duration, easing, cb, autoStart) {

    if (sprite == null || sprite.game === null)
        return null;


    var container = document.getElementById(newContainer);
    var finalWith = container.offsetWidth * window.devicePixelRatio;

    var offsetX = finalWith * sprite.anchor.x;
    var finalX = container.getBoundingClientRect().left * window.devicePixelRatio + offsetX;
    var finalScale = finalWith / (sprite.width / sprite.scale.x);

    var finalHeight = container.offsetHeight * window.devicePixelRatio;
    var offsetY = finalHeight * sprite.anchor.y;
    var finalY = container.getBoundingClientRect().top * window.devicePixelRatio + offsetY;

    var tween = sprite.game.add.tween(sprite).to({
            x: finalX,
            y: finalY,
        },
        duration,
        easing,
        typeof autoStart === 'undefined' ? true : autoStart,
        delay);

    sprite.game.add.tween(sprite.scale).to({
            x: finalScale,
            y: finalScale,
        },
        duration,
        easing,
        typeof autoStart === 'undefined' ? true : autoStart,
        delay);

    if (cb)
        tween.onComplete.add(cb, this);

    return tween;
}
