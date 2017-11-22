var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PileBar;
(function (PileBar) {
    var Entity2D = (function () {
        function Entity2D(x, y, width, height) {
            this._x = 0;
            this._y = 0;
            this._width = 0;
            this._height = 0;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Object.defineProperty(Entity2D.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (val) {
                this._x = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity2D.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (val) {
                this._y = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity2D.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (val) {
                this._width = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity2D.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (val) {
                this._height = val;
            },
            enumerable: true,
            configurable: true
        });
        return Entity2D;
    }());
    PileBar.Entity2D = Entity2D;
})(PileBar || (PileBar = {}));
var PileBar;
(function (PileBar) {
    var Entity2DWithDiv = (function () {
        function Entity2DWithDiv(x, y, width, height, parent) {
            this._element = document.createElement('div');
            this.element.style.position = 'absolute';
            this.element.style.boxSizing = 'border-box';
            this._parent = parent;
            this.parent.appendChild(this.element);
            this.element.classList.add('obj-2d-with-div');
            this.width = width;
            this.height = height;
            this.x = x;
            this.y = y;
        }
        Object.defineProperty(Entity2DWithDiv.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity2DWithDiv.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (val) {
                this._x = val;
                this.element.style.left = (val - this.width * 0.5) + 'px';
                this.element.setAttribute('data-x', val + '');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity2DWithDiv.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (val) {
                this._y = val;
                this.element.style.top = (val - this.height * 0.5) + 'px';
                this.element.setAttribute('data-y', val + '');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity2DWithDiv.prototype, "z", {
            get: function () {
                return this._z;
            },
            set: function (val) {
                this._z = val;
                this.element.style.zIndex = val + '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity2DWithDiv.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (val) {
                this._width = val;
                this.element.style.width = val + 'px';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity2DWithDiv.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (val) {
                this._height = val;
                this.element.style.height = val + 'px';
            },
            enumerable: true,
            configurable: true
        });
        Entity2DWithDiv.prototype.die = function () {
            this.hide();
            this.element.style.display = 'none';
            var parent = this.element.parentElement;
            if (parent)
                parent.removeChild(this.element);
        };
        Entity2DWithDiv.prototype.hide = function () {
            this.element.style.display = 'none';
        };
        Entity2DWithDiv.prototype.show = function () {
            this.element.style.display = null;
        };
        Object.defineProperty(Entity2DWithDiv.prototype, "classList", {
            get: function () {
                return this.element.classList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity2DWithDiv.prototype, "element", {
            get: function () {
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        return Entity2DWithDiv;
    }());
    PileBar.Entity2DWithDiv = Entity2DWithDiv;
})(PileBar || (PileBar = {}));
var PileBar;
(function (PileBar) {
    var Layout = (function () {
        function Layout(parent, distance) {
            this.lookingDirection = false;
            this.maxVisibleThumbnails = 3;
            this._parent = parent;
            this._distance = distance;
        }
        Object.defineProperty(Layout.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (parent) {
                this._parent = parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Layout.prototype, "focusSlot", {
            get: function () {
                return this._focusSlot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Layout.prototype, "slots", {
            get: function () {
                return this._slots;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Layout.prototype, "distance", {
            get: function () {
                return this._distance;
            },
            enumerable: true,
            configurable: true
        });
        Layout.prototype.sortSlots = function () {
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                var p = [];
                var s = [];
                for (var j_1 = 0; j_1 < column.length; j_1++) {
                    var slot = column[j_1];
                    p.push(slot.y);
                    s.push(slot);
                    slot.incoming.avg = slot.incoming.n == 0 ? (slot.y + slot.height / 2) : (slot.incoming.sum / slot.incoming.n);
                }
                s.sort(function (a, b) {
                    return a.incoming.avg - b.incoming.avg;
                });
                p.sort(function (a, b) {
                    return a - b;
                });
                for (var j = 0; j < s.length; j++) {
                    s[j].y = p[j];
                }
            }
        };
        Layout.prototype.buildSlots = function (columnDefinitions, scale, scaledDistance) {
            var slots = new Array();
            var columns = new Array();
            var x = -scaledDistance;
            var index = 0;
            for (var i = 0; i < columnDefinitions.length; i++) {
                var w = columnDefinitions[i].width * scale;
                var h = w * (1 / this.parent.aspectRatio);
                var y = this.parent.height - h * 0.5;
                x += w * 0.5;
                var c = new Array();
                for (var j = 0; j < columnDefinitions[i].number; j++) {
                    var s = new PileBar.Slot(x + scaledDistance, y - scaledDistance, w - scaledDistance * 2, h - scaledDistance * 2, columnDefinitions[i].k, index++);
                    slots.push(s);
                    c.push(s);
                    y -= h;
                }
                x += w * 0.5;
                columns.push(c);
            }
            this._focusSlot = columns[parseInt((columns.length / 2).toString())][0];
            for (var i = 0; i < slots.length; i++)
                slots[i].isLeft = slots[i].index - this._focusSlot.index <= 0;
            this._slots = slots;
            this.columns = columns;
        };
        return Layout;
    }());
    PileBar.Layout = Layout;
    var ColumnDefinition = (function () {
        function ColumnDefinition() {
        }
        ColumnDefinition.create = function (number, k) {
            var c = new ColumnDefinition();
            c.number = number;
            c.k = k;
            return c;
        };
        return ColumnDefinition;
    }());
    PileBar.ColumnDefinition = ColumnDefinition;
    var ScalingLayout = (function (_super) {
        __extends(ScalingLayout, _super);
        function ScalingLayout(parent, columns, distance, ignoreRefresh) {
            var _this = _super.call(this, parent, distance) || this;
            _this.columnDefs = columns;
            if (!ignoreRefresh)
                _this.refresh();
            return _this;
        }
        ScalingLayout.prototype.refresh = function () {
            var tmp = new Array(this.columnDefs.length * 2 - 1);
            var totWidth = 0;
            for (var i = 0; i < this.columnDefs.length; i++) {
                totWidth += (this.columnDefs[i].width) * (i > 0 ? 2 : 1);
                tmp[this.columnDefs.length - 1 + i] = this.columnDefs[i];
                tmp[this.columnDefs.length - 1 - i] = this.columnDefs[i];
            }
            var scale = this.parent.width / totWidth;
            var ds = scale * (this.distance / totWidth);
            this.buildSlots(tmp, scale, ds);
        };
        ScalingLayout.buildDemo = function (parent) {
            var col = new Array();
            var w = 30;
            for (var i = -1; i <= 5; i++) {
                var c = new ColumnDefinition();
                c.number = (i <= 0 ? 1 : i);
                c.width = w;
                c.k = i <= 0 ? -1 : i;
                col.push(c);
                w *= 0.75;
                w = w * 1.0;
            }
            col[1].k = 0;
            return new ScalingLayout(parent, col, 50);
        };
        return ScalingLayout;
    }(Layout));
    PileBar.ScalingLayout = ScalingLayout;
    var ResponsiveColumnDefinition = (function (_super) {
        __extends(ResponsiveColumnDefinition, _super);
        function ResponsiveColumnDefinition() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ResponsiveColumnDefinition;
    }(ColumnDefinition));
    PileBar.ResponsiveColumnDefinition = ResponsiveColumnDefinition;
    var ResponsiveLayout = (function (_super) {
        __extends(ResponsiveLayout, _super);
        function ResponsiveLayout(parent, columns, distance) {
            var _this = _super.call(this, parent, [], distance, true) || this;
            _this.responsiveColumnDefs = columns;
            return _this;
        }
        ResponsiveLayout.prototype.refresh = function () {
            this.columnDefs = [];
            for (var i = 0; i < this.responsiveColumnDefs.length; i++) {
                var r = this.responsiveColumnDefs[i];
                if ((!r.minWidth || this.parent.width >= r.minWidth) && (!r.maxWidth || this.parent.width <= r.maxWidth))
                    this.columnDefs.push(this.responsiveColumnDefs[i]);
            }
            _super.prototype.refresh.call(this);
        };
        ResponsiveLayout.buildDemo = function (parent) {
            var col = new Array();
            var w = 30;
            for (var i = -1; i <= 5; i++) {
                var c = new ResponsiveColumnDefinition();
                c.number = (i <= 0 ? 1 : i);
                c.width = w;
                c.k = i <= 0 ? -1 : i;
                col.push(c);
                w *= 0.75;
                w = w * 1.0;
            }
            function clone(def) {
                var d = new ResponsiveColumnDefinition();
                d.number = def.number;
                d.width = def.width;
                d.k = def.k;
                return d;
            }
            var tmp;
            col[1].k = 0;
            for (var i = 2; i < 7; i++)
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
        };
        return ResponsiveLayout;
    }(ScalingLayout));
    PileBar.ResponsiveLayout = ResponsiveLayout;
    var SuperAwesomeLayout = (function (_super) {
        __extends(SuperAwesomeLayout, _super);
        function SuperAwesomeLayout(parent, definitions, distance) {
            var _this = _super.call(this, parent, distance) || this;
            _this.lookingDirection = false;
            _this.maxVisibleThumbnails = 3;
            _this.definitions = definitions;
            return _this;
        }
        SuperAwesomeLayout.prototype.refresh = function () {
            var tmp = new Array(this.definitions.length * 2 - 1);
            ;
            var focusW = this.parent.aspectRatio * this.parent.height;
            var remainingWidth = this.parent.width / 2 - focusW * 0.5;
            var focusS = ColumnDefinition.create(1, -1);
            focusS.width = focusW;
            tmp[this.definitions.length] = focusS;
            var wSum = focusS.width;
            for (var i = 0; i < this.definitions.length; i++) {
                var colDef = ColumnDefinition.create(this.definitions[i].number, this.definitions[i].k);
                colDef.width = this.parent.aspectRatio * (this.parent.height / colDef.number);
                remainingWidth -= colDef.width;
                tmp[this.definitions.length + i + 1] = colDef;
                tmp[this.definitions.length - i - 1] = colDef;
                wSum += colDef.width * 2;
                if (remainingWidth <= 0)
                    break;
            }
            var tmp2 = [];
            for (var i = 0; i < tmp.length; i++)
                if (tmp[i])
                    tmp2.push(tmp[i]);
            this.buildSlots(tmp2, this.parent.width / wSum, this.distance);
        };
        SuperAwesomeLayout.buildDemo = function (parent) {
            var col = new Array();
            col.push(ColumnDefinition.create(2, 0));
            col.push(ColumnDefinition.create(2, 2));
            col.push(ColumnDefinition.create(3, 2));
            col.push(ColumnDefinition.create(3, 2));
            col.push(ColumnDefinition.create(4, 3));
            col.push(ColumnDefinition.create(4, 3));
            col.push(ColumnDefinition.create(8, 3));
            col.push(ColumnDefinition.create(8, 3));
            return new SuperAwesomeLayout(parent, col, 2);
        };
        return SuperAwesomeLayout;
    }(Layout));
    PileBar.SuperAwesomeLayout = SuperAwesomeLayout;
})(PileBar || (PileBar = {}));
var PileBar;
(function (PileBar) {
    var Peeker = (function (_super) {
        __extends(Peeker, _super);
        function Peeker(width, height, y, pileBar) {
            var _this = _super.call(this, 0, y, width, height, pileBar.container) || this;
            _this.hide();
            _this.pileBar = pileBar;
            _this.thumbnailHeight = height;
            _this.element.style.position = 'absolute';
            _this.element.style.zIndex = '10000';
            _this.element.classList.add('peeker');
            _this.tDiv = document.createElement('div');
            _this.tDiv.style.backgroundRepeat = 'no-repeat';
            _this.tDiv.style.backgroundPosition = 'center';
            _this.tDiv.style.backgroundSize = "100% 100%";
            _this.tDiv.style.width = '100%';
            _this.tDiv.style.height = height + 'px';
            _this.tDiv.classList.add('peeker-thumbnail');
            _this.element.appendChild(_this.tDiv);
            _this.fDiv = document.createElement('div');
            _this.fDiv.style.backgroundImage = '-webkit-linear-gradient(white, #F6FAB1)';
            _this.fDiv.style.position = 'absolute';
            _this.fDiv.style.opacity = '0.5';
            _this.fDiv.style.width = '100%';
            _this.fDiv.style.pointerEvents = 'none';
            _this.fDiv.classList.add('peeker-fade');
            _this.element.appendChild(_this.fDiv);
            if (PileBar.Utils.browser.isFirefox) {
                var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '0');
                svg.setAttribute('height', '0');
                var cp = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
                cp.setAttribute('id', 'peekerCP');
                _this.fDiv.style.clipPath = 'url(#peekerCP)';
                _this.polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                svg.appendChild(cp);
                cp.appendChild(_this.polygon);
                _this.element.appendChild(svg);
            }
            return _this;
        }
        Peeker.prototype.redraw = function (width, height, y) {
            this.y = y;
            this.width = width;
            this.height = height;
        };
        Peeker.prototype.peekAt = function (pile, tIndex) {
            this.thumbnail = pile.getThumbnailAt(tIndex);
            this.tDiv.style.backgroundImage = 'url(' + this.thumbnail.url + '), url(' + PileBar.Pile.LOADING_URL + ')';
            var position = pile.getThumbnailPositionAt(tIndex);
            var size = pile.getThumbnailSize();
            var h = (position.y - size.height * 0.5) - (this.y + this.height * 0.5) + (pile.height - size.height) + 1;
            var d = Math.abs(this.width - size.width) * 0.5;
            var px = PileBar.Utils.browser.isFirefox ? '' : 'px ';
            var points = 0 + px + 0 + px + ',' + this.width + px + '0' + px + ',' + (this.width - d) + px + h + px + ',' + d + px + h + px;
            if (PileBar.Utils.browser.isFirefox)
                this.polygon.setAttribute('points', points);
            else
                this.fDiv.style['webkitClipPath'] = 'polygon(' + points + ')';
            this.fDiv.style.height = Math.abs(h) + 'px';
            this.x = position.x;
            this.show();
        };
        return Peeker;
    }(PileBar.Entity2DWithDiv));
    PileBar.Peeker = Peeker;
})(PileBar || (PileBar = {}));
var PileBar;
(function (PileBar) {
    var PileDestination = (function (_super) {
        __extends(PileDestination, _super);
        function PileDestination() {
            return _super.call(this, 0, 0, 0, 0) || this;
        }
        return PileDestination;
    }(PileBar.Entity2D));
    PileBar.PileDestination = PileDestination;
    var Pile = (function (_super) {
        __extends(Pile, _super);
        function Pile(x, y, width, height, pileBar, thumbnails) {
            var _this = _super.call(this, x, y, width, height, pileBar.container) || this;
            _this.r = 1;
            _this.hide();
            _this._thumbnails = thumbnails;
            _this.pileBar = pileBar;
            _this.destination = null;
            _this.redraw();
            _this.element.setAttribute('pile', '');
            _this.element.classList.add('pile');
            _this.element.pile = _this;
            return _this;
        }
        Pile.createFromSlot = function (slot, pileBar) {
            var pile = new Pile(slot.x, slot.y, slot.width, slot.height, pileBar, slot.thumbnails);
            pile.r = slot.r;
            pile.isLeft = slot.isLeft;
            pile.redraw();
            return pile;
        };
        Object.defineProperty(Pile.prototype, "thumbnails", {
            get: function () {
                return this._thumbnails;
            },
            set: function (thumbnails) {
                this._thumbnails = thumbnails;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Pile.prototype, "isLeft", {
            get: function () {
                return this._isLeft;
            },
            set: function (val) {
                this._isLeft = val;
            },
            enumerable: true,
            configurable: true
        });
        Pile.prototype.redraw = function () {
            this.element.style.backgroundRepeat = 'no-repeat';
            var t = this.getTopThumbnail();
            this.z = (this.isLeft ? t.index : -t.index) + this.pileBar.thumbnails.length;
            var flag = this.isLeft !== this.pileBar.layout.lookingDirection;
            if (this.thumbnails.length > this.pileBar.layout.maxVisibleThumbnails) {
                if (t.hidden)
                    t = this.getThumbnailAt(1);
                this.element.style.backgroundColor = 'rgba(0,0,0,0)';
                var zebraUrl = flag ? Pile.ZEBRA_LEFT_URL : Pile.ZEBRA_RIGHT_URL;
                this.element.style.backgroundImage = 'url(' + t.url + '), url(' + Pile.LOADING_URL + '), url(' + zebraUrl + ')';
                var rp = this.r * 100;
                this.element.style.backgroundSize = rp + '% ' + rp + '%, ' + rp + '% ' + rp + '%, ' + 2 * rp + '% ' + 2 * rp + '%';
                if (flag)
                    this.element.style.backgroundPosition = '100% 100%, 100% 100%, ' + (rp < 50 ? '100% 100% ' : '0 0');
                else
                    this.element.style.backgroundPosition = '0 100% , 0 100%,' + (rp < 50 ? '0 100% ' : '100% 0');
                return;
            }
            else if (this.thumbnails.length === 1) {
                this.element.style.backgroundColor = null;
                this.element.style.backgroundPosition = null;
                this.element.style.backgroundSize = '100% 100%';
                this.element.style.backgroundImage = 'url(' + (!t.hidden ? t.url : '') + '),url(' + (!t.hidden ? Pile.LOADING_URL : '') + ')';
                return;
            }
            flag = this.isLeft == this.pileBar.layout.lookingDirection;
            var img = '';
            var position = '';
            this.element.style.backgroundColor = null;
            this.element.style.backgroundSize = (this.r * this.width) + 'px ' + (this.r * this.height) + 'px ';
            var k = this.thumbnails.length <= 1 ? 1 : (1 - this.r) / (this.thumbnails.length - 1);
            var kw = k * this.width;
            var kh = k * this.height;
            var x = flag ? 0 : (1 - this.r) * this.width;
            var y = ((1 - this.r) * this.height);
            var op = flag ? 1 : -1;
            var sep = '';
            for (var i = 0; i < this.thumbnails.length; i++) {
                var t_1 = this.getThumbnailAt(i);
                img += sep + 'url(' + (!t_1.hidden ? t_1.url : '') + '), url(' + (!t_1.hidden ? Pile.LOADING_URL : '') + ')';
                position += sep + x + 'px ' + y + 'px ,' + x + 'px ' + y + 'px ';
                x += op * kw;
                y -= kh;
                sep = ',';
            }
            this.element.style.backgroundImage = img;
            this.element.style.backgroundPosition = position;
        };
        Pile.prototype.isLookingLeft = function () {
            return this.isLeft == this.pileBar.layout.lookingDirection;
        };
        Pile.prototype.getTopThumbnail = function () {
            return this.isLeft ? this._thumbnails[this._thumbnails.length - 1] : this._thumbnails[0];
        };
        Pile.prototype.getBottomThumbnail = function () {
            return !this.isLeft ? this._thumbnails[this._thumbnails.length - 1] : this._thumbnails[0];
        };
        Pile.prototype.getThumbnailAt = function (index) {
            return (this.isLeft) ? this._thumbnails[this._thumbnails.length - 1 - index] : this._thumbnails[index];
        };
        Pile.prototype.getThumbnailSize = function () {
            return { width: this.r * this.width, height: this.r * this.height };
        };
        Pile.prototype.getThumbnailIndexAtRelativePosition = function (x, y) {
            var index;
            var size = this.getThumbnailSize();
            if (this.thumbnails.length == 1) {
                index = 0;
            }
            else {
                var offset = {
                    x: x, y: y
                };
                if (this.isLookingLeft() && offset.x < size.width)
                    offset.x = size.width - 1;
                else if (!this.isLookingLeft() && offset.x > (this.width * (1 - this.r)))
                    offset.x = (this.width * (1 - this.r)) + 1;
                if (y >= (1 - this.r) * this.height)
                    offset.y = (1 - this.r) * this.height + 1;
                var d = [this.width, this.height];
                var p = [offset.x, this.height - offset.y];
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
        };
        Pile.prototype.getThumbnailPositionAt = function (index) {
            var position = {
                x: this.x, y: this.y
            };
            if (this.thumbnails.length == 1)
                return position;
            var q = this.r < 1 ? (1 - this.r) / (this.thumbnails.length - 1) : 0;
            position.y = this.y - 0.5 * this.height * (1 - this.r);
            position.y -= q * this.height * index;
            if (!this.isLookingLeft()) {
                position.x = this.x + 0.5 * this.width * (1 - this.r);
                position.x -= q * this.width * index;
            }
            else {
                position.x = this.x - 0.5 * this.width * (1 - this.r);
                position.x += q * this.width * index;
            }
            return position;
        };
        Pile.prototype.animate = function () {
            if (!this.destination)
                return;
            var slot = this.destination.slot;
            var speed = this.pileBar.animationSpeed;
            this.x = this.x * (1 - speed) + this.destination.x * speed;
            this.y = this.y * (1 - speed) + this.destination.y * speed;
            var w = this.width * (1 - speed) + this.destination.width * speed;
            var h = this.height * (1 - speed) + this.destination.height * speed;
            var r = this.r * (1 - speed) + this.destination.r * speed;
            this.width = w;
            this.height = h;
            this.r = r;
            this.redraw();
        };
        Pile.prototype.onClick = function (event) {
            this.element.addEventListener('mousedown', event);
            this.element.addEventListener('touchstart', event);
        };
        Pile.prototype.toString = function () {
            var s = '[ ';
            for (var i = 0; i < this.thumbnails.length; i++)
                s += this.getThumbnailAt(i).index + ' ';
            s += ']';
            return s;
        };
        Pile.ZEBRA_LEFT_URL = './pilebar/build/assets/img/zebra-left.png';
        Pile.ZEBRA_RIGHT_URL = './pilebar/build/assets/img/zebra-right.png';
        Pile.LOADING_URL = './pilebar/build/assets/img/loading.jpg';
        return Pile;
    }(PileBar.Entity2DWithDiv));
    PileBar.Pile = Pile;
})(PileBar || (PileBar = {}));
var PileBar;
(function (PileBar_1) {
    var PileBar = (function () {
        function PileBar(thumbnails, container, layout, params) {
            this.aspectRatio = 3 / 2;
            this.piles = [];
            this.R_CONST = 0.06;
            this.R_LIMIT = 0.8;
            this.animationPaused = true;
            this.animationSpeed = 0.11;
            this.requestAnimationFrameId = undefined;
            this.heightHandlerOffset = 8;
            this.renderLoopList = [];
            var c = document.createElement('div');
            c.style.width = '100%';
            c.style.height = '100%';
            c.style.position = 'absolute';
            c.style.marginTop = '5px';
            container.appendChild(c);
            this._container = c;
            this._thumbnails = thumbnails;
            if (!layout)
                this.layout = PileBar_1.ScalingLayout.buildDemo(this);
            this.resetClusterNorm();
            this.init();
        }
        PileBar.prototype.init = function () {
            console.log('initializing PileBar');
            var me = this;
            this.refresh(true);
            window.addEventListener('resize', function (e) {
                console.log('refreshing layout');
                me.refresh();
            });
            this.initAnimation();
            this.initEvents();
            this.initRenderLoop();
        };
        PileBar.prototype.resetClusterNorm = function () {
            this.CLUSTER_NORM = Math.log(this.thumbnails[this.thumbnails.length - 1].sem / (this.thumbnails.length)) / Math.log(2);
        };
        Object.defineProperty(PileBar.prototype, "container", {
            get: function () {
                return this._container;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PileBar.prototype, "layout", {
            get: function () {
                return this._layout;
            },
            set: function (layout) {
                layout.parent = this;
                this._layout = layout;
                this.refresh(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PileBar.prototype, "thumbnails", {
            get: function () {
                return this._thumbnails;
            },
            set: function (thumbnails) {
                this._thumbnails = thumbnails;
                this.resetClusterNorm();
                for (var i = 0; i < this.slots.length; i++)
                    this.slots[i].thumbnails = [];
                for (var i = 0; i < this.piles.length; i++)
                    this.piles[i].die();
                this.piles = [];
                this.refresh(true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PileBar.prototype, "height", {
            get: function () {
                return this._container.getBoundingClientRect().height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PileBar.prototype, "width", {
            get: function () {
                return this._container.getBoundingClientRect().width;
            },
            enumerable: true,
            configurable: true
        });
        PileBar.prototype.refresh = function (reset) {
            this.dispatchEvent('refresh_start');
            this.stopAnimation();
            var t = this.getFocusT();
            var _this = this;
            function callback() {
                _this.layout.refresh();
                _this.getFocusS().thumbnails = _this.thumbnails;
                if (_this.piles.length == 0) {
                    var p = PileBar_1.Pile.createFromSlot(_this.getFocusS(), _this);
                    _this.piles.push(p);
                    p.show();
                }
                ;
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
            var m = new Image();
            m.onload = function (event) {
                _this.aspectRatio = m.width / m.height;
                callback();
                console.log('new aspectRatio', _this.aspectRatio);
            };
            m.src = this.thumbnails[0].url;
        };
        Object.defineProperty(PileBar.prototype, "slots", {
            get: function () {
                return this.layout.slots;
            },
            enumerable: true,
            configurable: true
        });
        PileBar.prototype.getFocusS = function () {
            return this.layout.focusSlot;
        };
        PileBar.prototype.getFocusT = function () {
            return !this.layout.focusSlot ? null : this.layout.focusSlot.thumbnails[0];
        };
        PileBar.prototype.setFocus = function (index) {
            this.refocus(index);
        };
        PileBar.prototype.setFocusByProperty = function (name, value) {
            for (var i = 0; i < this.thumbnails.length; i++)
                if (this.thumbnails[i][name] == value) {
                    this.refocus(this.thumbnails[i].index);
                    break;
                }
        };
        PileBar.prototype.cluster = function (sem, k) {
            return k == -1 ? sem : (sem >> this.CLUSTER_NORM + k);
        };
        PileBar.prototype.refocus = function (tIndex, sIndex, force) {
            tIndex = (tIndex === undefined || tIndex === null) ? this.getFocusT().index : tIndex;
            sIndex = (sIndex === undefined || sIndex === null) ? this.getFocusS().index : sIndex;
            if (tIndex == this.thumbnails[0].index &&
                sIndex > this.getFocusS().index ||
                tIndex == this.thumbnails[this.thumbnails.length - 1].index &&
                    sIndex < this.getFocusS().index)
                sIndex = this.getFocusS().index;
            if (!force && tIndex == this.lastRefocusThumbnailIndex && sIndex == this.lastRefocusSlotIndex)
                return false;
            this.stopAnimation();
            var now = performance.now();
            for (var i = 0; i < this.slots.length; i++)
                this.slots[i].thumbnails = [];
            for (var s = -1; s <= 1; s += 2) {
                var i = tIndex, j = sIndex;
                var cLast = this.cluster(this.thumbnails[tIndex].sem, this.slots[sIndex].k);
                while (i >= 0 && i < this.thumbnails.length) {
                    var cNow = this.cluster(this.thumbnails[i].sem, this.slots[j].k);
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
            var oldPiles = this.piles;
            var newPiles = new Array();
            this.piles = [];
            for (var i = 0; i < this.slots.length; i++) {
                var slot = this.slots[i];
                slot.r = this.calcR(slot.thumbnails.length);
                slot.incoming.reset();
            }
            for (var i = 0; i < oldPiles.length; i++) {
                var p = oldPiles[i];
                var r = this.calcR(p.thumbnails.length);
                var q = p.thumbnails.length == 1 ? 0 : ((1 - r) / (p.thumbnails.length - 1));
                var tmp = [];
                p.destination = undefined;
                for (var j = 0; j < p.thumbnails.length; j++) {
                    var t = p.thumbnails[j];
                    tmp.push(t);
                    var nextSlot = t.nextSlot;
                    if (j + 1 >= p.thumbnails.length || nextSlot.index != p.thumbnails[j + 1].nextSlot.index) {
                        var position = { x: p.x, y: p.y };
                        var size = { width: p.width, height: p.height };
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
                        var pile = new PileBar_1.Pile(position.x, position.y, size.width, size.height, this, tmp);
                        pile.r = r;
                        pile.isLeft = nextSlot.isLeft;
                        pile.redraw();
                        pile.show();
                        nextSlot.incoming.count += tmp.length;
                        nextSlot.incoming.piles.push(pile);
                        pile.destination = new PileBar_1.PileDestination();
                        pile.destination.slot = nextSlot;
                        newPiles.push(pile);
                        pile.destination.slot.incoming.sum += (pile.y + pile.height);
                        pile.destination.slot.incoming.n++;
                        tmp = [];
                    }
                }
            }
            this.layout.sortSlots();
            this.calcDestinations();
            for (var i = 0; i < oldPiles.length; i++) {
                oldPiles[i].die();
            }
            this.piles = newPiles;
            this.startAnimation();
            this.dispatchEvent('refocus_start', { index: tIndex, lastIndex: this.lastRefocusThumbnailIndex });
            this.lastRefocusThumbnailIndex = tIndex;
            this.lastRefocusSlotIndex = sIndex;
        };
        PileBar.prototype.dispatchEvent = function (event, detail) {
            this.container.dispatchEvent(new CustomEvent(event, { detail: detail }));
        };
        PileBar.prototype.addEventListener = function (event, callback) {
            this.container.addEventListener(event, callback);
        };
        PileBar.prototype.skip = function (i) {
            if (i < 0 && this.getFocusT().index + i >= 0)
                this.refocus(this.getFocusT().index + i, this.getFocusS().index);
            else if (i >= 0 && this.getFocusT().index + i < this.thumbnails.length)
                this.refocus(this.getFocusT().index + i, this.getFocusS().index);
        };
        PileBar.prototype.toggleSEM = function () {
        };
        PileBar.prototype.printStatus = function () {
            var c = 0, d = 0;
            var list = [];
            for (var i = 0; i < arguments.length; i++)
                list.push(arguments[i]);
            for (var i = 0; i < this.slots.length; i++) {
                var slot = this.slots[i];
                if (list.length > 0 && list.indexOf(slot.index) == -1)
                    continue;
                var s = slot.index + ': [ ';
                for (var j = 0; j < slot.thumbnails.length; j++)
                    s += slot.thumbnails[j].index + ' ';
                s += ']';
                console.log(s);
                c += slot.thumbnails.length;
            }
            for (var i = 0; i < this.piles.length; i++)
                d += this.piles[i].thumbnails.length;
            if (list.length == 0)
                console.log('Tot. Thumbnails:' + this.thumbnails.length, ' Tot. Thumbnails in slots: ' + c, ' Tot. Thumbnails in piles: ' + d);
        };
        PileBar.prototype.printPiles = function () {
            for (var i = 0; i < this.piles.length; i++) {
                var pile = this.piles[i];
                var str = '[';
                for (var j = 0; j < pile.thumbnails.length; j++)
                    str += pile.thumbnails[j].index + ' ';
                str += ']';
                console.log(str);
            }
        };
        PileBar.prototype.calcR = function (n) {
            var r = (n == 0 ? 1 : (1 - this.R_CONST * PileBar_1.Utils.log2(n)));
            return r <= this.R_LIMIT ? this.R_LIMIT : r;
        };
        PileBar.prototype.startAnimation = function () {
            this.animationPaused = false;
        };
        PileBar.prototype.stopAnimation = function () {
            this.animationPaused = true;
        };
        PileBar.prototype.toggleAnimation = function () {
            this.animationPaused = !this.animationPaused;
        };
        PileBar.prototype.initAnimation = function () {
            console.log('initializing animation');
            var _this = this;
            var END_OFFSET = 0.001;
            function animate(time) {
                var sum = 0;
                var count = 0;
                for (var i = 0; i < _this.piles.length && !_this.animationPaused; i++) {
                    var now = performance.now();
                    var pile = _this.piles[i];
                    if (!pile.destination)
                        continue;
                    pile.animate();
                    if (pile.destination.slot.index == _this.getFocusS().index) {
                        var currentDistance = Math.sqrt(Math.pow(pile.destination.slot.x - pile.x, 2) + Math.pow(pile.destination.slot.x - pile.x, 2));
                        _this.dispatchEvent('refocus_notify', { percent: 100 - Math.floor((currentDistance / pile.destination.distance) * 100) });
                    }
                    sum += ((performance.now() - now));
                    count++;
                    if (Math.abs(pile.x - pile.destination.x) <= END_OFFSET &&
                        Math.abs(pile.y - pile.destination.y) <= END_OFFSET &&
                        Math.abs(pile.width - pile.destination.width) <= END_OFFSET &&
                        Math.abs(pile.height - pile.destination.height) <= END_OFFSET) {
                        var slot = pile.destination.slot;
                        pile.destination = null;
                        slot.incoming.arrivedPiles.push(pile);
                        if (slot.index == _this.getFocusS().index)
                            _this.dispatchEvent('refocus_done', { index: pile.getTopThumbnail().index });
                        if (slot.incoming.arrivedPiles.length == slot.incoming.piles.length) {
                            slot.incoming.arrivedPiles = slot.incoming.arrivedPiles.sort(function (a, b) {
                                return a.thumbnails[0].index - b.thumbnails[0].index;
                            });
                            var thumbnails = [];
                            for (var k = 0; k < slot.incoming.arrivedPiles.length; k++) {
                                var p = slot.incoming.arrivedPiles[k];
                                thumbnails = thumbnails.concat(p.thumbnails);
                                p.thumbnails = [];
                                p.die();
                            }
                            slot.thumbnails.sort(function (a, b) {
                                return a.index - b.index;
                            });
                            var np = PileBar_1.Pile.createFromSlot(slot, _this);
                            np.thumbnails = thumbnails;
                            _this.piles.push(np);
                            np.show();
                        }
                    }
                }
            }
            this.startAnimation();
            this.renderLoopList.push(animate);
        };
        PileBar.prototype.initRenderLoop = function () {
            var _this = this;
            function run(time) {
                for (var i = 0; i < _this.renderLoopList.length; i++)
                    _this.renderLoopList[i](time);
                requestAnimationFrame(run);
            }
            run(0);
        };
        PileBar.prototype.calcDestinations = function () {
            for (var i = 0; i < this.slots.length; i++) {
                var slot = this.slots[i];
                if (!slot.isLeft)
                    slot.incoming.piles.sort(function (a, b) {
                        return a.thumbnails[0].index - b.thumbnails[0].index;
                    });
                else
                    slot.incoming.piles.sort(function (a, b) {
                        return b.thumbnails[0].index - a.thumbnails[0].index;
                    });
                var offset = 0;
                for (var j = 0; j < slot.incoming.piles.length; j++) {
                    var pile = slot.incoming.piles[j];
                    pile.destination.slot = slot;
                    pile.destination.x = 0;
                    pile.destination.y = 0;
                    pile.destination.width = 0;
                    pile.destination.height = 0;
                    pile.destination.r = 1;
                    pile.destination.distance = Math.sqrt(Math.pow(slot.x - pile.x, 2) + Math.pow(slot.x - pile.x, 2));
                    var r = pile.destination.r = this.calcR(slot.incoming.count);
                    var q = r < 1 ? (1 - r) / (slot.incoming.count - 1) : 0;
                    if (pile.thumbnails.length == slot.incoming.count) {
                        r = 1;
                        q = 0;
                    }
                    if (pile.thumbnails.length == 1) {
                        pile.destination.width = slot.width * r;
                        pile.destination.height = slot.height * r;
                    }
                    else if (offset > 0 || slot.incoming.count <= this.layout.maxVisibleThumbnails) {
                        var u = q * (pile.thumbnails.length - 1);
                        pile.destination.width = slot.width * Math.max(this.R_LIMIT, r + u);
                        pile.destination.height = slot.height * Math.max(this.R_LIMIT, r + u);
                    }
                    else {
                        pile.destination.width = slot.width;
                        pile.destination.height = slot.height;
                    }
                    if (r < 1)
                        pile.destination.r = (r * slot.width) / pile.destination.width;
                    if (r < this.R_LIMIT && pile.thumbnails.length > this.layout.maxVisibleThumbnails)
                        pile.destination.r = this.R_LIMIT;
                    pile.destination.y = slot.y + 0.5 * (slot.height - pile.destination.height) - q * offset * slot.height;
                    pile.destination.x = slot.x - 0.5 * slot.width + pile.destination.width * 0.5;
                    if (slot.isLeft == this.layout.lookingDirection) {
                        pile.destination.x += q * offset * slot.width;
                    }
                    else {
                        pile.destination.x += q * (slot.incoming.count - offset - pile.thumbnails.length) * slot.width;
                    }
                    if ((pile.destination.x + pile.destination.width) >
                        (slot.x + slot.width))
                        pile.destination.x = -pile.destination.width + slot.x + slot.width;
                    offset += pile.thumbnails.length;
                }
            }
        };
        PileBar.prototype.toggleLookingDirection = function (direction) {
            if (direction !== null && direction !== undefined)
                this.layout.lookingDirection = direction;
            else
                this.layout.lookingDirection = !this.layout.lookingDirection;
            this.refocus(null, null, true);
            return this.layout.lookingDirection;
        };
        PileBar.prototype.rebuildPeeker = function () {
            console.log('Rebuilding Peeker');
            var maxY = 100000;
            for (var i = 0; i < this.slots.length; i++) {
                if (this.slots[i].y < maxY)
                    maxY = this.slots[i].y;
            }
            if (this.peeker)
                this.peeker.die();
            this.peeker = new PileBar_1.Peeker(this.getFocusS().width, this.getFocusS().height, ((maxY - (this.getFocusS().height)) * 1.5), this);
        };
        PileBar.prototype.updateSem = function () {
            for (var i = 0; i < this.thumbnails.length; i++)
                this.thumbnails[i].sem = Math.random() * 10000;
            this.thumbnails.sort(function (a, b) {
                return a.sem - b.sem;
            });
            for (var i = 0; i < this.thumbnails.length; i++)
                this.thumbnails[i].index = i;
            this.refresh(true);
        };
        Object.defineProperty(PileBar.prototype, "testDotDiv", {
            get: function () {
                if (!this._testDotDiv) {
                    this._testDotDiv = new PileBar_1.Entity2DWithDiv(0, 0, 10, 10, this.container);
                    this._testDotDiv.classList.add('test-div');
                }
                return this._testDotDiv;
            },
            enumerable: true,
            configurable: true
        });
        PileBar.prototype.initEvents = function () {
            var _this = this;
            var holdingTimeoutId;
            var floatingThumbnail;
            var nextWidth;
            var nextHeight;
            var nextX;
            var nextY;
            this._container.style['-webkit-touch-callout'] = 'none';
            this._container.style['-webkit-user-select'] = 'none';
            this._container.style['-khtml-user-select'] = 'none';
            this._container.style['-moz-user-select'] = 'none';
            this._container.style['-ms-user-select'] = 'none';
            this._container.style['user-select'] = 'none';
            function clicked(event) {
                if (event.shiftKey) {
                    _this.refocus(_this.peeker.thumbnail.index);
                    _this.peeker.hide();
                    return;
                }
                if (!event.target.hasAttribute('pile'))
                    return;
                var pile = event.target.pile;
                _this.refocus(pile.getTopThumbnail().index, null, true);
            }
            function peekerEvent(event) {
                if (!event.shiftKey || !event.target.classList.contains('pile') || event.offsetX < 0 || event.offsetY < 0) {
                    _this.peeker.hide();
                    return;
                }
                var pile = event.target.pile;
                _this.peeker.peekAt(event.target.pile, pile.getThumbnailIndexAtRelativePosition(event.offsetX, event.offsetY));
                _this.peeker.show();
            }
            function stopDragging() {
                if (!floatingThumbnail)
                    return;
                console.log('Stop Dragging');
                _this.thumbnails[floatingThumbnail.element.getAttribute('t-index')].hidden = false;
                floatingThumbnail.die();
                floatingThumbnail = undefined;
                _this.refresh();
            }
            function startDragging(pile, event) {
                var t = pile.getTopThumbnail();
                if (floatingThumbnail || !t)
                    stopDragging();
                if (!t)
                    return;
                console.log('Dragging');
                t.hidden = true;
                pile.redraw();
                var w = pile.width * pile.r;
                var h = pile.height * pile.r;
                nextWidth = w;
                nextHeight = h;
                floatingThumbnail = new PileBar_1.Pile(event.pageX, event.pageY, w, h, _this, [t]);
                floatingThumbnail.element.style.position = 'fixed';
                floatingThumbnail.classList.add('floating-pile');
                floatingThumbnail.element.style.background = 'url(' + t.url + ')  center/100% no-repeat';
                floatingThumbnail.element.style.zIndex = '2147483646';
                floatingThumbnail.element.setAttribute('t-index', t.index + '');
                floatingThumbnail.show();
            }
            function movingEvent(event) {
                if (!floatingThumbnail) {
                    return;
                }
                floatingThumbnail.x = event.pageX;
                floatingThumbnail.y = event.pageY;
                floatingThumbnail.element.style.zIndex = '2147483646';
                var min = Number.MAX_VALUE;
                var slot;
                for (var i = 0; i < _this.slots.length; i++) {
                    var s = _this.slots[i];
                    var dist = Math.abs((_this.container.getBoundingClientRect().left + s.x) - event.pageX);
                    if (dist > min)
                        continue;
                    min = dist;
                    slot = s;
                }
                nextWidth = slot.width;
                nextHeight = slot.height;
                _this.refocus(Number(floatingThumbnail.element.getAttribute('t-index')), slot.index);
            }
            function release() {
                clearTimeout(holdingTimeoutId);
                stopDragging();
                if (!holdingTimeoutId)
                    return;
                holdingTimeoutId = false;
            }
            function downEvent(event) {
                if (event.button === 2)
                    return;
                release();
                holdingTimeoutId = setTimeout(function () {
                    release();
                    if (!event.target.hasAttribute('pile'))
                        return;
                    var pile = event.target.pile;
                    startDragging(pile, event);
                }, 300);
            }
            function upEvent() {
                if (floatingThumbnail) {
                    stopDragging();
                    return;
                }
                if (!holdingTimeoutId)
                    return;
                release();
                clicked(event);
            }
            function floatingThumbnailAnimation() {
                if (!floatingThumbnail)
                    return;
                floatingThumbnail.width = floatingThumbnail.width * (1 - _this.animationSpeed) + nextWidth * _this.animationSpeed;
                floatingThumbnail.height = floatingThumbnail.height * (1 - _this.animationSpeed) + nextHeight * _this.animationSpeed;
            }
            var heightHandlerFlag = false;
            function isInsideHeightHandler(event) {
                var y = event.clientY - _this.container.getBoundingClientRect().top;
                return y > 0 && y < _this.heightHandlerOffset;
            }
            function heightHandlerMove(event) {
                if (isInsideHeightHandler(event) || heightHandlerFlag) {
                    _this.container.style.borderTop = _this.heightHandlerOffset + 'px solid white';
                    if (heightHandlerFlag) {
                        var h = _this.container.getBoundingClientRect().height - (event.clientY - _this.container.getBoundingClientRect().top);
                        var parent_1 = _this.container.parentNode;
                        parent_1.style.height = h + 'px';
                        _this.refresh();
                    }
                }
                else
                    _this.container.style.borderTop = null;
            }
            function heightHandlerClick(event) {
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
        };
        PileBar.VERSION = 1.0;
        PileBar.DEBUG = false;
        return PileBar;
    }());
    PileBar_1.PileBar = PileBar;
})(PileBar || (PileBar = {}));
var PileBar;
(function (PileBar) {
    var SlotIncominData = (function () {
        function SlotIncominData() {
            this.avg = 0;
            this.reset();
        }
        SlotIncominData.prototype.reset = function () {
            this.count = 0;
            this.piles = [];
            this.arrivedPiles = [];
            this.sum = 0;
            this.n = 0;
            this.avg = 0;
        };
        return SlotIncominData;
    }());
    PileBar.SlotIncominData = SlotIncominData;
    var Slot = (function (_super) {
        __extends(Slot, _super);
        function Slot(x, y, width, height, k, index, isLeft) {
            var _this = _super.call(this, x, y, width, height) || this;
            _this._thumbnails = [];
            _this.incoming = new SlotIncominData();
            _this.k = k;
            _this.index = index;
            _this.isLeft = isLeft;
            return _this;
        }
        Object.defineProperty(Slot.prototype, "thumbnails", {
            get: function () {
                return this._thumbnails;
            },
            set: function (thumbnails) {
                this._thumbnails = thumbnails;
            },
            enumerable: true,
            configurable: true
        });
        Slot.prototype.toString = function () {
            var s = '[ ';
            for (var i = 0; i < this.thumbnails.length; i++)
                s += this.thumbnails[i].index + ' ';
            s += ']';
            return s;
        };
        return Slot;
    }(PileBar.Entity2D));
    PileBar.Slot = Slot;
})(PileBar || (PileBar = {}));
var PileBar;
(function (PileBar) {
    var Thumbnail = (function () {
        function Thumbnail(url, hdUrl, sem, index) {
            this.hidden = false;
            this._url = url;
            this._hdUrl = hdUrl;
            this._sem = sem;
            this._index = index;
        }
        Object.defineProperty(Thumbnail.prototype, "url", {
            get: function () {
                return !PileBar.PileBar.DEBUG ? this._url : 'https://placeholdit.imgix.net/~text?txtsize=33&w=80&h=60&txt=' + this.index;
            },
            set: function (url) {
                this._url = url;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Thumbnail.prototype, "hdUrl", {
            get: function () {
                return !PileBar.PileBar.DEBUG ? this._hdUrl : 'https://placeholdit.imgix.net/~text?txtsize=330&w=800&h=600&txt=' + this.index;
            },
            set: function (hdUrl) {
                this._hdUrl = hdUrl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Thumbnail.prototype, "sem", {
            get: function () {
                return this._sem;
            },
            set: function (sem) {
                this._sem = sem;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Thumbnail.prototype, "index", {
            get: function () {
                return this._index;
            },
            set: function (index) {
                this._index = index;
            },
            enumerable: true,
            configurable: true
        });
        return Thumbnail;
    }());
    PileBar.Thumbnail = Thumbnail;
})(PileBar || (PileBar = {}));
var PileBar;
(function (PileBar) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.readPxi = function (src, callback, base) {
            var request = new XMLHttpRequest();
            base = !base ? '' : base;
            request.open('GET', src, true);
            var read = function () { };
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var data = new DOMParser().parseFromString(request.responseText, "application/xml");
                    var metadata = {
                        sceneName: data.getElementsByTagName('scene')[0].getAttribute('name'),
                        upDirection: Utils.stringToNumberArray(data.getElementsByTagName('scene')[0].getAttribute('updirection'))
                    };
                    var shots = data.getElementsByTagName('shot');
                    var thumbnails = [];
                    for (var i = 0; i < shots.length; i++) {
                        var t = new PileBar.Thumbnail(base + shots[i].getAttribute('thumbnail'), base + shots[i].getAttribute('colormap'), Number(shots[i].getAttribute('sem')), i);
                        thumbnails.push(t);
                    }
                    thumbnails.sort(function (a, b) {
                        return a.sem - b.sem;
                    });
                    for (var i = 0; i < thumbnails.length; i++)
                        thumbnails[i].index = i;
                    if (callback)
                        callback(thumbnails, metadata);
                }
            };
            request.send();
        };
        Utils.log2 = function (x) {
            return Math.log(x) / Math.log(2);
        };
        Utils.stringToNumberArray = function (str) {
            if (str == null)
                return null;
            var tmp = str.trim().split(" ");
            var n = [];
            for (var i = 0; i < tmp.length; i++)
                n[i] = Number(tmp[i]);
            return n;
        };
        Utils.browser = {
            isOpera: navigator.userAgent.indexOf(' OPR/') >= 0,
            isFirefox: navigator.userAgent.indexOf('Firefox') != -1,
            isSafari: Object.prototype.toString.call(HTMLElement).indexOf('Constructor') > 0,
            isChrome: (navigator.appVersion.indexOf('Chrome') != -1 && navigator.vendor.indexOf('Google') != -1),
        };
        return Utils;
    }());
    PileBar.Utils = Utils;
})(PileBar || (PileBar = {}));
//# sourceMappingURL=pilebar.js.map