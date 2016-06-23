((window, document, undefined) => {

    class Emitter {

        static emit(type, data) {
            let event = document.createEvent('Event');
            event.initEvent(type, true, true);
            event.data = data;
            if (this._origin) {
                this._origin.dispatchEvent(event);
            }
        }

        static set origin(element) {
            this._origin = element;
        }

    }

    class Model {

        constructor(container, min, max) {
            this.container = container;
            this.min = min;
            this.max = max;
            this.range = max-min;
            this._value = this.min;
            this.listen();
        }

        get value() {
            return this._value;
        }

        set value(num) {
            this._value = Math.min(Math.max(this.min, num), this.max);
            Emitter.emit('change', { value: this._value });
            Emitter.emit('updateView', {
                min: this.min,
                max: this.max,
                range: this.range,
                value: this._value
            });
        }

        listen() {
            this.container.addEventListener('updateModel', this.updateValue.bind(this));
        }

    }

    class View {

        constructor(container, slider, cursor) {
            this.container = container;
            this.slider = slider;
            this.cursor = cursor;
            this.width = this.slider.clientWidth - this.cursor.clientWidth;
            this._value = 0;
            this.listen();
        }

        get value() {
            return this._value;
        }

        set value(num) {
            const quantized = this.quantize(this.normalize(position), this.step);
            this._value = quantized;
            Emitter.emit('updateModel', {
                min: this.min,
                max: this.max,
                range: this.range,
                value: this._value
            });
            this.renderView();
        }

        /* Set view value and update model value */
        setView(position) {
            const quantized = this.quantize(this.normalize(position), this.step);
            this._value = quantized;
            Emitter.emit('updateValue', {
                min: this.min,
                max: this.max,
                range: this.range,
                value: this._value
            });
            this.renderView();
        }

        /* Compute view value from model value */
        getViewFromValue(min, range, value) {
            const offset = value - min;
            const percentage = (offset / range).toFixed(4);
            return percentage * this.width;
        }

        /* Update view based on model value */
        updateValue(event) {
            let data = event.data;
            this._value =  this.getViewFromValue(data.min, data.range, data.value);
            this.renderView();
        }

        /* Translate slider according to view value */
        renderView() {
            this.cursor.style.left = `${this._value}px`;
        }

        listen() {
            this.container.addEventListener('updateView', this.updateValue.bind(this));
        }
    }

    class Slider {

        constructor(selector, min, max, step, options) {

            this.options = options || {};

            this.container = document.body.querySelector(selector);

            this.createSlider();
            this.createCursor();

            this.slider.appendChild(this.cursor);
            this.container.appendChild(this.slider);

            this.step = step;

            Emitter.origin = this.container;

            this.model = new Model(this.container, min,max);
            this.view = new View(this.container, this.slider, this.cursor);

            this.model.value = this.minValue;

            this.addListeners();
        }

        createSlider() {
            this.slider = document.createElement('div');
            this.slider.className = `slider-base ${this.options.sliderClass || 'slider'}`;
        }

        createCursor() {
            this.cursor = document.createElement('span');
            this.cursor.className = `cursor-base ${this.options.cursorClass || 'cursor'}`;
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
            const stepInPx = (step * this.viewWidth) / this.model.range;             //step in slider coordinates
            const quantum = Math.round(value/stepInPx) * stepInPx;                  //compute discrete slider values
            return Math.min(this.viewWidth, quantum);                               //minimum between end position and quantum
        }

        getPercentage() {
            const result = this.viewValue / this.viewWidth;
            return result.toFixed(4);
        }

        /* Set model value in percentage and update view */
        setPercentage(percentage) {
            const value = percentage * this.model.range + this.minValue;
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
            return (this.minValue + (this.model.range * this.getPercentage())).toFixed(0);
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
            const percentage = (offset / this.model.range).toFixed(4);
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
            this.setView(event.clientX);
        }

        addListeners() {

            this.container.addEventListener('click', (event) => {
                this.setView(event.clientX);
            });

            this.cursor.addEventListener('mousedown', () => {
                this.boundMove = this.moveHandler.bind(this);                          //Hold a reference for unregistering later
                document.addEventListener('mousemove', this.boundMove);
            });

            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', this.boundMove);
            });

            this.cursor.addEventListener('touchmove', (event) => {
                event.preventDefault();
                this.setView(event.changedTouches[0].clientX);
            });

        }

    }

    window.Slider = Slider;

})(window, document, undefined);
