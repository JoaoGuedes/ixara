((window, undefined) => {

    let cursor = document.querySelector('.cursor'),
        container = cursor.parentElement;

    let dragging = false, step = 100;

    let getPosition = (position) => {
        let result = position / (container.clientWidth - cursor.clientWidth);
        return result;
    };

    let getCurrentPosition = (mousePos, cursorWidth, containerWidth) => {
        if ((mousePos - cursorWidth) <= 0) {
            return 0;
        } else if (mousePos > containerWidth) {
            return containerWidth - cursorWidth;
        } else {
            return mousePos - cursorWidth;
        }
    };

    let moveHandler = (event) => {
        if (dragging) {
            let pos = event.clientX,
                currentPos = getCurrentPosition(pos, cursor.clientWidth, container.clientWidth);

            console.log(getPosition(currentPos) * 255);

            cursor.style.left = `${currentPos}px`;
        }
    };

    cursor.addEventListener('mousedown', (event) => {
        dragging = true;
        document.addEventListener('mousemove', moveHandler);
    });

    document.addEventListener('mouseup', (event) => {
        dragging = false;
        document.removeEventListener('mousemove', moveHandler);
    });

    cursor.addEventListener('touchstart', (event) => {
        dragging = true;
    });

    cursor.addEventListener('touchend', (event) => {
        dragging = false;
    });

    cursor.addEventListener('touchmove', (event) => {
        event.preventDefault();
        moveHandler(event.changedTouches[0]);
    });

})(window, undefined);
