module PileBar {
    export class PileDestination extends Entity2D {
        public slot: Slot;
        public r: number;
        public distance:number
        /* missing  */
        constructor() {
            super(0, 0, 0, 0);
        }
    }

    export class Pile extends Entity2DWithDiv {
        private _thumbnails: Array<Thumbnail>;
        public _isLeft: boolean;
        public destination: PileDestination;
        public r: number = 1;
        private pileBar: PileBar;
        public hideTop: boolean

        /* They should be moved elsewhere  */
        public static ZEBRA_LEFT_URL = './pilebar/build/assets/img/zebra-left.png';
        public static ZEBRA_RIGHT_URL = './pilebar/build/assets/img/zebra-right.png';
        public static LOADING_URL = './pilebar/build/assets/img/loading.jpg';

        constructor(x: number, y: number, width: number, height: number, pileBar: PileBar, thumbnails: Array<Thumbnail>) {
            super(x, y, width, height, pileBar.container);
            this.hide();
            this._thumbnails = thumbnails;
            this.pileBar = pileBar;
            this.destination = null;
            this.redraw();
            this.element.setAttribute('pile', '');
            this.element.classList.add('pile');
            (<any>this.element).pile = this;

        }

        public static createFromSlot(slot: Slot, pileBar: PileBar): Pile {
            let pile: Pile = new Pile(slot.x, slot.y, slot.width, slot.height, pileBar, slot.thumbnails);
            pile.r = slot.r;
            pile.isLeft = slot.isLeft;
            pile.redraw();
            return pile;
        }

        public get thumbnails(): Array<Thumbnail> {
            return this._thumbnails;
        }

        public set thumbnails(thumbnails: Array<Thumbnail>) {
            this._thumbnails = thumbnails;
        }

        public get isLeft(): boolean {
            return this._isLeft;
        }

        public set isLeft(val: boolean) {
            this._isLeft = val;
            //    if (this.isLeft) console.trace(this.toString(),this.isLeft);

        }

        public redraw() {
            this.element.style.backgroundRepeat = 'no-repeat';
            let t = this.getTopThumbnail();

            this.z = (this.isLeft ? t.index : - t.index) + this.pileBar.thumbnails.length;
            let flag = this.isLeft !== this.pileBar.layout.lookingDirection;
            if (this.thumbnails.length > this.pileBar.layout.maxVisibleThumbnails) {
                if(t.hidden)
                   t = this.getThumbnailAt(1);
                this.element.style.backgroundColor = 'rgba(0,0,0,0)';
                let zebraUrl = flag ? Pile.ZEBRA_LEFT_URL : Pile.ZEBRA_RIGHT_URL;
             //   this.element.style.backgroundImage = 'url(' + (!t.hidden ? t.url : '') + '), url(' + (!t.hidden  ? Pile.LOADING_URL : '') + '), url(' + zebraUrl + ')';
                this.element.style.backgroundImage = 'url(' + t.url + '), url(' + Pile.LOADING_URL + '), url(' + zebraUrl + ')';
                let rp = this.r * 100;
                this.element.style.backgroundSize = rp + '% ' + rp + '%, ' + rp + '% ' + rp + '%, ' + 2 * rp + '% ' + 2 * rp + '%';

                if (flag)
                    this.element.style.backgroundPosition = '100% 100%, 100% 100%, ' + (rp < 50 ? '100% 100% ' : '0 0');
                else
                    this.element.style.backgroundPosition = '0 100% , 0 100%,' + (rp < 50 ? '0 100% ' : '100% 0');
                return;
            } else if (this.thumbnails.length === 1) {
                this.element.style.backgroundColor = null;
                this.element.style.backgroundPosition = null;
                this.element.style.backgroundSize = '100% 100%';
                this.element.style.backgroundImage = 'url(' + (!t.hidden ? t.url : '') + '),url(' + (!t.hidden ? Pile.LOADING_URL : '') + ')';
                return;
            }

            flag = this.isLeft == this.pileBar.layout.lookingDirection;
            let img = '';
            let position = '';
            this.element.style.backgroundColor = null;
            this.element.style.backgroundSize = (this.r * this.width) + 'px ' + (this.r * this.height) + 'px ';

            let k = this.thumbnails.length <= 1 ? 1 : (1 - this.r) / (this.thumbnails.length - 1);
            let kw = k * this.width;
            let kh = k * this.height;

            let x = flag ? 0 : (1 - this.r) * this.width;
            let y = ((1 - this.r) * this.height);
            let op = flag ? 1 : -1;
            let sep = '';

            for (let i = 0; i < this.thumbnails.length; i++) {
                let t = this.getThumbnailAt(i);

                //      img += sep + 'url(' + (!t.selected ? t.getTUrl() : '') + '), url(' + (!t.selected ? 'loading.jpg' : '') + ')';
                img += sep + 'url(' + (!t.hidden ? t.url : '') + '), url(' + (!t.hidden ? Pile.LOADING_URL : '') + ')';
                position += sep + x + 'px ' + y + 'px ,' + x + 'px ' + y + 'px ';
                x += op * kw;
                y -= kh;
                sep = ',';
            }

            this.element.style.backgroundImage = img;
            this.element.style.backgroundPosition = position;
        }

        public isLookingLeft(): boolean {
            return this.isLeft == this.pileBar.layout.lookingDirection;
        }


        public getTopThumbnail(): Thumbnail {
            return this.isLeft ? this._thumbnails[this._thumbnails.length - 1] : this._thumbnails[0];
        }

        public getBottomThumbnail(): Thumbnail {
            return !this.isLeft ? this._thumbnails[this._thumbnails.length - 1] : this._thumbnails[0];
        }

        public getThumbnailAt(index: number) {
            return (this.isLeft) ? this._thumbnails[this._thumbnails.length - 1 - index] : this._thumbnails[index];
        }

        public getThumbnailSize(): any {
            return { width: this.r * this.width, height: this.r * this.height };
        }

        public getThumbnailIndexAtRelativePosition(x: number, y: number) {
            let index: number;
            let size: any = this.getThumbnailSize();
            if (this.thumbnails.length == 1) {
                index = 0;
            } else {
                let offset = {
                    x: x, y: y
                };

                if (this.isLookingLeft() && offset.x < size.width)
                    offset.x = size.width - 1;
                else if (!this.isLookingLeft() && offset.x > (this.width * (1 - this.r)))
                    offset.x = (this.width * (1 - this.r)) + 1;

                if (y >= (1 - this.r) * this.height)
                    offset.y = (1 - this.r) * this.height + 1;

                let d = [this.width, this.height];
                let p = [offset.x, this.height - offset.y];

                if (!this.isLookingLeft()) {
                    d[1] = -d[1];
                    p[1] = -offset.y;
                }

                if (Math.atan2(p[1], p[0]) > Math.atan2(d[1], d[0]))
                    index = offset.y / ((1 - this.r) * this.height + 1);

                else if (this.isLookingLeft())
                    index = -(offset.x - this.width) / ((1 - this.r) * this.width + 1);

                else
                    index = (offset.x) / ((1 - this.r) * this.width + 1);

                index = Math.round((1 - index) * (this.thumbnails.length - 1));
            }

            return index;
        }

        public getThumbnailPositionAt(index: number): any {
            let position = {
                x: this.x, y: this.y
            };


            if (this.thumbnails.length == 1) return position;

            let q = this.r < 1 ? (1 - this.r) / (this.thumbnails.length - 1) : 0;

            //position.y = this.y - 0.5 * this.height * 0.5 + this.height * this.r * 0.5;
            position.y = this.y - 0.5 * this.height * (1 - this.r);
            position.y -= q * this.height * index;

            if (!this.isLookingLeft()) {
                position.x = this.x + 0.5 * this.width * (1 - this.r);
                position.x -= q * this.width * index;
            } else {
                position.x = this.x - 0.5 * this.width * (1 - this.r);
                position.x += q * this.width * index;
            }

            return position;
        }

        public animate() {
            if (!this.destination) return;

            let slot = this.destination.slot;

            let speed = this.pileBar.animationSpeed;
            this.x = this.x * (1 - speed) + this.destination.x * speed;
            this.y = this.y * (1 - speed) + this.destination.y * speed;

            let w: number = this.width * (1 - speed) + this.destination.width * speed;
            let h: number = this.height * (1 - speed) + this.destination.height * speed;

            let r: number = this.r * (1 - speed) + this.destination.r * speed;

            this.width = w;
            this.height = h;
            this.r = r;
            this.redraw();

          //  if (slot.index == this.pileBar.getFocusS().index)
            //    this.element.style.zIndex = '10000000';
        }

        public onClick(event: any) {
            this.element.addEventListener('mousedown', event);
            this.element.addEventListener('touchstart', event);
        }

        public toString(): string {
            let s = '[ ';
            for (let i = 0; i < this.thumbnails.length; i++)
                s += this.getThumbnailAt(i).index + ' ';
            s += ']'
            return s;
        }
    }
}
