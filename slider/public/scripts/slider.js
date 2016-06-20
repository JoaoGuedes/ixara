'use strict';

(function (window, undefined) {

    var cursor = document.querySelector('.cursor'),
        container = cursor.parentElement;

    var dragging = false,
        step = 30;

    var getPercentage = function getPercentage(position) {
        var result = position / (container.clientWidth - cursor.clientWidth);
        return result * 100;
    };

    var getCurrentPosition = function getCurrentPosition(mousePos, cursor, container) {
        if (mousePos - cursor.clientWidth - container.getBoundingClientRect().left <= 0) {
            return 0;
        } else if (mousePos - container.getBoundingClientRect().left > container.clientWidth) {
            return container.clientWidth - cursor.clientWidth;
        } else {
            var value = mousePos - cursor.clientWidth - container.getBoundingClientRect().left;
            return Math.min(container.clientWidth - cursor.clientWidth, quantize(value, step));
        }
    };

    var quantize = function quantize(value, step) {
        return Math.round(value / step) * step;
    };

    var moveHandler = function moveHandler(event) {
        if (dragging) {
            var pos = event.clientX,
                currentPos = getCurrentPosition(pos, cursor, container);

            //console.log(Math.round(getPosition(currentPos) * 100));
            console.log(getPercentage(currentPos));

            cursor.style.left = currentPos + 'px';
        }
    };

    container.addEventListener('click', function (event) {
        dragging = true;
        moveHandler(event);
    });

    cursor.addEventListener('mousedown', function (event) {
        dragging = true;
        //document.body.style.cursor = 'pointer';
        document.addEventListener('mousemove', moveHandler);
    });

    document.addEventListener('mouseup', function (event) {
        dragging = false;
        //document.body.style.cursor = 'default;'
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
