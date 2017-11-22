
//import {Thumbnail} from './Thumbnail.ts';
module PileBar {
    export abstract class Layout {
        protected _parent: PileBar;
        protected columns: Array<any>;
        protected _slots: Array<Slot>;
        protected _focusSlot: Slot;
        protected _distance: number;
        public lookingDirection: boolean = false;
        public maxVisibleThumbnails: number = 3;
        constructor(parent: PileBar, distance: number) {
            this._parent = parent;
            this._distance = distance;
        }
        public abstract refresh(): void;

        public get parent(): PileBar {
            return this._parent;
        }

        public set parent(parent: PileBar) {
            this._parent = parent;
        }

        public get focusSlot(): Slot {
            return this._focusSlot;
        }

        public get slots() {
            return this._slots;
        }

        public get distance(): number {
            return this._distance;
        }

        public sortSlots() {
            for (let i = 0; i < this.columns.length; i++) {
                let column = this.columns[i];
                let p: Array<any> = [];
                let s: Array<Slot> = [];
                for (let j = 0; j < column.length; j++) {
                    let slot = column[j];
                    p.push(slot.y);
                    s.push(slot);
                    slot.incoming.avg = slot.incoming.n == 0 ? (slot.y + slot.height / 2) : (slot.incoming.sum / slot.incoming.n);
                }
                s.sort(function (a: Slot, b: Slot): number {
                    return a.incoming.avg - b.incoming.avg
                });

                p.sort(function (a, b) {
                    return a - b
                });

                for (var j = 0; j < s.length; j++) {
                    s[j].y = p[j];
                    //  s[j].style.bottom = s[j].position.bottom;
                }
            }
        }

        protected buildSlots(columnDefinitions: Array<ColumnDefinition>, scale: number, scaledDistance: number) {
            let slots = new Array<Slot>();
            let columns = new Array<any>();


            let x: number = -scaledDistance;
            let index = 0;
            for (let i = 0; i < columnDefinitions.length; i++) {
                let w = columnDefinitions[i].width * scale;
                let h = w * (1 / this.parent.aspectRatio);
                let y = this.parent.height - h * 0.5;

                x += w * 0.5;
                let c = new Array<Slot>();
                for (let j = 0; j < columnDefinitions[i].number; j++) {

                    let s = new Slot(x + scaledDistance, y - scaledDistance, w - scaledDistance * 2, h - scaledDistance * 2, columnDefinitions[i].k, index++);
                    slots.push(s);
                    c.push(s);
                    y -= h;
                }

                x += w * 0.5;
                columns.push(c);
            }

            this._focusSlot = columns[parseInt((columns.length / 2).toString())][0];
            for (let i = 0; i < slots.length; i++)
                slots[i].isLeft = slots[i].index - this._focusSlot.index <= 0;

            this._slots = slots;
            this.columns = columns;
        }
    }

    export class ColumnDefinition {
        public k: number;
        public width: number;
        public number: number;

        public static create(number: number, k: number): ColumnDefinition {
            let c = new ColumnDefinition();
            c.number = number;
            c.k = k;
            return c;
            //       this.width = width;
        }
    }

    export class ScalingLayout extends Layout {
        protected columnDefs: Array<ColumnDefinition>;


        constructor(parent: PileBar, columns: Array<ColumnDefinition>, distance: number, ignoreRefresh?: boolean) {
            super(parent, distance);
            this.columnDefs = columns;

            if (!ignoreRefresh)
                this.refresh();
        }


        public refresh() {
            let tmp = new Array<ColumnDefinition>(this.columnDefs.length * 2 - 1);
            let totWidth = 0;
            for (let i = 0; i < this.columnDefs.length; i++) {
                totWidth += (this.columnDefs[i].width) * (i > 0 ? 2 : 1);
                tmp[this.columnDefs.length - 1 + i] = this.columnDefs[i];
                tmp[this.columnDefs.length - 1 - i] = this.columnDefs[i];
            }

            let scale = this.parent.width / totWidth;
            let ds = scale * (this.distance / totWidth);

            this.buildSlots(tmp, scale, ds);

        }

        public static buildDemo(parent: PileBar): ScalingLayout {
            let col = new Array<ColumnDefinition>();
            let w: number = 30;

            for (let i = -1; i <= 5; i++) {
                let c = new ColumnDefinition();
                c.number = (i <= 0 ? 1 : i);
                c.width = w;
                c.k = i <= 0 ? -1 : i;
                col.push(c);
                w *= 0.75;
                w = w * 1.0;

            }
            col[1].k = 0;
            return new ScalingLayout(parent, col, 50);
        }
    }

    export class ResponsiveColumnDefinition extends ColumnDefinition {
        public minWidth: number;
        public maxWidth: number;
    }

    export class ResponsiveLayout extends ScalingLayout {
        private responsiveColumnDefs: Array<ResponsiveColumnDefinition>;
        constructor(parent: PileBar, columns: Array<ResponsiveColumnDefinition>, distance: number) {
            super(parent, [], distance, true);
            this.responsiveColumnDefs = columns;
        }

        public refresh() {
            this.columnDefs = [];
            for (let i = 0; i < this.responsiveColumnDefs.length; i++) {
                let r = this.responsiveColumnDefs[i];
                if ((!r.minWidth || this.parent.width >= r.minWidth) && (!r.maxWidth || this.parent.width <= r.maxWidth))
                    this.columnDefs.push(this.responsiveColumnDefs[i] as ColumnDefinition);
            }
            super.refresh();
        }

        public static buildDemo(parent: PileBar): ResponsiveLayout {
            let col = new Array<ResponsiveColumnDefinition>();
            let w: number = 30;

            for (let i = -1; i <= 5; i++) {
                let c = new ResponsiveColumnDefinition();
                c.number = (i <= 0 ? 1 : i);
                c.width = w;
                c.k = i <= 0 ? -1 : i;
                col.push(c);
                w *= 0.75;
                w = w * 1.0;
            }

            function clone(def: ResponsiveColumnDefinition) {
                let d = new ResponsiveColumnDefinition();
                d.number = def.number;
                d.width = def.width;
                d.k = def.k;
                //          d.minWidth = def.minWidth;
                //        d.maxWidth = def.maxWidth;
                return d;
            }


            let tmp;

            //768, 992 1200
            col[1].k = 0;
            for (let i = 2; i < 7; i++)
                col[i].minWidth = 768;

            tmp = clone(col[2]);
            tmp.number = 2;
            tmp.maxWidth = 768;
            col.push(tmp);

            tmp = clone(col[3]);
            tmp.number = 3;
            tmp.maxWidth = 768;
            col.push(tmp);

            console.log(col);
            return new ResponsiveLayout(parent, col, 50);
        }
    }

    //TODO: must find a more appropiate name for these class!!!
    export class SuperAwesomeLayout extends Layout {
        private definitions: Array<ColumnDefinition>;
        protected _parent: PileBar;
        protected columns: Array<any>;
        protected _slots: Array<Slot>;
        protected _focusSlot: Slot;
        protected _distance: number;
        public lookingDirection: boolean = false;
        public maxVisibleThumbnails: number = 3;
        constructor(parent: PileBar, definitions: Array<ColumnDefinition>, distance: number) {
            super(parent, distance);
            this.definitions = definitions;
            // this.responsiveColumnDefs = columns;
        }

        public refresh() {
            let tmp = new Array<ColumnDefinition>(this.definitions.length * 2 - 1);;
            let focusW = this.parent.aspectRatio * this.parent.height;
            let remainingWidth = this.parent.width / 2 - focusW * 0.5;

            let focusS = ColumnDefinition.create(1, -1);
            focusS.width = focusW;
            tmp[this.definitions.length] = focusS;
            let wSum = focusS.width;
            for (let i = 0; i < this.definitions.length; i++) {
                let colDef = ColumnDefinition.create(this.definitions[i].number, this.definitions[i].k);
                colDef.width = this.parent.aspectRatio * (this.parent.height / colDef.number);

                remainingWidth -= colDef.width;
                tmp[this.definitions.length + i + 1] = colDef;
                tmp[this.definitions.length - i - 1] = colDef;
                
                wSum += colDef.width * 2;
                if(remainingWidth <=0)
                   break;
                
            }

          //  console.log('diff', this.parent.width -  )

            //Fixing indexes
            let tmp2 = [];
            for(let i =0; i<tmp.length; i++)
                if(tmp[i])
                 tmp2.push(tmp[i]);

            this.buildSlots(tmp2, this.parent.width / wSum, this.distance);
        }

        public static buildDemo(parent: PileBar): SuperAwesomeLayout {
            let col = new Array<ColumnDefinition>();

            col.push(ColumnDefinition.create(2, 0));
            col.push(ColumnDefinition.create(2, 2));
            col.push(ColumnDefinition.create(3, 2));
            col.push(ColumnDefinition.create(3, 2));
            col.push(ColumnDefinition.create(4, 3));
            col.push(ColumnDefinition.create(4, 3));
            col.push(ColumnDefinition.create(8, 3));
            col.push(ColumnDefinition.create(8, 3));

            return new SuperAwesomeLayout(parent, col, 2);
        }
    }
}