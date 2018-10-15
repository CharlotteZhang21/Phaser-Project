export function fitInContainer(object, containerName, anchorX = 0, anchorY = 0) {
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
    object.scale.x = containerWidth / (object.width / object.scale.x);
    object.scale.y = object.scale.x;
}

export function fitInContainerHeight(object, containerName) {
	var container = document.getElementById(containerName);
	var containerWidth = container.offsetWidth * window.devicePixelRatio;
	var containerHeight = container.offsetHeight * window.devicePixelRatio;
	var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
	var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;

	object.x = containerX;
	object.y = containerY;
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