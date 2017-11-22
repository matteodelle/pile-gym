
module PileBar {
    export class SlotIncominData {
        public count: number;
        public piles: Array<Pile>;
        public arrivedPiles: Array<Pile>;
        public sum: number;
        public n: number;
        public avg: number = 0;

        constructor() {
            this.reset();
        }

        public reset() {
            this.count = 0;
            this.piles = [];
            this.arrivedPiles = [];
            this.sum = 0;
            this.n = 0;
            this.avg = 0;
        }

    }
    export class Slot extends Entity2D {
        public k: number;
        private _thumbnails: Array<Thumbnail> = [];
        public index: number;
        public isLeft: boolean;
        public r: number;
        public incoming: SlotIncominData = new SlotIncominData();
        public offset : number;
        constructor(x: number, y: number, width: number, height: number, k: number, index: number, isLeft?: boolean) {
            super(x, y, width, height);
            this.k = k;
            this.index = index;
            this.isLeft = isLeft;
        }

        public get thumbnails(): Array<Thumbnail> {
            return this._thumbnails;
        }

        public set thumbnails(thumbnails: Array<Thumbnail>) {
            this._thumbnails = thumbnails;
        }

        public toString(): string {
            let s = '[ ';
            for (let i = 0; i < this.thumbnails.length; i++)
                s += this.thumbnails[i].index + ' ';
            s += ']'
            return s;
        }
    }
}
