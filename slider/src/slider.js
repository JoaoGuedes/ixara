((window, undefined) => {

    let cursor = document.querySelector('.cursor'),
        container = cursor.parentElement;

    let dragging = false, step = 30;

    let getPercentage = (position) => {
        let result = position / (container.clientWidth - cursor.clientWidth);
        return result * 100;
    };

    let getCurrentPosition = (mousePos, cursor, container) => {
        if ((mousePos - cursor.clientWidth - container.getBoundingClientRect().left) <= 0) {
            return 0;
        } else if (mousePos - container.getBoundingClientRect().left > container.clientWidth) {
            return container.clientWidth - cursor.clientWidth;
        } else {
            const value = mousePos - cursor.clientWidth - container.getBoundingClientRect().left;
            return Math.min(container.clientWidth - cursor.clientWidth, quantize(value, step));
        }
    };

    let quantize = (value, step) => {
        return Math.round(value/step) * step;
    };

    let moveHandler = (event) => {
        if (dragging) {
            let pos = event.clientX,
                currentPos = getCurrentPosition(pos, cursor, container);

            //console.log(Math.round(getPosition(currentPos) * 100));
            console.log(getPercentage(currentPos));

            cursor.style.left = `${currentPos}px`;
        }
    };


    container.addEventListener('click', (event) => {
        dragging = true;
        moveHandler(event);
    });

    cursor.addEventListener('mousedown', (event) => {
        dragging = true;
        //document.body.style.cursor = 'pointer';
        document.addEventListener('mousemove', moveHandler);
    });

    document.addEventListener('mouseup', (event) => {
        dragging = false;
        //document.body.style.cursor = 'default;'
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
