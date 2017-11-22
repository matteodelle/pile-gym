module PileBar {
    export class Thumbnail {
        private _url: string;
        private _hdUrl: string;
        public _sem: number;
        private _index: number;
        public hidden: boolean = false;
        public nextSlot: Slot;
        
        constructor(url: string, hdUrl: string, sem: number, index: number) {
            this._url = url;
            this._hdUrl = hdUrl;
            this._sem = sem;
            this._index = index;
        }

        public get url(): string {
            return !PileBar.DEBUG ? this._url : 'https://placeholdit.imgix.net/~text?txtsize=33&w=80&h=60&txt=' + this.index;
        }

        public set url(url: string) {
            this._url = url;
        }

        public get hdUrl(): string {
            return !PileBar.DEBUG ? this._hdUrl : 'https://placeholdit.imgix.net/~text?txtsize=330&w=800&h=600&txt=' + this.index;
        }

        public set hdUrl(hdUrl: string) {
            this._hdUrl = hdUrl;
        }

        public get sem(): number {
            return this._sem;
        }

        public set sem(sem: number) {
            this._sem = sem;
        }

        public get index(): number {
            return this._index;
        }

        public set index(index: number) {
            this._index = index;
        }
    }
}
