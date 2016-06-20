'use strict';

(function (window, undefined) {

    var cursor = document.querySelector('.cursor'),
        container = cursor.parentElement;

    var dragging = false,
        step = 100;

    var getPosition = function getPosition(position) {
        var result = position / (container.clientWidth - cursor.clientWidth);
        return result;
    };

    var getCurrentPosition = function getCurrentPosition(mousePos, cursorWidth, containerWidth) {
        if (mousePos - cursorWidth <= 0) {
            return 0;
        } else if (mousePos > containerWidth) {
            return containerWidth - cursorWidth;
        } else {
            return mousePos - cursorWidth;
        }
    };

    var moveHandler = function moveHandler(event) {
        if (dragging) {
            var pos = event.clientX,
                currentPos = getCurrentPosition(pos, cursor.clientWidth, container.clientWidth);

            console.log(getPosition(currentPos) * 255);

            cursor.style.left = currentPos + 'px';
        }
    };

    cursor.addEventListener('mousedown', function (event) {
        dragging = true;
        document.addEventListener('mousemove', moveHandler);
    });

    document.addEventListener('mouseup', function (event) {
        dragging = false;
        document.removeEventListener('mousemove', moveHandler);
    });

    cursor.addEventListener('touchstart', function (event) {
        dragging = true;
    });

    cursor.addEventListener('touchend', function (event) {
        dragging = false;
    });

    cursor.addEventListener('touchmove', function (event) {
        event.preventDefault();
        moveHandler(event.changedTouches[0]);
    });
})(window, undefined);
//# sourceMappingURL=slider.js.map
