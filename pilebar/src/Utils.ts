module PileBar {


    export class Utils {
        public static readPxi(src: string, callback: Function, base: string): void {
            let request = new XMLHttpRequest();
            base = !base ? '' : base;
            request.open('GET', src, true); //async;
            let read = function () { };

            request.onreadystatechange = function () {


                if (request.readyState == 4 && request.status == 200) {
                    let data = new DOMParser().parseFromString(request.responseText, "application/xml");
                  
                    let metadata: any = {
                        sceneName: data.getElementsByTagName('scene')[0].getAttribute('name'),
                        upDirection: Utils.stringToNumberArray(data.getElementsByTagName('scene')[0].getAttribute('updirection'))
                    };

                    let shots = data.getElementsByTagName('shot');
                    let thumbnails: Array<Thumbnail> = [];
                    for (let i = 0; i < shots.length; i++) {
                        
                        let t = new Thumbnail(
                            base + shots[i].getAttribute('thumbnail'),
                            base + shots[i].getAttribute('colormap'),
                            Number(shots[i].getAttribute('sem')),
                            i
                        );
                        thumbnails.push(t);
                    }

                    if (callback)
                        callback(thumbnails,metadata);
                }
            }

            request.send();
        }

        public static log2(x: number): number {
            return Math.log(x) / Math.log(2);
        }

        public static browser: { isOpera: boolean, isFirefox: boolean, isSafari: boolean, isChrome: boolean } = <any>{
            isOpera: navigator.userAgent.indexOf(' OPR/') >= 0,
            isFirefox: navigator.userAgent.indexOf('Firefox') != -1,
            isSafari: Object.prototype.toString.call(HTMLElement).indexOf('Constructor') > 0,
            //    isIE: /*@cc_on!@*/false || !!document.documentMode,
            //    isEdge: !isIE && !!window.StyleMedia,
            isChrome: (navigator.appVersion.indexOf('Chrome') != -1 && navigator.vendor.indexOf('Google') != -1),
            //      isBlink: (isChrome || isOpera) && !!window.CSS
        }

        public static stringToNumberArray(str: string): number[] {
            if (str == null) return null;
            let tmp = str.trim().split(" ");
            let n: Array<number> = [];
            for (let i = 0; i < tmp.length; i++)
                n[i] = Number(tmp[i]);
            return n;
        }
    }


}
