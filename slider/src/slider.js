
    /**
     * getPercentage - return the percentage (0 - 1) representing the current slider position

setPercentage - a method that takes a percentage (0 - 1) and sets the slider position accordingly

getValue - return the actual value representing the current slider position

setValue - set the actual value of the slider **/

((window, document, undefined) => {

    class Slider {

        constructor(selector, min, max, step) {
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

        getPosition(mousePos, cursor, slider) {
            if ((mousePos - cursor.clientWidth - slider.getBoundingClientRect().left) <= 0) {
                return 0;
            } else if (mousePos - slider.getBoundingClientRect().left > slider.clientWidth) {
                return slider.clientWidth - cursor.clientWidth;
            } else {
                const value = mousePos - cursor.clientWidth - slider.getBoundingClientRect().left;
                return Math.min(slider.clientWidth - cursor.clientWidth, this.quantize(value, this.step));
            }
        }

        quantize(value, step) {
            return Math.round(value/step) * step;
        }

        move(event) {
            if (this.dragging) {
                let pos = event.clientX;
                let currentPos = this.getPosition(pos, this.cursor, this.slider);
                //this.getPosition(pos, this.cursor, this.container);
                //console.log(Math.round(getPosition(currentPos) * 100));
                //console.log(getPercentage(currentPos));
                this.cursor.style.left = `${currentPos}px`;
            }
        }

        addListeners() {

            this.container.addEventListener('click', (event) => {
                this.dragging = true;
                this.move(event);
            });

            this.cursor.addEventListener('mousedown', (event) => {
                this.dragging = true;
                this.boundMove = this.move.bind(this); //To hold a reference for unregistering later
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
