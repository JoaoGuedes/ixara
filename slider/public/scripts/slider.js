'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * getPercentage - return the percentage (0 - 1) representing the current slider position
setPercentage - a method that takes a percentage (0 - 1) and sets the slider position accordingly
getValue - return the actual value representing the current slider position
setValue - set the actual value of the slider **/

(function (window, document, undefined) {
    var Slider = function () {
        function Slider(selector, min, max, step) {
            _classCallCheck(this, Slider);

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

        _createClass(Slider, [{
            key: 'getValue',
            value: function getValue() {
                return this.value;
            }
        }, {
            key: 'setValue',
            value: function setValue(value) {
                this.value = Math.min(value, this.max);
                this.move(null, this.value);
            }
        }, {
            key: 'getPercentage',
            value: function getPercentage(position) {
                var result = position / (this.slider.clientWidth - this.cursor.clientWidth);
                return result;
            }
        }, {
            key: 'getDisplacement',
            value: function getDisplacement(mousePos) {
                var actualPos = mousePos - this.slider.getBoundingClientRect().left;
                var endPos = this.slider.clientWidth - this.cursor.clientWidth;

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
                step = step * endPos / this.max;
                return Math.round(value / step) * step;
            }
        }, {
            key: 'move',
            value: function move(event, value) {
                var position = 0;
                var endPos = this.slider.clientWidth - this.cursor.clientWidth;
                if (event && this.dragging) {
                    position = this.getDisplacement(event.clientX);
                    this.value = position * this.max / endPos;
                } else if (value) {
                    position = value * endPos / this.max;
                }
                this.cursor.style.left = position + 'px';
            }
        }, {
            key: 'addListeners',
            value: function addListeners() {
                var _this = this;

                this.container.addEventListener('click', function (event) {
                    _this.dragging = true;
                    _this.move(event);
                });

                this.cursor.addEventListener('mousedown', function (event) {
                    _this.dragging = true;
                    _this.boundMove = _this.move.bind(_this); //Hold a reference for unregistering later
                    document.addEventListener('mousemove', _this.boundMove);
                });

                document.addEventListener('mouseup', function (event) {
                    _this.dragging = false;
                    document.removeEventListener('mousemove', _this.boundMove);
                });

                this.cursor.addEventListener('touchstart', function (event) {
                    _this.dragging = true;
                });

                this.cursor.addEventListener('touchend', function (event) {
                    _this.dragging = false;
                });

                this.cursor.addEventListener('touchmove', function (event) {
                    event.preventDefault();
                    _this.move(event.changedTouches[0]);
                });
            }
        }]);

        return Slider;
    }();

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
//# sourceMappingURL=slider.js.map
