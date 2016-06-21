
    /**
     * getPercentage - return the percentage (0 - 1) representing the current slider position

setPercentage - a method that takes a percentage (0 - 1) and sets the slider position accordingly

getValue - return the actual value representing the current slider position

setValue - set the actual value of the slider **/

((window, document, undefined) => {

    class Slider {

        constructor(selector, min, max, step) {

            this.min = min;
            this.max = max;

            this.container = document.querySelector(selector);

            this.slider = document.createElement('div');
            this.slider.className = 'slider';

            this.cursor = document.createElement('span');
            this.cursor.className = 'cursor';

            this.slider.appendChild(this.cursor);
            this.container.appendChild(this.slider);

            this.dragging = false;
            this.step = step;

            this.addListeners();
        }

        getValue() {
            return this.value;
        }

        setValue(value) {
            this.value = Math.min(value, this.max);
            this.move(null, this.value);
        }

        getPercentage(position) {
            let result = position / (this.slider.clientWidth - this.cursor.clientWidth);
            return result;
        }

        getDisplacement(mousePos) {
            let actualPos = mousePos - this.slider.getBoundingClientRect().left;
            const endPos = this.slider.clientWidth - this.cursor.clientWidth;

            if (actualPos - this.cursor.clientWidth/2 <= 0) {                           //mouse is behind lower limit
                return 0;                                                        //...return start position
            } else if (actualPos > this.slider.clientWidth) {                         //mouse is after upper limit
                return endPos;                                                   //...return end position
            } else {
                const middlepoint = actualPos - this.cursor.clientWidth/2;            //mouse is somewhere in between
                const quantized = this.quantize(middlepoint, this.step);
                return Math.min(endPos, quantized);  //...return end position or quantized step, whichever is smaller
            }
        }

        quantize(value, step) {
            const endPos = this.slider.clientWidth - this.cursor.clientWidth;
            step = (step * endPos) / this.max;
            return Math.round(value/step) * step;
        }

        move(event, value) {
            let position = 0;
            let endPos = this.slider.clientWidth - this.cursor.clientWidth;
            if (event && this.dragging) {
                position = this.getDisplacement(event.clientX);
                this.value = (position * this.max) / endPos;
            } else if (value) {
                position = value * endPos / this.max;
            }
            this.cursor.style.left = `${position}px`;
        }

        addListeners() {

            this.container.addEventListener('click', (event) => {
                this.dragging = true;
                this.move(event);
            });

            this.cursor.addEventListener('mousedown', (event) => {
                this.dragging = true;
                this.boundMove = this.move.bind(this);                          //Hold a reference for unregistering later
                document.addEventListener('mousemove', this.boundMove);
            });

            document.addEventListener('mouseup', (event) => {
                this.dragging = false;
                document.removeEventListener('mousemove', this.boundMove);
            });

            this.cursor.addEventListener('touchstart', (event) => {
                this.dragging = true;
            });

            this.cursor.addEventListener('touchend', (event) => {
                this.dragging = false;
            });

            this.cursor.addEventListener('touchmove', (event) => {
                event.preventDefault();
                this.move(event.changedTouches[0]);
            });

        }



    }

    window.Slider = Slider;

    /*let cursor = document.querySelector('#foo.cursor'),
        container = cursor.parentElement;

    let dragging = false, step = 30;

    let getPercentage = (position) => {
        let result = position / (container.clientWidth - cursor.clientWidth);
        return result * 100;
    };

    let getCurrentPosition = (mousePos, cursor, container) => {
        var leftOffset = container.getBoundingClientRect().left;
        console.log(leftOffset);
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
            console.log(pos);

            //console.log(Math.round(getPosition(currentPos) * 100));
            //console.log(getPercentage(currentPos));

            cursor.style.left = `${currentPos}px`;
        }
    };


    container.addEventListener('click', (event) => {
        dragging = true;
        moveHandler(event);
    });

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
    });*/

})(window, document, undefined);
