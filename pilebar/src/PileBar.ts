
//import {Thumbnail} from './Thumbnail.ts';
module PileBar {
    export class PileBar {
        public static VERSION = 1.0;
        private _thumbnails: Array<Thumbnail>;
        private _container: HTMLDivElement;
        private _layout: Layout;
        public aspectRatio: number = 3 / 2;
        private CLUSTER_NORM: number;
        private piles: Array<Pile> = [];
        private R_CONST: number = 0.06;
        private R_LIMIT: number = 0.8;
        private animationPaused: boolean = true;
        public animationSpeed: number = 0.11;
        private requestAnimationFrameId: any = undefined;
        public peeker: Peeker;
        public heightHandlerOffset: number = 8;
        public static DEBUG: boolean = false;
        constructor(thumbnails: Array<Thumbnail>, container: HTMLDivElement, layout?: Layout, params?: any) {
            let c = document.createElement('div');
            c.style.width = '100%';
            c.style.height = '100%';
            c.style.position = 'absolute';
            c.style.marginTop = '5px';
            container.appendChild(c);
            this._container = c;

            this._thumbnails = thumbnails;
            // this.fixAspectRatio();
            if (!layout)
                this.layout = ScalingLayout.buildDemo(this);

            this.resetClusterNorm();
            this.init();
        }

        private init() {
            console.log('initializing PileBar');

            let me = this;
            this.refresh(true);
            window.addEventListener('resize', function (e) {
                console.log('refreshing layout');
                me.refresh();
            });
            this.initAnimation();
            this.initEvents();
            this.initRenderLoop();
        }

        private resetClusterNorm() {
            this.CLUSTER_NORM = Math.log(this.thumbnails[this.thumbnails.length - 1].sem / (this.thumbnails.length)) / Math.log(2)
        }

        public get container(): HTMLDivElement {
            return this._container;
        }

        /**
        * Sets pilebar layout (and sets its parent)
        * @param {Layout} pilebar layout
        **/
        public set layout(layout: Layout) {
            layout.parent = this;
            this._layout = layout;
            this.refresh(true);
        }

        public get layout(): Layout {
            return this._layout;
        }

        public set thumbnails(thumbnails: Array<Thumbnail>) {
            this._thumbnails = thumbnails;
            this.resetClusterNorm();
            for (let i = 0; i < this.slots.length; i++)
                this.slots[i].thumbnails = [];

            for (let i = 0; i < this.piles.length; i++)
                this.piles[i].die();
            this.piles = [];

            this.refresh(true);
        }

        public get thumbnails(): Array<Thumbnail> {
            return this._thumbnails;
        }

        public get height() {
            return this._container.getBoundingClientRect().height;
        }

        public get width() {
            return this._container.getBoundingClientRect().width;
        }

        private refresh(reset?: boolean) {

            this.dispatchEvent('refresh_start');
            this.stopAnimation();
            let t = this.getFocusT();
            let _this = this;
            function callback() {
                _this.layout.refresh();
                _this.getFocusS().thumbnails = _this.thumbnails;
                // this.piles.push(Pile.createFromSlot(this.getFocusS(), this));
                if (_this.piles.length == 0) {
                    let p = Pile.createFromSlot(_this.getFocusS(), _this);

                    _this.piles.push(p);
                    p.show();
                };
                console.log('refreshing', _this.lastRefocusThumbnailIndex, _this.lastRefocusSlotIndex);
                if (reset)
                    _this.refocus(_this.thumbnails[Math.round(_this.thumbnails.length / 2)].index, _this.getFocusS().index, true);
                else
                    _this.refocus(t.index, _this.getFocusS().index, true);


                _this.rebuildPeeker();
                _this.dispatchEvent('refresh_done');
            }
            if (!reset) {
                callback();
                return;
            }

            let m = new Image();

            m.onload = function (event) {
                _this.aspectRatio = m.width / m.height;
                callback();
                console.log('new aspectRatio', _this.aspectRatio);
            }
            m.src = this.thumbnails[0].url;


        }

        public get slots(): Array<Slot> {
            return this.layout.slots;
        }

        public getFocusS(): Slot {
            return this.layout.focusSlot;
        }

        public getFocusT(): Thumbnail {

            return !this.layout.focusSlot ? null : this.layout.focusSlot.thumbnails[0];
        }

        public setFocus(index: number) {
            this.refocus(index);
        }

        public setFocusByProperty(name: string, value: any): void {
            for (let i = 0; i < this.thumbnails.length; i++)
                if (this.thumbnails[i][name] == value) {
                    this.refocus(this.thumbnails[i].index);
                    break;
                }
        }

        private cluster(sem: number, k: number): number {
            return k == -1 ? sem : (sem >> this.CLUSTER_NORM + k);
        }

        private lastRefocusThumbnailIndex: number;
        private lastRefocusSlotIndex: number;

        public refocus(tIndex?: number, sIndex?: number, force?: boolean) {

            tIndex = (tIndex === undefined || tIndex === null) ? this.getFocusT().index : tIndex;
            sIndex = (sIndex === undefined || sIndex === null) ? this.getFocusS().index : sIndex;

            if (tIndex == this.thumbnails[0].index &&
                sIndex > this.getFocusS().index ||
                tIndex == this.thumbnails[this.thumbnails.length - 1].index &&
                sIndex < this.getFocusS().index
            )
                sIndex = this.getFocusS().index;

            if (!force && tIndex == this.lastRefocusThumbnailIndex && sIndex == this.lastRefocusSlotIndex)
                return false;

            this.stopAnimation();

            let now = performance.now();

            for (let i = 0; i < this.slots.length; i++)
                this.slots[i].thumbnails = [];

            for (let s = -1; s <= 1; s += 2) {
                let i = tIndex,
                    j = sIndex;
                let cLast = this.cluster(this.thumbnails[tIndex].sem, this.slots[sIndex].k);

                while (i >= 0 && i < this.thumbnails.length) {
                    let cNow = this.cluster(this.thumbnails[i].sem, this.slots[j].k);
                    if (cNow != cLast && (j + s) >= 0 && (j + s) < this.slots.length) {
                        j += s;
                        cNow = this.cluster(this.thumbnails[i].sem, this.slots[j].k);
                    }
                    cLast = cNow;

                    if (!(i == tIndex && s > 0)) {
                        this.thumbnails[i].nextSlot = this.slots[j];
                        this.slots[j].thumbnails.push(this.thumbnails[i]);
                    }

                    i += s;
                }
            }

            if (this.getFocusS().thumbnails.length <= 0) {
                this.refocus(tIndex, this.getFocusS().index, true);
                return;
            }

            let oldPiles = this.piles;
            let newPiles = new Array<Pile>();
            this.piles = [];

            for (let i = 0; i < this.slots.length; i++) {
                let slot = this.slots[i];
                slot.r = this.calcR(slot.thumbnails.length);
                slot.incoming.reset();
            }

            for (let i = 0; i < oldPiles.length; i++) {
                let p = oldPiles[i];
                let r = this.calcR(p.thumbnails.length);
                let q = p.thumbnails.length == 1 ? 0 : ((1 - r) / (p.thumbnails.length - 1));
                let tmp: Array<Thumbnail> = [];
                p.destination = undefined;

                for (let j = 0; j < p.thumbnails.length; j++) {

                    let t = p.thumbnails[j];
                    tmp.push(t);
                    let nextSlot = t.nextSlot;

                    if (j + 1 >= p.thumbnails.length || nextSlot.index != p.thumbnails[j + 1].nextSlot.index) {
                        let position = { x: p.x, y: p.y };

                        let size = { width: p.width, height: p.height };

                        if (tmp.length != p.thumbnails.length) {
                            size.width *= r;
                            size.height *= r;
                            position.x += q * j * p.width - (p.width - size.width) * 0.5;
                            position.y += (p.height - size.height) * 0.5;
                            if (p.isLeft)
                                position.y -= q * (p.thumbnails.length - j - 1) * p.height;
                            else
                                position.y -= q * j * p.height;
                        }

                        let pile = new Pile(position.x, position.y, size.width, size.height, this, tmp);

                        pile.r = r;
                        pile.isLeft = nextSlot.isLeft;
                        pile.redraw();
                        pile.show();

                        nextSlot.incoming.count += tmp.length;
                        nextSlot.incoming.piles.push(pile);

                        pile.destination = new PileDestination();
                        pile.destination.slot = nextSlot;
                        newPiles.push(pile);

                        pile.destination.slot.incoming.sum += (pile.y + pile.height /* /2 */);
                        pile.destination.slot.incoming.n++;

                        tmp = [];

                    }

                }
                //     p.thumbnails = [];
            }

            this.layout.sortSlots();

            this.calcDestinations();
            for (let i = 0; i < oldPiles.length; i++) {
                oldPiles[i].die();
            }

            this.piles = newPiles;

            this.startAnimation();

            this.dispatchEvent('refocus_start', { index: tIndex, lastIndex: this.lastRefocusThumbnailIndex });

            this.lastRefocusThumbnailIndex = tIndex;
            this.lastRefocusSlotIndex = sIndex;



        }

        private dispatchEvent(event: string, detail?: any) {
            this.container.dispatchEvent(new CustomEvent(event, { detail: detail }));
        }

        public addEventListener(event: string, callback: any) {
            this.container.addEventListener(event, callback);
        }

        public skip(i: number) {
            if (i < 0 && this.getFocusT().index + i >= 0)
                this.refocus(this.getFocusT().index + i, this.getFocusS().index);

            else if (i >= 0 && this.getFocusT().index + i < this.thumbnails.length)
                this.refocus(this.getFocusT().index + i, this.getFocusS().index);
        }

        public toggleSEM() {

        }

        public printStatus() {
            let c = 0, d = 0;
            let list: Array<any> = [];
            for (let i = 0; i < arguments.length; i++)
                list.push(arguments[i]);
            for (let i = 0; i < this.slots.length; i++) {

                let slot = this.slots[i];

                if (list.length > 0 && list.indexOf(slot.index) == -1) continue;

                let s = slot.index + ': [ ';
                for (let j = 0; j < slot.thumbnails.length; j++)
                    s += slot.thumbnails[j].index + ' ';
                s += ']';
                console.log(s);
                c += slot.thumbnails.length;
            }

            for (let i = 0; i < this.piles.length; i++)
                d += this.piles[i].thumbnails.length;

            if (list.length == 0)
                console.log('Tot. Thumbnails:' + this.thumbnails.length, ' Tot. Thumbnails in slots: ' + c, ' Tot. Thumbnails in piles: ' + d);

        }


        public printPiles() {
            for (let i = 0; i < this.piles.length; i++) {

                let pile = this.piles[i];

                let str = '[';
                for (let j = 0; j < pile.thumbnails.length; j++)
                    str += pile.thumbnails[j].index + ' ';
                str += ']';
                console.log(str);
            }

        }

        public calcR(n: number): number {
            let r = (n == 0 ? 1 : (1 - this.R_CONST * Utils.log2(n)));
            return r <= this.R_LIMIT ? this.R_LIMIT : r;
        }

        public startAnimation() {
            this.animationPaused = false;
        }

        public stopAnimation() {
            this.animationPaused = true;
        }

        public toggleAnimation() {
            this.animationPaused = !this.animationPaused;
        }

        private initAnimation() {

            console.log('initializing animation');
            let _this = this;
            let END_OFFSET = 0.001;
            function animate(time: number) {
                let sum = 0;
                let count = 0;

                for (let i = 0; i < _this.piles.length && !_this.animationPaused; i++) {

                    let now = performance.now();
                    let pile: Pile = _this.piles[i];

                    if (!pile.destination) continue;
                    pile.animate();

                    if (pile.destination.slot.index == _this.getFocusS().index) {
                        let currentDistance = Math.sqrt(Math.pow(pile.destination.slot.x - pile.x, 2) + Math.pow(pile.destination.slot.x - pile.x, 2));
                        _this.dispatchEvent('refocus_notify', { percent: 100 - Math.floor((currentDistance / pile.destination.distance) * 100) });
                    }

                    sum += ((performance.now() - now));
                    count++;

                    if (
                        Math.abs(pile.x - pile.destination.x) <= END_OFFSET &&
                        Math.abs(pile.y - pile.destination.y) <= END_OFFSET &&
                        Math.abs(pile.width - pile.destination.width) <= END_OFFSET &&
                        Math.abs(pile.height - pile.destination.height) <= END_OFFSET
                    ) {
                        let slot = pile.destination.slot;
                        pile.destination = null;
                        slot.incoming.arrivedPiles.push(pile);


                        if (slot.index == _this.getFocusS().index)
                            _this.dispatchEvent('refocus_done', { index: pile.getTopThumbnail().index });


                        if (slot.incoming.arrivedPiles.length == slot.incoming.piles.length) {
                            slot.incoming.arrivedPiles = slot.incoming.arrivedPiles.sort(function (a, b) {
                                return a.thumbnails[0].index - b.thumbnails[0].index;
                            });

                            let thumbnails: Array<Thumbnail> = [];
                            for (let k = 0; k < slot.incoming.arrivedPiles.length; k++) {
                                let p = slot.incoming.arrivedPiles[k];
                                thumbnails = thumbnails.concat(p.thumbnails);
                                p.thumbnails = [];
                                p.die();
                            }

                            //TODO: remove sorting + bug fix
                            slot.thumbnails.sort(function (a, b) {
                                return a.index - b.index;
                            });
                            let np = Pile.createFromSlot(slot, _this);
                            np.thumbnails = thumbnails;

                            _this.piles.push(np);
                            np.show();
                        }
                    }

                }

            }
            this.startAnimation();
            this.renderLoopList.push(animate);
        }

        private renderLoopList: Array<Function> = [];

        private initRenderLoop() {
            let _this = this;
            function run(time: number) {
                for (let i = 0; i < _this.renderLoopList.length; i++)
                    _this.renderLoopList[i](time);
                requestAnimationFrame(run);
            }

            run(0);
        }

        private calcDestinations() {
            for (let i = 0; i < this.slots.length; i++) {

                let slot = this.slots[i];

                if (!slot.isLeft)
                    slot.incoming.piles.sort(function (a, b) {
                        return a.thumbnails[0].index - b.thumbnails[0].index
                    });
                else
                    slot.incoming.piles.sort(function (a, b) {
                        return b.thumbnails[0].index - a.thumbnails[0].index
                    });

                let offset = 0;

                for (let j = 0; j < slot.incoming.piles.length; j++) {
                    let pile: Pile = slot.incoming.piles[j];
                    //  let destSlot = slot;//pile.destination.slot;
                    pile.destination.slot = slot;
                    pile.destination.x = 0;
                    pile.destination.y = 0;
                    pile.destination.width = 0;
                    pile.destination.height = 0;
                    pile.destination.r = 1;
                    pile.destination.distance = Math.sqrt(Math.pow(slot.x - pile.x, 2) + Math.pow(slot.x - pile.x, 2));


                    let r = pile.destination.r = this.calcR(slot.incoming.count);
                    let q = r < 1 ? (1 - r) / (slot.incoming.count - 1) : 0; //avoiding division by 0

                    if (pile.thumbnails.length == slot.incoming.count) {
                        r = 1;
                        q = 0;
                    }

                    //****dest. size
                    //single thumbnail
                    if (pile.thumbnails.length == 1) {
                        pile.destination.width = slot.width * r;
                        pile.destination.height = slot.height * r;
                    } else if (offset > 0 || slot.incoming.count <= this.layout.maxVisibleThumbnails) {
                        let u = q * (pile.thumbnails.length - 1);

                        pile.destination.width = slot.width * Math.max(this.R_LIMIT, r + u);
                        pile.destination.height = slot.height * Math.max(this.R_LIMIT, r + u);

                    } else {
                        pile.destination.width = slot.width;
                        pile.destination.height = slot.height;
                    }

                    if (r < 1)
                        pile.destination.r = (r * slot.width) / pile.destination.width;

                    if (r < this.R_LIMIT && pile.thumbnails.length > this.layout.maxVisibleThumbnails)
                        pile.destination.r = this.R_LIMIT;

                    pile.destination.y = slot.y + 0.5 * (slot.height - pile.destination.height) - q * offset * slot.height;

                    //***dest. position
                    //deck looking left
                    pile.destination.x = slot.x - 0.5 * slot.width + pile.destination.width * 0.5;
                    if (slot.isLeft == this.layout.lookingDirection) {
                        pile.destination.x += q * offset * slot.width;
                    }
                    else { //looking right
                        pile.destination.x += q * (slot.incoming.count - offset - pile.thumbnails.length) * slot.width;

                    }

                    if (
                        (pile.destination.x + pile.destination.width) >
                        (slot.x + slot.width)
                    )
                        pile.destination.x = -pile.destination.width + slot.x + slot.width;

                    offset += pile.thumbnails.length;

                }
            }
        }

        public toggleLookingDirection(direction?: boolean): boolean {
            if (direction !== null && direction !== undefined)
                this.layout.lookingDirection = direction;
            else
                this.layout.lookingDirection = !this.layout.lookingDirection;
            this.refocus(null, null, true);
            return this.layout.lookingDirection;
        }

        private rebuildPeeker() {
            console.log('Rebuilding Peeker');
            let maxY = 100000;

            for (let i = 0; i < this.slots.length; i++) {
                //      console.log(this.slots[i].y);
                if (this.slots[i].y < maxY)
                    maxY = this.slots[i].y;
            }
            if (this.peeker)
                this.peeker.die();

            this.peeker = new Peeker(this.getFocusS().width, this.getFocusS().height, ((maxY - (this.getFocusS().height)) * 1.5), this);
        }
		
		public updateSem(): void {
			// let t = this.getFocusT();
			for (let i = 0; i < this.thumbnails.length; i++)
				this.thumbnails[i].sem = Math.random()*10000;
			this.thumbnails.sort(function(a, b) {
				return a.sem - b.sem;
			})
            this.refresh(true);   
			//this.refocus(this.index);		
        }

        private _testDotDiv: Entity2DWithDiv;
        public get testDotDiv() {
            if (!this._testDotDiv) {
                this._testDotDiv = new Entity2DWithDiv(0, 0, 10, 10, this.container);
                this._testDotDiv.classList.add('test-div');
            }
            return this._testDotDiv;
        }

        private initEvents() {
            let _this = this;
            let holdingTimeoutId: any;
            let floatingThumbnail: Entity2DWithDiv;
            let nextWidth: number;
            let nextHeight: number;
            let nextX: number;
            let nextY: number;

            /* disabling text/img/etc... browser selection to avoid bugs while dragging */
            // iOS Safari
            this._container.style['-webkit-touch-callout'] = 'none';

            // Chrome/Safari/Opera
            this._container.style['-webkit-user-select'] = 'none';

            // Konqueror             
            this._container.style['-khtml-user-select'] = 'none';

            // Firefox
            this._container.style['-moz-user-select'] = 'none';

            // Internet Explorer/Edge
            this._container.style['-ms-user-select'] = 'none';

            // Non-prefixed version, currently not supported by any browser
            this._container.style['user-select'] = 'none';

            function clicked(event: any) {
                if (event.shiftKey) {
                    _this.refocus(_this.peeker.thumbnail.index);
                    _this.peeker.hide();
                    return;
                }

                if (!event.target.hasAttribute('pile')) return;
                let pile = event.target.pile;
                _this.refocus(pile.getTopThumbnail().index, null, true);
            }

            function peekerEvent(event: any) {
                if (!event.shiftKey || !event.target.classList.contains('pile') || event.offsetX < 0 || event.offsetY < 0) {
                    _this.peeker.hide();
                    return;
                }

                let pile: Pile = event.target.pile;
                _this.peeker.peekAt(event.target.pile, pile.getThumbnailIndexAtRelativePosition(event.offsetX, event.offsetY));
                _this.peeker.show();
            }


            function stopDragging() {
                if (!floatingThumbnail) return;
                console.log('Stop Dragging');
                _this.thumbnails[floatingThumbnail.element.getAttribute('t-index')].hidden = false;
                floatingThumbnail.die();
                floatingThumbnail = undefined;
                _this.refresh();
            }


            function startDragging(pile: Pile, event: any) {
                let t = pile.getTopThumbnail();

                //cleaning up the old one ... if still exists
                if (floatingThumbnail || !t) stopDragging();
                if (!t) return;
                console.log('Dragging');
                t.hidden = true;
                pile.redraw();
                let w = pile.width * pile.r;
                let h = pile.height * pile.r;
                nextWidth = w;
                nextHeight = h;
                floatingThumbnail = new Pile(event.pageX, event.pageY, w, h, _this, [t]);
                floatingThumbnail.element.style.position = 'fixed';
                floatingThumbnail.classList.add('floating-pile');
                floatingThumbnail.element.style.background = 'url(' + t.url + ')  center/100% no-repeat';
                floatingThumbnail.element.style.zIndex = '2147483646';
                floatingThumbnail.element.setAttribute('t-index', t.index + '');
                floatingThumbnail.show();
            }

            function movingEvent(event: any) {

                if (!floatingThumbnail) {
                    // _this.refocus();
                    return;
                }

                floatingThumbnail.x = event.pageX;
                floatingThumbnail.y = event.pageY;
                floatingThumbnail.element.style.zIndex = '2147483646';

                let min = Number.MAX_VALUE;
                let slot: Slot;

                //this assumes that there is no resizing while dragging!!!
                for (let i = 0; i < _this.slots.length; i++) {
                    let s = _this.slots[i];
                    let dist = Math.abs((_this.container.getBoundingClientRect().left + s.x) - event.pageX);
                    if (dist > min) continue;
                    min = dist;
                    slot = s;
                }

                nextWidth = slot.width;
                nextHeight = slot.height;
                //        console.log('Nearest Slot', Number(floatingThumbnail.element.getAttribute('t-index')), slot.index);
                _this.refocus(Number(floatingThumbnail.element.getAttribute('t-index')), slot.index);

            }

            function release() {
                clearTimeout(holdingTimeoutId);
                stopDragging();
                if (!holdingTimeoutId) return;
                holdingTimeoutId = false;
            }

            function downEvent(event: any) {
                if (event.button === 2) return;

                release();
                holdingTimeoutId = setTimeout(function () {
                    release();
                    if (!event.target.hasAttribute('pile')) return;
                    let pile = event.target.pile;
                    startDragging(pile, event);
                }, 300);
            }

            function upEvent() {
                //  _this.refocus(null, null, true);
                if (floatingThumbnail) {
                    stopDragging();
                    return;
                }
                if (!holdingTimeoutId) return;

                release();
                clicked(event);
            }

            function floatingThumbnailAnimation() {
                if (!floatingThumbnail)
                    return;

                floatingThumbnail.width = floatingThumbnail.width * (1 - _this.animationSpeed) + nextWidth * _this.animationSpeed;
                floatingThumbnail.height = floatingThumbnail.height * (1 - _this.animationSpeed) + nextHeight * _this.animationSpeed;

            }

            let heightHandlerFlag: boolean = false;
            function isInsideHeightHandler(event: any) {
                let y = event.clientY - _this.container.getBoundingClientRect().top;
                return y > 0 && y < _this.heightHandlerOffset;
            }


            function heightHandlerMove(event: any) {

                if (isInsideHeightHandler(event) || heightHandlerFlag) {
                    _this.container.style.borderTop = _this.heightHandlerOffset + 'px solid white';
                    if (heightHandlerFlag) {
                        let h = _this.container.getBoundingClientRect().height - (event.clientY - _this.container.getBoundingClientRect().top);
                        // _this.container.style.height = h + 'px';
                      //  _this.container.parentNode.style.height = h + 'px';
                      let parent:any = _this.container.parentNode;
                      parent.style.height = h + 'px';
                        _this.refresh();
                    }
                }
                else
                    _this.container.style.borderTop = null;
            }

            function heightHandlerClick(event: any) {

                //  if ()
                heightHandlerFlag = isInsideHeightHandler(event);
            }

            function heightHandlerRelease() {
                heightHandlerFlag = false;
            }

            this.renderLoopList.push(floatingThumbnailAnimation);

            document.addEventListener('keyup', function (event) {
                if (!event.shiftKey && _this.peeker)
                    _this.peeker.hide();
            });

            this.container.addEventListener('mousemove', peekerEvent);
            this.container.addEventListener('touchstart', downEvent);

            document.addEventListener('mousemove', movingEvent);

            document.addEventListener('mousedown', downEvent);
            document.addEventListener('mouseup', upEvent);

            document.addEventListener('mousemove', heightHandlerMove);
            document.addEventListener('mousedown', heightHandlerClick);
            document.addEventListener('mouseup', heightHandlerRelease);
        }
    }

}