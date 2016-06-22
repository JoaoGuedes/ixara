'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, document, undefined) {
    var Slider = function () {
        function Slider(selector, min, max, step) {
            _classCallCheck(this, Slider);

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


        _createClass(Slider, [{
            key: 'isBehindLowerLimit',
            value: function isBehindLowerLimit(pos) {
                return pos - this.cursor.clientWidth / 2 <= 0;
            }
        }, {
            key: 'normalize',
            value: function normalize(mousePos) {
                var posOnOrigin = mousePos - this.slider.getBoundingClientRect().left;

                if (this.isBehindLowerLimit(posOnOrigin)) {
                    //mouse is behind lower limit
                    return 0; //...return start position
                }

                var point = posOnOrigin - this.cursor.clientWidth / 2; //mouse is somewhere in between
                return point;
            }
        }, {
            key: 'quantize',
            value: function quantize(value, step) {
                var stepInPx = step * this.viewWidth / (this.maxValue - this.minValue);
                var quantum = Math.round(value / stepInPx) * stepInPx;
                return Math.min(this.viewWidth, quantum);
            }
        }, {
            key: 'getPercentage',
            value: function getPercentage() {
                var result = this.viewValue / this.viewWidth;
                return result.toFixed(4);
            }
        }, {
            key: 'setPercentage',
            value: function setPercentage(percentage) {
                var total = this.maxValue - this.minValue;
                var value = percentage * total + this.minValue;
                this.setValue(value);
            }
        }, {
            key: 'emit',
            value: function emit(value) {
                var event = document.createEvent('Event');
                event.initEvent('change', true, true);
                event.data = value;
                this.container.dispatchEvent(event);
            }

            /**
             * Value (model) methods
             */

        }, {
            key: 'getValue',
            value: function getValue() {
                return this.value;
            }
        }, {
            key: 'setValue',
            value: function setValue(value) {
                this.value = Math.min(Math.max(this.minValue, value), this.maxValue);
                this.emit(this.value);
                this.updateView();
            }
        }, {
<<<<<<< HEAD
            key: 'getPercentage',
            value: function getPercentage(position) {
                var result = position / (this.slider.clientWidth - this.cursor.clientWidth);
                return result.toFixed(4);
=======
            key: 'updateValue',
            value: function updateValue() {
                var range = this.maxValue - this.minValue;
                this.value = (this.minValue + range * this.getPercentage()).toFixed(0);
                this.emit(this.value);
>>>>>>> final
            }

<<<<<<< HEAD
                if (actualPos - this.cursor.clientWidth / 2 <= 0) {
                    //mouse is behind lower limit
                    return 0; //...return start position
                } else if (actualPos > this.slider.clientWidth) {
                        //mouse is after upper limit
                        return endPos; //...return end position
                    } else {
                            var middlepoint = actualPos - this.cursor.clientWidth / 2; //mouse is somewhere in between
                            var quantized = this.quantize(middlepoint, this.step);
                            return Math.min(endPos, quantized); //...return end position or quantized step, whichever is smaller
                        }
            }
        }, {
            key: 'quantize',
            value: function quantize(value, step) {
                var endPos = this.slider.clientWidth - this.cursor.clientWidth;
                step = step * endPos / (this.max + Math.abs(this.min));
                return Math.round(value / step) * step;
=======
            /**
             * View methods
             */

        }, {
            key: 'getView',
            value: function getView() {
                return this.viewValue;
            }
        }, {
            key: 'setView',
            value: function setView(position) {
                var quantized = this.quantize(this.normalize(position), this.step);
                this.viewValue = quantized;
                this.renderView();
                this.updateValue();
            }
        }, {
            key: 'updateView',
            value: function updateView() {
                var offset = this.value - this.minValue;
                var total = this.maxValue - this.minValue;
                var percentage = (offset / total).toFixed(4);
                this.viewValue = percentage * this.viewWidth;
                this.renderView();
            }
        }, {
            key: 'renderView',
            value: function renderView() {
                this.cursor.style.left = this.viewValue + 'px';
>>>>>>> final
            }

            /**
             * Handlers and listeners
             */

        }, {
<<<<<<< HEAD
            key: 'move',
            value: function move(event, value) {
                var position = 0;
                var endPos = this.slider.clientWidth - this.cursor.clientWidth;
                if (event && this.dragging) {
                    position = this.getDisplacement(event.clientX);
                    this.value = (this.min + (this.max - this.min) * this.getPercentage(position)).toFixed(0);
                    console.log(this.getValue());
                } else if (value) {
                    position = value * endPos / this.max;
                }
                this.cursor.style.left = position + 'px';
=======
            key: 'moveHandler',
            value: function moveHandler(event) {
                if (this.dragging) {
                    this.setView(event.clientX);
                }
>>>>>>> final
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
