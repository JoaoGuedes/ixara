'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, document, undefined) {
    var Draggable = function () {

        /**
        * Constructor and DOM creation
        **/

        function Draggable(selector, options) {
            _classCallCheck(this, Draggable);

            this.options = options || {};
            this.container = document.body.querySelector(selector);
            this.container.className = this.options.containerClass || 'draggable-container';
            this.createSlider();
            this.createSquare();
            this.addViewListeners();
        }

        _createClass(Draggable, [{
            key: 'createSlider',
            value: function createSlider() {
                var _this = this;

                var sliderElement = document.createElement('div');
                sliderElement.className = 'draggable-slider-container';
                sliderElement.id = 'slider';

                this.container.appendChild(sliderElement);

                this.slider = new Slider('#slider', 0, 25, 1, {
                    sliderClass: 'draggable-slider',
                    cursorClass: 'draggable-slider-cursor'
                });

                sliderElement.addEventListener('change', function (event) {
                    _this.square.style.borderRadius = event.data.value + 'px';
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
            * Get value within [lower,upper]
            **/

        }, {
            key: 'clip',
            value: function clip(value, lower, upper) {
                return Math.max(lower, Math.min(value, upper));
            }

            /* Translate square */

        }, {
            key: 'renderView',
            value: function renderView(x, y) {
                var windowMaxX = window.innerWidth - this.container.clientWidth;
                var windowMaxY = window.innerHeight - this.container.clientHeight;
                var xView = this.clip(x - this.startX, 0, windowMaxX); //get clipped value of "x - this.startX" (current pos - position within square)
                var yView = this.clip(y - this.startY, 0, windowMaxY); //same for y
                this.container.style.left = xView + 'px';
                this.container.style.top = yView + 'px';
            }

            /**
            * Handlers and listeners
            */

        }, {
            key: 'moveHandler',
            value: function moveHandler(event) {
                this.renderView(event.clientX, event.clientY);
            }
        }, {
            key: 'addViewListeners',
            value: function addViewListeners() {
                var _this2 = this;

                this.square.addEventListener('mousedown', function (event) {
                    _this2.boundMove = _this2.moveHandler.bind(_this2); //For unregistering the event on mouseup
                    _this2.startX = event.offsetX; //Store mouse position within square
                    _this2.startY = event.offsetY;
                    document.addEventListener('mousemove', _this2.boundMove);
                });

                document.addEventListener('mouseup', function () {
                    _this2.startX = undefined;
                    _this2.startY = undefined;
                    document.removeEventListener('mousemove', _this2.boundMove);
                });

                this.square.addEventListener('touchstart', function () {
                    _this2.startX = _this2.square.clientWidth / 2; //In mobile, dragging feels better when dragging the middle of the item
                    _this2.startY = _this2.square.clientWidth / 2;
                });

                this.square.addEventListener('touchmove', function (event) {
                    _this2.renderView(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                });
            }
        }]);

        return Draggable;
    }();

    window.Draggable = Draggable;
})(window, document, undefined);
//# sourceMappingURL=draggable.js.map
