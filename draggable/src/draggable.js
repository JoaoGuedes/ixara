((window, document, undefined) => {

    class Draggable {

        /**
        * Constructor and DOM creation
        **/
        constructor(selector, options) {
            this.options = options || {};
            this.container = document.body.querySelector(selector);
            this.container.className = this.options.containerClass || 'draggable-container';
            this.createSlider();
            this.createSquare();
            this.addViewListeners();
        }

        createSlider() {
            let sliderElement = document.createElement('div');
            sliderElement.className = 'draggable-slider-container';
            sliderElement.id = 'slider';

            this.container.appendChild(sliderElement);

            this.slider = new Slider('#slider', 0, 25, 1, {
                sliderClass: 'draggable-slider',
                cursorClass: 'draggable-slider-cursor'
            });

            sliderElement.addEventListener('change', (event) => {
                this.square.style.borderRadius = `${event.data.value}px`;
            });
        }

        createSquare() {
            this.square = document.createElement('div');
            this.square.className = this.options.squareClass || 'square';
            this.container.appendChild(this.square);
        }

        /**
        * Get value within [lower,upper]
        **/
        clip(value, lower, upper) {
            return Math.max(lower, Math.min(value,upper));
        }

        /* Translate square */
        renderView(x,y) {
            const windowMaxX = window.innerWidth - this.container.clientWidth;
            const windowMaxY = window.innerHeight - this.container.clientHeight;
            const xView = this.clip(x - this.startX, 0, windowMaxX); //get clipped value of "x - this.startX" (current pos - position within square)
            const yView = this.clip(y - this.startY, 0, windowMaxY); //same for y
            this.container.style.left = `${xView}px`;
            this.container.style.top = `${yView}px`;
        }

        /**
        * Handlers and listeners
        */
        moveHandler(event) {
            this.renderView(event.clientX,event.clientY);
        }

        addViewListeners() {

            this.square.addEventListener('mousedown', (event) => {
                this.boundMove = this.moveHandler.bind(this); //For unregistering the event on mouseup
                this.startX = event.offsetX;                  //Store mouse position within square
                this.startY = event.offsetY;
                document.addEventListener('mousemove', this.boundMove);
            });

            document.addEventListener('mouseup', () => {
                this.startX = undefined;
                this.startY = undefined;
                document.removeEventListener('mousemove', this.boundMove);
            });

            this.square.addEventListener('touchstart', () => {
                this.startX = this.square.clientWidth/2;      //In mobile, dragging feels better when dragging the middle of the item
                this.startY = this.square.clientWidth/2;
            });

            this.square.addEventListener('touchmove', (event) => {
                this.renderView(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
            });

        }

    }

    window.Draggable = Draggable;

})(window, document, undefined);
