'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, document, undefined) {
    var Emitter = function () {
        function Emitter() {
            _classCallCheck(this, Emitter);
        }

        _createClass(Emitter, null, [{
            key: 'emit',
            value: function emit(type, data) {
                var event = document.createEvent('Event');
                event.initEvent(type, true, true);
                event.data = data;
                if (this._origin) {
                    this._origin.dispatchEvent(event);
                }
            }
        }, {
            key: 'origin',
            set: function set(element) {
                this._origin = element;
            }
        }]);

        return Emitter;
    }();

    var Model = function () {
        function Model(min, max) {
            _classCallCheck(this, Model);

            this.min = min;
            this.max = max;
            this.range = max - min;
            this._value = this.min;
        }

        _createClass(Model, [{
            key: 'value',
            get: function get() {
                return this._value;
            },
            set: function set(num) {
                this._value = Math.min(Math.max(this.min, num), this.max);
                Emitter.emit('change', { value: this._value });
                Emitter.emit('updateView', {
                    min: this.min,
                    max: this.max,
                    range: this.range,
                    value: this._value
                });
            }
        }]);

        return Model;
    }();

    var View = function () {
        function View(container, slider, cursor) {
            _classCallCheck(this, View);

            this.container = container;
            this.slider = slider;
            this.cursor = cursor;
            this.width = this.slider.clientWidth - this.cursor.clientWidth;
            this._value = 0;
            this.listen();
        }

        /* Set view value and update model value */


        _createClass(View, [{
            key: 'setView',
            value: function setView(position) {
                var quantized = this.quantize(this.normalize(position), this.step);
                this.viewValue = quantized;
                this.updateValue();
                this.renderView();
            }

            /* Compute view value from model value */

        }, {
            key: 'getViewFromValue',
            value: function getViewFromValue(min, range, value) {
                var offset = value - min;
                var percentage = (offset / range).toFixed(4);
                return percentage * this.width;
            }

            /* Update view based on model value */

        }, {
            key: 'updateView',
            value: function updateView(event) {
                var data = event.data;
                this._value = this.getViewFromValue(data.min, data.range, data.value);
                this.renderView();
            }

            /* Translate slider according to view value */

        }, {
            key: 'renderView',
            value: function renderView() {
                this.cursor.style.left = this._value + 'px';
            }
        }, {
            key: 'listen',
            value: function listen() {
                this.container.addEventListener('updateView', this.updateView.bind(this));
            }
        }]);

        return View;
    }();

    var Slider = function () {
        function Slider(selector, min, max, step, options) {
            _classCallCheck(this, Slider);

            this.options = options || {};

            this.container = document.body.querySelector(selector);

            this.createSlider();
            this.createCursor();

            this.slider.appendChild(this.cursor);
            this.container.appendChild(this.slider);

            this.step = step;

            Emitter.origin = this.container;

            this.model = new Model(min, max);
            this.view = new View(this.container, this.slider, this.cursor);

            this.model.value = this.minValue;

            this.addListeners();
        }

        _createClass(Slider, [{
            key: 'createSlider',
            value: function createSlider() {
                this.slider = document.createElement('div');
                this.slider.className = 'slider-base ' + (this.options.sliderClass || 'slider');
            }
        }, {
            key: 'createCursor',
            value: function createCursor() {
                this.cursor = document.createElement('span');
                this.cursor.className = 'cursor-base ' + (this.options.cursorClass || 'cursor');
            }

            /**
             * Validations and helpers for computing positions
             */

        }, {
            key: 'isBehindLowerLimit',
            value: function isBehindLowerLimit(pos) {
                return pos - this.cursor.clientWidth / 2 <= 0;
            }

            /* Receives mouse position and translates to slider coordinates */

        }, {
            key: 'normalize',
            value: function normalize(mousePos) {
                var posOnOrigin = mousePos - this.slider.getBoundingClientRect().left; //Translated position on origin

                if (this.isBehindLowerLimit(posOnOrigin)) {
                    //mouse is behind lower limit
                    return 0; //...return start position
                }

                var point = posOnOrigin - this.cursor.clientWidth / 2; //mouse is somewhere in between
                return point;
            }

            /* Quantizes received mouse coordinates into slider steps coordinates */

        }, {
            key: 'quantize',
            value: function quantize(value, step) {
                var stepInPx = step * this.viewWidth / this.model.range; //step in slider coordinates
                var quantum = Math.round(value / stepInPx) * stepInPx; //compute discrete slider values
                return Math.min(this.viewWidth, quantum); //minimum between end position and quantum
            }
        }, {
            key: 'getPercentage',
            value: function getPercentage() {
                var result = this.viewValue / this.viewWidth;
                return result.toFixed(4);
            }

            /* Set model value in percentage and update view */

        }, {
            key: 'setPercentage',
            value: function setPercentage(percentage) {
                var value = percentage * this.model.range + this.minValue;
                this.setValue(value);
            }

            /**
             * Value (model) methods
             */

        }, {
            key: 'getValue',
            value: function getValue() {
                return this.value;
            }

            /* Compute model value from view value */

        }, {
            key: 'getValueFromView',
            value: function getValueFromView() {
                return (this.minValue + this.model.range * this.getPercentage()).toFixed(0);
            }

            /* Set model value and update view */

        }, {
            key: 'setValue',
            value: function setValue(value) {
                this.value = Math.min(Math.max(this.minValue, value), this.maxValue);
                this.emit(this.value);
                this.updateView();
            }

            /* Update model value based on view value */

        }, {
            key: 'updateValue',
            value: function updateValue() {
                this.value = this.getValueFromView();
                this.emit(this.value);
            }

            /**
             * View methods
             */

        }, {
            key: 'getView',
            value: function getView() {
                return this.viewValue;
            }

            /* Compute view value from model value */

        }, {
            key: 'getViewFromValue',
            value: function getViewFromValue() {
                var offset = this.value - this.minValue;
                var percentage = (offset / this.model.range).toFixed(4);
                return percentage * this.viewWidth;
            }

            /* Set view value and update model value */

        }, {
            key: 'setView',
            value: function setView(position) {
                var quantized = this.quantize(this.normalize(position), this.step);
                this.viewValue = quantized;
                this.updateValue();
                this.renderView();
            }

            /* Update view based on model value */

        }, {
            key: 'updateView',
            value: function updateView() {
                this.viewValue = this.getViewFromValue();
                this.renderView();
            }

            /* Translate slider according to view value */

        }, {
            key: 'renderView',
            value: function renderView() {
                this.cursor.style.left = this.viewValue + 'px';
            }

            /**
             * Handlers and listeners
             */

        }, {
            key: 'moveHandler',
            value: function moveHandler(event) {
                this.setView(event.clientX);
            }
        }, {
            key: 'addListeners',
            value: function addListeners() {
                var _this = this;

                this.container.addEventListener('click', function (event) {
                    _this.setView(event.clientX);
                });

                this.cursor.addEventListener('mousedown', function () {
                    _this.boundMove = _this.moveHandler.bind(_this); //Hold a reference for unregistering later
                    document.addEventListener('mousemove', _this.boundMove);
                });

                document.addEventListener('mouseup', function () {
                    document.removeEventListener('mousemove', _this.boundMove);
                });

                this.cursor.addEventListener('touchmove', function (event) {
                    event.preventDefault();
                    _this.setView(event.changedTouches[0].clientX);
                });
            }
        }]);

        return Slider;
    }();

    window.Slider = Slider;
})(window, document, undefined);
//# sourceMappingURL=slider.js.map
