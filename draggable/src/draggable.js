((window, document, undefined) => {

    class Draggable {

        constructor(selector, options) {

            this.options = this.options || {};

            this.container = document.body.querySelector(selector);
            this.container.className = this.options.containerClass || 'draggable-container';
            this.createSlider();
            this.createSquare();
            this.dragging = false;

            this.addListeners();
        }

        createSlider() {
            this.sliderElement = document.createElement('div');
            this.sliderElement.className = 'draggable-slider-container';
            this.sliderElement.id = 'slider';

            this.container.appendChild(this.sliderElement);

            this.slider = new Slider('#slider', 0, 25, 1, {
                sliderClass: 'draggable-slider',
                cursorClass: 'draggable-slider-cursor'
            });
        }

        createSquare() {
            this.square = document.createElement('div');
            this.square.className = this.options.squareClass || 'square';

            this.container.appendChild(this.square);
        }

        /**
         * Handlers and listeners
         */
        moveHandler(event) {
            if (this.dragging) {
                this.renderView(event.clientX, event.clientY);
            }
        }

        normalize(value) {
            return value - this.square.clientWidth / 2;
        }
        /* Translate square */
        renderView(x,y) {
            x = this.normalize(x);
            y = this.normalize(y);
            this.container.style.left = `${x}px`;
            this.container.style.top = `${y}px`;
        }

        addListeners() {

            this.sliderElement.addEventListener('change', (event) => {
                this.square.style.borderRadius = `${event.data.value}px`;
            });

            this.square.addEventListener('mousedown', () => {
                this.dragging = true;
                this.boundMove = this.moveHandler.bind(this);
                document.addEventListener('mousemove', this.boundMove);
            });

            document.addEventListener('mouseup', () => {
                this.dragging = false;
                document.removeEventListener('mousemove', this.boundMove);
            });

            this.square.addEventListener('touchstart', () => {
                this.dragging = true;
            });

            this.square.addEventListener('touchend', () => {
                this.dragging = false;
            });

            this.square.addEventListener('touchmove', (event) => {
                event.preventDefault();
                this.renderView(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
            });

        }

    }

    window.Draggable = Draggable;

})(window, document, undefined);
