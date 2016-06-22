'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, document, undefined) {
    var Draggable = function () {
        function Draggable(selector, options) {
            _classCallCheck(this, Draggable);

            this.options = this.options || {};

            this.container = document.body.querySelector(selector);
            this.container.className = this.options.containerClass || 'draggable-container';
            this.createSlider();
            this.createSquare();
            this.dragging = false;

            this.addListeners();
        }

        _createClass(Draggable, [{
            key: 'createSlider',
            value: function createSlider() {
                this.sliderElement = document.createElement('div');
                this.sliderElement.className = 'draggable-slider-container';
                this.sliderElement.id = 'slider';

                this.container.appendChild(this.sliderElement);

                this.slider = new Slider('#slider', 0, 25, 1, {
                    sliderClass: 'draggable-slider',
                    cursorClass: 'draggable-slider-cursor'
                });
            }
        }, {
            key: 'createSquare',
            value: function createSquare() {
                this.square = document.createElement('div');
                this.square.className = this.options.squareClass || 'square';

                this.container.appendChild(this.square);
            }

            /**
             * Handlers and listeners
             */

        }, {
            key: 'moveHandler',
            value: function moveHandler(event) {
                if (this.dragging) {
                    this.renderView(event.clientX, event.clientY);
                }
            }
        }, {
            key: 'normalize',
            value: function normalize(value) {
                return value - this.square.clientWidth / 2;
            }
            /* Translate square */

        }, {
            key: 'renderView',
            value: function renderView(x, y) {
                x = this.normalize(x);
                y = this.normalize(y);
                this.container.style.left = x + 'px';
                this.container.style.top = y + 'px';
            }
        }, {
            key: 'addListeners',
            value: function addListeners() {
                var _this = this;

                this.sliderElement.addEventListener('change', function (event) {
                    _this.square.style.borderRadius = event.data.value + 'px';
                });

                this.square.addEventListener('mousedown', function () {
                    _this.dragging = true;
                    _this.boundMove = _this.moveHandler.bind(_this);
                    document.addEventListener('mousemove', _this.boundMove);
                });

                document.addEventListener('mouseup', function () {
                    _this.dragging = false;
                    document.removeEventListener('mousemove', _this.boundMove);
                });

                this.square.addEventListener('touchstart', function () {
                    _this.dragging = true;
                });

                this.square.addEventListener('touchend', function () {
                    _this.dragging = false;
                });

                this.square.addEventListener('touchmove', function (event) {
                    event.preventDefault();
                    _this.renderView(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                });
            }
        }]);

        return Draggable;
    }();

    window.Draggable = Draggable;
})(window, document, undefined);
//# sourceMappingURL=draggable.js.map
