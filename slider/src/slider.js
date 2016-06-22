((window, document, undefined) => {

    class Slider {

        constructor(selector, min, max, step) {

            this.minValue = min;
            this.maxValue = max;

            this.container = document.querySelector(selector);

            this.slider = document.createElement('div');
            this.slider.className = 'slider';

            this.cursor = document.createElement('span');
            this.cursor.className = 'cursor';

            this.slider.appendChild(this.cursor);
            this.container.appendChild(this.slider);

            this.dragging = false;
            this.step = step;

            this.viewWidth = this.slider.clientWidth - this.cursor.clientWidth;

            this.setValue(this.minValue);

            this.addListeners();
        }

        /**
         * Validations and helpers for computing positions
         */
        isBehindLowerLimit(pos) {
            return pos - this.cursor.clientWidth/2 <= 0;

        }

        normalize(mousePos) {
            const posOnOrigin = mousePos - this.slider.getBoundingClientRect().left;

            if (this.isBehindLowerLimit(posOnOrigin)) {                           //mouse is behind lower limit
                return 0;                                                        //...return start position
            }

            const point = posOnOrigin - this.cursor.clientWidth/2;            //mouse is somewhere in between
            return point;
        }

        quantize(value, step) {
            const stepInPx = (step * this.viewWidth) / (this.maxValue - this.minValue);
            const quantum = Math.round(value/stepInPx) * stepInPx;
            return Math.min(this.viewWidth, quantum);
        }

        getPercentage() {
            const result = this.viewValue / this.viewWidth;
            return result.toFixed(4);
        }

        setPercentage(percentage) {
            const total = this.maxValue - this.minValue;
            const value = percentage * total + this.minValue;
            this.setValue(value);
        }

        emit(value) {
            var event = document.createEvent('Event');
            event.initEvent('change', true, true);
            event.data = value;
            this.container.dispatchEvent(event);
        }

        /**
         * Value (model) methods
         */
        getValue() {
            return this.value;
        }

        setValue(value) {
            this.value = Math.min(Math.max(this.minValue, value), this.maxValue);
            this.emit(this.value);
            this.updateView();
        }

        updateValue() {
            const range = this.maxValue - this.minValue;
            this.value = (this.minValue + (range * this.getPercentage())).toFixed(0);
            this.emit(this.value);
        }

        /**
         * View methods
         */
        getView() {
            return this.viewValue;
        }

        setView(position) {
            const quantized = this.quantize(this.normalize(position), this.step);
            this.viewValue = quantized;
            this.renderView();
            this.updateValue();
        }

        updateView() {
            const offset = this.value - this.minValue;
            const total = this.maxValue - this.minValue;
            const percentage = (offset / total).toFixed(4);
            this.viewValue =  percentage * this.viewWidth;
            this.renderView();
        }

        renderView() {
            this.cursor.style.left = `${this.viewValue}px`;
        }

        /**
         * Handlers and listeners
         */
        moveHandler(event) {
            if (this.dragging) {
                this.setView(event.clientX);
            }
        }

        addListeners() {

            this.container.addEventListener('click', (event) => {
                this.dragging = true;
                this.setView(event.clientX);
            });

            this.cursor.addEventListener('mousedown', () => {
                this.dragging = true;
                this.boundMove = this.moveHandler.bind(this);                          //Hold a reference for unregistering later
                document.addEventListener('mousemove', this.boundMove);
            });

            document.addEventListener('mouseup', () => {
                this.dragging = false;
                document.removeEventListener('mousemove', this.boundMove);
            });

            this.cursor.addEventListener('touchstart', () => {
                this.dragging = true;
            });

            this.cursor.addEventListener('touchend', () => {
                this.dragging = false;
            });

            this.cursor.addEventListener('touchmove', (event) => {
                event.preventDefault();
                this.setView(event.changedTouches[0].clientX);
            });

        }

    }

    window.Slider = Slider;

})(window, document, undefined);
