'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, document, undefined) {
    var Slider = function () {
        function Slider(selector, min, max, step, options) {
            _classCallCheck(this, Slider);

            this.minValue = min;
            this.maxValue = max;

            this.options = options || {};

            this.container = document.body.querySelector(selector);

            this.slider = document.createElement('div');
            this.slider.className = 'slider-base ' + (this.options.sliderClass || 'slider');

            this.cursor = document.createElement('span');
            this.cursor.className = 'cursor-base ' + (this.options.cursorClass || 'cursor');

            this.slider.appendChild(this.cursor);
            this.container.appendChild(this.slider);

            this.dragging = false;
            this.step = step;

            this.viewWidth = this.slider.clientWidth - this.cursor.clientWidth; //Slider viewport width
            this.valueWidth = this.maxValue - this.minValue; //Slider model total range

            this.event = document.createEvent('Event');

            this.setValue(this.minValue); //Initialize slider

            this.addListeners();
        }

        /**
         * Validations and helpers for computing positions
         */


        _createClass(Slider, [{
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
                var stepInPx = step * this.viewWidth / this.valueWidth; //step in slider coordinates
                var quantum = Math.round(value / stepInPx) * stepInPx; //compute discrete slider values
                return Math.min(this.viewWidth, quantum); //minimum between end position and quantum
            }

            /* Emit change event */

        }, {
            key: 'emit',
            value: function emit(value) {
                this.event.initEvent('change', true, true);
                this.event.data = {
                    value: value
                };
                this.container.dispatchEvent(this.event);
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
                var value = percentage * this.valueWidth + this.minValue;
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
                return (this.minValue + this.valueWidth * this.getPercentage()).toFixed(0);
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
                var percentage = (offset / this.valueWidth).toFixed(4);
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
                if (this.dragging) {
                    this.setView(event.clientX);
                }
            }
        }, {
            key: 'addListeners',
            value: function addListeners() {
                var _this = this;

                this.container.addEventListener('click', function (event) {
                    _this.dragging = true;
                    _this.setView(event.clientX);
                });

                this.cursor.addEventListener('mousedown', function () {
                    _this.dragging = true;
                    _this.boundMove = _this.moveHandler.bind(_this); //Hold a reference for unregistering later
                    document.addEventListener('mousemove', _this.boundMove);
                });

                document.addEventListener('mouseup', function () {
                    _this.dragging = false;
                    document.removeEventListener('mousemove', _this.boundMove);
                });

                this.cursor.addEventListener('touchstart', function () {
                    _this.dragging = true;
                });

                this.cursor.addEventListener('touchend', function () {
                    _this.dragging = false;
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
