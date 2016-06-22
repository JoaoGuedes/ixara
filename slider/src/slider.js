((window, document, undefined) => {

    class Slider {

        constructor(selector, min, max, step, options) {

            this.minValue = min;
            this.maxValue = max;

            this.options = options || {};

            this.container = document.body.querySelector(selector);

            this.slider = document.createElement('div');
            this.slider.className = this.options.sliderClass || 'slider';

            this.cursor = document.createElement('span');
            this.cursor.className = this.options.cursorClass || 'cursor';

            this.slider.appendChild(this.cursor);
            this.container.appendChild(this.slider);

            this.dragging = false;
            this.step = step;

            this.viewWidth = this.slider.clientWidth - this.cursor.clientWidth; //Slider viewport width
            this.valueWidth = this.maxValue - this.minValue;                    //Slider model total range

            this.event = document.createEvent('Event');

            this.setValue(this.minValue); //Initialize slider

            this.addListeners();
        }

        /**
         * Validations and helpers for computing positions
         */
        isBehindLowerLimit(pos) {
            return pos - this.cursor.clientWidth/2 <= 0;
        }

        /* Receives mouse position and translates to slider coordinates */
        normalize(mousePos) {
            const posOnOrigin = mousePos - this.slider.getBoundingClientRect().left; //Translated position on origin

            if (this.isBehindLowerLimit(posOnOrigin)) {                              //mouse is behind lower limit
                return 0;                                                            //...return start position
            }

            const point = posOnOrigin - this.cursor.clientWidth/2;                   //mouse is somewhere in between
            return point;
        }

        /* Quantizes received mouse coordinates into slider steps coordinates */
        quantize(value, step) {
            const stepInPx = (step * this.viewWidth) / this.valueWidth;             //step in slider coordinates
            const quantum = Math.round(value/stepInPx) * stepInPx;                  //compute discrete slider values
            return Math.min(this.viewWidth, quantum);                               //minimum between end position and quantum
        }

        /* Emit change event */
        emit(value) {
            this.event.initEvent('change', true, true);
            this.event.data = {
                value: value
            };
            this.container.dispatchEvent(this.event);
        }

        getPercentage() {
            const result = this.viewValue / this.viewWidth;
            return result.toFixed(4);
        }

        /* Set model value in percentage and update view */
        setPercentage(percentage) {
            const value = percentage * this.valueWidth + this.minValue;
            this.setValue(value);
        }

        /**
         * Value (model) methods
         */
        getValue() {
            return this.value;
        }

        /* Compute model value from view value */
        getValueFromView() {
            return (this.minValue + (this.valueWidth * this.getPercentage())).toFixed(0);
        }

        /* Set model value and update view */
        setValue(value) {
            this.value = Math.min(Math.max(this.minValue, value), this.maxValue);
            this.emit(this.value);
            this.updateView();
        }

        /* Update model value based on view value */
        updateValue() {
            this.value = this.getValueFromView();
            this.emit(this.value);
        }

        /**
         * View methods
         */
        getView() {
            return this.viewValue;
        }

        /* Compute view value from model value */
        getViewFromValue() {
            const offset = this.value - this.minValue;
            const percentage = (offset / this.valueWidth).toFixed(4);
            return percentage * this.viewWidth;
        }

        /* Set view value and update model value */
        setView(position) {
            const quantized = this.quantize(this.normalize(position), this.step);
            this.viewValue = quantized;
            this.updateValue();
            this.renderView();
        }

        /* Update view based on model value */
        updateView() {
            this.viewValue =  this.getViewFromValue();
            this.renderView();
        }

        /* Translate slider according to view value */
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
