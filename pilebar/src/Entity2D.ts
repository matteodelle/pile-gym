
//import {Thumbnail} from './Thumbnail.ts';
module PileBar {

    export interface Entity2DInterface {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export class Entity2D implements Entity2DInterface {
        private _x: number = 0;
        private _y: number = 0;
        private _width: number = 0;
        private _height: number = 0;

        public constructor(x: number, y: number, width: number, height: number) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        public get x(): number {
            return this._x;
        }

        public set x(val: number) {
            this._x = val;
        }
        public get y(): number {
            return this._y;
        }

        public set y(val: number) {
            this._y = val;
        }

        public set width(val: number) {
            this._width = val;
        }

        public get width(): number {
            return this._width;
        }

        public set height(val: number) {
            this._height = val;
        }

        public get height(): number {
            return this._height;
        }
    }
}
//var t = new Thumbnail(null,null,null,null);
