module PileBar {
    export class Peeker extends Entity2DWithDiv {
        private tDiv: HTMLDivElement;
        private fDiv: HTMLDivElement;
        public thumbnail: Thumbnail;
        private polygon: SVGPolygonElement;
        private thumbnailHeight: number;
        private pileBar: PileBar;

        constructor(width: number, height: number, y: number, pileBar: PileBar) {
            super(0, y, width, height, pileBar.container);
            this.hide();
           
            this.pileBar = pileBar;
            this.thumbnailHeight = height;

            this.element.style.position = 'absolute';
            this.element.style.zIndex = '10000';
            this.element.classList.add('peeker');

            this.tDiv = document.createElement('div');
            this.tDiv.style.backgroundRepeat = 'no-repeat';
            this.tDiv.style.backgroundPosition = 'center';
            this.tDiv.style.backgroundSize = "100% 100%";
            this.tDiv.style.width = '100%'
            this.tDiv.style.height = height + 'px';
            this.tDiv.classList.add('peeker-thumbnail');
            this.element.appendChild(this.tDiv);

            this.fDiv = document.createElement('div');
            this.fDiv.style.backgroundImage = '-webkit-linear-gradient(white, #F6FAB1)';
            this.fDiv.style.position = 'absolute';
            this.fDiv.style.opacity = '0.5';
            this.fDiv.style.width = '100%';
            this.fDiv.style.pointerEvents = 'none';
            this.fDiv.classList.add('peeker-fade');
            this.element.appendChild(this.fDiv);

            if (Utils.browser.isFirefox) {
                let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '0');
                svg.setAttribute('height', '0');
                let cp = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')
                cp.setAttribute('id', 'peekerCP');
                this.fDiv.style.clipPath = 'url(#peekerCP)';
                this.polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
                svg.appendChild(cp);
                cp.appendChild(this.polygon);
                this.element.appendChild(svg);
            }

        }

        public redraw(width: number, height: number, y: number): void {
            this.y = y;
            this.width = width;
            this.height = height;
        }

        private test: Entity2DWithDiv;

        public peekAt(pile: Pile, tIndex: number): void {
            this.thumbnail = pile.getThumbnailAt(tIndex);
            this.tDiv.style.backgroundImage = 'url(' + this.thumbnail.url + '), url(' + Pile.LOADING_URL + ')';

            let position = pile.getThumbnailPositionAt(tIndex);
            let size = pile.getThumbnailSize();

            //needs some review...
            let h = (position.y - size.height * 0.5) - (this.y + this.height * 0.5) + (pile.height - size.height) + 1;
            let d = Math.abs(this.width - size.width) * 0.5;

            /* SVG stuff */
            let px = Utils.browser.isFirefox ? '' : 'px ';
            let points = 0 + px + 0 + px + ',' + this.width + px + '0' + px + ',' + (this.width - d) + px + h + px + ',' + d + px + h + px;
            if (Utils.browser.isFirefox)
                this.polygon.setAttribute('points', points);
            else
                this.fDiv.style['webkitClipPath'] = 'polygon(' + points + ')';

            this.fDiv.style.height = Math.abs(h) + 'px';
            this.x = position.x;

            this.show();
        }
    }
}
