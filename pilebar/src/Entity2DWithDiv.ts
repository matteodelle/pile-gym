
module PileBar {
    export class Entity2DWithDiv implements Entity2DInterface {
        private _x: number;
        private _y: number;
        private _z: number;
        private _width: number;
        private _height: number;
        private _parent: HTMLDivElement;
        protected _element: HTMLDivElement = document.createElement('div');

        public constructor(x: number, y: number, width: number, height: number, parent?: HTMLDivElement) {

            this.element.style.position = 'absolute';
            //  this.element.style.bottom = '0px';
            //  this.element.style.left = '0px';
            this.element.style.boxSizing = 'border-box';
            this._parent = parent;
            //  console.log('parent',this.parent);
            this.parent.appendChild(this.element);
            this.element.classList.add('obj-2d-with-div');

            this.width = width;
            this.height = height;
            this.x = x;
            this.y = y;

        }

        public get parent(): HTMLElement {
            return this._parent;
        }

        public get x(): number {
            return this._x;
        }

        public set x(val: number) {
            this._x = val;
            //this.element.style.left = (val - this.width / 2) + 'px';

            this.element.style.left = (val - this.width * 0.5) + 'px';
            this.element.setAttribute('data-x', val + '');

        }
        public get y(): number {
            return this._y;
        }

        public set y(val: number) {
            this._y = val;
            //this.element.style.bottom = (val - this.parent.getBoundingClientRect().height) + 'px';
            this.element.style.top = (val - this.height * 0.5) + 'px';
            this.element.setAttribute('data-y', val + '');
        }

        public get z(): number {
            return this._z;
        }

        public set z(val: number) {
            this._z = val;
            this.element.style.zIndex = val + '';
        }

        public set width(val: number) {
            this._width = val;
            this.element.style.width = val + 'px';
        }

        public get width(): number {
            return this._width;
        }

        public set height(val: number) {
            this._height = val;
            this.element.style.height = val + 'px';
        }

        public get height(): number {
            return this._height;
        }

        public die() {

            this.hide();
            this.element.style.display = 'none';
            var parent = this.element.parentElement;
            if (parent)
                parent.removeChild(this.element);
        }

        public hide() {
            this.element.style.display = 'none';
        }

        public show() {
            this.element.style.display = null;
        }

        public get classList() : DOMTokenList{
            return this.element.classList;
        }

        public get element() {
            return this._element;
        }

    }
}
