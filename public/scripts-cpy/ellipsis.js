/*
 * =============================================================
 * jQuery.browser
 * =============================================================
 *
 * replaces the deprecated jQuery.browser that has now been removed from jQuery 1.9+
 *
 *
 * Dependencies:
 * jQuery 2.0 +
 *
 *
 */

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    var browser = {};
    browser.mozilla = false;
    browser.webkit = false;
    browser.opera = false;
    browser.msie = false;

    var nAgt = navigator.userAgent;
    browser.name = navigator.appName;
    browser.fullVersion = '' + parseFloat(navigator.appVersion);
    browser.majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

// Opera
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browser.opera = true;
        browser.name = "Opera";
        browser.fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            browser.fullVersion = nAgt.substring(verOffset + 8);
    }
// MSIE
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browser.msie = true;
        browser.name = "Microsoft Internet Explorer";
        browser.fullVersion = nAgt.substring(verOffset + 5);
    }
// Chrome
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browser.webkit = true;
        browser.name = "Chrome";
        browser.fullVersion = nAgt.substring(verOffset + 7);
    }
// Safari
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browser.webkit = true;
        browser.name = "Safari";
        browser.fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            browser.fullVersion = nAgt.substring(verOffset + 8);
    }
// Firefox
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browser.mozilla = true;
        browser.name = "Firefox";
        browser.fullVersion = nAgt.substring(verOffset + 8);
    }
// Other
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browser.name = nAgt.substring(nameOffset, verOffset);
        browser.fullVersion = nAgt.substring(verOffset + 1);
        if (browser.name.toLowerCase() === browser.name.toUpperCase()) {
            browser.name = navigator.appName;
        }
    }else if(nAgt.indexOf('Mozilla') !== -1 && nAgt.indexOf('Firefox')===-1){
        browser.msie = true;
        browser.name = "Internet Explorer";
        browser.fullVersion = '11';
    }
// trim the fullVersion string at semicolon/space if present
    if ((ix = browser.fullVersion.indexOf(";")) != -1)
        browser.fullVersion = browser.fullVersion.substring(0, ix);
    if ((ix = browser.fullVersion.indexOf(" ")) != -1)
        browser.fullVersion = browser.fullVersion.substring(0, ix);

    browser.majorVersion = parseInt('' + browser.fullVersion, 10);
    if (isNaN(browser.majorVersion)) {
        browser.fullVersion = '' + parseFloat(navigator.appVersion);
        browser.majorVersion = parseInt(navigator.appVersion, 10);
    }
    browser.version = browser.majorVersion;

    $.browser = $.browser || browser;

    return $;


}));




/*
 * =============================================================
 * jQuery.support
 * =============================================================
 *
 * almost all tests adopted from Modernizr
 *
 *
 *
 * Dependencies:
 * jQuery 2.0+
 *
 *
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    var support = {},


        docElement = document.documentElement,

        mod = 'ellipsis',

        modElem = document.createElement(mod),

        mStyle = modElem.style,

        toString = {}.toString,

        prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),

        omPrefixes = 'Webkit Moz O ms',

        cssomPrefixes = omPrefixes.split(' '),

        domPrefixes = omPrefixes.toLowerCase().split(' '),

        ns = {'svg':'http://www.w3.org/2000/svg'},

        classes = [],

        slice = classes.slice,

        featureName,
        injectElementWithStyles = function (rule, callback, nodes, testnames) {

            var style, ret, node, docOverflow,
                div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

            if (parseInt(nodes, 10)) {
                while (nodes--) {
                    node = document.createElement('div');
                    node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                    div.appendChild(node);
                }
            }

            style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
            div.id = mod;
            (body ? div : fakeBody).innerHTML += style;
            fakeBody.appendChild(div);
            if (!body) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
                docOverflow = docElement.style.overflow;
                docElement.style.overflow = 'hidden';
                docElement.appendChild(fakeBody);
            }

            ret = callback(div, rule);
            if (!body) {
                fakeBody.parentNode.removeChild(fakeBody);
                docElement.style.overflow = docOverflow;
            } else {
                div.parentNode.removeChild(div);
            }

            return !!ret;

        },

        testMediaQuery = function (mq) {

            var matchMedia = window.matchMedia || window.msMatchMedia;
            if (matchMedia) {
                return matchMedia(mq).matches;
            }

            var bool;

            injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function (node) {
                bool = (window.getComputedStyle ?
                    getComputedStyle(node, null) :
                    node.currentStyle)['position'] == 'absolute';
            });

            return bool;

        },



        _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    function setCss(str) {
        mStyle.cssText = str;
    }

    function setCssAll(str1, str2) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is(obj, type) {
        return typeof obj === type;
    }

    function contains(str, substr) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps(props, prefixed) {
        for (var i in props) {
            var prop = props[i];
            if (!contains(prop, "-") && mStyle[prop] !== undefined) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps(props, obj, elem) {
        for (var i in props) {
            var item = obj[props[i]];
            if (item !== undefined) {

                if (elem === false){
                    return props[i];
                }

                if (is(item, 'function')) {
                    return item.bind(elem || obj);
                }

                return item;
            }
        }
        return false;
    }

    function prefixed(prop, obj, elem) {
        if (!obj) {
            return testPropsAll(prop, 'pfx');
        } else {
            return testPropsAll(prop, obj, elem);
        }
    }

    function testPropsAll(prop, prefixed, elem) {

        var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
            props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        if (is(prefixed, "string") || is(prefixed, "undefined")) {
            return testProps(props, prefixed);

        } else {
            props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
            return testDOMProps(props, prefixed, elem);
        }
    }



    //touch
    support.touch = testTouch();
    function testTouch() {
        var bool;

        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            bool = true;
        } else {
            injectElementWithStyles(['@media (', prefixes.join('touch-enabled),('), mod, ')', '{#ellipsis{top:9px;position:absolute}}'].join(''), function (node) {
                bool = node.offsetTop === 9;
            });
        }

        return bool;
    }

    //canvas
    support.canvas = testCanvas();
    function testCanvas() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));

    }

    //geolocation
    support.geolocation = testGeolocation();
    function testGeolocation() {
        return 'geolocation' in navigator;
    }

    //history
    support.history = testHistory();
    function testHistory() {
        return !!(window.history && history.pushState);
    }

    //dragdrop
    support.dragdrop = testDragDrop();
    function testDragDrop() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    }

    //websockets
    support.websockets = testWebSockets();
    function testWebSockets() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    }

    //css3dtransforms
    support.css3dtransforms = testCSSTransform3d();
    function testCSSTransform3d() {
        var ret = !!testPropsAll('perspective');

        if (ret && 'webkitPerspective' in docElement.style) {

            injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#ellipsis{left:9px;position:absolute;height:3px;}}', function (node, rule) {
                ret = node.offsetLeft === 9 && node.offsetHeight === 3;
            });
        }
        return ret;

    }

    //video
    support.video = testVideo();
    function testVideo() {
        var elem = document.createElement('video'),
            bool = false;

        try {
            if (bool = !!elem.canPlayType) {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '');

                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '');
            }

        } catch (e) {
        }

        return bool;
    }

    //audio
    support.audio = testAudio();
    function testAudio() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if (bool = !!elem.canPlayType) {
                bool = new Boolean(bool);
                bool.ogg = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, '');
                bool.mp3 = elem.canPlayType('audio/mpeg;').replace(/^no$/, '');

                bool.wav = elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '');
                bool.m4a = ( elem.canPlayType('audio/x-m4a;') ||
                    elem.canPlayType('audio/aac;')).replace(/^no$/, '');
            }
        } catch (e) {
        }

        return bool;
    }

    //localstorage
    support.localstorage = testLocalStorage();
    function testLocalStorage() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    }

    //sessionstorage
    support.sessionstorage = testSessionStorage();
    function testSessionStorage() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch (e) {
            return false;
        }
    }

    //web workers
    support.webworkers = testWebWorkers();
    function testWebWorkers() {
        return !!window.Worker;
    }

    //application cache
    support.applicationcache = testApplicationCache();
    function testApplicationCache() {
        return !!window.applicationCache;
    }

    //svg
    support.svg = testSVG();
    function testSVG() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    }

    //inline svg
    support.inlinesvg = testInlineSVG();
    function testInlineSVG() {
        var div = document.createElement('div');
        div.innerHTML = '<svg/>';
        return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    }

    //svg clip paths
    support.svgclippaths = testSVGClipPaths();
    function testSVGClipPaths() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    }

    //webkit background clip
    support.backgroundclip = testBackgroundClip();
    function testBackgroundClip() {

        if (/Android/.test(navigator.userAgent)) {
            return false;
        }
        var ele = document.createElement("ellipsis");
        var ret = ((typeof ele.style.webkitBackgroundClip !== 'undefined') && ( ele.style.webkitBackgroundClip = 'text'));
        var textSupport = ele.style.webkitBackgroundClip == 'text';
        return textSupport;

    }

    //content editable
    support.contenteditbale = testContentEditable();
    function testContentEditable() {
        return 'contentEditable' in document.documentElement;
    }

    //overflow scrolling
    support.overflowscrolling = testOverflowScrolling();
    function testOverflowScrolling() {
        return testPropsAll('overflowScrolling');
    }

    //css resize
    support.cssresize = testResize();
    function testResize() {
        return testPropsAll('resize');
    }

    //css flexwrap
    support.flexwrap = testFlexWrap();
    function testFlexWrap() {
        return testPropsAll('flexWrap');
    }

    //postmessage
    support.postmessage = testPostMessage();
    function testPostMessage() {
        return !!window.postMessage;
    }

    //dataview
    support.dataview = testDataView();
    function testDataView() {
        return (typeof DataView !== 'undefined' && 'getFloat64' in DataView.prototype);
    }

    //dataset
    support.dataset = testDataSet();
    function testDataSet() {
        var n = document.createElement("div");
        n.setAttribute("data-a-b", "c");
        return !!(n.dataset && n.dataset.aB === "c");
    }

    //progressbar
    support.progressbar = testProgressBar();
    function testProgressBar() {
        return document.createElement('progress').max !== undefined;
    }

    //meter
    support.meter = testMeter();
    function testMeter() {
        return document.createElement('meter').max !== undefined;
    }

    //filesystem
    support.filesystem = testFilesystem();
    function testFilesystem() {
        return !!prefixed('requestFileSystem', window);
    }

    //filereader
    support.filereader = testFileReader();
    function testFileReader() {
        return !!(window.File && window.FileList && window.FileReader);
    }

    //fullscreen
    support.fullscreen = testFullScreen();
    function testFullScreen() {
        for(var i = 0; i < domPrefixes.length; i++) {
            if( document[domPrefixes[i].toLowerCase() + 'CancelFullScreen']){
                return true;
            }

        }
        return !!document['cancelFullScreen'] || false;
    }

    //cors
    support.cors = testCors();
    function testCors() {
        return !!(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest());
    }

    //battery
    support.battery = testBattery();
    function testBattery() {
        return !!prefixed('battery', navigator);
    }

    //low battery
    support.lowbattery = testLowBattery();
    function testLowBattery() {
        var minLevel = 0.20,
            battery = prefixed('battery', navigator);
        return !!(battery && !battery.charging && battery.level <= minLevel);
    }

    //flexbox
    support.flexbox=testFlexbox();
    function testFlexbox(){
        return testPropsAll('flexWrap');
    }

    //indexedDB
    support.indexeddb=testIndexedDB();
    function testIndexedDB(){
        return !!testPropsAll("indexedDB", window);
    }

    //hsla
    support.hsla=hsla();
    function hsla(){
        setCss('background-color:hsla(120,40%,100%,.5)');
        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    }

    //multiple backgrounds
    support.multiplebgs=multiplebgs();
    function multiplebgs(){
        setCss('background:url(https://),url(https://),red url(https://)');
        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    }

    //css columns
    support.csscolumns=cssColumns();
    function cssColumns(){
        return testPropsAll('columnCount');
    }

    //css reflections
    support.cssreflections=cssReflections();
    function cssReflections(){
        return testPropsAll('boxReflect');
    }


    //form validation
    support.formvalidation = testFormValidation();
    function testFormValidation() {
        var form = document.createElement('form');
        if ( !('checkValidity' in form) ) {
            return false;
        }
        var body = document.body,

            html = document.documentElement,

            bodyFaked = false,

            invaildFired = false,

            input,

            formvalidationapi = true;

        // Prevent form from being submitted
        form.onsubmit = function(e) {
            //Opera does not validate form, if submit is prevented
            if ( !window.opera ) {
                e.preventDefault();
            }
            e.stopPropagation();
        };

        // Calling form.submit() doesn't trigger interactive validation,
        // use a submit button instead
        //older opera browsers need a name attribute
        form.innerHTML = '<input name="modTest" required><button></button>';

        // FF4 doesn't trigger "invalid" event if form is not in the DOM tree
        // Chrome throws error if invalid input is not visible when submitting
        form.style.position = 'absolute';
        form.style.top = '-99999em';

        // We might in <head> in which case we need to create body manually
        if ( !body ) {
            bodyFaked = true;
            body = document.createElement('body');
            //avoid crashing IE8, if background image is used
            body.style.background = "";
            html.appendChild(body);
        }

        body.appendChild(form);

        input = form.getElementsByTagName('input')[0];

        // Record whether "invalid" event is fired
        input.oninvalid = function(e) {
            invaildFired = true;
            e.preventDefault();
            e.stopPropagation();
        };

        //presto Opera does not fully support the validationMessage property
        var formvalidationmessage = !!input.validationMessage;

        // Submit form by clicking submit button
        form.getElementsByTagName('button')[0].click();

        // Don't forget to clean up
        body.removeChild(form);
        bodyFaked && html.removeChild(body);

        return invaildFired;
    }
    support.init=function(){
        var html=$('html');
        html.removeClass('no-js');
        html.addClass('js');
        var tests=['touch','canvas','svg','history','formvalidation','localstorage','sessionstorage','meter','backgroundclip','inlinesvg',
            'svgclippaths','css3dtransforms','video','audio','progressbar','cssresize','postmessage','overflowscrolling','flexbox',
            'indexeddb','hsla','multiplebgs','csscolumns','cssreflections','flexwrap'];

        tests.forEach(function(t){
            support[t] ? html.addClass(t) : html.addClass('no-' + t);
        });

        //old ie
        if($.browser && $.browser.msie){
            if($.browser.majorVersion===6){
                html.addClass('ie6');
            }else if($.browser.majorVersion===7){
                html.addClass('ie7');
            }else if($.browser.majorVersion===8){
                html.addClass('ie8');
            }
        }

    };

    support.stickyFooter=function(){
        if($.browser.msie){
            var stickyFooter=$('.ui-sticky-footer');
            if(stickyFooter[0]){
                stickyFooter.addClass('ns');
            }
        }


    };


    support.init();
    support.stickyFooter();
    $.support = $.support || {};
    $.extend($.support, support);

    return $;

}));




/*
 * =============================================================
 * jQuery.utils
 * =============================================================
 *
 *
 *
 * Dependencies:
 * jQuery 2.0+
 *
 *
 */

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    var utils={};
    utils.datetime={

        isDate: function(obj){
            return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
        },

        isLeapYear: function(year){
            return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
        },

        getDaysInMonth: function(year, month){
            return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },

        setToStartOfDay: function(date){
            if (this.isDate(date)) date.setHours(0,0,0,0);
        },

        compareDates: function(a,b){
            // weak date comparison (use setToStartOfDay(date) to ensure correct result)
            return a.getTime() === b.getTime();
        },

        /**
         *
         * @returns {string}
         */
        currentDate: function () {
            var currentDate = new Date();
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            return (month + '/' + day + '/' + year);
        }
    };

    utils.array={
        isArray: function(obj){
            return (/Array/).test(Object.prototype.toString.call(obj));
        }
    };

    utils.string={
        dashToCamelCase:function(s){
            return s.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
        },

        random:function(){
            return Math.floor((Math.random()*100000)+1).toString();
        }
    };

    utils.color={
        rgb2hex: function(rgb){
            if (  rgb.search("rgb") == -1 ) {
                return rgb;
            }
            else if ( rgb == 'rgba(0, 0, 0, 0)' ) {
                return 'transparent';
            }
            else {
                rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
                function hex(x) {
                    return ("0" + parseInt(x).toString(16)).slice(-2);
                }
                return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
            }
        }
    };

    utils.url={
        /**
         *
         * @param ji {String}
         * @returns {String}
         */
        queryString: function (ji) {
            var hu = window.location.search.substring(1);
            var gy = hu.split("&");
            for (i = 0; i < gy.length; i++) {
                var ft = gy[i].split("=");
                if (ft[0] == ji) {
                    return ft[1];
                }
            }
            return null;
        },

        /**
         *
         * @returns {Array}
         */
        queryStringObjectArray: function () {
            var arr = [];
            var hu = window.location.search.substring(1);
            var gy = hu.split("&");
            for (i = 0; i < gy.length; i++) {
                var ft = gy[i].split("=");
                if (ft[0] == ji) {
                    return ft[1];
                }
                var obj = {};
                obj.prop = ft[0];
                obj.val = ft[1];
                arr.push(obj);
            }

            return arr;
        },

        /**
         *
         * @returns {Array}
         */
        queryStringFilterArray: function () {
            var arr = [];
            var hu = window.location.search.substring(1);
            var gy = hu.split("&");
            for (i = 0; i < gy.length; i++) {
                var ft = gy[i].split("=");
                var obj = {};
                obj.filter = ft[0];
                obj.val = ft[1];
                if (obj.filter != '') {
                    arr.push(obj);
                }

            }

            return arr;
        }
    };

    utils.image={
        /**
         *
         * @param img {Object}
         * @param data {Object}
         * @returns {Object}
         */
        aspectRatio: function (img, data) {
            var width = img.width();
            var height = img.height();
            var aRatio = height / width;
            data.aspectRatio = aRatio;
            if (typeof data.height != 'undefined') {
                data.width = parseInt((1 / aRatio) * data.height);
            } else if (typeof data.width != 'undefined') {
                data.height = parseInt(aRatio * data.width);
            }

            return data;
        }
    };


    $.utils = $.utils || {};
    $.extend($.utils, utils);

    /* String/Number prototypes  */
    String.prototype.toCamelCase=function(){
        return this.replace(/[-_]([a-z])/g, function (g) { return g[1].toUpperCase(); });
    };
    String.prototype.toTitleCase=function(){
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
    String.prototype.toPixel = function(){
        var val=parseInt(this,10);
        val = val.toString() + 'px';
        return val;
    };
    Number.prototype.toPixel = function(){
        var val=parseInt(this,10);
        val = val.toString() + 'px';
        return val;
    };
    String.prototype.toFloatPixel = function(){
        var val = this.toString() + 'px';
        return val;
    };
    Number.prototype.toFloatPixel = function(){
        var val = this.toString() + 'px';
        return val;
    };
    String.prototype.toInteger=function(){
        return parseInt(this.replace('px',''),10);
    };
    String.prototype.toMillisecond = function(){
        var val=parseInt(this,10);
        val = val.toString() + 'ms';
        return val;
    };
    Number.prototype.toMillisecond = function(){
        var val=parseInt(this,10);
        val = val.toString() + 'ms';
        return val;
    };



    /**
     * replaces an element's class based on a wildcard pattern
     * @param removals {String}
     * @param additions {String}
     * @returns {Object}
     * @public
     *
     * ex: average rating
     *     $span.alterClass('icon-star-*', 'icon-star-3');
     *     $span.icon-star-2 => $span.icon-star-3
     */
    $.fn.alterClass = function ( removals, additions ) {

        var self = this;

        if ( removals.indexOf( '*' ) === -1 ) {
            // Use native jQuery methods if there is no wildcard matching
            self.removeClass( removals );
            return !additions ? self : self.addClass( additions );
        }

        var patt = new RegExp( '\\s' +
            removals.
                replace( /\*/g, '[A-Za-z0-9-_]+' ).
                split( ' ' ).
                join( '\\s|\\s' ) +
            '\\s', 'g' );

        self.each( function ( i, it ) {
            var cn = ' ' + it.className + ' ';
            while ( patt.test( cn ) ) {
                cn = cn.replace( patt, ' ' );
            }
            it.className = $.trim( cn );
        });

        return !additions ? self : self.addClass( additions );
    };

    /**
     * extends jQuery 'find' to additionally filter the jQuery object against the selector
     * example uses: querying mutation records
     * @param selector {String}
     * @returns {Object}
     * @public
     */
    $.fn.selfFind = function(selector) {
        return this.find(selector).add(this.filter(selector))
    };

    /**
     * clear select list
     * @param opts
     * @returns {$.fn}
     */
    $.fn.clearSelect=function(opts){
        (typeof opts.defaultOption ==='undefined') ? this.children.remove() : this.children('option:not(:first)').remove();
        return this;

    };

    $.fn.findTextNodes=function(){
        return this.contents().filter(function(){return this.nodeType===3});
    };

    $.fn.findTextNodeDescendants=function(){
        return this.find('*').contents().filter(function(){return this.nodeType===3});
    };

    $.fn.isVisible=function(){
        var _isVisible=this.is(':visible');
        var visibility=this.css( 'visibility');
        return(_isVisible && visibility==='visible');
    }

    /**
     *  returns first matched children in an iterative children query as "children"
     * @param selector
     * @returns {*|jQuery|HTMLElement}
     */
    $.fn.closestChildren=function(selector){
        if (!selector || selector === '') {
            return $();
        }
        var result=$();
        this.each(function() {
            var $this = $(this);
            var queue = [];
            queue.push($this);
            while (queue.length > 0) {
                var node = queue.shift();
                var children = node.children();
                for (var i = 0; i < children.length; ++i) {
                    var $child = $(children[i]);
                    if ($child.is(selector)) {
                        result=children;
                        return false;
                    } else {
                        queue.push($child);
                    }
                }
            }
        });
        var elements = [];
        $.each(result, function (index, element) {
            if ($(element).is(selector)) {
                elements.push(element);
            }
        });
        return $(elements);
    };





    return $;


}));






/*
 * =============================================================
 * jQuery.touch
 * =============================================================
 * Dependencies:
 * jQuery 2.0+
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    $.touch = $.extend({}, {

        // Version
        version: "0.9.1",

        containerSelector:'[data-role="container"]',

        // Minimum scroll distance that will be remembered when returning to a page
        minScrollBack: 250,

        //delay for invoking 'popped' routes on smartphones to account for address bar visibility
        poppedDelay: 700,

        //auto refresh the screen on orientation change events(retrigger the route)
        autoOrientationChangeScreenRefresh: true,

        triggerScreenRefreshDelay: 1000,

        tabletMinWidth: 767,

        smartPhoneMaxWidth: 480,

        // replace calls to window.history.back with phonegaps navigation helper
        // where it is provided on the window object
        phonegapNavigationEnabled: false,

        pushStateEnabled: true,

        // turn of binding to the native orientationchange due to android orientation behavior
        orientationChangeEnabled: true,

        //auto scrollTo on document.ready
        autoScrollTo: true,

        //media query max-width
        mqMaxWidth: 1360,

        //media query min width
        mqMinWidth: 320,

        keyCode: {
            ALT: 18,
            BACKSPACE: 8,
            CAPS_LOCK: 20,
            COMMA: 188,
            COMMAND: 91,
            COMMAND_LEFT: 91, // COMMAND
            COMMAND_RIGHT: 93,
            CONTROL: 17,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            INSERT: 45,
            LEFT: 37,
            MENU: 93, // COMMAND_RIGHT
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SHIFT: 16,
            SPACE: 32,
            TAB: 9,
            UP: 38,
            WINDOWS: 91 // COMMAND
        },


        /**
         * Scroll page vertically: scroll to 0 to hide iOS address bar, or pass a Y value
         *
         * @param ypos
         */
        scrollTop: function (ypos, evt) {
            if ($.type(ypos) !== "number") {
                ypos = 0;
            } else if (typeof evt === 'undefined') {
                evt = 'scrollTop';
            }


            setTimeout(function () {
                window.scrollTo(0, ypos);
                $(document).trigger(evt, { x: 0, y: ypos });
            }, 20);


        },

        /**
         * hide address bar on page load
         *
         */
        hideAddressBar: function () {
            var container=this.containerSelector;
            if ($.support.touch && !window.location.hash) {
                $(window).load(function () {
                    var height = $.touch.device.viewport.height + 60;
                    $(container).css({
                        'min-height': height + 'px'
                    });
                    setTimeout(function () {
                        window.scrollTo(0, 1);
                    }, 0);
                });
            }
        }
    });

    return $;

}));


/*
 * =============================================================
 * jQuery.touch.device
 * =============================================================
 *
 * Dependencies:
 * jQuery 2.0+
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    var device = {};
    device.touch = $.support.touch || 'ontouchend' in document;
    device.android = false;
    device.iphone = false;
    device.ipad = false;
    device.ipod = false;
    device.ios = false;
    device.webos = false;
    device.blackberry = false;
    device.smartphone = false;
    device.tablet = false;
    device.retina = false;


    if (/Android/.test(navigator.userAgent)) {
        device.android = device.touch;

    } else if (/iPhone/.test(navigator.userAgent)) {
        device.iphone = device.touch;

    } else if (/iPad/.test(navigator.userAgent)) {
        device.ipad = device.touch;

    } else if (/iPod/.test(navigator.userAgent)) {
        device.ipod = device.touch;

    } else if (/webOS/.test(navigator.userAgent)) {
        device.webos = device.touch;

    } else if (/BlackBerry/.test(navigator.userAgent)) {
        device.blackberry = device.touch;

    }
    if ((device.iphone) || (device.ipad) || (device.ipod)) {
        device.ios = true;
    }


    Object.defineProperties(device, {
        'viewport': {
            /**
             * getter
             *
             * @returns {{width: *, height: *}}
             */
            get: function () {
                var width = _getScreenWidth();
                var height = _getScreenHeight();
                return {
                    width: width,
                    height: height
                };
            },
            configurable: false

        },

        'orientation': {
            /**
             * getter
             *
             * @returns {string}
             */
            get: function () {
                var width = _getScreenWidth();
                var height = _getScreenHeight();
                return (height > width) ? 'portrait' : 'landscape';
            },
            configurable: false

        },

        /**
         * getter
         * @returns {string}
         */
        'orientationEvent': {
            get: function () {
                var supportsOrientationChange = "onorientationchange" in window,
                    orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize';

                return orientationEvent;
            }
        }
    });


    if (window.devicePixelRatio > 1) {
        device.retina = true;
    }
    if ((_getScreenHeight() > $.touch.tabletMinWidth) || (_getScreenWidth() > $.touch.tabletMinWidth)) {
        device.tablet = true;
        device.smartphone = false;
    } else {
        device.tablet = false;
        device.smartphone = true;
    }
    if (!device.touch) {
        device.tablet = false;
        device.smartphone = false;
    }

    $.touch= $.touch || {};
    $.touch.device = device;

    //private

    /**
     *
     * @returns {Number|*|jQuery}
     * @private
     */
    function _getScreenHeight() {
        return window.innerHeight || $(window).height();
    }

    /**
     *
     * @returns {Number|*|jQuery}
     * @private
     */
    function _getScreenWidth() {
        return window.innerWidth || $(window).width();
    }


    return $;


}));


/*
 * =============================================================
 * jQuery.touch.mq
 * =============================================================
 *
 * Dependencies:
 * jQuery 2.0+
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    var mq = {};
    Object.defineProperties(mq, {
        'touch': {
            /**
             * getter
             *
             * @returns {boolean}
             */
            get: function () {
                return ($.touch.device.viewport.width <= $.touch.mqMaxWidth);
            },
            configurable: false

        },

        'smartphone': {
            /**
             * getter
             *
             * @returns {boolean}
             */
            get: function () {
                return ($.touch.device.viewport.width <= $.touch.smartPhoneMaxWidth);
            },
            configurable: false

        },

        'touchQuery': {
            /**
             * getter
             *
             * @returns {string}
             */
            get: function () {
                var mediaQuery = '(max-width:' + $.touch.mqMaxWidth + 'px) and (min-width:' + $.touch.mqMinWidth + 'px)';
                return mediaQuery;
            },
            configurable: false

        },

        'touchLandscapeQuery': {
            /**
             * getter
             *
             * @returns {string}
             */
            get: function () {
                var mediaQuery = '(max-width:' + $.touch.mqMaxWidth + 'px) and (min-width:' + $.touch.mqMinWidth + 'px) and (orientation:landscape)';
                return mediaQuery;
            },
            configurable: false

        },

        'touchPortraitQuery': {
            /**
             * getter
             *
             * @returns {string}
             */
            get: function () {
                var mediaQuery = '(max-width:' + $.touch.mqMaxWidth + 'px) and (min-width:' + $.touch.mqMinWidth + 'px) and (orientation:portrait)';
                return mediaQuery;
            },
            configurable: false

        },

        'tabletQuery': {
            /**
             * getter
             *
             * @returns {string}
             */
            get: function () {
                var mediaQuery = '(max-width:' + ($.touch.mqMaxWidth - 1) + 'px) and (min-width:' + $.touch.tabletMinWidth + 'px)';
                return mediaQuery;
            },
            configurable: false

        },

        'tabletLandscapeQuery': {
            /**
             * getter
             *
             * @returns {string}
             */
            get: function () {
                var mediaQuery = '(max-width:' + $.touch.mqMaxWidth + 'px) and (min-width:' + $.touch.mqMinWidth + 'px) and (orientation:landscape)';
                return mediaQuery;
            },
            configurable: false

        },

        'tabletPortraitQuery': {
            /**
             * getter
             *
             * @returns {string}
             */
            get: function () {
                var mediaQuery = '(max-width:' + $.touch.mqMaxWidth + 'px) and (min-width:' + $.touch.mqMinWidth + 'px) and (orientation:portrait)';
                return mediaQuery;
            },
            configurable: false

        },

        'smartPhoneQuery': {
            /**
             * getter
             *
             * @returns {string}
             */
            get: function () {
                var mediaQuery = '(max-width:' + $.touch.smartPhoneMaxWidth + 'px)';
                return mediaQuery;
            },
            configurable: false

        },

        'smartPhoneLandscapeQuery': {
            /**
             * getter
             *
             * @returns {string}
             */
            get: function () {
                var mediaQuery = '(max-width:' + $.touch.smartPhoneMaxWidth + 'px) and (orientation:landscape)';
                return mediaQuery;
            },
            configurable: false

        },

        'smartPhonePortraitQuery': {
            /**
             * getter
             *
             * @returns {string}
             */
            get: function () {
                var mediaQuery = '(max-width:' + $.touch.smartPhoneMaxWidth + 'px) and (orientation:portrait)';
                return mediaQuery;
            },
            configurable: false

        },

        'landscapeQuery': {
            /**
             * getter
             *
             * @returns {string}
             */
            get: function () {
                var mediaQuery = '(orientation:landscape)';
                return mediaQuery;
            },
            configurable: false

        },

        'portraitQuery': {
            /**
             * getter
             *
             * @returns {string}
             */
            get: function () {
                var mediaQuery = '(orientation:portrait)';
                return mediaQuery;
            },
            configurable: false

        },

        'desktopQuery': {
            /**
             * getter
             *
             * @returns {string}
             */
            get: function () {
                var desktopMinWidth = $.touch.mqMaxWidth + 1;
                var mediaQuery = '(min-width:' + desktopMinWidth + 'px)';
                return mediaQuery;
            },
            configurable: false

        }


    });

    $.touch= $.touch || {};

    $.touch.mq = mq;

    return $;



}));


/*
 * =============================================================
 * jQuery.touch.cache
 * =============================================================
 *
 * Dependencies:
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    var tmpRepo = [];
    var cache = {};

    /**
     *
     * @param key
     * @returns {Object}
     */
    cache.get = function (key) {
        var val;
        for (var i = 0, max = tmpRepo.length; i < max; i++) {
            if (tmpRepo[i].key === key) {
                val = tmpRepo[i].val;
                break;
            }
        }
        return val;
    };

    /**
     *
     * @param key
     * @param val
     * @returns void
     */
    cache.set = function (key, val) {
        _validateKey(key);
        var cacheObj = {
            key: key,
            val: val
        };
        tmpRepo.push(cacheObj);

    };

    /**
     *
     * @param key
     * @returns void
     */
    cache.remove = function (key) {
        _validateKey(key);
    };

    //
    /**
     * enforce unique key; if key exists, we remove the cached object
     *
     * @param key
     * @private
     */
    function _validateKey(key) {
        for (var i = 0, max = tmpRepo.length; i < max; i++) {
            if (tmpRepo[i].key === key) {
                tmpRepo.splice(i, 1);
                break;
            }
        }
    }


    $.touch = $.touch || {};
    $.touch.cache = cache;


    return $;

}));

/*
 * =============================================================
 * jQuery.touch.support
 * =============================================================
 *
 * Dependencies:
 * jQuery 2.0+
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    var support = {
        touch: "ontouchend" in document
    };

    //devicemotion
    support.devicemotion = testDeviceMotion();
    function testDeviceMotion() {
        return 'DeviceMotionEvent' in window;
    }

    //deviceorientation
    support.deviceorientation = testDeviceOrientation();
    function testDeviceOrientation() {
        return 'DeviceOrientationEvent' in window;
    }

    //connectiontype (note buggy) bugs.webkit.org/show_bug.cgi?id=73528
    support.connectiontype = testConnectionType();
    function testConnectionType() {
        var connection = navigator.connection || { type: 0 };
        return connection.type;
    }

    //lowbandwidth (note buggy) bugs.webkit.org/show_bug.cgi?id=73528
    support.lowbandwidth = testLowBandwidth();
    function testLowBandwidth() {
        var connection = navigator.connection || { type: 0 };

        return connection.type == 3 || // connection.CELL_2G
            connection.type == 4 || // connection.CELL_3G
            /^[23]g$/.test(connection.type);
    }


    $.support = $.support || {};

    $.extend($.support, {
        orientation: "orientation" in window && "onorientationchange" in window
    });

    $.touch = $.touch || {};
    $.touch.support = $.touch.support || {};
    $.extend($.touch.support, $.support);
    $.extend($.touch.support, support);

    return $;

}));




(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {

    (function (doc, win) {
        'use strict';
        if (typeof doc.createEvent !== 'function') return false; // no tap events here
        // helpers
        var useJquery = typeof jQuery !== 'undefined',
            // some helpers borrowed from https://github.com/WebReflection/ie-touch
            msPointerEnabled = !!navigator.pointerEnabled || navigator.msPointerEnabled,
            isTouch = (!!('ontouchstart' in window) && navigator.userAgent.indexOf('PhantomJS') < 0) || msPointerEnabled,
            msEventType = function (type) {
                var lo = type.toLowerCase(),
                    ms = 'MS' + type;
                return navigator.msPointerEnabled ? ms : lo;
            },
            touchevents = {
                touchstart: msEventType('PointerDown') + ' touchstart',
                touchend: msEventType('PointerUp') + ' touchend',
                touchmove: msEventType('PointerMove') + ' touchmove'
            },
            setListener = function (elm, events, callback) {
                var eventsArray = events.split(' '),
                    i = eventsArray.length;

                while (i--) {
                    elm.addEventListener(eventsArray[i], callback, false);
                }
            },
            getPointerEvent = function (event) {
                return event.targetTouches ? event.targetTouches[0] : event;
            },
            sendEvent = function (elm, eventName, originalEvent, data) {
                var customEvent = doc.createEvent('Event');
                data = data || {};
                data.x = currX;
                data.y = currY;
                data.distance = data.distance;
                if (useJquery)
                    jQuery(elm).trigger(eventName, data);
                else {
                    customEvent.originalEvent = originalEvent;
                    for (var key in data) {
                        customEvent[key] = data[key];
                    }
                    customEvent.initEvent(eventName, true, true);
                    elm.dispatchEvent(customEvent);
                }
            },
            onTouchStart = function (e) {

                var pointer = getPointerEvent(e);
                // caching the current x
                cachedX = currX = pointer.pageX;
                // caching the current y
                cachedY = currY = pointer.pageY;
                // a touch event is detected
                touchStarted = true;
                tapNum++;
                // detecting if after 200ms the finger is still in the same position
                clearTimeout(tapTimer);
                tapTimer = setTimeout(function () {
                    if (
                        cachedX >= currX - precision &&
                        cachedX <= currX + precision &&
                        cachedY >= currY - precision &&
                        cachedY <= currY + precision &&
                        !touchStarted
                    ) {
                        // Here you get the Tap event
                        sendEvent(e.target, (tapNum === 2) ? 'dbltap' : 'tap', e);
                    }
                    tapNum = 0;
                }, taptreshold);

            },
            onTouchEnd = function (e) {
                var eventsArr = [],
                    deltaY = cachedY - currY,
                    deltaX = cachedX - currX;
                touchStarted = false;

                if (deltaX <= -swipeTreshold)
                    eventsArr.push('swiperight');

                if (deltaX >= swipeTreshold)
                    eventsArr.push('swipeleft');

                if (deltaY <= -swipeTreshold)
                    eventsArr.push('swipedown');

                if (deltaY >= swipeTreshold)
                    eventsArr.push('swipeup');
                if (eventsArr.length) {
                    for (var i = 0; i < eventsArr.length; i++) {
                        var eventName = eventsArr[i];
                        sendEvent(e.target, eventName, e, {
                            distance: {
                                x: Math.abs(deltaX),
                                y: Math.abs(deltaY)
                            }
                        });
                    }
                }
            },
            onTouchMove = function (e) {
                var pointer = getPointerEvent(e);
                currX = pointer.pageX;
                currY = pointer.pageY;
            },
            touchStarted = false, // detect if a touch event is sarted
            swipeTreshold = win.SWIPE_TRESHOLD || 80,
            taptreshold = win.TAP_TRESHOLD || 200,
            precision = win.TAP_PRECISION / 2 || 60 / 2, // touch events boundaries ( 60px by default )
            justTouchEvents = win.JUST_ON_TOUCH_DEVICES || isTouch,
            tapNum = 0,
            currX, currY, cachedX, cachedY, tapTimer;

        //setting the events listeners
        setListener(doc, touchevents.touchstart + (justTouchEvents ? '' : ' mousedown'), onTouchStart);
        setListener(doc, touchevents.touchend + (justTouchEvents ? '' : ' mouseup'), onTouchEnd);
        setListener(doc, touchevents.touchmove + (justTouchEvents ? '' : ' mousemove'), onTouchMove);
    }(document, window));


}));

/*
 * =============================================================
 * jQuery special events
 * =============================================================
 * Dependencies:
 * jQuery 2.0+
 * jQuery.touch
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {


    /* throttled resize special event */
    /* ported from jQuery.mobile */
    (function () {
        $.event.special.throttledresize = {
            setup: function () {
                $(this).bind("resize", handler);
            },
            teardown: function () {
                $(this).unbind("resize", handler);
            }
        };

        var throttle = 250,
            handler = function () {
                curr = ( new Date() ).getTime();
                diff = curr - lastCall;

                if (diff >= throttle) {

                    lastCall = curr;
                    $(this).trigger("throttledresize");

                } else {

                    if (heldCall) {
                        clearTimeout(heldCall);
                    }

                    // Promise a held call will still execute
                    heldCall = setTimeout(handler, throttle - diff);
                }
            },
            lastCall = 0,
            heldCall,
            curr,
            diff;
    })();

    /* orientationchange special event--------------------------------------------------------------------------------*/
    /* ported from jQuery.mobile */
    (function () {
        var win = $(window),
            event_name = "orientationchange",
            special_event,
            get_orientation,
            last_orientation,
            initial_orientation_is_landscape,
            initial_orientation_is_default,
            portrait_map = { "0": true, "180": true };

        // It seems that some device/browser vendors use window.orientation values 0 and 180 to
        // denote the "default" orientation. For iOS devices, and most other smart-phones tested,
        // the default orientation is always "portrait", but in some Android and RIM based tablets,
        // the default orientation is "landscape". The following code attempts to use the window
        // dimensions to figure out what the current orientation is, and then makes adjustments
        // to the to the portrait_map if necessary, so that we can properly decode the
        // window.orientation value whenever get_orientation() is called.
        //


        if ($.touch.support.orientation) {

            // Check the window width and height to figure out what the current orientation
            // of the device is at this moment. Note that we've initialized the portrait map
            // values to 0 and 180, *AND* we purposely check for landscape so that if we guess
            // wrong, , we default to the assumption that portrait is the default orientation.
            // We use a threshold check below because on some platforms like iOS, the iPhone
            // form-factor can report a larger width than height if the user turns on the
            // developer console. The actual threshold value is somewhat arbitrary, we just
            // need to make sure it is large enough to exclude the developer console case.

            var ww = window.innerWidth || $(window).width(),
                wh = window.innerHeight || $(window).height(),
                landscape_threshold = 50;

            initial_orientation_is_landscape = ww > wh && ( ww - wh ) > landscape_threshold;


            // Now check to see if the current window.orientation is 0 or 180.
            initial_orientation_is_default = portrait_map[ window.orientation ];

            // If the initial orientation is landscape, but window.orientation reports 0 or 180, *OR*
            // if the initial orientation is portrait, but window.orientation reports 90 or -90, we
            // need to flip our portrait_map values because landscape is the default orientation for
            // this device/browser.
            if (( initial_orientation_is_landscape && initial_orientation_is_default ) || ( !initial_orientation_is_landscape && !initial_orientation_is_default )) {
                portrait_map = { "-90": true, "90": true };
            }
        }

        $.event.special.orientationchange = $.extend({}, $.event.special.orientationchange, {
            setup: function () {
                // If the event is supported natively, return false so that jQuery
                // will bind to the event using DOM methods.
                if ($.support.orientation && !$.event.special.orientationchange.disabled && !$.touch.device.android) {
                    return false;
                }

                // Get the current orientation to avoid initial double-triggering.
                last_orientation = get_orientation();

                // Because the orientationchange event doesn't exist, simulate the
                // event by testing window dimensions on resize.
                win.bind("throttledresize", handler);
            },
            teardown: function () {
                // If the event is not supported natively, return false so that
                // jQuery will unbind the event using DOM methods.
                if ($.support.orientation && !$.event.special.orientationchange.disabled && !$.touch.device.android) {
                    return false;
                }

                // Because the orientationchange event doesn't exist, unbind the
                // resize event handler.
                win.unbind("throttledresize", handler);
            },
            add: function (handleObj) {
                // Save a reference to the bound event handler.
                var old_handler = handleObj.handler;


                handleObj.handler = function (event) {
                    // Modify event object, adding the .orientation property.
                    event.orientation = get_orientation();

                    // Call the originally-bound event handler and return its result.
                    return old_handler.apply(this, arguments);
                };
            }
        });

        // If the event is not supported natively, this handler will be bound to
        // the window resize event to simulate the orientationchange event.
        function handler() {
            // Get the current orientation.
            var orientation = get_orientation();

            if (orientation !== last_orientation) {
                // The orientation has changed, so trigger the orientationchange event.
                last_orientation = orientation;
                win.trigger(event_name);
            }
        }

        // Get the current page orientation. This method is exposed publicly, should it
        // be needed, as jQuery.event.special.orientationchange.orientation()
        $.event.special.orientationchange.orientation = get_orientation = function () {
            var isPortrait = true, elem = document.documentElement;

            // prefer window orientation to the calculation based on screensize as
            // the actual screen resize takes place before or after the orientation change event
            // has been fired depending on implementation (eg android 2.3 is before, iphone after).
            // More testing is required to determine if a more reliable method of determining the new screensize
            // is possible when orientationchange is fired. (eg, use media queries + element + opacity)
            if ($.support.orientation) {
                // if the window orientation registers as 0 or 180 degrees report
                // portrait, otherwise landscape
                isPortrait = portrait_map[ window.orientation ];
            } else {
                isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
            }

            return isPortrait ? "portrait" : "landscape";
        };

        $.fn[ event_name ] = function (fn) {
            return fn ? this.bind(event_name, fn) : this.trigger(event_name);
        };

        // jQuery < 1.8
        if ($.attrFn) {
            $.attrFn[ event_name ] = true;
        }

    }());



    /* zoom ----------------------------------------------------------------------------------------------------------*/
    /* ported from jQuery.mobile */
    (function () {
        var meta = $("meta[name=viewport]"),
            initialContent = meta.attr("content"),
            disabledZoom = initialContent + ",maximum-scale=1, user-scalable=no",
            enabledZoom = initialContent + ",maximum-scale=10, user-scalable=yes",
            disabledInitially = /(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test(initialContent);

        $.touch.zoom = $.extend({}, {
            enabled: !disabledInitially,
            locked: false,
            disable: function (lock) {
                if (!disabledInitially && !$.touch.zoom.locked) {
                    meta.attr("content", disabledZoom);
                    $.touch.zoom.enabled = false;
                    $.touch.zoom.locked = lock || false;
                }
            },
            enable: function (unlock) {
                if (!disabledInitially && ( !$.touch.zoom.locked || unlock === true )) {
                    meta.attr("content", enabledZoom);
                    $.touch.zoom.enabled = true;
                    $.touch.zoom.locked = false;
                }
            },
            restore: function () {
                if (!disabledInitially) {
                    meta.attr("content", initialContent);
                    $.touch.zoom.enabled = true;
                }
            }
        });

    }());

    /* end zoom ------------------------------------------------------------------------------------------------------*/

    /* orientationfix ------------------------------------------------------------------------------------------------*/

    (function () {
        /* ported from jQuery.mobile */
        // This fix addresses an iOS bug, so return early if the UA claims it's something else.
        if (!(/iPhone|iPad|iPod/.test(navigator.platform) && navigator.userAgent.indexOf("AppleWebKit") > -1 )) {
            return;
        }

        var zoom = $.touch.zoom,
            evt, x, y, z, aig;

        function checkTilt(e) {
            evt = e.originalEvent;
            aig = evt.accelerationIncludingGravity;

            x = Math.abs(aig.x);
            y = Math.abs(aig.y);
            z = Math.abs(aig.z);

            // If portrait orientation and in one of the danger zones
            if (!window.orientation && ( x > 7 || ( ( z > 6 && y < 8 || z < 8 && y > 6 ) && x > 5 ) )) {
                if (zoom.enabled) {
                    zoom.disable();
                }
            } else if (!zoom.enabled) {
                zoom.enable();
            }
        }

        $(window)
            .bind("orientationchange.iosorientationfix", zoom.enable)
            .bind("devicemotion.iosorientationfix", checkTilt);

    }());





    /* scrollstart/scrollstop special event ---------------------------------------------------------------------------*/

    (function () {
        var scrollEvent = 'touchmove scroll';
        $.event.special.scrollstart = {

            enabled: true,
            setup: function () {

                var thisObject = this,
                    $this = $(thisObject),
                    scrolling,
                    timer;

                function trigger(event, state) {
                    scrolling = state;
                    triggerCustomEvent(thisObject, scrolling ? "scrollstart" : "scrollstop", event);
                }

                // iPhone triggers scroll after a small delay; use touchmove instead
                $this.bind(scrollEvent, function (event) {

                    if (!$.event.special.scrollstart.enabled) {
                        return;
                    }

                    if (!scrolling) {
                        trigger(event, true);
                    }

                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        trigger(event, false);
                    }, 50);
                });
            },
            teardown: function () {
                $(this).unbind(scrollEvent);
            }
        };

        function triggerCustomEvent(obj, eventType, event, bubble) {
            var originalType = event.type;
            event.type = eventType;
            if (bubble) {
                $.event.trigger(event, undefined, obj);
            } else {
                $.event.dispatch.call(obj, event);
            }
            event.type = originalType;
        }

    }());



    /* touchclick special event --------------------------------------------------------------------------------------*/
    //create a special event to act as standard 'click' for desktop and 'touch' for touch devices
    (function () {

        var isTouch = false;

        $.event.special.touchclick = {

            setup: function () {
                isTouch = $.touch.support.touch;
            },

            add: function (handleObj) {
                if (!isTouch) {
                    bindClick($(this), handleObj);
                } else {
                    bindTouch($(this), handleObj);
                }
            },

            remove: function (handleObj) {
                if (!isTouch) {
                    unbindClick($(this), handleObj);
                } else {
                    unbindTouch($(this), handleObj);
                }
            }

        };

        function bindClick(element, handleObj) {
            var old_handler = handleObj.handler;
            var selector = handleObj.selector;
            element.on('click', selector, function (event) {
                event.preventDefault();
                event.namespace = 'elliptical.click';
                return old_handler.apply(this, arguments);
            });
        }

        function bindTouch(element, handleObj) {
            var old_handler = handleObj.handler;
            var selector = handleObj.selector;
            element.on('touchstart', selector, function (event) {
                event.preventDefault();
                event.namespace = 'elliptical.touch';
                return old_handler.apply(this, arguments);
            });
        }

        function unbindClick(element, handleObj) {
            var selector = handleObj.selector;
            element.off('click', selector);
        }

        function unbindTouch(element, handleObj) {
            var selector = handleObj.selector;
            element.off('touchstart', selector);
        }

    }());




    /* touchhover special event --------------------------------------------------------------------------------------*/
    //create a special event to handle mouseenter/mouseleave for desktop and  touch devices
    (function () {

        var isTouch = false;

        $.event.special.touchhover = {

            setup: function () {
                isTouch = $.touch.support.touch;
            },

            add: function (handleObj) {
                if (!isTouch) {
                    bindHover($(this), handleObj);
                } else {
                    bindTouch($(this), handleObj);
                }
            },

            remove: function (handleObj) {
                if (!isTouch) {
                    unbindHover($(this), handleObj);
                } else {
                    unbindTouch($(this), handleObj);
                }
            }

        };

        function bindHover(element, handleObj) {
            var old_handler = handleObj.handler;
            var selector = handleObj.selector;
            element.on('mouseenter', selector, function (event) {
                event.preventDefault();
                event.type='hoverover';
                event.namespace = 'ellipsis.hoverover';
                return old_handler.apply(this, arguments);
            });
            element.on('mouseleave', selector, function (event) {
                event.preventDefault();
                event.type='hoverout';
                event.namespace = 'ellipsis.hoverout';
                return old_handler.apply(this, arguments);
            });
        }

        function bindTouch(element, handleObj) {
            var old_handler = handleObj.handler;
            var selector = handleObj.selector;
            element.on('touchend', selector, function (event) {
                event.preventDefault();
                if(element.hasClass('over')){
                    event.type='hoverout';
                    event.namespace = 'ellipsis.hoverout';
                    element.removeClass('over');
                }else{
                    event.type='hoverover';
                    event.namespace = 'ellipsis.hoverover';
                    element.addClass('over');
                }

                return old_handler.apply(this, arguments);
            });
        }

        function unbindHover(element, handleObj) {
            var selector = handleObj.selector;
            element.off('mouseenter', selector);
            element.off('mouseleave', selector);
        }

        function unbindTouch(element, handleObj) {
            var selector = handleObj.selector;
            element.off('touchend', selector);
        }

    }());



    /* fixed navs and inputs focus -----------------------------------------------------------------------------------*/
    //on ios devices, keyboard on input focus will shift fixed navs...workaround: hide navs on focus
    (function () {
        if ($.touch.device.ios) {
            var inputs = $('input, textarea');
            var navs = $('.ui-navbar, .ui-topbar');
            inputs.on('focusin', function (event) {
                onFocus(navs);

            });
            inputs.on('focusout', function (event) {
                onBlur(navs);

            });

        }

        function onFocus(navs){
            navs.addClass('ui-hide');
        }
        function onBlur(navs){

            navs.removeClass('ui-hide');
        }

    }());

    /* auto document.ready scrollTo for smartphones ----------------------------------------------------------------- */

    if ($.touch.autoScrollTo && $.touch.device.smartphone) {
        $.touch.scrollTop(0, 'documentScrollTop');
    }


    return $;

}));


/*
 * =============================================================
 * jQuery.transition
 * =============================================================
 *
 * culled in large part from https://github.com/rstacruz/jquery.transit/
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-utils'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-utils'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    $.transit = {

        // Map of $.css() keys to values for 'transitionProperty'.
        // See https://developer.mozilla.org/en/CSS/CSS_transitions#Properties_that_can_be_animated
        propertyMap: {
            marginLeft: 'margin',
            marginRight: 'margin',
            marginBottom: 'margin',
            marginTop: 'margin',
            paddingLeft: 'padding',
            paddingRight: 'padding',
            paddingBottom: 'padding',
            paddingTop: 'padding'
        },

        // Will simply transition "instantly" if false
        enabled: true,

        // Set this to false if you don't want to use the transition end property.
        useTransitionEnd: false
    };

    var div = document.createElement('div');
    var support = {};

    // Helper function to get the proper vendor property name.
    // (`transition` => `WebkitTransition`)
    function getVendorPropertyName(prop) {
        var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
        var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

        if (prop in div.style) { return prop; }

        for (var i = 0; i < prefixes.length; ++i) {
            var vendorProp = prefixes[i] + prop_;
            if (vendorProp in div.style) { return vendorProp; }
        }
    }

    // Helper function to check if transform3D is supported.
    // Should return true for Webkits and Firefox 10+.
    function checkTransform3dSupport() {
        div.style[support.transform] = '';
        div.style[support.transform] = 'rotateY(90deg)';
        return div.style[support.transform] !== '';
    }

    var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

    // Check for the browser's transitions support.
    // You can access this in jQuery's `$.support.transition`.
    // As per [jQuery's cssHooks documentation](http://api.jquery.com/jQuery.cssHooks/),
    // we set $.support.transition to a string of the actual property name used.
    support.transition = getVendorPropertyName('transition');
    support.transitionDelay = getVendorPropertyName('transitionDelay');
    support.transform = getVendorPropertyName('transform');
    support.transformOrigin = getVendorPropertyName('transformOrigin');
    support.transform3d = checkTransform3dSupport();

    $.extend($.support, support);

    var eventNames = {
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'WebkitTransition': 'webkitTransitionEnd',
        'msTransition': 'MSTransitionEnd'
    };

    // Detect the 'transitionend' event needed.
    var transitionEnd = support.transitionEnd = eventNames[support.transition] || null;

    // Avoid memory leak in IE.
    div = null;

    // ## $.cssEase
    // List of easing aliases that you can use with `$.fn.transition`.
    $.cssEase = {
        '_default': 'ease',
        'in': 'ease-in',
        'out': 'ease-out',
        'in-out': 'ease-in-out',
        'snap': 'cubic-bezier(0,1,.5,1)'
    };

    // ## 'transform' CSS hook
    // Allows you to use the `transform` property in CSS.
    //
    //     $("#hello").css({ transform: "rotate(90deg)" });
    //
    //     $("#hello").css('transform');
    //     //=> { rotate: '90deg' }
    //
    $.cssHooks.transform = {
        // The getter returns a `Transform` object.
        get: function (elem) {
            return $(elem).data('transform');
        },

        // The setter accepts a `Transform` object or a string.
        set: function (elem, v) {
            var value = v;

            if (!(value instanceof Transform)) {
                value = new Transform(value);
            }

            // We've seen the 3D version of Scale() not work in Chrome when the
            // element being scaled extends outside of the viewport.  Thus, we're
            // forcing Chrome to not use the 3d transforms as well.  Not sure if
            // translate is affectede, but not risking it.  Detection code from
            // http://davidwalsh.name/detecting-google-chrome-javascript
            if (support.transform === 'WebkitTransform' && !isChrome) {
                elem.style[support.transform] = value.toString(true);
            } else {
                elem.style[support.transform] = value.toString();
            }

            $(elem).data('transform', value);
        }
    };

    // ## 'transformOrigin' CSS hook
    // Allows the use for `transformOrigin` to define where scaling and rotation
    // is pivoted.
    //
    //     $("#hello").css({ transformOrigin: '0 0' });
    //
    $.cssHooks.transformOrigin = {
        get: function (elem) {
            return elem.style[support.transformOrigin];
        },
        set: function (elem, value) {
            elem.style[support.transformOrigin] = value;
        }
    };

    // ## 'transition' CSS hook
    // Allows you to use the `transition` property in CSS.
    //
    //     $("#hello").css({ transition: 'all 0 ease 0' });
    //
    $.cssHooks.transition = {
        get: function (elem) {
            return elem.style[support.transition];
        },
        set: function (elem, value) {
            elem.style[support.transition] = value;
        }
    };

    // ## Other CSS hooks
    // Allows you to rotate, scale and translate.
    registerCssHook('scale');
    registerCssHook('translate');
    registerCssHook('rotate');
    registerCssHook('rotateX');
    registerCssHook('rotateY');
    registerCssHook('rotate3d');
    registerCssHook('perspective');
    registerCssHook('skewX');
    registerCssHook('skewY');
    registerCssHook('x', true);
    registerCssHook('y', true);

    // ## Transform class
    // This is the main class of a transformation property that powers
    // `$.fn.css({ transform: '...' })`.
    //
    // This is, in essence, a dictionary object with key/values as `-transform`
    // properties.
    //
    //     var t = new Transform("rotate(90) scale(4)");
    //
    //     t.rotate             //=> "90deg"
    //     t.scale              //=> "4,4"
    //
    // Setters are accounted for.
    //
    //     t.set('rotate', 4)
    //     t.rotate             //=> "4deg"
    //
    // Convert it to a CSS string using the `toString()` and `toString(true)` (for WebKit)
    // functions.
    //
    //     t.toString()         //=> "rotate(90deg) scale(4,4)"
    //     t.toString(true)     //=> "rotate(90deg) scale3d(4,4,0)" (WebKit version)
    //
    function Transform(str) {
        if (typeof str === 'string') { this.parse(str); }
        return this;
    }

    Transform.prototype = {
        // ### setFromString()
        // Sets a property from a string.
        //
        //     t.setFromString('scale', '2,4');
        //     // Same as set('scale', '2', '4');
        //
        setFromString: function (prop, val) {
            var args =
                (typeof val === 'string') ? val.split(',') :
                    (val.constructor === Array) ? val :
                        [val];

            args.unshift(prop);

            Transform.prototype.set.apply(this, args);
        },

        // ### set()
        // Sets a property.
        //
        //     t.set('scale', 2, 4);
        //
        set: function (prop) {
            var args = Array.prototype.slice.apply(arguments, [1]);
            if (this.setter[prop]) {
                this.setter[prop].apply(this, args);
            } else {
                this[prop] = args.join(',');
            }
        },

        get: function (prop) {
            if (this.getter[prop]) {
                return this.getter[prop].apply(this);
            } else {
                return this[prop] || 0;
            }
        },

        setter: {
            // ### rotate
            //
            //     .css({ rotate: 30 })
            //     .css({ rotate: "30" })
            //     .css({ rotate: "30deg" })
            //     .css({ rotate: "30deg" })
            //
            rotate: function (theta) {
                this.rotate = unit(theta, 'deg');
            },

            rotateX: function (theta) {
                this.rotateX = unit(theta, 'deg');
            },

            rotateY: function (theta) {
                this.rotateY = unit(theta, 'deg');
            },

            // ### scale
            //
            //     .css({ scale: 9 })      //=> "scale(9,9)"
            //     .css({ scale: '3,2' })  //=> "scale(3,2)"
            //
            scale: function (x, y) {
                if (y === undefined) { y = x; }
                this.scale = x + "," + y;
            },

            // ### skewX + skewY
            skewX: function (x) {
                this.skewX = unit(x, 'deg');
            },

            skewY: function (y) {
                this.skewY = unit(y, 'deg');
            },

            // ### perspectvie
            perspective: function (dist) {
                this.perspective = unit(dist, 'px');
            },

            // ### x / y
            // Translations. Notice how this keeps the other value.
            //
            //     .css({ x: 4 })       //=> "translate(4px, 0)"
            //     .css({ y: 10 })      //=> "translate(4px, 10px)"
            //
            x: function (x) {
                this.set('translate', x, null);
            },

            y: function (y) {
                this.set('translate', null, y);
            },

            // ### translate
            // Notice how this keeps the other value.
            //
            //     .css({ translate: '2, 5' })    //=> "translate(2px, 5px)"
            //
            translate: function (x, y) {
                if (this._translateX === undefined) { this._translateX = 0; }
                if (this._translateY === undefined) { this._translateY = 0; }

                if (x !== null) { this._translateX = unit(x, 'px'); }
                if (y !== null) { this._translateY = unit(y, 'px'); }

                this.translate = this._translateX + "," + this._translateY;
            }
        },

        getter: {
            x: function () {
                return this._translateX || 0;
            },

            y: function () {
                return this._translateY || 0;
            },

            scale: function () {
                var s = (this.scale || "1,1").split(',');
                if (s[0]) { s[0] = parseFloat(s[0]); }
                if (s[1]) { s[1] = parseFloat(s[1]); }

                // "2.5,2.5" => 2.5
                // "2.5,1" => [2.5,1]
                return (s[0] === s[1]) ? s[0] : s;
            },

            rotate3d: function () {
                var s = (this.rotate3d || "0,0,0,0deg").split(',');
                for (var i = 0; i <= 3; ++i) {
                    if (s[i]) { s[i] = parseFloat(s[i]); }
                }
                if (s[3]) { s[3] = unit(s[3], 'deg'); }

                return s;
            }
        },

        // ### parse()
        // Parses from a string. Called on constructor.
        parse: function (str) {
            var self = this;
            str.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function (x, prop, val) {
                self.setFromString(prop, val);
            });
        },

        // ### toString()
        // Converts to a `transition` CSS property string. If `use3d` is given,
        // it converts to a `-webkit-transition` CSS property string instead.
        toString: function (use3d) {
            var re = [];

            for (var i in this) {
                if (this.hasOwnProperty(i)) {
                    // Don't use 3D transformations if the browser can't support it.
                    if ((!support.transform3d) && (
                        (i === 'rotateX') ||
                        (i === 'rotateY') ||
                        (i === 'perspective') ||
                        (i === 'transformOrigin'))) { continue; }

                    if (i[0] !== '_') {
                        if (use3d && (i === 'scale')) {
                            re.push(i + "3d(" + this[i] + ",1)");
                        } else if (use3d && (i === 'translate')) {
                            re.push(i + "3d(" + this[i] + ",0)");
                        } else {
                            re.push(i + "(" + this[i] + ")");
                        }
                    }
                }
            }

            return re.join(" ");
        }
    };

    function callOrQueue(self, queue, fn) {
        if (queue === true) {
            self.queue(fn);
        } else if (queue) {
            self.queue(queue, fn);
        } else {
            fn();
        }
    }

    // ### getProperties(dict)
    // Returns properties (for `transition-property`) for dictionary `props`. The
    // value of `props` is what you would expect in `$.css(...)`.
    function getProperties(props) {
        var re = [];

        $.each(props, function (key) {
            key = $.camelCase(key); // Convert "text-align" => "textAlign"
            key = $.transit.propertyMap[key] || key;
            key = uncamel(key); // Convert back to dasherized

            if ($.inArray(key, re) === -1) { re.push(key); }
        });

        return re;
    }

    // ### getTransition()
    // Returns the transition string to be used for the `transition` CSS property.
    //
    // Example:
    //
    //     getTransition({ opacity: 1, rotate: 30 }, 500, 'ease');
    //     //=> 'opacity 500ms ease, -webkit-transform 500ms ease'
    //
    function getTransition(properties, duration, easing, delay) {
        // Get the CSS properties needed.
        var props = getProperties(properties);

        // Account for aliases (`in` => `ease-in`).
        if ($.cssEase[easing]) { easing = $.cssEase[easing]; }

        // Build the duration/easing/delay attributes for it.
        var attribs = '' + toMS(duration) + ' ' + easing;
        if (parseInt(delay, 10) > 0) { attribs += ' ' + toMS(delay); }

        // For more properties, add them this way:
        // "margin 200ms ease, padding 200ms ease, ..."
        var transitions = [];
        $.each(props, function (i, name) {
            transitions.push(name + ' ' + attribs);
        });

        return transitions.join(', ');
    }

    // ## $.fn.transition
    // Works like $.fn.animate(), but uses CSS transitions.
    //
    //     $("...").transition({ opacity: 0.1, scale: 0.3 });
    //
    //     // Specific duration
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500);
    //
    //     // With duration and easing
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in');
    //
    //     // With callback
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, function() { ... });
    //
    //     // With everything
    //     $("...").transition({ opacity: 0.1, scale: 0.3 }, 500, 'in', function() { ... });
    //
    //     // Alternate syntax
    //     $("...").transition({
    //       opacity: 0.1,
    //       duration: 200,
    //       delay: 40,
    //       easing: 'in',
    //       complete: function() { /* ... */ }
    //      });
    //
    $.fn.transition = $.fn.transit = function (properties, callback) {
        var self = this;
        var delay = 0;
        var queue = true;
        var easing;
        var duration;
        var count;
        var preset;

        /*// Account for `.transition(properties, callback)`.
         if (typeof duration === 'function') {
         callback = duration;
         duration = undefined;
         }

         // Account for `.transition(properties, duration, callback)`.
         if (typeof easing === 'function') {
         callback = easing;
         easing = undefined;
         }*/

        // Alternate syntax.
        if (typeof properties.easing !== 'undefined') {
            easing = properties.easing;
            delete properties.easing;
        }

        if (typeof properties.duration !== 'undefined') {
            duration = properties.duration;
            delete properties.duration;
        }

        if (typeof properties.complete !== 'undefined') {
            callback = properties.complete;
            delete properties.complete;
        }

        if (typeof properties.queue !== 'undefined') {
            queue = properties.queue;
            delete properties.queue;
        }

        if (typeof properties.delay !== 'undefined') {
            delay = properties.delay;
            delete properties.delay;
        }


        preset=properties.preset;
        count=properties.count;
        if(preset!==undefined){
            if ((duration === undefined)||(duration===0)) {
                duration = '';
            } else {
                duration = toSeconds(duration).toString();
            }
            if ((delay === undefined)||(delay===0)) {
                delay = '';
            } else {
                delay = toSeconds(delay).toString();
            }
            if ((count === undefined)||(count===0)) {
                count = '';
            } else {
                count = count.toString();
            }
            var options={};
            options.duration=duration;
            options.delay=delay;
            options.count=count;
            return CSS3.animate(self, options, callback, preset);

        }

        // Set defaults. (`400` duration, `ease` easing)
        if (typeof duration === 'undefined') { duration = $.fx.speeds._default; }
        if (typeof easing === 'undefined') { easing = $.cssEase._default; }

        duration = toMS(duration);

        // Build the `transition` property.
        var transitionValue = getTransition(properties, duration, easing, delay);

        // Compute delay until callback.
        // If this becomes 0, don't bother setting the transition property.
        var work = $.transit.enabled && support.transition;
        var i = work ? (parseInt(duration, 10) + parseInt(delay, 10)) : 0;

        // If there's nothing to do...
        if (i === 0) {
            var fn = function (next) {
                self.css(properties);
                if (callback) { callback.apply(self); }
                if (next) { next(); }
            };

            callOrQueue(self, queue, fn);
            return self;
        }

        // Save the old transitions of each element so we can restore it later.
        var oldTransitions = {};

        var run = function (nextCall) {
            var bound = false;

            // Prepare the callback.
            var cb = function () {
                if (bound) { self.unbind(transitionEnd, cb); }

                if (i > 0) {
                    self.each(function () {
                        this.style[support.transition] = (oldTransitions[this] || null);
                    });
                }

                if (typeof callback === 'function') { callback.apply(self); }
                if (typeof nextCall === 'function') { nextCall(); }
            };

            if ((i > 0) && (transitionEnd) && ($.transit.useTransitionEnd)) {
                // Use the 'transitionend' event if it's available.
                bound = true;
                self.bind(transitionEnd, cb);
            } else {
                // Fallback to timers if the 'transitionend' event isn't supported.
                window.setTimeout(cb, i);
            }

            // Apply transitions.
            self.each(function () {
                if (i > 0) {
                    this.style[support.transition] = transitionValue;
                }
                $(this).css(properties);
            });
        };

        // Defer running. This allows the browser to paint any pending CSS it hasn't
        // painted yet before doing the transitions.
        var deferredRun = function (next) {
            var i = 0;

            // Durations that are too slow will get transitions mixed up.
            // (Tested on Mac/FF 7.0.1)
            if ((support.transition === 'MozTransition') && (i < 25)) { i = 25; }

            window.setTimeout(function () { run(next); }, i);
        };

        // Use jQuery's fx queue.
        callOrQueue(self, queue, deferredRun);

        // Chainability.
        return this;
    };

    function registerCssHook(prop, isPixels) {
        // For certain properties, the 'px' should not be implied.
        if (!isPixels) { $.cssNumber[prop] = true; }

        $.transit.propertyMap[prop] = support.transform;

        $.cssHooks[prop] = {
            get: function (elem) {
                var t = $(elem).css('transform') || new Transform();
                return t.get(prop);
            },

            set: function (elem, value) {
                var t = $(elem).css('transform') || new Transform();
                t.setFromString(prop, value);

                $(elem).css({ transform: t });
            }
        };
    }

    // ### uncamel(str)
    // Converts a camelcase string to a dasherized string.
    // (`marginLeft` => `margin-left`)
    function uncamel(str) {
        return str.replace(/([A-Z])/g, function (letter) { return '-' + letter.toLowerCase(); });
    }

    // ### unit(number, unit)
    // Ensures that number `number` has a unit. If no unit is found, assume the
    // default is `unit`.
    //
    //     unit(2, 'px')          //=> "2px"
    //     unit("30deg", 'rad')   //=> "30deg"
    //
    function unit(i, units) {
        if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
            return i;
        } else {
            return "" + i + units;
        }
    }

    // ### toMS(duration)
    // Converts given `duration` to a millisecond string.
    //
    //     toMS('fast')   //=> '400ms'
    //     toMS(10)       //=> '10ms'
    //
    function toMS(duration) {
        var i = duration;

        // Allow for string durations like 'fast'.
        if ($.fx.speeds[i]) { i = $.fx.speeds[i]; }

        return unit(i, 'ms');
    }

    // Export some functions for testable-ness.
    $.transit.getTransitionValue = getTransition;


    /*
     =========================================
     Preset keyframe animations extension
     =========================================
     */

    //CSS3 uses seconds as the unit measurement
    function toSeconds(ms){
        var sec=parseFloat(ms/1000);
        return sec;
    }

    var CSS3 = {};
    CSS3.pfx = ["webkit", "moz", "MS", "o"];
    if ($.browser.webkit) {
        CSS3.animationend = CSS3.pfx[0] + 'AnimationEnd';
    } else{
        CSS3.animationend = 'animationend'; /* mozilla doesn't use the vendor prefix */
    }
    CSS3.isAnimated = function (ele) {  /* method query to determine if the element is currently being animated; we don't want to attach multiple animationend handlers; undesirable behavior will result */

        //var data = ele.data("events")[CSS3.animationend];
        /*var data = $.data(ele,'events');
         console.log(data);
         if (data === undefined || data.length === 0) {
         return false;  // no animationend event handler attached, return false
         } else {
         return true;  // there is animationend event handler attached, return true
         }*/

        if(!ele[0]){
            return;
        }
        var classList = ele[0].className.split(/\s+/);
        for (var i = 0; i < classList.length; i++) {
            if (classList[i] === 'animated') {
                return true;
            }
        }
        return false;
    };
    CSS3.animate = function (ele, options, callback, animationType) {  /* transition animation handler */

        if (CSS3.isAnimated(ele)) {
            return ele; /* block animation request */
        }
        if (options === undefined) {
            options = {};
        }
        ele.show();
        ele.css({visibility:'visible'});
        var animation = 'animated ' + animationType;
        ele.bind(CSS3.animationend, function (e) {
            ele.removeCSSStyles().removeClass(animation);
            //hide element if animationOut
            if((animationType.indexOf('Out')>-1)||(animationType.indexOf('out')>-1)){
                ele.hide();
            }
            ele.unbind(e);
            if (callback !== undefined) {
                callback.call(ele);
            }
        });

        ele.addCSSStyles(options).addClass(animation);
        return ele;
    };

    CSS3.animationEndEvent=function(){
        return CSS3.animationend;
    };

    CSS3.transitionEndEvent=function(){
        var transitionEnd;
        var pfx = ["webkit", "moz", "MS", "o"];
        if ($.browser.webkit) {
            transitionEnd = pfx[0] + 'TransitionEnd';
        } else if ($.browser.mozilla) {
            transitionEnd = 'transitionend';
            /* mozilla doesn't use the vendor prefix */
        } else if ($.browser.msie) {
            transitionEnd = pfx[2] + 'TransitionEnd';
        } else if ($.browser.opera) {
            transitionEnd = pfx[3] + 'TransitionEnd';
        } else {
            transitionEnd = 'transitionend';
        }
        return transitionEnd;
    };

    /* css style setter methods */
    $.fn.removeCSSStyles = function () {
        this.css({
            'animation-duration': '',
            'animation-delay': '',
            'animation-iteration-count': '',
            '-webkit-animation-duration': '',
            '-webkit-animation-delay': '',
            '-webkit-animation-iteration-count': '',
            '-moz-animation-duration': '',
            '-moz-animation-delay': '',
            '-moz-animation-iteration-count': ''
        });
        return this;
    };
    $.fn.addCSSStyles = function (options) {
        var duration = options.duration;
        var delay = options.delay;
        var count = options.count;
        if (duration === undefined) {
            duration = '';
        } else {
            duration = options.duration.toString() + 's';
        }
        if (delay === undefined) {
            delay = '';
        } else {
            delay = options.delay.toString() + 's';
        }
        if (count === undefined) {
            count = '';
        } else {
            count = options.count.toString();
        }

        this.css({
            'animation-duration': duration,
            'animation-delay': delay,
            'animation-iteration-count': count,
            '-webkit-animation-duration': duration,
            '-webkit-animation-delay': delay,
            '-webkit-animation-iteration-count': count,
            '-moz-animation-duration': duration,
            '-moz-animation-delay': delay,
            '-moz-animation-iteration-count': count
        });

        return this;
    };

    //expose CSS3 object
    $.transit.CSS3=CSS3;

    return $;
}));


/*
 * =============================================================
 * transforms
 * =============================================================
 *
 * Dependencies:
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {

    var transforms={

    };

    /**
     * sets hardware accelerated class and returns toggle flag
     * @param element {Object}
     * @param hardwareAcceleratedClass {String}
     * @returns {Boolean}
     */
    transforms.setHardwareAcceleration = function (element,hardwareAcceleratedClass) {
        var toggleAcceleration;
        if (!element.hasClass(hardwareAcceleratedClass)) {
            toggleAcceleration = true;
            element.addClass(hardwareAcceleratedClass);

        } else {
            toggleAcceleration = false;
        }
        return toggleAcceleration;
    };

    /**
     * removes hardware acceleration class if toggleAcceleration bit set
     * @param element {Object}
     * @param toggleAcceleration {Boolean}
     * @param hardwareAcceleratedClass {String}
     */
    transforms.resetHardwareAcceleration = function (element,toggleAcceleration,hardwareAcceleratedClass) {
        if (toggleAcceleration) {
            element.removeClass(hardwareAcceleratedClass);
        }
    };

    /**
     *
     * @param element {Object}
     * @param overflowContainerClass {String}
     * @returns {Boolean}
     */
    transforms.setContainerOverflow = function (element,overflowContainerClass) {
        var toggleOverflow;
        if (!element.hasClass(overflowContainerClass)) {
            toggleOverflow = true;
            element.addClass(overflowContainerClass);

        } else {
            toggleOverflow = false;
        }

        return toggleOverflow;
    };

    /**
     *
     * @param element {Object}
     * @param toggleOverflow {Boolean}
     * @param overflowContainerClass {String}
     */
    transforms.resetContainerOverflow = function (element,toggleOverflow,overflowContainerClass) {
        if (toggleOverflow) {
            element.removeClass(overflowContainerClass);
        }
    };

    /**
     *
     * @param container {Object}
     * @param leftBoxShadowClass {String}
     * @param fixedToggleContainerClass {String}
     */
    transforms.resetContainer = function (container,leftBoxShadowClass,fixedToggleContainerClass) {
        if(!container){
            return;
        }
        container.css({
            transition: '',
            '-webkit-transition': '',
            '-webkit-transform': '',
            '-moz-transition': '',
            '-moz-transform': '',
            'transform':'',
            'height': ''
        })
            .removeClass(leftBoxShadowClass)
            .removeClass(fixedToggleContainerClass);
    };

    transforms.resetTransition = function (element) {
        element.css({
            transition: '',
            '-webkit-transition': '',
            '-moz-transition': ''
        });

    };

    /**
     *
     * @param element {Object}
     */
    transforms.resetTransform = function (element) {
        element.css({
            transition: '',
            '-webkit-transition': '',
            '-webkit-transform': '',
            '-moz-transition': '',
            '-moz-transform': '',
            'transform':''
        });

    };

    /**
     *
     * @param element {Object}
     * @param coordinates {Object}
     */
    transforms.transform = function (element, coordinates) {
        var obj = {
            '-webkit-transform': 'translate3d(' + coordinates.x + ',' + coordinates.y + ',' + coordinates.z + ')',
            '-moz-transform': 'translate3d(' + coordinates.x + ',' + coordinates.y + ',' + coordinates.z + ')',
            transform: 'translate3d(' + coordinates.x + ',' + coordinates.y + ',' + coordinates.z + ')'
        };

        element.css(obj);

    };

    /**
     *
     * @param element {Object}
     * @param opts  {Object}
     * @param callback  {Function}
     *
     */
    transforms.transition3d = function (element, opts, callback) {
        //get prefixed transitionEnd event
        var CSS3= $.transit.CSS3;
        var transitionEnd = CSS3.transitionEndEvent();

        var coordinates = opts.coordinates;

        /* coordinates properties to pixel */
        coordinates.x=coordinates.x.toPixel();
        coordinates.y=coordinates.y.toPixel();
        coordinates.z=coordinates.z.toPixel();

        var easing = opts.easing || 'ease-in-out';
        opts.duration = opts.duration.toMillisecond() || '300ms';
        opts.delay = opts.delay.toMillisecond() || 0;
        opts.transitionEnd = opts.transitionEnd || false;
        var obj = {
            transition: 'transform ' + opts.duration + ' ' + opts.delay + ' ' + easing,
            '-webkit-transition': '-webkit-transform ' + opts.duration + ' ' + opts.delay + ' ' + easing,
            '-moz-transition': '-moz-transform ' + opts.duration + ' ' + opts.delay + ' ' + easing,
            '-webkit-transform': 'translate3d(' + coordinates.x + ',' + coordinates.y + ',' + coordinates.z + ')',
            '-moz-transform': 'translate3d(' + coordinates.x + ',' + coordinates.y + ',' + coordinates.z + ')',
            transform: 'translate3d(' + coordinates.x + ',' + coordinates.y + ',' + coordinates.z + ')'
        };

        element
            .on(transitionEnd, function () {
                if (opts.transitionEnd) {
                    $(this).off(transitionEnd);
                }
                if (callback) {
                    callback();
                }
            })
            .css(obj);
    };

    $.transit.transforms=transforms;
    return $;

}));

/*
 * =============================================================
 * jQuery UI widget.factory
 * =============================================================
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    var widget_uuid = 0,
        widget_slice = Array.prototype.slice;

    $.cleanData = (function( orig ) {
        return function( elems ) {
            for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
                try {
                    $( elem ).triggerHandler( "remove" );
                    // http://bugs.jquery.com/ticket/8235
                } catch( e ) {}
            }
            orig( elems );
        };
    })( $.cleanData );

    $.widget = function( name, base, prototype ) {
        var fullName, existingConstructor, constructor, basePrototype,
        // proxiedPrototype allows the provided prototype to remain unmodified
        // so that it can be used as a mixin for multiple widgets (#8876)
            proxiedPrototype = {},
            namespace = name.split( "." )[ 0 ];

        name = name.split( "." )[ 1 ];
        fullName = namespace + "-" + name;

        if ( !prototype ) {
            prototype = base;
            base = $.Widget;
        }

        // create selector for plugin
        $.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
            return !!$.data( elem, fullName );
        };

        $[ namespace ] = $[ namespace ] || {};
        existingConstructor = $[ namespace ][ name ];
        constructor = $[ namespace ][ name ] = function( options, element ) {
            // allow instantiation without "new" keyword
            if ( !this._createWidget ) {
                return new constructor( options, element );
            }

            // allow instantiation without initializing for simple inheritance
            // must use "new" keyword (the code above always passes args)
            if ( arguments.length ) {
                this._createWidget( options, element );
            }
        };
        // extend with the existing constructor to carry over any static properties
        $.extend( constructor, existingConstructor, {
            version: prototype.version,
            // copy the object used to create the prototype in case we need to
            // redefine the widget later
            _proto: $.extend( {}, prototype ),
            // track widgets that inherit from this widget in case this widget is
            // redefined after a widget inherits from it
            _childConstructors: []
        });

        basePrototype = new base();
        // we need to make the options hash a property directly on the new instance
        // otherwise we'll modify the options hash on the prototype that we're
        // inheriting from
        basePrototype.options = $.widget.extend( {}, basePrototype.options );
        $.each( prototype, function( prop, value ) {
            if ( !$.isFunction( value ) ) {
                proxiedPrototype[ prop ] = value;
                return;
            }
            proxiedPrototype[ prop ] = (function() {
                var _super = function() {
                        return base.prototype[ prop ].apply( this, arguments );
                    },
                    _superApply = function( args ) {
                        return base.prototype[ prop ].apply( this, args );
                    };
                return function() {
                    var __super = this._super,
                        __superApply = this._superApply,
                        returnValue;

                    this._super = _super;
                    this._superApply = _superApply;

                    returnValue = value.apply( this, arguments );

                    this._super = __super;
                    this._superApply = __superApply;

                    return returnValue;
                };
            })();
        });
        constructor.prototype = $.widget.extend( basePrototype, {
            // TODO: remove support for widgetEventPrefix
            // always use the name + a colon as the prefix, e.g., draggable:start
            // don't prefix for widgets that aren't DOM-based
            widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
        }, proxiedPrototype, {
            constructor: constructor,
            namespace: namespace,
            widgetName: name,
            widgetFullName: fullName
        });

        // If this widget is being redefined then we need to find all widgets that
        // are inheriting from it and redefine all of them so that they inherit from
        // the new version of this widget. We're essentially trying to replace one
        // level in the prototype chain.
        if ( existingConstructor ) {
            $.each( existingConstructor._childConstructors, function( i, child ) {
                var childPrototype = child.prototype;

                // redefine the child widget using the same prototype that was
                // originally used, but inherit from the new version of the base
                $.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
            });
            // remove the list of existing child constructors from the old constructor
            // so the old child constructors can be garbage collected
            delete existingConstructor._childConstructors;
        } else {
            base._childConstructors.push( constructor );
        }

        $.widget.bridge( name, constructor );

        return constructor;
    };

    $.widget.extend = function( target ) {
        var input = widget_slice.call( arguments, 1 ),
            inputIndex = 0,
            inputLength = input.length,
            key,
            value;
        for ( ; inputIndex < inputLength; inputIndex++ ) {
            for ( key in input[ inputIndex ] ) {
                value = input[ inputIndex ][ key ];
                if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
                    // Clone objects
                    if ( $.isPlainObject( value ) ) {
                        target[ key ] = $.isPlainObject( target[ key ] ) ?
                            $.widget.extend( {}, target[ key ], value ) :
                            // Don't extend strings, arrays, etc. with objects
                            $.widget.extend( {}, value );
                        // Copy everything else by reference
                    } else {
                        target[ key ] = value;
                    }
                }
            }
        }
        return target;
    };

    $.widget.bridge = function( name, object ) {
        var fullName = object.prototype.widgetFullName || name;
        $.fn[ name ] = function( options ) {
            var isMethodCall = typeof options === "string",
                args = widget_slice.call( arguments, 1 ),
                returnValue = this;

            // allow multiple hashes to be passed on init
            options = !isMethodCall && args.length ?
                $.widget.extend.apply( null, [ options ].concat(args) ) :
                options;

            if ( isMethodCall ) {
                this.each(function() {
                    var methodValue,
                        instance = $.data( this, fullName );
                    if ( options === "instance" ) {
                        returnValue = instance;
                        return false;
                    }
                    if ( !instance ) {
                        return $.error( "cannot call methods on " + name + " prior to initialization; " +
                            "attempted to call method '" + options + "'" );
                    }
                    if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
                        return $.error( "no such method '" + options + "' for " + name + " widget instance" );
                    }
                    methodValue = instance[ options ].apply( instance, args );
                    if ( methodValue !== instance && methodValue !== undefined ) {
                        returnValue = methodValue && methodValue.jquery ?
                            returnValue.pushStack( methodValue.get() ) :
                            methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function() {
                    var instance = $.data( this, fullName );
                    if ( instance ) {
                        instance.option( options || {} );
                        if ( instance._init ) {
                            instance._init();
                        }
                    } else {
                        $.data( this, fullName, new object( options, this ) );
                    }
                });
            }

            return returnValue;
        };
    };

    $.Widget = function( /* options, element */ ) {};
    $.Widget._childConstructors = [];

    $.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: {
            disabled: false,

            // callbacks
            create: null
        },
        _createWidget: function( options, element ) {
            element = $( element || this.defaultElement || this )[ 0 ];
            this.element = $( element );
            this.uuid = widget_uuid++;
            this.eventNamespace = "." + this.widgetName + this.uuid;
            this.options = $.widget.extend( {},
                this.options,
                this._getCreateOptions(),
                options );

            this.bindings = $();
            this.hoverable = $();
            this.focusable = $();

            if ( element !== this ) {
                $.data( element, this.widgetFullName, this );
                this._on( true, this.element, {
                    remove: function( event ) {
                        if ( event.target === element ) {
                            this.destroy();
                        }
                    }
                });
                this.document = $( element.style ?
                    // element within the document
                    element.ownerDocument :
                    // element is window or document
                    element.document || element );
                this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
            }

            this._create();
            this._trigger( "create", null, this._getCreateEventData() );
            this._init();
        },
        _getCreateOptions: $.noop,
        _getCreateEventData: $.noop,
        _create: $.noop,
        _init: $.noop,

        destroy: function() {
            this._destroy();
            // we can probably remove the unbind calls in 2.0
            // all event bindings should go through this._on()
            this.element
                .unbind( this.eventNamespace )
                .removeData( this.widgetFullName )
                // support: jquery <1.6.3
                // http://bugs.jquery.com/ticket/9413
                .removeData( $.camelCase( this.widgetFullName ) );
            this.widget()
                .unbind( this.eventNamespace )
                .removeAttr( "aria-disabled" )
                .removeClass(
                    this.widgetFullName + "-disabled " +
                    "ui-state-disabled" );

            // clean up events and states
            this.bindings.unbind( this.eventNamespace );
            this.hoverable.removeClass( "ui-state-hover" );
            this.focusable.removeClass( "ui-state-focus" );
        },
        _destroy: $.noop,

        widget: function() {
            return this.element;
        },

        option: function( key, value ) {
            var options = key,
                parts,
                curOption,
                i;

            if ( arguments.length === 0 ) {
                // don't return a reference to the internal hash
                return $.widget.extend( {}, this.options );
            }

            if ( typeof key === "string" ) {
                // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
                options = {};
                parts = key.split( "." );
                key = parts.shift();
                if ( parts.length ) {
                    curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
                    for ( i = 0; i < parts.length - 1; i++ ) {
                        curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
                        curOption = curOption[ parts[ i ] ];
                    }
                    key = parts.pop();
                    if ( arguments.length === 1 ) {
                        return curOption[ key ] === undefined ? null : curOption[ key ];
                    }
                    curOption[ key ] = value;
                } else {
                    if ( arguments.length === 1 ) {
                        return this.options[ key ] === undefined ? null : this.options[ key ];
                    }
                    options[ key ] = value;
                }
            }

            this._setOptions( options );

            return this;
        },
        _setOptions: function( options ) {
            var key;

            for ( key in options ) {
                this._setOption( key, options[ key ] );
            }

            return this;
        },
        _setOption: function( key, value ) {
            this.options[ key ] = value;

            if ( key === "disabled" ) {
                this.widget()
                    .toggleClass( this.widgetFullName + "-disabled", !!value );

                // If the widget is becoming disabled, then nothing is interactive
                if ( value ) {
                    this.hoverable.removeClass( "ui-state-hover" );
                    this.focusable.removeClass( "ui-state-focus" );
                }
            }

            return this;
        },

        enable: function() {
            return this._setOptions({ disabled: false });
        },
        disable: function() {
            return this._setOptions({ disabled: true });
        },

        _on: function( suppressDisabledCheck, element, handlers ) {
            var delegateElement,
                instance = this;

            // no suppressDisabledCheck flag, shuffle arguments
            if ( typeof suppressDisabledCheck !== "boolean" ) {
                handlers = element;
                element = suppressDisabledCheck;
                suppressDisabledCheck = false;
            }

            // no element argument, shuffle and use this.element
            if ( !handlers ) {
                handlers = element;
                element = this.element;
                delegateElement = this.widget();
            } else {
                // accept selectors, DOM elements
                element = delegateElement = $( element );
                this.bindings = this.bindings.add( element );
            }

            $.each( handlers, function( event, handler ) {
                function handlerProxy() {
                    // allow widgets to customize the disabled handling
                    // - disabled as an array instead of boolean
                    // - disabled class as method for disabling individual parts
                    if ( !suppressDisabledCheck &&
                        ( instance.options.disabled === true ||
                            $( this ).hasClass( "ui-state-disabled" ) ) ) {
                        return;
                    }
                    return ( typeof handler === "string" ? instance[ handler ] : handler )
                        .apply( instance, arguments );
                }

                // copy the guid so direct unbinding works
                if ( typeof handler !== "string" ) {
                    handlerProxy.guid = handler.guid =
                        handler.guid || handlerProxy.guid || $.guid++;
                }

                var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
                    eventName = match[1] + instance.eventNamespace,
                    selector = match[2];
                if ( selector ) {
                    delegateElement.delegate( selector, eventName, handlerProxy );
                } else {
                    element.bind( eventName, handlerProxy );
                }
            });
        },

        _off: function( element, eventName ) {
            eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
            element.unbind( eventName ).undelegate( eventName );
        },

        _delay: function( handler, delay ) {
            function handlerProxy() {
                return ( typeof handler === "string" ? instance[ handler ] : handler )
                    .apply( instance, arguments );
            }
            var instance = this;
            return setTimeout( handlerProxy, delay || 0 );
        },

        _hoverable: function( element ) {
            this.hoverable = this.hoverable.add( element );
            this._on( element, {
                mouseenter: function( event ) {
                    $( event.currentTarget ).addClass( "ui-state-hover" );
                },
                mouseleave: function( event ) {
                    $( event.currentTarget ).removeClass( "ui-state-hover" );
                }
            });
        },

        _focusable: function( element ) {
            this.focusable = this.focusable.add( element );
            this._on( element, {
                focusin: function( event ) {
                    $( event.currentTarget ).addClass( "ui-state-focus" );
                },
                focusout: function( event ) {
                    $( event.currentTarget ).removeClass( "ui-state-focus" );
                }
            });
        },

        _trigger: function( type, event, data ) {
            var prop, orig,
                callback = this.options[ type ];

            data = data || {};
            event = $.Event( event );
            event.type = ( type === this.widgetEventPrefix ?
                type :
                this.widgetEventPrefix + type ).toLowerCase();
            // the original event may come from any element
            // so we need to reset the target on the new event
            event.target = this.element[ 0 ];

            // copy original event properties over to the new event
            orig = event.originalEvent;
            if ( orig ) {
                for ( prop in orig ) {
                    if ( !( prop in event ) ) {
                        event[ prop ] = orig[ prop ];
                    }
                }
            }

            this.element.trigger( event, data );
            return !( $.isFunction( callback ) &&
                callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
                event.isDefaultPrevented() );
        }
    };

    $.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
        $.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
            if ( typeof options === "string" ) {
                options = { effect: options };
            }
            var hasOptions,
                effectName = !options ?
                    method :
                        options === true || typeof options === "number" ?
                    defaultEffect :
                    options.effect || defaultEffect;
            options = options || {};
            if ( typeof options === "number" ) {
                options = { duration: options };
            }
            hasOptions = !$.isEmptyObject( options );
            options.complete = callback;
            if ( options.delay ) {
                element.delay( options.delay );
            }
            if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
                element[ method ]( options );
            } else if ( effectName !== method && element[ effectName ] ) {
                element[ effectName ]( options.duration, options.easing, callback );
            } else {
                element.queue(function( next ) {
                    $( this )[ method ]();
                    if ( callback ) {
                        callback.call( element[ 0 ] );
                    }
                    next();
                });
            }
        };
    });

    return $.widget;

}));

/*
 * =============================================================
 * ellipsis.widget
 * =============================================================
 *
 *
 * ellipsis extensions of the jQuery UI factory
 * uses the Polymer Platform to create custom elements/web components and creates a "stateful widget instance"
 * of a custom element on the jQuery object
 * other enhancements include: template rendering, animation support, media query support, device support, location support
 *
 * dependencies:
 * jquery widget ui factory
 * ellipsis platform
 * ellipsis utils
 *
 * provider dependencies:
 * dust.js-->template
 * ellipsis animation-->animation support -->transition plugin method for transitions, transforms provider for 3d transforms
 * ellipsis touch--->touch/gesture/media query/device support, jQuery special events for click,hover that trigger corresponding touch gestures
 */
(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-utils'),require('ellipsis-platform'),require('./widget.factory'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-utils','ellipsis-platform','./widget.factory'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {

    //init providers
    var touch_= $.touch || {};
    var transit_= $.transit || {};


    /* extend base prototype public options */
    /* for the most part, we follow a dependency injection/provider pattern for UI factory enhancements */
    var options = {
        $providers:{
            template:window.dust || {},
            device: touch_.device || {},
            mq: touch_.mq || {},
            transforms: transit_.transforms || {},
            location:function(url){window.location=url;},
            utils: $.utils || {}
        },
        $customElements:false,
        mqMaxWidth: $.touch.mqMaxWidth || 1024

    };
    window.ellipsis=window.ellipsis || {};
    $.extend($.Widget.prototype.options, options);

    /* private data store */
    var _data = {
        containerSelector: '[data-role="container"]',
        $containerSelector:'ui-container',
        drawerClass: 'touch-ui-drawer',
        $drawerElement:'<touch-ui-drawer></touch-ui-drawer>',
        touchMenuClass: 'touch-ui-menu',
        touchDropdownClass: 'touch-ui-dropdown',
        $menuElement:'<ui-menu></ui-menu>',
        $touchMenuElement:'<touch-ui-menu></touch-ui-menu>',
        menuClass: 'ui-menu',
        listItem:'li',
        $listItem:'menu-item',
        $listItemElement:'<menu-item></menu-item>',
        dropdownClass: 'ui-dropdown',
        $dropdownElement:'<ui-dropdown></ui-dropdown>',
        searchClass: 'ui-search',
        $searchRole:'[role="search"]',
        $overlayElement:'<ui-overlay></ui-overlay>',
        hardwareAcceleratedClass: 'ui-hardware-accelerated',
        leftBoxShadowClass: 'ui-left-box-shadow',
        fixedToggleContainerClass: 'ui-fixed-toggle-container',
        overflowContainerClass: 'ui-overflow-container',
        $toggleSelector:'ui-toggle',
        loadingContainer:'.ui-loading-container',
        loading:'.ui-loading',
        loadingDelay:300,
        $modalElement:'<ui-modal></ui-modal>',
        modalClass:'ui-modal',
        modal:null,
        modalOpacity:.4,
        modalZIndex:99999,
        click:'touchclick',
        hover:'touchhover',
        $elements:['ui-container',
            'ui-overlay',
            'ui-modal',
            'ui-menu',
            'menu-item',
            'ui-brand',
            'ui-toggle',
            'menu-item-dropdown',
            'menu-item-search',
            'menu-divider',
            'grid-row',
            'grid-columns',
            'ui-select',
            'ui-input-addon',
            'ui-input-icon',
            'ui-loading',
            'ui-notification',
            'ui-slide-notification',
            'ui-flex-grid',
            'grid-item',
            'ui-flex-table',
            'ui-dropdown',
            'ui-mega-dropdown',
            'ui-media-object',
            'ui-box',
            'ui-breadcrumb',
            'breadcrumb-item',
            'ui-menu-tab',
            'ui-flex-list',
            'ui-flex-gallery',
            'ui-flex-form',
            'ui-radio-list',
            'form-item',
            'flex-box',
            'flex-form',
            'flex-list',
            'flex-grid',
            'flex-label',
            'ui-badge',
            'ui-semantic-label',
            'ui-semantic-checkbox',
            'social-icon',
            'ui-tip',
            'ui-column',
            'column-item',
            'ui-flex-container',
            'touch-ui-drawer',
            'touch-ui-menu',
            'touch-ui-dropdown',
            'touch-ui-toggle',
            'touch-ui-brand',
            'touch-icons',
            'touch-icon',
            'touch-ui-brand',
            'ui-icons',
            'screen-icon',
            'ui-screentab',
            'ui-step-progress',
            'progress-item',
            'touch-template',
            'empty-template'
        ]

    };

    $.Widget.prototype._data = $.Widget.prototype._data || {};
    $.extend($.Widget.prototype._data, _data);



    /* private -------------------------------------------------------------------------------------------------------*/

    /**
     * use _getCreateEventData as a 'reserved hook' to bind the internal store to the instance
     * @private
     */
    $.Widget.prototype._getCreateEventData= function(){
        this._data=$.widget.extend({},this._data);
        //set our own data store record of an instance
        $.data(this.element[0],'custom-' + this.widgetName,this.widgetName);


        /* fire this to hook the original method */
        this._onCreateEventData();
    };


    /**
     * replaces _getCreateEventData for the instance method hook
     * @private
     */
    $.Widget.prototype._onCreateEventData= $.noop;


    /* expose an animation method for widget animations/transitions */
    /**
     *
     * @param element {Object}
     * @param options {Object}
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._transitions = function (element, options, callback) {
        options = options || {};
        if (options === {}) {
            options.duration = 300;
            options.preset = 'fadeIn';
        }
        if(options.preset==='none'){
            element.hide();
            return;
        }
        element.transition(options, function () {
            if (callback) {
                callback.call(element[ 0 ]);
            }
        });
    };

    /* expose render method for templates */
    /**
     *
     * @param element {Object}
     * @param options {Object}
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._render = function (element, options, callback) {
        var provider = $.Widget.prototype.options.$providers.template;
        var context=parseTemplateContext(options,provider);
        var template=templateReference(options,provider);
        provider.render(template, context, function (err, out) {
            var html=out;
            element.html(html);
            if (callback) {
                callback(err, html);
            }
        });
    };

    /**
     * method that returns parsed html from a rendered template(however, does not insert it into an element like 'render')
     * @param options {Object}
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._renderTemplate = function (options, callback) {
        options.parse=(options.parse !== undefined) ? options.parse : true;
        var provider = $.Widget.prototype.options.$providers.template;
        var context=parseTemplateContext(options,provider);
        var template=templateReference(options,provider);
        provider.render(template, context, function (err, out) {
            var html = out.replace(/<ui-template(.*?)>/g, '').replace(/<\/ui-template>/g, '');
            var parsedHtml= (options.parse) ? $.parseHTML(html) : html;
            if (callback) {
                callback(err, parsedHtml);
            }
        });
    };

    $.Widget.prototype._renderTemplateString = function (element, options, callback) {
        var provider = $.Widget.prototype.options.$providers.template;
        var templateString = options.templateString;
        var template = options.template;
        var model = options.model;
        if (typeof options.compile !== 'undefined') {
            if (options.compile) {
                var compiled = provider.compile(templateString, template);
                provider.loadSource(compiled);
            }
        }
        provider.render(template, model, function (err, out) {
            element.html(out);
            if (callback) {
                callback(err, out);
            }
        });
    };

    /**
     * renders a ui-template element fragment
     * @param element {Object}
     * @param options {Object}
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._renderFragment = function (element, options, callback) {
        var provider = $.Widget.prototype.options.$providers.template;
        var context=parseTemplateContext(options,provider);
        var template=templateReference(options,provider);
        provider.render(template, context, function (err, out) {
            var html=out.replace(/<ui-template(.*?)>/g,'').replace(/<\/ui-template>/g,'');
            element.html(html);
            if (callback) {
                callback(err, html);
            }
        });
    };

    $.Widget.prototype._precompileTemplate = function (id,node,prop) {
        var str=getTemplateFragementById(id);
        if(!str){
            var $provider = $.Widget.prototype.options.$providers.template;
            precompileTemplateFragment($provider,node,id,prop);
        }
    };

    /**
        * fetches the uncompiled string template fragment for the passed id
        * @param id {String}
        * @returns {String}
        */
    $.Widget.prototype._getFragmentById = function (id) {
        return getTemplateFragementById(id);
    };

    function parseTemplateContext(options,provider){
        if (provider === null) {
            throw new Error('Error: render requires a template provider to be set');
        }
        if (typeof options === 'undefined') {
            throw new Error('Error: render requires an options object');
        }
        if (typeof options.template === 'undefined' && typeof options.templateStr ==='undefined') {
            throw new Error('Error: template name or template string is required');
        }
        options.model = options.model || {};
        var context={};
        (options.context) ? context[options.context]=options.model : context=options.model;
        return context;
    }

    function templateReference(opts,$provider){
        if(opts.template){
            return opts.template
        }else if(opts.templateStr){
            var name='str_' + rndString(8);
            var compiled = $provider.compile(opts.templateStr, name);
            $provider.loadSource(compiled);

            return name;
        }else{
            return null;
        }
    }

    function precompileTemplateFragment($provider, node, id,prop) {
        node = upgradeTemplateCustomElements(node);
        var html = node.prop(prop);
        html = html.replace(/&quot;/g,'"');
        var obj={
            id:id,
            fragment:html
        };
        $$.fragments.push(obj);
        var compiled=$provider.compile(html,id);
        $provider.loadSource(compiled);
    }

    function getTemplateFragementById(id){
        var fragment;
        if(!$$ || !$$.fragments){
            return null;
        }
        if (!$$.fragments.length > 0){
            return null;
        }
        $$.fragments.forEach(function(obj){
            if(obj.id===id){
                fragment=obj.fragment;
            }
        });

        return fragment;
    }

    function upgradeTemplateCustomElements(node){
        var upgrades = node.find('[html5-imported="true"]').not('[data-upgraded="true"]');
        if (upgrades.length > 0) {
            $.each(upgrades, function (index, element) {
                _HTML5Imports.upgradeElement(element.tagName, element);
            });
        }
        return node;
    }

    $.Widget.prototype._renderElementTemplateImports=function(templateNode,scope){
        if(_HTML5Imports ===undefined){
            return false;
        }
        var provider = $.Widget.prototype.options.$providers.template;
        var upgrades=templateNode.find('[html5-imported="true"]').not('[data-upgraded="true"]');
        if(upgrades.length > 0){
            $.each(upgrades,function(index,element){
                _HTML5Imports.upgradeElement(element.tagName,element);
            });
            $.each(upgrades,function(index,element){
                var $element=$(element);
                var att=$element.attr('render-inline');
                if(att){
                    var modelProp=$element.attr('inline-scope');
                    var model=scope[modelProp];
                    var parent=$element.parent();
                    var template=$element.attr('inline-template');
                    provider.render(template, model, function (err, out) {
                        if(out){
                            var html=out.replace(/<ui-template(.*?)>/g,'').replace(/<\/ui-template>/g,'');
                            parent.html(html);
                            
                        }
                    });
                }
            });
        }
    };

    function rndString(length){
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }

    /**
     * converts a string into a html document
     * @param htmlString {String}
     * @returns {HTMLDocument}
     * @private
     */
    $.Widget.prototype._DOMParser=function(htmlString){
        return new DOMParser().parseFromString(htmlString, 'text/html');

    };

    $.Widget.prototype._randomString = function (length) {
        return rndString(length);

    };

    /*key-value session store */
    /**
     * get value
     * @param key {String}
     * @returns {Object}
     * @private
     */
    $.Widget.prototype._getData = function (key) {
        return sessionStorage.getItem(key);
    };

    /**
     * set key/value
     * @param key {String}
     * @param val {Object}
     * @private
     */
    $.Widget.prototype._setData = function (key, val) {
        sessionStorage.setItem(key, val);
    };



    $.Widget.prototype._utils=$.Widget.prototype.options.$providers.utils || {};

    /**
     * private method that returns screen mode
     * @returns {string}
     * @private
     */
    $.Widget.prototype._mode = function () {
        return (this._support.device.viewport.width > this.options.mqMaxWidth) ? "desktop" : "touch";
    };



    /**
     *
     * @param obj {Object}
     * @returns {Object}
     * @private
     */
    $.Widget.prototype._offset=function(obj){
        var curleft = curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }
        return{
            top:curtop,
            left:curleft
        }
    };

    /**
     * preload images from element
     * @param element {Object}
     * @param callback {Function}
     * @returns {boolean}
     * @private
     */
    $.Widget.prototype._preloadImages = function (element, callback) {
        var imgArray = [];
        var err = {};
        var data = {};
        var images = element.find('img').not('[data-src]');
        var length = images.length;
        var counter = 0;
        if (length === 0) {
            if (callback) {
                err.message = 'No images found in element';
                callback(err, null);
            }
            return false;
        }
        $.each(images, function (i, img) {
            var image = new Image();
            $(image).bind('load', function (event) {
                counter++;
                imgArray.push(image);
                if (counter === length) {
                    if (callback) {
                        data.images = imgArray;
                        data.length = counter;
                        callback(null, data);
                    }
                }
            });
            image.src = img.src;
        });
        return true;
    };


    /**
     *
     * @param evt {String}
     * @param data {Object}
     * @private
     */
    $.Widget.prototype._onEventTrigger = function (evt, data) {
        var event = $.Event(evt);

        this._trigger(evt, event, data);
        //this.element.trigger(evt,data);
        //$(window).trigger(evt,data);
    };

    /**
     * scrollTop event dispatcher
     * @param ypos {Number}
     * @param evt {String}
     * @private
     */
    $.Widget.prototype._scrollTop= function (ypos, evt) {
        if ($.type(ypos) !== "number") {
            ypos = 0;
        } else if (typeof evt === 'undefined') {
            evt = 'scrollTop';
        }

        setTimeout(function () {
            window.scrollTo(0, ypos);
            $(document).trigger(evt, { x: 0, y: ypos });
        }, 20);
    };

    /**
     *
     * @param element {Object}
     * @private
     */
    $.Widget.prototype._setHardwareAcceleration = function (element) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        this._data.toggleAcceleration =provider.setHardwareAcceleration(element,this._data.hardwareAcceleratedClass);
    };

    /**
     *
     * @param element {Object}
     * @private
     */
    $.Widget.prototype._resetHardwareAcceleration = function (element) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.resetHardwareAcceleration(element,this._data.toggleAcceleration,this._data.hardwareAcceleratedClass);
    };

    $.Widget.prototype._setContainerOverflow = function (element) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        this._data.toggleOverflow=provider.setContainerOverflow(element,this._data.overflowContainerClass);
    };

    /**
     *
     * @param element {Object}
     * @private
     */
    $.Widget.prototype._resetContainerOverflow = function (element) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.resetContainerOverflow(element,this._data.overflowContainerClass);
    };

    /**
     *
     * @param container {object}
     * @private
     */
    $.Widget.prototype._resetContainer = function (container) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.resetContainer(container,this._data.leftBoxShadowClass,this._data.fixedToggleContainerClass);
    };


    /**
     *
     * @param element {object}
     * @private
     */
    $.Widget.prototype._resetTransition = function (element) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.resetTransition(element);
    };

    /**
     *
     * @param element {object}
     * @private
     */
    $.Widget.prototype._resetTransform = function (element) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.resetTransform(element);
    };

    /**
     *
     * @param element {Object}
     * @param coordinates {Object}
     * @private
     */
    $.Widget.prototype._transform = function (element, coordinates) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.transform(element,coordinates);

    };

    /**
     *
     * @param element {object}
     * @param opts {object}
     * @param callback {function}
     * @private
     */
    $.Widget.prototype._3dTransition = function (element, opts, callback) {
        var provider=$.Widget.prototype.options.$providers.transforms;
        provider.transition3d(element,opts,callback);

    };

    /**
     * requestAnimationFrame wrapper
     * @type {window.requestAnimationFrame|*|Function}
     * @private
     */
    $.Widget.prototype._requestAnimationFrame = (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            setTimeout(callback, 1000 / 60);
        }
        );



    /**
     * binds a touch gesture as a jquery object to the passed element
     * @param element {object}
     * @param obj (object}
     * @returns {object}
     * @private
     */
    $.Widget.prototype._touch = function (element,obj) {
        return element.touch(obj);
    };

    $.Widget.prototype._press = function () {
        var press = ('ontouchend' in document) ? 'touchstart' : 'click';
        return press;
    };

    /**
     * queryable device info & media queries attached to the instance
     *
     * @private
     */
    $.Widget.prototype._support = Object.defineProperties({}, {
        'device':{
            get:function(){
                return $.Widget.prototype.options.$providers.device;
            },
            configurable: false
        },

        'mq':{
            get:function(){
                return $.Widget.prototype.options.$providers.mq;
            },
            configurable: false
        }
    });


    /**
     * @param opts {Object}
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._loadTemplate = function (opts,callback) {
        throw new Error('Load Template method not implemented for this widget');
    };

    /**
     * add modal overlay
     * @param element {Object}
     * @param opts {Object}
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._setModal = function (element,opts,callback) {
        var div=$('<div class="ui-modal"></div>');
        if(opts.cssClass){
            div.addClass(opts.cssClass);
        }

        if(opts.zIndex){
            div.css({
                'z-index':opts.zIndex
            });
        }
        this._data.modal=div;
        var opacity=(opts.opacity) ? opts.opacity : this._data.modalOpacity;
        div.css({
            opacity:0
        });
        element.append(div);

        this._transitions(div,{
            opacity:opacity,
            duration:250
        },function(){
            if(callback){
                callback();
            }
        });
    };

    /**
     * remove modal
     * @param callback {Function}
     * @private
     */
    $.Widget.prototype._removeModal = function (callback) {
        var self=this;
        var modal=this._data.modal;
        if(!modal || modal===undefined ){
            return;
        }
        this._transitions(modal,{
            opacity:0,
            duration:250
        },function(){
            modal.remove();
            self._data.modal=null;
            if(callback){
                callback();
            }
        });
    };

    /**
     * overwrite the jQuery UI _trigger method because 'name.event' more expressive than the run-on 'nameevent'
     * event subscribing:'widgetName + '.' + type;  'window.show', as opposed to 'windowshow'
     * @param type {String}
     * @param event {Object}
     * @param data {Object}
     * @returns {boolean}
     * @private
     */
    $.Widget.prototype._trigger=function( type, event, data ) {
        var prop, orig,
            callback = this.options[ type ];

        data = data || {};
        event = $.Event( event );
        event.type = ( type === this.widgetEventPrefix ?
            type :
            this.widgetEventPrefix + '.' + type ).toLowerCase();
        // the original event may come from any element
        // so we need to reset the target on the new event
        event.target = this.element[ 0 ];

        // copy original event properties over to the new event
        orig = event.originalEvent;
        if ( orig ) {
            for ( prop in orig ) {
                if ( !( prop in event ) ) {
                    event[ prop ] = orig[ prop ];
                }
            }
        }

        this.element.trigger( event, data );
        return !( $.isFunction( callback ) &&
            callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
            event.isDefaultPrevented() );
    };

    /**
     * location handler
     * @param url {String}
     * @private
     */
    $.Widget.prototype._location=function(url){
        var fn=$.Widget.prototype.options.$providers.location;
        fn(url);
    };

    /**
     * registers custom tag as an custom element
     * @param tag {String}
     * @param ElementProto {Object}
     * @private
     */
    $.Widget.prototype._registerElement=function(tag,ElementProto){
        if(typeof ElementProto ==='undefined'){
            ElementProto=HTMLElement.prototype;
            ElementProto._name='HTMLElement';
        }
        var proto = Object.create(ElementProto);
        proto._tagName = tag;
        var object_={prototype:proto};

        /* register the element */
        if(ElementProto._name==='HTMLElement'){
            document.register(tag,object_);
        }else{
            object_=getExtendedObject(ElementProto._name,object_);
            document.register(tag,object_);
        }

    };

    /**
     * registers an array of custom tags as custom elements
     * @param arr (ofString or ofObject) object={name,prototype)
     * @private
     */
    $.Widget.prototype._registerElements=function(arr){

        if(typeof arr==='string'){ //support simple passing of a string
            $.Widget.prototype._registerElement(arr);
        }else{
            if(arr.length>0){
                arr.forEach(function(t){
                    (typeof t==='string') ? $.Widget.prototype._registerElement(t) : $.Widget.prototype._registerElement(t.name, t.prototype);
                });
            }
        }
    };

    $.Widget.prototype._instantiated=function(element,name){
        return(name=== $.data(element,'custom-' + name));
    };

    $.Widget.prototype._getAttrs=function(element,camelCase){
        return $.widget.getOpts(element,camelCase);
    }

    $.Widget.prototype._jsonParseMessage = function (obj) {
        try {
            var msgObj = JSON.parse(obj);
            if (msgObj.message) {
                return msgObj.message;
            } else {
                return obj;
            }
        } catch (ex) {
            return obj;
        }
    }


    /* public --------------------------------------------------------------------------------------------------------*/


    /**
     *
     * @param opts {object} opts.model,opts.template
     * @param callback {function}
     * @public
     */
    $.Widget.prototype.loadTemplate = function (opts, callback) {
        this._loadTemplate(opts, function (err, out) {
            if (callback) {
                callback(err, out);
            }
        });
    };

    /**
     *
     * @param options {object}
     * @public
     */
    $.Widget.prototype.setOptions = function (options) {
        this._setOptions(options);
    };


    /* replace show,hide with css3 transitions */
    $.each({ show: "fadeIn", hide: "fadeOut" }, function (method, defaultEffect) {
        $.Widget.prototype[ "_" + method ] = function (element, options, callback) {
            var _event = (options) ? options.event : null;
            if (typeof options === "string") {
                options = { effect: options };
            }
            var hasOptions,
                effectName = !options ?
                    method :
                        options === true || typeof options === "number" ?
                    defaultEffect :
                    options.effect || defaultEffect;
            options = options || {};
            if (typeof options === "number") {
                options = { duration: options };
            }
            hasOptions = !$.isEmptyObject(options);
            options.complete = callback;
            if (options.delay) {
                element.delay(options.delay);
            }

            if (!options.duration) {
                options.duration = 300; //default value
            }

            //we are using our own CSS3 Transitions/animations implementation instead of jQuery UI Effects

            var obj = {};
            obj.duration = options.duration;
            obj.preset = options.effect;

            //test for css3 support; if not, then on 'show' or 'hide', just call the jquery methods
            if ($('html').hasClass('no-css3dtransforms') || options.effect === 'none') {
                if (_event === 'show') {
                    element.show();
                    if (callback) {
                        callback();

                    }
                } else if (_event === 'hide') {
                    element.hide();
                    if (callback) {
                        callback();

                    }
                }

            } else {
                this._transitions(element, obj, callback);
            }
        };
    });

    /**
     * expose render
     * @param element {Object}
     * @param opts {Object}
     * @param callback {Function}
     */
    $.widget.render=function(element,opts,callback){
        $.Widget.prototype._render(element,opts,callback);
    };


    /**
     * getters & setters for widget providers
     *
     */
    $.widget.$providers=function(opts){
        for (var key in opts) {
            if (opts.hasOwnProperty(key)) {
                $.Widget.prototype.options.$providers[key]=opts[key];
            }
        }
    };

    /**
     * getter/setter
     * @type {{options: void}}
     */
    $.widget.config={
        options:Object.defineProperties({}, {
            'mqMaxWidth':{
                get: function () {
                    return  $.Widget.prototype.options.mqMaxWidth;
                },
                set:function(val){
                    $.Widget.prototype.options.mqMaxWidth=val;

                }
            }
        })
    };

    /**
     * custom element info object
     * @returns {{Selector: string, customElements: boolean}}
     */
    $.widget.customElementsObj=function(){
        var Selector_='[data-ui]';
        var customElements=false;
        if($('html').hasClass('customelements')){
            Selector_='ui-element';
            customElements=true;
        }
        return {
            Selector:Selector_,
            customElements:customElements
        }
    };

    /**
     * mutation observer handler
     * parse mutations for widget/element instantiations
     * @param mutations {Array}
     */
    $.widget.onMutation=function(mutations){
        /* support data-ui and ui-element */
        var _custom= $.widget.customElementsObj();
        var Selector_=_custom.Selector;
        var customElements=_custom.customElements;

        /* pass along to any registered listeners */
        $(document).trigger('ellipsis.onMutation',{mutations:mutations});

        mutations.forEach(function (mutation) {
            var added=mutation.addedNodes;
            var removed=mutation.removedNodes;
            if(added.length>0){
                //look for upgradeable elements
                discoverUpgradeableElements(added);

                //look for ui-elements
                discoverUIElements(added,Selector_,customElements);
                //look for custom definition elements
                discoverCustomDefinitionElements(added);

            }else if(removed.length>0){
                try{
                    $(document).tooltip('remove',removed);
                }catch(ex){

                }
            }
        });
    };

    /**
     *
     * @param added {Array}
     * @param Selector {String}
     * @param customElements {Boolean}
     * @param doc {Boolean}
     */
    function discoverUIElements(added,Selector,customElements,doc){
        var ui=(doc) ? $(added).find(Selector) : $(added).selfFind(Selector);
        if(ui && ui.length >0){
            $.widget.instantiateUIElements(ui,customElements);
        }
    }

    function discoverUpgradeableElements(added){
        var upgraded=$(added).find('[data-upgraded=false]');
        if(upgraded[0]){
            $.each(upgraded,function(index,node){
                var tagName=node.tagName;
                var x=window;

                window._HTML5Imports.upgradeElement(tagName,node);
            });
        }
    }

    /**
     *
     * @param added {Array}
     * @param doc {Boolean}
     */
    function discoverCustomDefinitionElements(added,doc){
        var definitions= $.widget.definitions;
        if(definitions && definitions.length){
            definitions.forEach(function(obj){
                var elements = (doc) ? $(added).find(obj.tagName) : $(added).selfFind(obj.tagName);
                if(elements && elements.length >0){
                    $.widget.instantiateCustomDefinitionElements(elements,obj.name);
                }
            });
        }
    }


    /**
     * instantiate custom ui-elements from queried jQuery array
     * @param ui {Array}
     * @param customElements {Boolean}
     */
    $.widget.instantiateUIElements=function(ui,customElements){
        $.each(ui,function(){
            var widget=(customElements) ? $(this).attr('name') : $(this).attr('data-ui');
            if(widget !==undefined){
                widget=widget.toCamelCase();
            }
            var camelCase =(customElements) ? $(this).attr('camel-case') : $(this).attr('data-camel-case');
            if(camelCase===undefined){
                camelCase=true;
            }
            var opts=getOpts(this,camelCase);
            if(opts.name){
                delete opts.name;
            }
            if(opts.ui){
                delete opts.ui;
            }
            if (widget !== undefined && !$.widget.instantiated(this, widget)) {
                $(this)[widget](opts);
            }

        });
    };

    /**
     *
     * @param elements {Array}
     * @param name {String}
     */
    $.widget.instantiateCustomDefinitionElements=function(elements,name){
        $.each(elements,function(index,element){
            instantiateCustomElement(element, name);
        });
    };

    function instantiateCustomElement(element, name) {
        
        var $element = $(element);
        var camelCase = $element.attr('camel-case');
        if (camelCase === undefined) {
            camelCase = true;
        }
        //check not already instantiated and is valid element
        //var isDOM = element.parentElement;
        var isDOM=isDOMElement(element);
        var isInstantiated = $.widget.instantiated(element, name);
        var proto = element.__proto__;
        if (!isInstantiated && isDOM) {
            if (proto._tagName === undefined) {
                $.widget.assignPrototype(element);
            }
            var opts = getOpts(element, camelCase);
            $element[name](opts);
        }
    }

    function isDOMElement(element) {
        var parentElement = element.parentElement;
        if (!parentElement) {
            return false;
        }
        var template = $(element).find('template');
        return template[0] ? false : true;

    }


    /**
     * custom definitions array reference
     * @type {Array}
     */
    $.widget.definitions=[];
    $.widget.upgraded = [];

    /**
     * register the element as a custom element (depends on Platform which polyfills document.register)
     * @param name {String}
     * @param tagName {String}
     * @param ElementProto {Object}
     * @param registerDef {Boolean}
     */
    $.widget.register=function(name,tagName,ElementProto,registerDef){
        //record the element definition
        var regElement_={};
        regElement_.name=name;
        regElement_.tagName=tagName;

        if(registerDef===undefined){
            registerDef=true;
        }

        //define the object
        var proto = Object.create(ElementProto);
        proto._tagName = tagName;
        var object_={prototype:proto};

        /* custom element callbacks
        *  pass them onto the element instance, where the UI factory can hook into them
        * */
        proto.attachedCallback=function(){
            if(this._attachedCallback){
                this._attachedCallback();
            }
        };

        proto.detachedCallback=function(){
            if(this._detachedCallback){
                this._detachedCallback();
            }
        };

        proto.createdCallback = function () {
            var obj = {};
            obj.tagName = this.__proto__._tagName;
            obj.proto = this.__proto__;

            setElementUpgradedStatus(this);
            instantiateCustomElement(this, name);
            $.widget.upgraded.push(obj);

        };

        proto.attributeChangedCallback = function (n, o, v) {
            if (n === 'loaded') {
                this.removeAttribute('ui-preload');
            }
            if(n==='data-upgraded' && v==='true'){
                //attributeNotification(this);
            }

            if(this._attributeChangedCallback){
                this._attributeChangedCallback(n,o,v);
            }
        };

        /* register the element */
        if (ElementProto._name === 'HTMLElement') {
            document.register(tagName, object_);
           
        }else{
            regElement_.tagName='[is="' + tagName + '"]';
            object_=getExtendedObject(ElementProto._name,object_);
            document.register(tagName,object_);
        }

        if (registerDef) {
            pushElementDefinition(regElement_);
        }
    };

    function setElementUpgradedStatus(node) {
        var dataSet=node.dataset;
        if(dataSet !==undefined){
            if(node.dataset.upgraded===undefined){
                node.dataset.upgraded=false;
            }
        }
    }

    function pushElementDefinition(obj) {
        if (!isTagDefined(obj.tagName)) {
            $.widget.definitions.push(obj);
        }
    }

    function attributeNotification(node){
        var $window=$(window);
        $.each(node.attributes, function(i, att){
            var result= att.name.match(/ea-(.*?)/g);
            if(result && result.length){
                var event=att.name.replace(/-/g,'.');
                $window.trigger(event,{
                    value:att.value,
                    element:node
                });
            }
        });
    }

    function parseNodeAttributes(node,attrName){
        var attr_=null;
        $.each(node.attributes, function(i, att){
            if(attrName===att.name){
                attr_=att;
            }
        });

        return attr_
    }

    function parseEaAttributes(node,arr){
        var attr_=null;
        $.each(node.attributes, function(i, att){
            var result= att.name.match(/ea-(.*?)/g);
            if(result && result.length){
                var obj={
                    name:result,
                    node:node
                }
            }
            arr.push(node);
        });
    }

    /**
     *
     * @param element {Object}
     * @param name {String}
     * @returns {boolean}
     */
    $.widget.instantiated=function(element,name){
        var dataName=$.data(element,'custom-' + name);
        //return(name=== $.data(element,'custom-' + name));
        return (name===dataName);

    };

    /**
     * register a custom tag as a custom element
     * @param tag
     * @param ElementProto
     */
    $.widget.registerElement=function(tag,ElementProto){
        $.Widget.prototype._registerElement(tag,ElementProto);
    };

    /**
     * register an array of custom tags as custom elements
     * @param arr
     */
    $.widget.registerElements=function(arr){
        $.Widget.prototype._registerElements(arr);
    };

    /**
     * registers the ellipsis css components as custom elements
     */
    $.widget.registerFrameworkElements=function(){
        var arr= $.Widget.prototype._data.$elements;
        arr.forEach(function(t){
            $.widget.registerElement(t);
        });
    };

    /**
     * registers template custom elements
     */
    $.widget.registerTemplateElements=function(){
        $.widget.registerElement('ui-template');
        $.widget.registerElement('ui-model');
    };

    $.widget.assignPrototype = function (element) {
        var proto = undefined;
        var tagName = element.tagName.toLowerCase();
        var length = $.widget.upgraded.length;
        var upgraded = $.widget.upgraded;
        for (var i = 0; i < length; i++) {
            if (tagName === upgraded[i].tagName.toLowerCase()) {
                proto = upgraded[i].proto;
                break;
            }
        }
        if (proto !== undefined) {
            element.__proto__ = proto;
        }
    };

    function isTagDefined(tagName) {
        tagName = tagName.toLowerCase();
        var isDefined = false;
        var definitions = $.widget.definitions;
        var length = definitions.length;
        for (var i = 0; i < length; i++) {
            var tagName_ = definitions[i].tagName.toLowerCase();
            if (tagName_ === tagName) {
                isDefined = true;
                break;
            }
        }

        return isDefined;
    }

    function getNameByTag(tagName){
        tagName=tagName.toLowerCase();
        var definitions= $.widget.definitions;
        var length = definitions.length;
        var name;
        for (var i = 0; i < length; i++) {
            var tagName_ = definitions[i].tagName.toLowerCase();
            if (tagName_ === tagName) {
                name = definitions[i].name;
                break;
            }
        }
        return name;
    }

    /**
     *
     * @param element {Object}
     * @param camelCase {Boolean}
     * @returns {Object}
     */
    function getOpts(element,camelCase){
        if(camelCase===undefined){
            camelCase=true;
        }
        var opts={};
        $.each(element.attributes,function(i,obj){
            var opt=obj.name;
            var val = obj.value;
            if(!testAttr(opt)){
                var patt=/data-/;
                if(patt.test(opt)){
                    opt=opt.replace('data-','');
                }
                if(camelCase && camelCase !=='false'){
                    (opt !== 'template') ? opts[opt.toCamelCase()] = booleanCheck(val.toCamelCase()) : (opts[opt] = booleanCheck(val));

                }else{
                    opts[opt.toCamelCase()]= booleanCheck(val);
                }
            }
        });

        return opts;
    }

    function booleanCheck(val) {
        if (val === 'false') {
            val = false;
        }
        if (val === 'true') {
            val = true;
        }
        return val;
    }

    /**
     *
     * @param attr {String}
     * @returns {boolean}
     */
    function testAttr(attr){
        var patt=/href|tcmuri|rowspan|colspan|class|nowrap|cellpadding|cellspacing/;
        return patt.test(attr);
    }


    /**
     * returns element 'name' attribute value
     * @param that {Object} this context of caller
     * @param name {String}
     * @returns {String}
     */
    function getName(element,name){
        var nodeName=element.nodeName.toLowerCase();
        if(nodeName ==='input' || nodeName==='select'){
            return name;
        }else{
            var name_=$(element).attr('name');
            return (typeof name_ !== 'undefined') ? name_ : name;
        }

    }

    /**
     * extends the object to pass to document.register for HTML element interfaces that inherit from HTMLElement
     * extended object={prototype:proto,extends:name}
     * ex: HTMLInputElement-->obj.extends='input'
     * @param name {String}
     * @param obj {Object}
     * @returns {Object}
     */
    function getExtendedObject(name,obj){
        var type=name.replace(/HTML/g,'').replace(/Element/g,'');
        type=type.toLowerCase();
        obj.extends=type;
        return obj;
    }


    /**
     *
     * @param element {Object}
     * @param camelCase {Boolean}
     * @returns {Object}
     */
    $.widget.getOpts=function(element,camelCase){
        return getOpts(element,camelCase);
    };

    /**
     * set up an observer to enable declarative element invocation
     */
    (function(){

        $.widget.observer = new MutationObserver($.widget.onMutation);
        $.widget.observer.observe($('body')[0], {childList: true,subtree:true});
        $(document).on('OnElementImport',function(event,data){
            setTimeout(function(){
                $(document).trigger('OnElementBinding',data);
            },800);
        });

        //polymer ready event
        document.addEventListener('WebComponentsReady', function() {
            var _custom= $.widget.customElementsObj();
            var Selector_=_custom.Selector;

            discoverUIElements(document,Selector_,_custom.customElements,true);
            discoverCustomDefinitionElements(document,true);

        });

    })();


    return $;
    

}));






/*
 * =============================================================
 * ellipsis.element
 * =============================================================
 * the ellipsis UI factory
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('./widget'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./widget'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    function _upgradedDataSet(node){
        var dataSet=node.dataset;
        if(dataSet !==undefined){
            return node.dataset.upgraded;
        }else{
            return undefined;
        }

    }

    /* customElements object */

    var customElements_=false;
    if($('html').hasClass('customelements')){
        customElements_=true;
    }

    /* define the base element  */
    $.widget('ellipsis.element',{

        /**
         * should never be overwritten, _initElement becomes the de facto dev hook
         * @private
         */
        _create:function(){
            /* init events array */
            this._data.events=[];
            $.extend(this.options, $.Widget.prototype.options);

            /* custom elements assignment */
            if(customElements_){
                this.options.$customElements=true;
                this._data.containerSelector=this._data.$containerSelector;
                this._data.overlayElement=this._data.$overlayElement;
                this._data.drawerElement=this._data.$drawerElement;
                this._data.listItem=this._data.$listItem;
                this._data.listItemElement=this._data.$listItemElement;
                this._data.menuElement=this._data.$menuElement;
                this._data.touchMenuElement=this._data.$touchMenuElement;
                this._data.searchRole=this._data.$searchRole;
                this._data.dropdownElement=this._data.$dropdownElement;
                this._data.toggleSelector=this._data.$toggleSelector;
                this._data.modalElement=this._data.$modalElement;
            }
           
            this._onBeforeElementInit();

        },

        _onBeforeElementInit: function () {
            var self = this;
            var dataUpgraded=_upgradedDataSet(this.element[0]);
            if (dataUpgraded==='false') {
                var timeOutId = setInterval(function () {
                    var upgraded = _upgradedDataSet(self.element[0]);
                    if (upgraded === "true") {
                        clearInterval(timeOutId);
                        self.__executeCallStack();
                    }
                }, 100);
            } else {
                this.__executeCallStack();
            }
        },

        /**
         * element hook for executing callstack of parent _initElement
         * @private
         */
        __executeCallStack: function(){
            /* we want "this" to be the widget instance */
            var widget=this;
            if(this.__initFunc && this.__initFunc.length){
                this.__initFunc.forEach(function(f){
                    f.call(widget);
                });
            }

            this._createElement();
        },

        _createElement:function(){
            this._onCreate();
            this._initElement();
            this.__onInit();
            var evt_ = this.widgetName.toLowerCase() + '.loaded';
            $(window).trigger(evt_, { target: this.element });
            if (customElements_) {
                this.__componentCallbacks();
            }
        },

       

        _onCreate: $.noop,

        /**
         * init Element
         */
        _initElement: $.noop,

        /**
         * generally, should not overwrite this
         * @private
         */
        __onInit:function(){
            this._events();
            this._onInit();
        },

        /**
         * @private
         */
        _onInit: $.noop,


        /**
         * called by default by _onInit; event listener registrations should go here, although this is not a requirement
         */
        _events: $.noop,

        /**
         * event facade
         * register an event listener that is automatically disposed on _destroy()
         * if unbind=true, it is destroyed on any call to _unbindEvents() within the $.element lifecycle
         * NOTE: using the _event facade for event handling not a requirement, just a convenience. The convenience of this
         * facade pattern is not in writing event handlers per se, but in automating the cleanup
         *
         *
         * NOTE: the facade wrapper supports event delegation but does not automatically delegate
         * this._event(li,click,function(event){}) ---> no delegation, listener is attached to each li
         * this._event(ul,click,'li',function(event){}) -->delegation, listener is attached to ul, li clicks bubble up
         *
         * @param element {Object}
         * @param event {String}
         * @param selector {String}
         * @param unbind {Boolean}
         * @param callback {Function}
         * @private
         */
        _event: function (element, event, selector,unbind,callback) {
            var obj = {};
            obj.element = element;
            obj.event = event;

            //support 3-5 params
            var length=arguments.length;
            if(length===3){
                callback=(typeof selector==='function') ? selector : null;
                unbind=false;
                selector=null;
            }else if(length===4){
                callback=(typeof unbind==='function') ? unbind : null;
                if(typeof selector==='boolean'){
                    unbind=selector;
                    selector=null;
                }else{
                    unbind=false;
                }
            }
            obj.selector=selector;
            obj.unbind = unbind;
            obj.callback=callback;
            var arr = this._data.events;
            if ($.inArray(obj, arr) === -1) {
                this._data.events.push(obj);
            }
            if(selector){
                element.on(event,selector,function(){
                    var args = [].slice.call(arguments);
                    if(callback){
                        callback.apply(this,args);
                    }
                });
            }else{
                element.on(event,function(){
                    var args = [].slice.call(arguments);
                    if(callback){
                        callback.apply(this,args);
                    }
                });
            }

        },

        /**
         * unbinds registered event listeners. When called from _destroy(), all events are disposed, regardless.
         * If called during the $.element lifecycle, events are disposed if unbind flag was set at registration
         * @param destroy {Boolean}
         * @private
         */
        _unbindEvents: function (destroy) {
            if (typeof destroy === 'undefined') {
                destroy = false;
            }

            var events=this._data.events;
            $.each(events, function (index, obj) {
                if (!destroy) {
                    if (obj.unbind) {
                        (obj.selector) ? obj.element.off(obj.event,obj.selector,obj.callback) : obj.element.off(obj.event,obj.callback);
                        events.splice(index,1);
                    }
                } else {
                    (obj.selector) ? obj.element.off(obj.event,obj.selector,obj.callback) : obj.element.off(obj.event,obj.callback);
                }
            });

            if (destroy) {
                this._onUnbindEvents();
            }

        },

        /**
         * additional event cleanup, if needed, should be placed here. Invoked on _destroy()
         * @private
         */
        _onUnbindEvents: $.noop,

        _hide:function(){
            this.element.hide();
        },

        _show:function(){
            this.element.show();
        },

        /**
         *
         * @param opts {Object}
         * @private
         */
        _showLoader:function(opts){
            if(typeof opts==='undefined'){
                opts={};
            }
            var body=$('body');
            body.loading(opts);
        },

        /**
         *
         * @private
         */
        _hideLoader:function(){
            //this._data.loadingElement.loading('hide');
            var body=$('body');
            body.loading('hide');
        },


        /**
         * convenience wrapper for notification that uses $('body')
         * @param cssClass {String}
         * @param msg {String}
         * @param terminate {Boolean}
         * @param delay {Number}
         * @private
         */
        _notify:function(cssClass,msg,terminate,delay,duration){
            var opts={};
            opts.cssClass=cssClass;
            opts.message=msg;
            opts.terminate=terminate;
            opts.terminateDelay = delay;
            opts.terminateTimeout = duration;
            this._notification($('body'),opts);
        },

        /**
         *
         * @param element {Object}
         * @param opts {Object}
         * @param callback {Function}
         * @private
         */
        _notification: function (element, opts, callback) {
            if(typeof opts==='function'){
                callback===opts;
                opts={};
            }else if(!opts){
                opts={};
            }

            opts.inline = opts.inline || false;
            opts.terminateTimeout=opts.terminateTimeout || 1000;
            opts.terminateDelay=opts.terminateDelay || 0;
            opts.cssClass=opts.cssClass || 'info';
            opts.message=opts.message || 'processing...';
            opts.terminate=opts.terminate || false;


            element.notification(opts);
            element.notification('show');

            if (callback) {
                callback();
            }

        },

        _notificationLabel:function(opts,callback){
            if(this._data.notificationLabel){
                return;
            }
            opts=opts || {};
            opts.cssClass=opts.cssClass || 'info';
            opts.message=opts.message || 'message...';
            var label=$('<div class="ui-semantic-label ' + opts.cssClass + '">' + opts.message + '</div>');
            opts.inline=true;
            this._data.notificationLabel=label;
            this.element.append(label);
            this._notification(label,opts,callback);
        },

        _killNotificationLabel:function(){
            if(this._data.notificationLabel){
                this._data.notificationLabel.remove();
                this._data.notificationLabel=null;
            }
        },

        _find:function(selector){
            return this.element.find(selector);
        },

        /**
         *
         * @param opts {Object}
         * @param callback {Function}
         * @private
         */
        _window: function (opts,callback) {
            opts.window=opts.window || {};
            opts.template=opts.template || 'ui-window';
            opts.window.modal = opts.window.modal || true;
            opts.window.animationIn=opts.window.animationIn || 'none';
            opts.context=opts.context || 'model';
            var container=$('<div data-window></div>');
            var body = $('body');
            body.append(container);
            var windowSelector=(this.options.$customElements) ? 'ui-window' : '.ui-window';
            this._render(container,opts,function(err,out){
                var window=container.find(windowSelector);
                window.window(opts.window);
                if(callback){
                    callback(null,window);
                }
                _onHide();

            });

            function _onHide(){
                $(window).on('window.hide',function(event,data){
                    try{
                        container[0].remove();
                    }catch(ex){
                        container.remove();
                    }

                    _off();
                });

            }
            function _off(){
                $(window).off('window.hide',function(event,data){
                    try{
                        container[0].remove();
                    }catch(ex){
                        container.remove();
                    }

                    _off();
                });
            }
        },

        /**
         * returns a window dimension based on passed height,width params and current viewport
         * @param maxWidth {Number}
         * @param maxHeight {Number}
         * @returns {Object}
         * @private
         */
        _getWindowDimensions:function(maxWidth,maxHeight){
            var win={
                height:maxHeight,
                width:maxWidth
            };

            var viewport=this._support.device.viewport;
            if(viewport.height < maxHeight){
                win.height=parseInt(.8*viewport.height);
            }
            if(viewport.width < maxWidth){
                win.width=parseInt(.7*viewport.width);
            }

            return win;

        },

        _modal: function (opts, delay) {
            var self = this;
            this._data.hideModal = false;
            if (typeof opts === 'undefined') {
                opts = {};
                opts.opacity = .2;
            } else if (typeof opts === 'number') {
                delay = opts;
                opts = {};
                opts.opacity = .2;
            }
            if (typeof delay === 'undefined') {
                delay = 300;
            }
            setTimeout(function () {
                self._setModal($('body'), opts);
            }, delay);
            delay += 50;
            var id = setInterval(function () {
                if (self._data.hideModal) {
                    self._removeModal();
                    clearInterval(id);
                }
            }, delay);
        },

        /**
         * destroy event
         * @private
         */
        _destroy: function () {

            this._unbindEvents(true);
            this.__onDispose();
            this._onDestroy();
            $.removeData(this.element[0],'custom-' + this.widgetName);

        },

        __onDispose:function(){
            var that=this;
            if(this.__disposeFunc && this.__disposeFunc.length){
                this.__disposeFunc.forEach(function(f){
                    f.call(that);
                });
            }
        },

        /* custom element callback events */

        __componentCallbacks:function(){
            var element=this.element[0];
            var self=this;
            element._attributeChangedCallback=function(name,oldValue,newValue){
                self._attributeChangedCallback(name,oldValue,newValue);
            };
            element._attachedCallback=function(){
                self._attachedCallback();
            };
            element._detachedCallback=function(){
                self._detachedCallback();
            };
        },

        _import: function () {
            var element0 = this.element[0];
            var tagName = element0.tagName;
            _HTML5Imports.upgradeElement(tagName, element0);
            var self = this;
            this._data.imported = false;
            this._event($(document), 'OnElementImport', function (event, data) {
                if (data.node.tagName && data.node.tagName.toLowerCase()=== element0.tagName.toLowerCase() && !self._data.imported) {
                    self._onImport();
                    self._data.imported = true;
                }
            });
        },

        _upgradeElement:function(tagName,element){
            _HTML5Imports.upgradeElement(tagName, element);
        },

        _onImport: $.noop,

        _attachedCallback: $.noop,

        _detachedCallback: $.noop,

        _attributeChangedCallback: $.noop,



        /**
         * for cleanup
         * @private
         */
        _dispose: $.noop,


        /**
         * for cleanup
         * @private
         */
        _onDestroy: $.noop



    });


    /**
     * define the factory
     * @param ElementProto {Object} <optional>, only should be supplied if the element not derived from HTMLElement
     * @param name {String}
     * @param tagName {String} <optional>
     * @param base {Object} <optional>
     * @param prototype {Object}
     */
    $.element = function (ElementProto,name,tagName, base, prototype) {
        var baseObject;
        var tagName_=null;
        var ElementProto_=null;

        /* support 2-5 params */
        var length=arguments.length;
        if(length < 2){
            throw "Error: Element requires a minimum of two parameter types: string name and a singleton for the prototype"
        }else if(length===2){
            /*
                 $.element(ElementType,name) ---> $.element(name,prototype);
             */
            prototype = name;
            if(typeof ElementProto==='object'){
                throw "Error: Element requires a string name parameter";
            }
            if(typeof name!=='object'){
                throw "Error: Element requires a singleton for the prototype";
            }
            name=ElementProto;
            baseObject = $.ellipsis.element;
            base=null;
        }else if(length===3){
            /*
                $.element(ElementType,name,tagName) --->
                $.element(ElementType,name,prototype) or $.element(name,tagName,prototype) or $.element(name,base,prototype)
             */
            prototype=tagName;
            if(typeof ElementProto==='object'){
                if(typeof name!=='string'){
                    throw "Error: Element requires a string name parameter";
                }
                if(typeof tagName!=='object'){
                    throw "Error: Element requires a singleton for the prototype";
                }

                ElementProto_=ElementProto;
                baseObject = $.ellipsis.element;
                base=null;
            }else{
                if(typeof tagName==='object'){
                    if(typeof name==='string'){
                        tagName_=name;
                        baseObject = $.ellipsis.element;
                        base=null;
                    }else{
                        base=name;
                    }
                    name=ElementProto;
                }else{
                    throw "Error: Element requires a singleton for the prototype";
                }
            }


        }else if(length===4){
            /*
             $.element(ElementType,name,tagName,base) --->
             $.element(ElementType,name,tagName,prototype) or $.element(ElementType,name,base,prototype)
             or $.element(name,tagName,base,prototype)
             */
            prototype=base;
            if(typeof ElementProto==='object'){
                ElementProto_=ElementProto;
                if(typeof name!=='string'){
                    throw "Error: Element requires a string name parameter";
                }
                if(typeof tagName==='string'){
                    tagName_=tagName;
                    baseObject = $.ellipsis.element;
                    base=null;
                }else{
                    base=tagName;
                }
            }else{
                base=tagName;
                tagName_=name;
                name=ElementProto;
            }
        }else{
            /*
               $.element(ElementType,name,tagName,base,prototype)
             */
            ElementProto_=ElementProto;
            tagName_=tagName;

        }

        if(base){

            var initFunc=[];
            var disposeFunc=[];
            /* element inheritance creates a callstack for the parent elements' _initElement event,written to an array on the element prototype, so they get fired
               in sequence, avoiding being overwritten by the element's _initElement event
             */
            if($.utils.array.isArray(base)){ /* support passing in array of base elements, not just one */
                /* array */

                /* setup baseObject constructor */
                baseObject = function () {};
                baseObject._childConstructors = [];

                /* iterate and extend */
                base.forEach(function(obj){
                    /* obj.__initFunc array of _initElement gets concat'ed to the new stack */
                    if(obj.prototype.__initFunc && obj.prototype.__initFunc.length > 0){
                        initFunc=initFunc.concat(obj.prototype.__initFunc);
                    }
                    if(obj.prototype.__disposeFunc && obj.prototype.__disposeFunc.length > 0){
                        disposeFunc=disposeFunc.concat(obj.prototype.__disposeFunc);
                    }
                    $.extend(baseObject.prototype, obj.prototype, $.ellipsis.element.prototype);

                    /* push obj._initElement onto initFunc stack */
                    initFunc.push(obj.prototype._initElement);
                    disposeFunc.push(obj.prototype._dispose);
                });

                /* attach the stack to the prototype */
                if(initFunc.length > 0){
                    prototype.__initFunc=initFunc;
                }
                if(disposeFunc.length > 0){
                    prototype.__disposeFunc=disposeFunc;
                }

            }else{
                /* object */
                if (base.prototype._initElement) {
                    baseObject = base;
                    if(baseObject.prototype.__initFunc && baseObject.prototype.__initFunc.length > 0){
                        initFunc=initFunc.concat(baseObject.prototype.__initFunc);
                    }
                    if(baseObject.prototype.__disposeFunc && baseObject.prototype.__disposeFunc.length > 0){
                        disposeFunc=disposeFunc.concat(baseObject.prototype.__disposeFunc);
                    }
                    initFunc.push(baseObject.prototype._initElement);
                    disposeFunc.push(baseObject.prototype._dispose);
                } else {
                    /* base is not derived from element, so extend onto a baseObject constructor */
                    baseObject = function () {};
                    baseObject._childConstructors = [];
                    $.extend(baseObject.prototype, base.prototype, $.ellipsis.element.prototype);
                }

                if(initFunc.length > 0){
                    prototype.__initFunc=initFunc;
                }
                if(disposeFunc.length > 0){
                    prototype.__disposeFunc=disposeFunc;
                }
            }
        }

        /* implement using the extended jQuery UI factory */
        $.widget(name, baseObject, prototype);

        /* register the element as a custom element, if enabled */
        if(customElements_){
            if(!tagName_){
                tagName_=name.replace('.','-');
            }
            
            var name_= name.split( "." )[ 1 ];
            if(!ElementProto_){
                var __proto__=HTMLElement.prototype;
                __proto__._name='HTMLElement';
                //__proto__._id=name_;
                //__proto__._tag=tagName_;
                ElementProto_=__proto__;
            }else{
               // ElementProto._id=name_;
                //ElementProto._tag=tagName_;
            }
            $.widget.register(name_,tagName_,ElementProto_);


        }
    };

    //register framework css components as custom elements
    if(customElements_){
        $.element.custom=true;
        try{
            $.widget.registerFrameworkElements();
        }catch(ex){

        }
        $.widget.registerElement('ui-element');
    }

    //register template elements
    try{
        $.widget.registerTemplateElements();
    }catch(ex){

    }

    /* make public props/methods available on $.element */
    for(var key in $.widget){
        $.element[key]= $.widget[key];
    }




    return $;

}));







/*
 * =============================================================
 * ellipsis.button
 * =============================================================
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    if($.element.custom){
        $.element.registerElements(['ui-button-bar','button-item']);
    }

    $.element("ellipsis.buttonGroup", "ui-button-group",{


        /*==========================================
         PRIVATE
         *===========================================*/

        _initElement:function(){
           
        },

        /**
         * get the related button and index
         * @param buttons {Array}
         * @returns {Object}
         * @private
         */
        _relatedButton: function(buttons){
            var active=buttons.filter('.active');
            return (active[0]) ? {target:active,index:buttons.index(active)} : {target:null,index:null}
        },

        /**
         *
         * @param id {String}
         * @private
         */
        _disableButtonById: function(id){
            var button = this.element.find('.ui-button[data-id="' + id + '"]');
            button.addClass('disabled');
        },

        /**
         *
         * @param index {Number}
         * @private
         */
        _disableButtonByIndex: function(index){
            var button = this.element.find('.ui-button')[index];
            button.addClass('disabled');
        },

        /**
         *
         * @param id {String}
         * @private
         */
        _enableButtonById: function(id){
            var button = this.element.find('.ui-button[data-id="' + id + '"]');
            button.removeClass('disabled');
        },

        /**
         *
         * @param index {Number}
         * @private
         */
        _enableButtonByIndex: function(index){
            var button = this.element.find('.ui-button')[index];
            button.removeClass('disabled');
        },

        /**
         *
         * @param $this {Object}
         * @param button {Object}
         * @private
         */
        _onClick:function($this,button){
            /* trigger if not currently active and not currently disabled */
            if (!$this.hasClass('disabled') && !$this.hasClass('active')) {
                var related=this._relatedButton(button);
                button.removeClass('active');
                $this.addClass('active');
                var id = $this.attr('data-id');
                var index=button.index($this);
                var data = {
                    id: id,
                    index:index,
                    target:$this,
                    relatedIndex:related.index,
                    relatedTarget:related.target
                };
                this._onEventTrigger('selected', data);
            }
        },

        /**
         * element events
         * @private
         */
        _events: function () {
            var self = this;
            /* click special event name */
            var click=this._data.click;
            var element=this.element;
            var button = element.find('.ui-button');

            this._event(button,click,function(event){
                self._onClick($(this),button);
            });

        },

        /**
         * show
         * @private
         */
        _show: function(){
            this.element.show();
        },

        /**
         * hide
         * @private
         */
        _hide: function(){
            this.element.show();
        },

        /**
         * toggle visibility
         * @private
         */
        _toggle: function(){
            this.element.toggle();
        },


        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        /**
         * @public api
         */
        show: function () {
            this._show();
        },

        /**
         * @public api
         */
        hide: function () {
            this._hide();
        },

        /**
         * @public api
         */
        toggle: function(){
            this._toggle();
        },

        /**
         *
         * @param id {String}|{Number}
         * @public api
         */
        disable:function(id){
            (typeof id==='string') ? this._disableButtonById(id) : this._disableButtonByIndex(id);
        },

        /**
         *
         * @param id {String}|{Number}
         * @public api
         */
        enable:function(id){
            (typeof id==='string') ? this._enableButtonById(id) : this._enableButtonByIndex(id);
        }



    });


    return $;


}));



/*
 * =============================================================
 * ellipsis.close
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    $.element("ellipsis.close","ui-close", {

        /* Options to be used as defaults */
        options:{
            close:'destroy'

        },



        /*==========================================
         PRIVATE
         *===========================================*/

        /**
         *
         * @param event {Object}
         * @private
         */
        _onClose:function(event){
            var parent=this.element.parent();
            var method=this.options.close;
            (method==='hide') ? parent.addClass('hidden').removeClass('visible') : parent.remove();
        },

        /**
         * element events
         * @private
         */
        _events: function(){
            var element=this.element;
            var click=this._data.click;
            this._event(element,click,this._onClose.bind(this));
        }



    });

    return $;


}));



/*
 * =============================================================
 * ellipsis.drawer
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {


    $.element("ellipsis.drawer", "ui-drawer",{



        /**
         * create a drawer container
         * @param element {Object}
         * @param dataClass {String}
         * @private
         */
        _createDrawer: function (element, dataClass) {
            //prevent multiple drawers
            if(this._data.locked){
                return;
            }
            this._data.locked=true;
            //get reference to the container
            var container;
            if (this._data.container) {
                container = this._data.container;
            } else {
                container = element.parents(this._data.containerSelector);
                if (container[0]) {
                    this._data.container = $(container[0]);
                } else {
                    //throw new Error('Drawer Requires a data-role container element');
                    return;
                }

            }


            //get ref to the toggle container
            var transformContainer = container.parent();
            this._data.transformContainer = transformContainer;

            //create the drawer elements
            var drawer=$(this._data.drawerElement);
            if (dataClass) {
                drawer.addClass(dataClass);
            }
            var height = this._support.device.viewport.height;

            drawer.css({
                'min-height': height + 'px'
            });
            if(!this._support.device.touch){
                drawer.css({
                    'position': 'relative'
                });
            }
            var drawerHeader = $('<header></header>');

            //append header to drawer
            drawer.append(drawerHeader);

            var drawerSection = $('<section></section>');
            drawer.append(drawerSection);

            //insert drawer into the DOM
            container.before(drawer);

            //save references
            this._data.drawer = drawer;
            this._data.drawerHeader = drawerHeader;
            this._data.drawerSection = drawerSection;
        },

        /**
         * open the drawer
         * @param callback {function}
         * @param fnClose {function}
         * @private
         */
        _openDrawer: function (callback, fnClose) {

            //show drawer
            this._showDrawer();


            //get viewport height
            var height = this._support.device.viewport.height;
            this.options.height = height;

            var self = this;

            //get ref to containers
            var container = this._data.container;
            var transformContainer = this._data.transformContainer;


            //hardware accelerate the transition
            this._setHardwareAcceleration(transformContainer);

            //container overflow
            //this._setContainerOverflow(transformContainer);

            //set container to viewport height and add component classes
            container
                .addClass(this._data.fixedToggleContainerClass)
                .css({
                    height: height + 'px'
                })
                .addClass(this._data.leftBoxShadowClass);


            //append overlay to container
            var overlay = $(this._data.overlayElement);
            overlay.addClass('show');
            container.append(overlay);

            //save ref to overlay
            this._data.overlay = overlay;

            //transition overlay
            overlay.transition({
                background: this.options.overlayBackground,
                opacity: this.options.overlayOpacity,
                duration: this.options.overlayOpenDuration

            });

            //transition container
            var opts = {};
            opts.duration = this.options.transformDuration;
            opts.delay = this.options.transformDelay;
            opts.easing = 'ease-in-out';
            var coordinates = {};
            coordinates.x = this.options.translateX;
            coordinates.y = 0;
            coordinates.z = 0;
            opts.coordinates = coordinates;
            opts.transitionEnd = true;

            /* click special event name */
            var click=this._data.click;
            var closeEvent=this._closeDrawer.bind(this);
            this.element.trigger('drawer.open',{open:true,closeEvent:closeEvent});
            this._3dTransition(container, opts, function () {
                self._resetHardwareAcceleration(transformContainer);
                self._resetTransition($(this));

                if (callback) {
                    callback();
                }
            });

            overlay.on(click, function () {
                if (fnClose) {
                    fnClose();
                }
            });


        },

        /**
         * close the drawer
         * @param callback
         * @private
         */
        _closeDrawer: function (callback) {
            //get container ref
            var container = this._data.container;
            var scrollTop=window.scrollY;
            /* if drawer has been vertically scrolled, we need to add scrollY to
             the fixed toggle container height(=viewport height when opened) on close
             to avoid revealing underneath content at scrollY.
             */
            if(scrollTop > 0){
                var height=this.options.height;
                height+=scrollTop;
                container.css({
                    height:height + 'px'
                });

                /* additionally, to avoid navbar/topbar and drawer header dsiappearing from viewport on drawer close, we
                 need to assign top=scrollTop on those elements during the duration of the close animation
                 */
                this.element.css({
                    top:scrollTop + 'px'
                });

                this._data.drawerHeader.css({
                    top:scrollTop + 'px'
                })
            }

            var transformContainer = this._data.transformContainer;

            //get overlay ref
            var overlay = this._data.overlay;

            var self = this;
            //hardware accelerate the transition
            this._setHardwareAcceleration(transformContainer);

            var opts = {};
            opts.duration = this.options.transformDuration;
            opts.delay = this.options.transformDelay;
            opts.easing = 'ease-in-out';
            var coordinates = {};
            coordinates.x = 0;
            coordinates.y = 0;
            coordinates.z = 0;
            opts.coordinates = coordinates;
            opts.transitionEnd = true;
            this.element.trigger('drawer.close',{open:false});
            this._3dTransition(container, opts, function () {
                self._resetHardwareAcceleration(transformContainer);
                self._resetContainer(container);
                self._hideDrawer();

                if (callback) {
                    callback();
                }
            });

            /* click special event name */
            var click=this._data.click;

            overlay.off(click);

            overlay.transition({
                background: this.options.overlayBackground,
                opacity: 0,
                duration: this.options.overlayCloseDuration
            }, function () {
                overlay.remove();

            });

        },

        /**
         * show the drawer
         * @private
         */
        _showDrawer: function () {
            var height = this._support.device.viewport.height;
            this._data.drawer.css({
                'min-height': height + 'px',
                'display':'block'
            });
          

        },

        /**
         * hide the drawer
         * @private
         */
        _hideDrawer: function () {
            this._data.drawerHeader.css({
                top:''
            });
            this._data.drawer.hide();
        },

        /**
         * remove the drawer
         * @private
         */
        _removeDrawer: function () {
            if(this._data.drawer){
                this._data.drawer.remove();
                this._data.drawer=null;
            }
            this._data.locked=false;
            var container = this._data.container;
            this._resetContainer(container);
            var overlay = this._data.overlay;
            if (overlay) {
                overlay.remove();
            }
            var transformContainer = this._data.transformContainer;
            this._resetHardwareAcceleration(transformContainer);

        },

        _onDestroy:function(){

        },



        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        /**
         *  @public
         */
        show: function () {
            this._showDrawer();
        },

        /**
         *
         * @public
         */
        hide: function () {
            this._hideDrawer();
        }

    });

    return $;

}));


/*
 * =============================================================
 * ellipsis.navigation
 * =============================================================
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    $.element("ellipsis.navigation","ui-navigation", $.ellipsis.drawer, {

        /**
         * shortcut method to create a touch navigation
         * @param element {Object}
         * @param dataClass {String}
         * @private
         */
        _createTouchNavigation: function (element, dataClass) {
            this._data.input=null;
            this._data.touchInput=null;
            this._createDrawer(element, dataClass);
            this._createTouchMenu(element);
        },

        /**
         * remove touch navigation
         * @param element
         * @private
         */
        _removeTouchNavigation: function (element) {
            //unbind touch search
            if (this._data.touchInput) {
                this._unbindSearch(this._data.touchInput);
            }
            //remove drawer
            this._removeDrawer();
            //reset element
            this.element.css({
                position: ''
            });
            this._data.navLocked=false;
        },

        /**
         *  create a touch drawer menu from element desktop navigation widget
         * @param element {Object}
         * @private
         */
        _createTouchMenu: function (element) {
            //prevent multiple menus
            if(this._data.navLocked){
                return;
            }
            this._data.navLocked=true;


            //var __customElements=this.options.$customElements;

            //get the drawer
            var drawer = this._data.drawer;

            //get the drawer
            var drawerSection = this._data.drawerSection;
            if(!drawerSection){
                return;
            }

            //get the drawer header
            var drawerHeader = this._data.drawerHeader;

            //create the drawer menu element
            var drawerMenu = $(this._data.touchMenuElement);

            //add home menu item at the top
            if (this.options.includeHome) {
                drawerMenu.append(this._methods.createHomeListItem(this.options.homeUrl, this.options.homeIcon));

            }

            if(this.options.touchMenu !==undefined && this.options.touchMenu===false){
                //append menu to drawer
                drawerSection.append(drawerMenu);
                //save ref to menu
                this._data.drawerMenu = drawerMenu;
                return;
            }

            var menu=this._getMenu(element);

            //clone it
            var clone = menu.clone();

            //extract items from clone
            var items=this._extractMenuItems(clone);


            /* unwrap button dropdowns */
            items.find('ui-button-dropdown').contents().unwrap();


            //touchify the ui-dropdowns
            this._methods.touchifyUIDropdowns(items);

            //iconify menu items
            this._methods.iconifyTouchMenuItems(items);

            //append to menu
            drawerMenu.append(items);

            //add any linkable parent node to the child touch dropdown(it is then linkable within the child dropdown)
            drawerMenu = this._methods.addParentNodesToChildDropDowns(drawerMenu, this._data.dropdownClass);


            /* ---attach search to drawerHeader----------------*/
            this._appendSearch(drawerMenu,drawerHeader);



            //add any menu items from plugin opts
            var optsItems = this._methods.createMenuItemsFromArray(this.options.model);
            if (optsItems) {
                drawerMenu.append(optsItems);
            }


            //append menu to drawer
            drawerSection.append(drawerMenu);

            //save ref to menu
            this._data.drawerMenu = drawerMenu;

        },

        /**
         *
         * @param element
         * @returns {*}
         * @private
         */
        _getMenu:function(element){
            //find DOM element menus
            return element.find(this._data.menuClass).not('[touch-menu="false"]').add(element.find('[role="menu"]'));

        },

        _extractMenuItems:function(clone){
            var excludeMenuItemSelector='[touch-menu-item="false"]';
            var items = clone.children().not(excludeMenuItemSelector);
            return this._methods.filterMenuItems(items);
        },

        _appendSearch:function(drawerMenu,drawerHeader){
            /* first check in cloned menu items */
            var hasSearch = drawerMenu.find(this._data.listItem + '.has-search');
            if (hasSearch[0]) {
                /* get search container */
                var searchClass=this._data.searchClass;
                var search = $(hasSearch[0]).find(searchClass);
                var touchInput = search.find(this._data.searchRole);
                if (touchInput) {
                    this._data.touchInput = touchInput;
                    /* append searchbox */
                    drawerHeader.append(search);
                    /* touch search handler */
                    this._onSearch(touchInput,'touch');
                }

                /* remove from the menu */
                hasSearch.remove();

                /* setup desktop search handler */
                this._initSearchHandler(__customElements);
            }else{
                /* check in the original element */
                var search_=this._initSearchHandler(true);
                if(search_){
                    this._initTouchSearchHandler(search_,drawerHeader);
                }
            }
        },

        /**
         * append menu items from a model
         * @private
         */
        _appendMenuModel: function () {
            if (this._support.mq.touch) {
                var drawerMenu = this._data.drawerMenu;
                //add menu items from plugin opts
                var optsLi = this._methods.createMenuItemsFromArray(this.options.model);
                if (optsLi) {
                    drawerMenu.append(optsLi);
                }
            }
        },

        /**
         *
         * @param model {Array}
         * @private
         */
        _addMenuModel:function(model){
            //var drawerMenu = this._data.drawerMenu;
            var drawerMenu = $('touch-ui-menu');
            var items = this._methods.createMenuItemsFromArray(model);
            drawerMenu.append(items);
        },

        /**
         * pass an input to the search handler
         * @returns {*}
         * @private
         */
        _initSearchHandler:function(){
            var searchSelector='ui-search';
            var search_ =this.element.find(searchSelector);
            if(search_[0]){
                /* desktop search box */
                var input=search_.find('input');
                this._data.input=input;
                /* setup handler for desktop */
                this._onSearch(input,'desktop');
                return search_;
            }else{
                return null;
            }
        },

        /**
         * pass a touch input to the search handler
         * @param search
         * @param drawerHeader
         * @private
         */
        _initTouchSearchHandler:function(search,drawerHeader){
            /* touch search box */
            var searchClone=search.clone();
            var touchInput = searchClone.find('input');
            if (touchInput[0]) {
                this._data.touchInput = touchInput;
                /* append touch search box */
                drawerHeader.append(searchClone);
                /* touch search handler */
                this._onSearch(touchInput,'touch');
            }
        },

        /**
         * search handler mediator
         * @param input {object}
         * @param device {string}
         * @private
         */
        _onSearch: function (input,device) {
            if(device==='desktop'){
                if(this._data.searchRegistered){
                    return false;
                } else{
                    this._data.searchRegistered=true;
                    this._onDesktopSearch(input)
                }

            }else{
                if(this._data.touchSearchRegistered){
                    return false;
                } else {
                    this._data.touchSearchRegistered=true;
                }
            }
        },

        _onDesktopSearch:function(input){
            var eventTrigger=this._onEventTrigger.bind(this);
            input.on('focus', function () {
                input.on('click', function (event) {
                    if ($(this).hasClass('focused')) {
                        handleEvent(input);
                    } else {
                        input.addClass('focused');
                    }
                });
                input.keypress(function (event) {
                    if (event.which === 13) {
                        handleEvent(input);
                        return true;
                    }
                });
            });
            input.on('blur', function () {
                input.removeClass('focused');
                input.off('click');
            });


            function handleEvent(input){
                var val = input.val();
                var eventData = {
                    value: val
                };
                eventTrigger('search', eventData);
            }
        },

        _onTouchSearch:function(input){
            var eventTrigger=this._onEventTrigger.bind(this);

            input.on('focus', function () {
                input.on('tap', function (event) {
                    if ($(this).hasClass('focused')) {
                        handleEvent(input);
                    } else {
                        input.addClass('focused');
                    }
                });
            });
            input.on('blur', function () {
                input.removeClass('focused');
                input.off('tap');
            });


            function handleEvent(input){
                var val = input.val();
                var eventData = {
                    value: val
                };
                eventTrigger('search', eventData);
            }

        },


        /**
         * get the correct touch-ui-dropdown selector
         * @returns {string}
         * @private
         */
        __dropdownSelector:function(){
            return 'touch-ui-dropdown';
        },

        /**
         * get the correct item dropdown selector
         * @returns {string}
         * @private
         */
        __menuItemSelector:function(){
            return 'menu-item-dropdown';
        },

        /**
         * toggles touch sub-menu
         * @param item {Object}
         * @private
         */
        _touchToggleDropdown:function(item){
            var selector=this.__dropdownSelector();
            var dropdown=item.find(selector);
            if (dropdown.hasClass('show')) {
                item.removeClass('close');
                dropdown.removeClass('show');
            } else {
                item.addClass('close');
                dropdown.addClass('show');
            }
        },

        /**
         * link element triggers location or a dev handled event
         * @param a {object} link element
         * @param handleTouchEvents {Boolean}
         * @private
         */
        _touchMenuItem:function(a,handleTouchEvents){
            var self=this;
            var duration=this.options.transformDuration;
            duration+=100;
            var id = a.attr('data-id');
            var href = a.attr('href');
            var action = a.attr('data-action');
            if (typeof href != 'undefined' && href != '#' && (typeof action === 'undefined' && handleTouchEvents)) {
                /* fire an event for SPA, that the route is being triggered/captured by the navigation element.
                 location is a provider, so app framework should set $.element's location provider to handle the request
                 */
                this.element.trigger('route.cancellation',href);
                /* close the drawer */
                this._hide();
                /* trigger location after the drawer has closed */
                setTimeout(function(){
                    if(typeof href !=='undefined'){
                        self._location(href);
                    }
                },duration);
            } else {
                var data = {
                    id: id,
                    action: action,
                    mode: 'touch',
                    href:href
                };
                this._onEventTrigger('selected', data);
            }
        },

        /**
         * currentTarget link element triggers submenu toggle or link element location/handled event
         * @param a {Object}
         * @param handleTouchEvents {Boolean}
         * @private
         */
        _touchMenuLink:function(a,handleTouchEvents){
            var href= a.attr('href');
            if(typeof href==='undefined' || href==='#'){
                var item= a.parent('menu-item-dropdown');
                if(item[0]){
                    this._touchToggleDropdown(item);
                }
            }else{
                this._touchMenuItem(a,handleTouchEvents);
            }
        },

        /**
         * reset touch menu--hide dropdown and remove close arrow css
         * @private
         */
        _resetMenu:function(){
            var menu=this._data.drawerMenu;
            menu.find('.show').removeClass('show');
            menu.find('.close').removeClass('close');
        },


        _methods: {
            /**
             *
             * @returns {boolean}
             */
            customElements:function(){
                return $('html').hasClass('customelements');
            },

            /**
             * returns menu item selector
             * @returns {string}
             */
            listItem:function(){
                return 'menu-item';
            },

            /**
             * returns dropdown menu item selector
             * @returns {string}
             */
            dropdownListItem:function(){
                return 'menu-item-dropdown';
            },

            /**
             * returns icon attribute selector
             * @returns {string}
             */
            iconAttribute:function(){
                return 'touch-icon';
            },

            /**
             *
             */
            dropdownElement:function(){
                return '<ui-dropdown></ui-dropdown>';
            },

            /**
             *
             * @param text {String}
             * @returns {*|HTMLElement}
             */
            createSpanItem: function (text) {
                return $('<span>' + text + '</span>');
            },

            /**
             *
             * @param href {String}
             * @param text {String}
             * @returns {*|HTMLElement}
             */
            createCloneListItem: function (href, text) {
                return $('<' + this.listItem() + '<a href="' + href + '">' + text + '</a></' + this.listItem() + '>');
            },

            /**
             * in a menu item dropdown, add the parent node as the first linkable item in the
             * dropdown. This is done to avoid tbe conflict of the parent triggering a dropdown
             * and being url linkable
             * @param menu {Object}
             * @param dropdownClass {String}
             * @returns {Object}
             */
            addParentNodesToChildDropDowns: function (menu, dropdownClass) {
                var li = menu.find(this.dropdownListItem());
                var self = this;
                li.each(function (i, ele) {
                    var a = $(ele).children('a');
                    var href = a.attr('href');
                    if (typeof href != 'undefined' && href != '#') {
                        var text = a.html();
                        var item = self.createCloneListItem(href, text);
                        var ul = $(ele).find('.' + dropdownClass);
                        ul.prepend(item);
                        var spanItem = self.createSpanItem(text);
                        a.replaceWith(spanItem);
                    }
                });

                return menu;
            },

            /**
             *
             * @param arr {Array}
             * //@param dropdownClass {String}
             * @returns {Array}
             */
            createMenuItemsFromArray: function (arr) {
                if (arr.length === 0) {
                    return null;
                }
                var itemArray = [];
                var a, item;
                for (var i = 0; i < arr.length; i++) {

                    if (arr[i].dropdown && arr[i].dropdown.length > 0) {
                        if (typeof arr[i].icon != 'undefined') {
                            item = $('<menu-item-dropdown><span class="touch-icon ' + arr[i].icon + '"></span><a>' + arr[i].label + '</a></menu-item-dropdown>');
                        } else {
                            item = $('<menu-item-dropdown><a>' + arr[i].label + '</a></menu-item-dropdown>');
                        }
                        var dropdown = $('<touch-ui-dropdown></touch-ui-dropdown>');
                        for (var j = 0; j < arr[i].dropdown.length; j++) {
                            var _item = $('<menu-item><a href="' + arr[i].dropdown[j].url + '">' + arr[i].dropdown[j].label + '</a></menu-item>');
                            dropdown.append(_item);
                        }

                        item.append(dropdown);
                        itemArray.push(item);

                    } else {
                        if (typeof arr[i].icon != 'undefined') {
                            item = $('<menu-item><span class="touch ' + arr[i].icon + '"><a href="' + arr[i].url + '">' + arr[i].label + '</a></span></menu-item>');
                        } else {
                            item = $('<menu-item><a href="' + arr[i].url + '">' + arr[i].label + '</a></menu-item>');
                        }
                        itemArray.push(item);
                    }
                }

                return itemArray;
            },

            /**
             *
             * @param homeUrl {String}
             * @param homeIcon {String}
             * @returns {Object}
             */
            createHomeListItem: function (homeUrl, homeIcon) {
                var item;
                var menuItem=this.listItem();
                var home='home';
                if (homeIcon === null) {
                    item = $('<' + menuItem + ' ' + home + '><a href="' + homeUrl + '">Home</a></' + menuItem + '>');
                } else {
                    item = $('<' + menuItem + ' ' + home + '><span class="touch-icon ' + homeIcon + '"></span><a href="' + homeUrl + '">Home</a></' + menuItem + '>');
                }

                return item;
            },

            filterMenuItems:function(items){
                var exclude=items.find('[data-touch="false"]');
                $.each(exclude,function(i,ele){
                    $(ele).remove();
                });
                return items;
            },

            /**
             *
             * @param items {Object}
             */
            touchifyUIDropdowns: function (items) {
                var self=this;
                $.each(items, function (index, element) {
                    var dropdown = $(element).find('ui-dropdown');
                    var megaDropdown=$(element).find('ui-mega-dropdown');
                    if (dropdown && dropdown.length > 0) {
                        dropdown.replaceWith( "<touch-ui-dropdown>" + dropdown.html() + "</touch-ui-dropdown>" );
                        if(megaDropdown && megaDropdown.length >0){
                            self.createTouchMenuItemsFromMegaDropdown(megaDropdown,dropdown);
                            megaDropdown.remove();
                        }
                    }else if(megaDropdown && megaDropdown.length >0){
                        dropdown=$('<touch-ui-dropdown></touch-ui-dropdown>');
                        self.createTouchMenuItemsFromMegaDropdown(megaDropdown,dropdown);
                        megaDropdown.replaceWith(dropdown);
                    }
                });
            },

            /**
             *
             * @param items {Array}
             */
            iconifyTouchMenuItems:function(items){
                var iconAttr=this.iconAttribute();
                $.each(items, function (index, item) {
                    var $item=$(item);
                    var icon=$item.attr(iconAttr);
                    if(icon !== undefined){
                        var span=$('<span class="touch ' + icon + '"></span>');
                        $item.prepend(span);
                    }
                });
            },

            /**
             *
             * @param mega {Element}
             * @param dropdown {Element}
             */
            createTouchMenuItemsFromMegaDropdown:function(mega,dropdown){
                var a=mega.find('a').not('[touch-menu-item="false"]');
                $.each(a,function(i,link){
                    var menuItem=$('<menu-item></menu-item>');
                    menuItem.append(link);
                    dropdown.append(menuItem);
                });
            }
        },

        /**
         *
         * @param input {object}
         * @private
         */
        _unbindSearch: function (input) {
            input.off('focus');
            input.off('blur');

        },


        /**
         *
         * @private
         */
        _onDestroy:function(){
            this._unbindSearch();
        },


        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        /**
         *  @public
         */
        show: function () {
            this._show();
        },

        /**
         *
         * @public
         */
        hide: function () {
            this._hide();
        }

    });


    return $;


}));



/*
 * =============================================================
 * ellipsis.dropdown
 * =============================================================
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    $.element("ellipsis.dropdown", "ui-button-dropdown",{

        //Options to be used as defaults
        options: {
            animate:false,
            slideDelay:100, //desktop slide delay duration
            slideOpenDuration: 250, //desktop slide open duration
            slideCloseDuration: 150,
            mode:'dropdown',
            handleEvents:false

        },

        /* internal/private object store */
        _data: {
            show: 'show',//internal class for display
            visible:'visible',
            dropdownClass: 'ui-dropdown', //dropdown class
            height:null,
            paused:false,
            element: null //internal jQuery object for dropdown element

        },


        /*==========================================
         PRIVATE
         *===========================================*/


        /**
         * init
         * @private
         */
        _initElement: function(){
            var element = this.element.find('ui-dropdown');
            if(!element[0]){
                element=this.element.find('ui-mega-dropdown');
            }
            if(!element[0]){
                this._destroy();
                return;
            }
            this._data.element=element;
            if(this.options.animate){
                this._data.transformContainer=$('body');
                this._getHeight();
            }
            this._focus();

        },


        /**
         * set internal height = element height + dropdown class element height
         * @private
         */
        _getHeight: function(){
            var h1= this._data.element.height();
            var h2=this.element.height();
            this._data.height = parseInt(h1 + h2);
        },

        /**
         * private method to add focus(tabIndex) to element
         * @private
         */
        _focus: function(){
            this.element.attr('tabindex',0);
        },

        /**
         * private method that shows the dropdown
         * @private
         */
        _show: function () {
            if(this._isDisabled()){
                return;
            }
            if(this.options.animate){
                this._animateShow();
            }else{
                this._onEventTrigger('show', {});
                this._data.element.addClass(this._data.show);
            }

        },

        /**
         * private method that hides the dropdown
         * @private
         */
        _hide: function (force) {
            if(this._isDisabled()){
                return;
            }
            if(this._data.paused && !force){
                return;
            }
            if(this.animate){
                this._animateHide();
            }else{
                this._onEventTrigger('hide', {});
                this._data.element.removeClass(this._data.show);
            }

        },

        /**
         * show css3 animation
         * @private
         */
        _animateShow: function(){
            if(this._isDisabled()){
                return;
            }
            var element=this.element;
            this._onEventTrigger('showing', {});
            var self=this;
            var opts={};
            opts.duration=this.options.slideOpenDuration;
            opts.delay=this.options.slideDelay;
            opts.coordinates={
                x:0,
                y:this._data.height + 'px',
                z:0
            };
            this._setHardwareAcceleration(this._data.transformContainer);
            this._data.element.addClass(this._data.visible);
            this._3dTransition(element,opts,function(){
                self._resetHardwareAcceleration(self._data.transformContainer);
                self._resetTransition(element);
                self._onEventTrigger('show', {});
            });

        },

        /**
         * hide css3 animation
         * @private
         */
        _animateHide: function(){
            if(this._isDisabled()){
                return;
            }
            this._onEventTrigger('hiding', {});
            var element=this.element;
            var self = this;
            var opts={};
            opts.duration=this.options.slideCloseDuration;
            opts.delay=this.options.slideDelay;
            opts.coordinates={
                x:0,
                y:0,
                z:0
            };
            opts.transitionEnd=true;
            this._setHardwareAcceleration(this._data.transformContainer);
            this._3dTransition(element,opts,function(){
                self._resetHardwareAcceleration(self._data.transformContainer);
                self._data.element.removeClass(self._data.visible);
                self._resetTransform(element);
                self._onEventTrigger('hide', {});
            });

        },

        /**
         * check disabled status
         * @returns {boolean}
         * @private
         */
        _isDisabled: function(){
            var element=this.element;
            if(element.hasClass('disabled') || element.parent().hasClass('disabled')){
                return true;
            }else if(typeof element.attr('disabled') !='undefined' || typeof element.parent().attr('disabled') != 'undefined'){
                return true;
            }else{
                return false;
            }
        },

        /**
         * private method that toggles the dropdown
         *
         * @private
         */
        _toggle: function () {
            if(this.options.animate){
                if(this._data.element.hasClass(this._data.visible)){
                    this._animateHide()
                }else{
                    this._animateShow();
                }
            }else{
                if (this._data.element.hasClass(this._data.show)) {
                    this._hide();
                } else {
                    if(this._support.device.touch){
                        /* for touch devices, explicitly set element focus to fire the focus event */
                        this.element[0].focus();
                        var self=this;
                        /* for touch, set a blur listener on the document */
                        setTimeout(function(){
                            self._blurEvent();
                        },1);
                    }
                    this._show();
                }
            }

        },

        _combo:function(target){
            if(target[0].nodeName==='A'){
                var li=target.parent(this._data.listItem);
                if(!li.hasClass('active')){
                    this._removeActiveClass();
                    li.addClass('active');
                    var text=target[0].innerHTML;
                    this._setText(text);
                    this._onEventTrigger('selected',this._eventData(target,li));
                }
            }
        },

        _selected:function(target){
            var __customElements=this.options.$customElements;
            var dataId=(!__customElements) ? 'data-id' : 'id';

            if(target[0].nodeName==='A' && !this.options.handleEvents){
                var href=target[0].href;
                if(href !=='' && href.indexOf('#') !==0){
                    //this._location(href);
                }

            }else{
                this._onEventTrigger('selected',{
                    id:target.attr(dataId),
                    target:target
                });
            }
        },

        _setText:function(text){
            var span=this.element.find('span');
            span.text(text);
        },

        _removeActiveClass:function(){
            this.element.find(this._data.listItem)
                .removeClass('active');
        },

        _eventData:function(target,li){
            var __customElements=this.options.$customElements;
            var dataId='data-id';
            if(dataId===undefined && __customElements){
                dataId='id';
            }
            var id=li.attr(dataId);
            var a=this.element.find('a');
            var index= a.index(target);
            return {
                index:index,
                id:id,
                target:target
            }
        },


        _onClick:function(event){
            var mode=this.options.mode;
            if(mode==='combo'){
                this._combo($(event.target));
            }else{
                this._selected($(event.target));
            }
            this._toggle();
        },

        _onKeyPress: function(event){
            var mode=this.options.mode;
            if(event.which===13){
                if(mode==='combo'){
                    this._combo($(event.target));
                }else{
                    this._selected($(event.target));
                }
                this._toggle();
            }
        },

        _onBlur:function(event){
            var element = this.element;
            element.removeClass('ui-focus');
            var self=this;
            if(this._support.device.touch){
                this._hide();
                this._unbindBlur();
            }else{
                setTimeout(function(){
                    self._hide();//mozilla/firefox won't fire click event on links unless hide() is delayed
                },200);
            }
        },

        _onFocus:function(event){
            var element = this.element;
            element.addClass('ui-focus');
        },

        _onPause:function(){
            this._data.paused=true;
        },

        _onResume:function(){
            this._data.paused=false;
        },

        /**
         * element events
         * @private
         */
        _events: function () {
            /* click special event name */
            var click=this._data.click;

            var element = this.element;
            var self = this;
            if(this.element.find('ui-mega-dropdown')){
                this._data.paused=true;
            }
            this._event(element,click,function(event){
                if(event.target.tagName.toLowerCase()!=='ui-mega-dropdown'){
                    self._onClick(event);
                }
            });

            this._event(element,'keypress',function(event){
                self._onKeyPress(event);
            });

            this._event(element,'blur',function(event){
                if(!self._data.paused){
                    self._onBlur(event);
                }
            });

            this._event(element,'focus',function(event){
                self._onFocus(event);
            });

            this._event(element,'pause',function(event){
                self._onPause(event);
            });

            this._event(element,'resume',function(event){
                self._onResume(event);
            });

        },

        _blurEvent: function(){
            var click=this._data.click;
            var element=this.element;
            this._event($(document),click,true,function(event){
                if(!$(event.target).closest(element).length && !this._data.paused){
                    element[0].blur();
                }
            });
        },

        _unbindBlur: function(){
           this._unbindEvents();
        },


        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        show: function () {

            this._show();
        },

        hide: function (force) {

            this._hide(force);
        },

        toggle: function () {

            this._toggle();
        },

        pause:function(){
            this._onPause();
        },

        resume:function(){
            this._onResume();
        }



    });

    return $;

}));


/*
 * =============================================================
 * ellipsis.loading
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {


    $.element("ellipsis.loading", {

        options:{
            modalCssClass:null,
            modalZIndex:999,
            modalOpacity:.3,
            duration:500,
            zIndex:null
        },

        _initElement: function(){
            var __customElements=this.options.$customElements;
            if(__customElements){
                this._data.loadingElement='<ui-loading></ui-loading>';
                this._data.loadingSelector='ui-loading';
            }else{
                this._data.loadingElement='<div class="' + this._data.containerClass + '"></div>';
                this._data.loadingSelector='.' + this._data.loadingClass;
            }

            this._remove();
            this._append();
            this._show();
        },

        _remove:function(){
            var element = this.element;
            var loading=element.find(this._data.loadingSelector);
            if(loading[0]){
                loading.remove();
            }
        },

        _append:function(){
            var loading=$(this._data.loadingElement);
            if(this.options.zIndex){
                loading.css({
                    'z-index':this.options.zIndex
                })
            }
            this.element.append(loading);
            this._data.loading=loading;
        },

        _show:function(){
            var self=this;
            var opts={};
            if(this.options.modalCssClass){
                opts.cssClass=this.options.modalCssClass;
            }
            opts.opacity=this.options.modalOpacity;
            opts.zIndex=this.options.modalZIndex;
            this._setModal(this.element,opts,function(){
                self._animate();
            });
        },

        _animate:function(){
            var loading=this._data.loading;
            loading.addClass('animate');
        },

        _hide:function(){
            var loading=this._data.loading;
            loading.removeClass('animate');
            this._killModal();
        },

        _killModal:function(){
            var self=this;
            var duration=this.options.duration;
            setTimeout(function(){
                self._kill();
            },duration);
        },

        _kill:function(){
            this._removeModal();
            var loading=this._data.loading;
            if(loading){
                loading.remove();
            }
            this._data.loading=null;
            this.destroy();
        },

        _onDestroy:function(){
            var loading=this._data.loading;
            if(loading){
                loading.remove();
            }
            var modal=this._data.modal;
            if(modal){
                modal.remove();
            }
        },

        hide:function(){
            this._hide();
        }

    });


    return $;

}));





/*
 * =============================================================
 * ellipsis.notification
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {
    $.element("ellipsis.notification", {

        //Options to be used as defaults
        options:{
            inline:true,
            cssClass:null,
            notificationCss:'ui-notification',
            message:'Processing...',
            terminate:false,
            terminateTimeout: 1000,
            terminateDelay:1000,
            animationDuration:1200,
            top:null

        },

        /* internal/private object store */
        _data: {
            cssClass:null,
            element:null

        },

        /*==========================================
         PRIVATE
         *===========================================*/



        /**
         *
         * @private
         */
        _initElement: function(){
            if(!this.options.inline){
                this._bind();
            }
        },

        /**
         *
         * @private
         */
        _bind:function () {
            var __customElements=this.options.$customElements;
            if(__customElements){
                this._data.notificationSelector='[notify-id="' + this.uuid + '"]';
                this._data.notificationElement='<ui-notification data-notify-id="' + this.uuid + '"></ui-notification>';
            }else{
                this._data.notificationSelector='[data-notify-id="' + this.uuid + '"]';
                this._data.notificationElement='<div data-ui="notification" data-notify-id="' + this.uuid + '"></div>';
            }
            var notification=$(this._data.notificationSelector);
            if(!notification[0]){
                var ele = this.element;
                var notificationCss=this.options.notificationCss;
                var div=$(this._data.notificationElement);
                div.addClass(notificationCss);
                ele.append(div);
                if(this.options.top){
                    div.css({
                        top:this.options.top
                    })
                }
                this._data.element=div;
            }
        },

        /**
         *
         * @private
         */
        _show: function(element){
            var self=this;
            /* if terminate, setTimeout to display notification */
            if(this.options.terminate){
                setTimeout(function(){
                    self._showNotification(element);
                },self.options.terminateDelay);
            }else{
                /* else, show notification immediately */
                this._showNotification(element);
            }
        },

        /**
         *
         * @private
         */
        _showNotification: function(element){
            var self=this;
            element.html(this.options.message);
            if(this.options.cssClass){
                /* remove previously added classes */
                if(this._data.cssClass){
                    element.removeClass(this._data.cssClass);
                }
                element.addClass(this.options.cssClass);
                this._data.cssClass=this.options.cssClass;
            }
            element.addClass('visible');

            /* if terminate, setTimeout to animateOut */
            if(this.options.terminate){
                setTimeout(function(){
                    self._animateOut(element);
                },self.options.terminateTimeout);
            }
        },

        /**
         *
         * @private
         */
        _hide: function(element){
            this._animateOut(element);
        },


        /**
         *
         * @param element
         * @private
         */
        _animateOut:function(element){
            var duration=this.options.animationDuration;
            this._transitions(element,{
                opacity: 0,
                duration:duration
            },function(){
                element.removeClass('visible');
                element.removeAttr('style');
            });
        },


        /**
         *
         * @private
         */
        _onDestroy:function(){
            var element = this._data.element;
            if(element){
                element.remove();
            }
        },


        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        /**
         * @public
         */
        show:function () {
            var element;
            (this.options.inline) ? element=this.element : element=this._data.element;
            this._show(element);

        },

        /**
         * @public
         */
        hide:function () {
            var element;
            (this.options.inline) ? element=this.element : element=this._data.element;
            this._hide(element);

        }

    });

    return $;


}));



/*
 * =============================================================
 * ellipsis.scroll
 * =============================================================
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    $.element("ellipsis.scroll", {


        /*==========================================
         PRIVATE
         *===========================================*/

        _initElement:function(){
            this._scrollEvent();
        },

        _onScroll: $.noop,

        /**
         * element events
         * @private
         */
        _scrollEvent: function(){
            var self = this;
            $(window).on('scroll', function (event) {
                var scrollY = window.pageYOffset;
                self._onScroll(scrollY);
            });
        },

        _onDestroy: function () {
            $(window).off('scroll');
        }



    });

    return $;


}));




/*
 * =============================================================
 * ellipsis.sidebar
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    return $;


}));



/*
 * =============================================================
 * ellipsis.sticky
 * =============================================================
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {
    $.element("ellipsis.sticky", {

        /* Options to be used as defaults */
        options: {
            top: null,
            bottom: null,
            footerSelector: '[data-role="footer"]',
            bottomPadding: 20,
            fudge:0
        },

        /* internal/private object store */
        _data: {
            left: 0,
            offset: null,
            bottom: null,
            documentHeight: null,
            isFixed: false,
            isOffset: false



        },

        /*==========================================
         PRIVATE
         *===========================================*/



        /* init fired once, on _create */
        _initElement: function () {
            /* exit if touch device */
            if (this._support.device.touch || this._support.mq.touch) {
                //return false;
                this._destroy();
            }
            /* exit if no top defined */
            if (this.options.top===undefined) {
                return false;
            }

            /* set the scrollTop to handle page refresh */
            $(window).scrollTop(0);

            this._parseOptions();
            this._getOffset();
            this._getDocumentScrollHeight();
            this._setBottom();
            this._events();

        },

        /**
         * parseInt options
         * @private
         */
        _parseOptions:function(){
            if(this.options.top){
                this.options.top=parseInt(this.options.top);
            }
            if(this.options.bottom){
                this.options.bottom=parseInt(this.options.bottom);
            }
            if(this.options.bottomPadding){
                this.options.bottomPadding=parseInt(this.options.bottomPadding);
            }
        },

        /**
         * show element
         * @private
         */
        _show: function () {
            this.element.show();
        },

        /**
         * hide element
         * @private
         */
        _hide: function () {
            this.element.hide();
        },


        /**
         * scroll event handler
         * @private
         */
        _update: function () {
            var scrollY = window.pageYOffset;
            var offsetTop = this._data.offset.top;
            var offsetBottom = this._data.offset.bottom;
            var scrollHeight = this._data.documentHeight;
            var top = this.options.top;
            var bottom = this._data.bottom;
            var fTop = top + this.options.fudge;
            /*
             scroll values set that trigger fixed sticky positioning:
             scroll Y offset >= element.offset.top -options.top
             scroll Y offset <= scrollHeight - bottom - offsetBottom
             */
            if ((scrollY >= offsetTop - fTop) && (scrollY <= scrollHeight - bottom - offsetBottom)) {
                if (!this._isFixed()) {
                    this._applyStickyTop(top);
                }
            } else if (scrollY > scrollHeight - bottom - offsetBottom) {
                /* scrollY > (scrollHeight - bottom - offsetBottom) triggers absolute offset css */
                if (this._isFixed()) {
                    this._applyStyleOffset(scrollHeight - bottom - offsetBottom);
                }
            } else {
                /* reset if scrollY < (element.offset.top -options.top) */
                if (this._boolStatus()) {
                    this._resetElement();
                }
            }

        },


        /**
         * get document scroll height
         * @private
         */
        _getDocumentScrollHeight: function () {
            var height = $('body')[0].scrollHeight;
            this._data.documentHeight = height;
        },

        /**
         * set the bottom value
         * @private
         */
        _setBottom: function () {
            /* if provided in options */
            if (this.options.bottom) {
                this._data.bottom = this.options.bottom;
            } else {
                /* set from footer height, if footer exists */
                var footer = $(this.options.footerSelector);
                if (footer[0]) {
                    this._data.bottom = footer.outerHeight() + this.options.bottomPadding;
                } else {
                    /* set equal to top value */
                    this._data.bottom = this.options.top;
                }
            }
        },


        /**
         * apply sticky top css
         * @private
         */
        _applyStickyTop: function (y) {
            var width = this.element.outerWidth().toPixel();
            var data = {};
            data.top = y;
            data.left = this._data.offset.left;
            data.event = 'fixed';
            this._resetStyles();
            this.element.css({
                top: y.toPixel(),
                left: this._data.offset.left.toPixel(),
                width: width

            })
                .addClass('ui-sticky');
            this._resetStatus();
            this._data.isFixed = true;
            this._onEventTrigger('fixed', data);
        },

        /**
         * apply offset style
         * @param y
         * @private
         */
        _applyStyleOffset: function (y) {
            if(this.options.fudge){
                y=y + this.options.fudge;
            }
            var width = this.element.outerWidth().toPixel();
            var data = {};
            data.top = y;
            data.event = 'offset';
            this._resetStyles();
            this.element.css({
                'top': y.toPixel(),
                position: 'absolute',
                width: width.toPixel()
            });

            this._resetStatus();
            this._data.isOffset = true;
            this._onEventTrigger('offset', data);
        },


        /**
         * reset sticky css
         * @private
         */
        _resetStyles: function () {
            this.element.removeClass('ui-sticky');
            this.element.removeAttr('style');
        },


        /**
         * release the sticky element & widget state
         * @private
         */
        _resetElement: function () {
            var data = {};
            data.event = 'reset';
            this._resetStyles();
            this._resetStatus();
            this._onEventTrigger('reset', data);
        },

        /**
         * store the element offset
         * and set an additional prop on the offset, offset.bottom=offset.top + height
         * @private
         */
        _getOffset: function () {
            var offset = this.element.offset();
            var height = this.element.outerHeight();
            offset.bottom = offset.top + height;
            this._data.offset = offset;
           

        },

        /**
         * return fixed status
         * @returns {boolean}
         * @private
         */
        _isFixed: function () {
            return this._data.isFixed;
        },

        /**
         * return offset status
         * @returns {boolean}
         * @private
         */
        _isOffset: function () {
            return this._data.isOffset;
        },

        /**
         * return sticky style status
         * @returns {boolean}
         * @private
         */
        _boolStatus: function () {
            return (this._data.isFixed || this._data.isOffset);
        },

        /**
         * reset status bits
         * @private
         */
        _resetStatus: function () {
            this._data.isFixed = false;
            this._data.isOffset = false;
        },


        /**
         * widget events
         * @private
         */
        _events: function () {
            var self = this;
            $(window).on('scroll', function (event) {
                self._update();
            });
        },

        /**
         * For UI 1.9, public destroy() on an instance is handled by the base widget factory
         * define private _destroy() in the widget for additional clean-up
         * @private
         */
        _destroy: function () {
            $(window).off('scroll');
        },


        /**
         * Respond to any changes the user makes to the option method
         * @param key
         * @param value
         * @private
         */
        _setOption: function (key, value) {
            switch (key) {
                case 'disabled':
                    this._super(key, value);
                    break;

                default:
                    this.options[ key ] = value;
                    break;
            }
        },


        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        /**
         *  @public
         */
        show: function () {
            this._show();
        },

        /**
         *
         * @public
         */
        hide: function () {
            this._hide();
        }

    });

    return $;


}));





/*
 * =============================================================
 * ellipsis.tooltip
 * =============================================================
 *
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {

    var _containerSelector='[data-role="container"]';
    if($.element.custom){
        _containerSelector='ui-container';
    }

    $.element("ellipsis.tooltip", {

        /* Options to be used as defaults */
        options:{
            placement:'top',
            tipHeight:8,
            tipWidth:10,
            animationIn:'none',
            animationOut:'none',
            duration:250

        },

        /* internal/private object store */
        _data:{
            padding:1

        },

        /*==========================================
         PRIVATE
         *===========================================*/


        /**
         * show the tooltip
         * @param tooltip {Object}
         * @param element {Object}
         * @private
         */
        _show: function(tooltip,element){
            var props=this._getAnimationInProps(element);
            if(props.preset.toLowerCase() !='none'){
                this._transitions(tooltip,{
                    preset:props.preset,
                    duration:props.duration
                });
            }else{
                tooltip.show();
            }
        },

        /**
         * hide the tooltip
         * @param tooltip {Object}
         * @param element {Object}
         * @private
         */
        _hide: function(tooltip,element){
            var props=this._getAnimationOutProps(element);
            if(props.preset.toLowerCase() !='none'){
                this._transitions(tooltip,{
                    preset:props.preset,
                    duration:props.duration
                });
            }else{
                tooltip.hide();
            }
        },

        /**
         * creates the animation object for tooltip animationIn
         * @param element {Object}
         * @returns {Object}
         * @private
         */
        _getAnimationInProps: function(element){
            var props={
                preset:this.options.animationIn,
                duration:this.options.duration
            };
            if (typeof element.attr('data-animation-in')!=='undefined'){
                props.preset=this._utils.string.dashToCamelCase(element.attr('data-animation-in'));
            }
            if (typeof element.attr('data-duration')!=='undefined'){
                props.preset=element.attr('data-duration');
            }
            return props;
        },

        /**
         * creates the animation object for tooltip animationOut
         * @param element {Object}
         * @returns {Object}
         * @private
         */
        _getAnimationOutProps: function(element){
            var props={
                preset:this.options.animationOut,
                duration:this.options.duration
            };
            if (typeof element.attr('data-animation-out')!=='undefined'){
                props.preset=this._utils.string.dashToCamelCase(element.attr('data-animation-out'));
            }
            if (typeof element.attr('data-duration')!=='undefined'){
                props.preset=element.attr('data-duration');
            }
            return props;
        },

        /**
         * gets the hex color to apply to canvas tip
         * @param canvas {Object}
         * @returns {String}
         * @private
         */
        _tipColor:function(canvas){
            return this._utils.color.rgb2hex(canvas.css('color'));
        },

        /**
         * get the tooltip padding(top,bottom,left or right)
         * @param tooltip {Object}
         * @param direction {String}
         * @returns {String}
         * @private
         */
        _toolTipPadding: function(tooltip,direction){
            return tooltip.css('padding-' + direction);
        },


        /**
         * get the tooltip placement
         * @param element {Object}
         * @returns {String}
         * @private
         */
        _placement:function(element){
            return (typeof element.attr('data-placement') != 'undefined') ? element.attr('data-placement') : this.options.placement;
        },

        /**
         * get the tip padding for element tooltip
         * @param element {Object}
         * @returns {Number}
         * @private
         */
        _padding:function(element){
            return (typeof element.attr('data-padding') != 'undefined') ? element.attr('data-padding') : this._data.padding;
        },

        /**
         * add css class to the element tooltip
         * @param element {Object}
         * @param tooltip {Object}
         * @private
         */
        _tooltipClass:function(element,tooltip){
            var cssClass=element.attr('data-tooltip-class');
            if(cssClass && cssClass!==undefined){
                tooltip.addClass(cssClass);
            }
        },

        /**
         * create element tooltip for 'right' placement
         * @param element {Object}
         * @param tooltip {Object}
         * @param canvas {Object}
         * @param dimensions {Object}
         * @param coords {Object}
         * @private
         */
        _right:function(element,tooltip,canvas,dimensions,coords){
            var left,top,tipHeight,tipWidth;
            tipHeight=this.options.tipHeight;
            tipWidth=this.options.tipWidth;

            //left position of the tooltip(element left + element width + canvas tip height + padding factor)
            left=coords.left;
            left=left + parseInt(dimensions.element.width);
            left=left + parseInt(tipHeight) + this._padding(element);

            //top position of the tooltip(element top - 1/2 element height)
            //coords.top=coords.top-50;
            top=coords.top - parseInt(element.height()/2);

            tooltip.css({
                left:left.toFloatPixel(),
                top:top.toFloatPixel()
            });

            var topPadding=this._toolTipPadding(tooltip,'top').toInteger()/2;

            //set the canvas element css positioning
            canvas.css({
                left:'-' + (tipHeight.toFloatPixel()),
                top:'-' + parseInt(topPadding).toFloatPixel()
            });

            //canvas attributes
            canvas.attr('width',tipHeight);
            canvas.attr('height',dimensions.tooltip.height);

            //draw the triangle tip
            var ctx=canvas[0].getContext("2d");
            ctx.fillStyle=this._tipColor(canvas);

            var x1=1;
            var y1=parseInt(dimensions.tooltip.height/2);
            var x2=tipHeight;
            var y2=y1 - parseInt(tipWidth/2);
            var y3=y2 + tipWidth;

            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.lineTo(x2,y3);


            ctx.fill();
        },

        /**
         * create element tooltip for 'left' placement
         * @param element {Object}
         * @param tooltip {Object}
         * @param canvas {Object}
         * @param dimensions {Object}
         * @param coords {Object}
         * @private
         */
        _left:function(element,tooltip,canvas,dimensions,coords){
            var left,top,tipHeight,tipWidth;
            tipHeight=this.options.tipHeight;
            tipWidth=this.options.tipWidth;

            //left position the tooltip(element left - tooltip width - canvas tip height - padding factor)
            left=coords.left;
            left=left - parseInt(dimensions.tooltip.width);
            left=left - parseInt(tipHeight) - this._padding(element);

            //top position of the tooltip(element top - 1/2 element height)
            top=coords.top - parseInt(element.height()/2);

            //set the tooltip positioning
            tooltip.css({
                left:left.toFloatPixel(),
                top:top.toFloatPixel()
            });

            var topPadding=this._toolTipPadding(tooltip,'top').toInteger()/2;

            //set the canvas element css positioning
            canvas.css({
                left:dimensions.tooltip.width-this._padding(element)-1,
                top:'-' + parseInt(topPadding).toFloatPixel()
            });

            //canvas attributes
            canvas.attr('width',tipHeight);
            canvas.attr('height',dimensions.tooltip.height);

            //draw the triangle tip
            var ctx=canvas[0].getContext("2d");
            ctx.fillStyle=this._tipColor(canvas);

            var x1=0;
            var y1=parseInt(dimensions.tooltip.height/2)-parseInt(tipWidth/2);
            var x2=tipHeight;
            var y2=parseInt(dimensions.tooltip.height/2);
            var x3=0;
            var y3=parseInt(dimensions.tooltip.height/2)+ parseInt(tipWidth/2);

            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.lineTo(x3,y3);


            ctx.fill();
        },

        /**
         * create element tooltip for 'top' placement
         * @param element {Object}
         * @param tooltip {Object}
         * @param canvas {Object}
         * @param dimensions {Object}
         * @param coords {Object}
         * @private
         */
        _top:function(element,tooltip,canvas,dimensions,coords){

            var left,top,tipHeight,tipWidth;
            tipHeight=this.options.tipHeight;
            tipWidth=this.options.tipWidth;

            //left position the tooltip
            left=coords.left + parseInt(dimensions.element.width/2) - parseInt(dimensions.tooltip.width/2);
            //force coords.left if specified
            if(typeof element.attr('data-left') !=='undefined'){
                left=coords.left;
            }

            //top position of the tooltip
            top=coords.top - dimensions.tooltip.height - tipHeight - this._padding(element);

            //set the tooltip positioning
            tooltip.css({
                left:left.toFloatPixel(),
                top:top.toFloatPixel()
            });

            //set the canvas element css positioning
            canvas.css({
                bottom:'-' + (tipHeight.toFloatPixel())
            });

            //canvas attributes
            canvas.attr('width',dimensions.tooltip.width);
            canvas.attr('height',tipHeight);

            //draw the triangle tip
            var ctx=canvas[0].getContext("2d");
            ctx.fillStyle=this._tipColor(canvas);

            var x1=parseInt(dimensions.tooltip.width/2)-tipWidth;
            var y1=1;
            var x2=x1 + parseInt(tipWidth/2);
            var y2=tipHeight;
            var x3=x1 + tipWidth;

            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.lineTo(x3,y1);
            ctx.fill();

        },

        /**
         * create element tooltip for 'bottom' placement
         * @param element {Object}
         * @param tooltip {Object}
         * @param canvas {Object}
         * @param dimensions {Object}
         * @param coords {Object}
         * @private
         */
        _bottom:function(element,tooltip,canvas,dimensions,coords){

            var left,top,tipHeight,tipWidth;
            tipHeight=this.options.tipHeight;
            tipWidth=this.options.tipWidth;

            //left position the tooltip
            left=coords.left;
            left=left-parseInt(dimensions.tooltip.width/2);
            left=left + parseInt(tipWidth/2);
            left=left + parseInt(dimensions.element.width/2);

            //top position of the tooltip
            top=coords.top + dimensions.element.height + tipHeight + this._padding(element);


            //set the tooltip positioning
            tooltip.css({
                left:left.toFloatPixel(),
                top:top.toFloatPixel()
            });

            //set the canvas element css positioning
            canvas.css({
                top:'-' + (tipHeight.toFloatPixel()),
                left:'-2px'
            });

            //canvas attributes
            canvas.attr('width',dimensions.tooltip.width);
            canvas.attr('height',tipHeight);

            //draw the triangle tip
            var ctx=canvas[0].getContext("2d");
            ctx.fillStyle=this._tipColor(canvas);

            var x1=parseInt(dimensions.tooltip.width/2)-tipWidth/2;
            var y1=tipHeight;
            var x2=parseInt(dimensions.tooltip.width/2);
            var y2=0;
            var x3=parseInt(dimensions.tooltip.width/2) + tipWidth/2;

            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.lineTo(x3,y1);
            ctx.fill();

        },

        /**
         * creates the dimensions object and pipes tooltip creation to the applicable placement create method
         * @param element {Object}
         * @param tooltip {Object}
         * @param canvas {Object}
         * @param coords {Object}
         * @private
         */
        _renderTooltip:function(element,tooltip,canvas,coords){
            var placement=this._placement(element);

            var dimensions={
                element:{
                    width:element.outerWidth(),
                    height:element.outerHeight()
                },
                tooltip:{
                    width:tooltip.outerWidth(),
                    height:tooltip.outerHeight()
                }
            };

            switch(placement){
                case 'top':
                    this._top(element,tooltip,canvas,dimensions,coords);
                    break;

                case 'left':
                    this._left(element,tooltip,canvas,dimensions,coords);
                    break;

                case 'right':
                    this._right(element,tooltip,canvas,dimensions,coords);
                    break;

                case 'bottom':
                    this._bottom(element,tooltip,canvas,dimensions,coords);
                    break;
            }
        },

        /**
         * create method for an element tooltip
         * @param element {Object}
         * @private
         */
        _createToolTip: function(element){
            var attr=this._utils.string.random();
            element.data('tooltip',attr);
            var txt=element.attr('data-title');
            txt=(typeof txt==='undefined') ? 'Tooltip' : txt;
            var coords=this._offset(element[0]);
            var canvas=$('<canvas></canvas>');
            var tooltip=$('<div class="data-tooltip"></div>');
            this._tooltipClass(element,tooltip);
            tooltip.attr('data-id',attr);
            tooltip.html(txt);
            tooltip.append(canvas);
            $(_containerSelector).append(tooltip);
            this._renderTooltip(element,tooltip,canvas,coords);
            this._show(tooltip,element);
        },

        /**
         * parses a tooltip show request(show or create)
         * @param target {Object}
         * @private
         */
        _parseShowRequest:function(target){
            //show or create tooltip
            var attr=target.data('tooltip');
            if(typeof attr ==='undefined'){
                //tooltip for element has not been created
                this._createToolTip(target);
            }else{
                //find and show
                var tooltip=$('[data-id="' + attr + '"]');
                this._show(tooltip,target);
            }
        },

        /**
         * parses a tooltip hide request
         * @param target {Object}
         * @private
         */
        _parseHideRequest: function(target){
            var attr=target.data('tooltip');
            var tooltip=$('[data-id="' + attr + '"]');
            this._hide(tooltip,target);
        },

        /**
         * parses element touchhover special event
         * @param event {Object}
         * @private
         */
        _parseEvent:function(event){
            var target = $(event.target);
            if(event.type==='hoverout'){
                //hide tooltip

                this._parseHideRequest(target);
            }else{
                //show or create tooltip
                this._parseShowRequest(target)
            }
        },

        /**
         * private handler for public show method
         * @param selector {Object}
         * @private
         */
        _showToolTip:function(selector){
            var target=selector;
            if(typeof selector !=='object'){
                target=$(selector);
            }

            this._parseShowRequest(target);
        },

        /**
         * private handler for public hide method
         * @param selector {Object}
         * @private
         */
        _hideToolTip:function(selector){
            var target=selector;
            if(typeof selector !=='object'){
                target=$(selector);
            }

            this._parseHideRequest(target);
        },

        /**
         * widget events
         * document listener for the 'touchover' special event from .ui-tooltip elements
         * @private
         */
        _events: function(){
            var hover=this._data.hover;
            var self=this;
            var doc=this.element;
            this._event(doc,hover,'.ui-tooltip',function(event){
                self._parseEvent(event);
            });


        },

        _removeTooltips:function(removed){
            if(typeof removed==='undefined'){
                $('.data-tooltip').remove();
            }else{
                var elements=removed.find('.ui-tooltip');

                $.each(elements,function(i,obj){
                    var attr=$(obj).data('tooltip-id');
                    var tooltip=$('[data-tooltip="' + attr + '"]');
                    tooltip.remove();
                });

            }
        },


        _onDestroy:function(){
            $('.data-tooltip').remove();
        },


        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        /**
         *  @public
         */
        show:function (selector) {
            this._showToolTip(selector);
        },

        /**
         *
         * @public
         */
        hide:function (selector) {
            this._hideToolTip(selector);
        },

        remove:function(removed){
            this._removeTooltips(removed);
        }

    });


    /**
     * Tooltip Declarative Invocation
     *
     * with tooltip, we use an event delegated single listener  on the document. do not use data-ui="tooltip"(or custom element ui-tooltip)
     * the class attribute ".ui-tooltip" on the element is the child selector for the jquery special event touchhover, which
     * triggers the tooltip.
     *
     * Hence there is no method "tooltip" on the element and attempting to instantiate the widget directly on the element will
     * throw an error.
     *
     * the widget api, however, implements show/hide for a passed selector
     */
    $(function () {
        $(document).tooltip();
    });

    return $;


}));




/*
 * =============================================================
 * ellipsis.window
 * =============================================================
 *
 */

//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('ellipsis-element'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['ellipsis-element'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory($);
    }
}(this, function ($) {
    $.element("ellipsis.window","ui-window", {

        //Options to be used as defaults
        options: {
            animationIn:'slideInDown',
            animationOut: 'none',
            duration: 300,
            height: null,
            width: null,
            top: null,
            bottom: null,
            left: null,
            right: null,
            modal: false,
            template: null,
            model: [],
            url: null,
            title: '',
            btnActionText: 'Save',
            zIndex: 110000,
            setZIndex:false,
            draggable: false,
            dragHandle: '.header',
            dragCursor: 'move',
            opacityCss:null,
            cssClass:null

        },

        _data:{
            element: null,
            backdrop:null
        },

        /*==========================================
         PRIVATE
         *===========================================*/

        /**
         * init
         * @private
         */
        _initElement:function(){

            this._setOpts();
            var __customElements=this.options.$customElements;
            this._data.windowSelector='[data-ui="window"]';
            this._data.modalSelector='.ui-modal';
            if(__customElements){
                this._data.windowSelector='ui-window';
                this._data.modalSelector='ui-modal';
            }
            var ele = this.element;
            this._isOpen = false;
            this._setModalInit();
            if (this.options.template != null) {
                this._load();
            } else {
                this._initWindow(ele);
            }
        },


        /**
         *
         * @private
         */
        _init: function () {

            this._open();
        },

        _setOpts:function(){
            if(this.options.top==='null'){
                this.options.top=null;
            }
            if(this.options.left==='null'){
                this.options.left=null;
            }
            if(this.options.height==='null'){
                this.options.height=null;
            }
            if(this.options.width==='null'){
                this.options.width=null;
            }
            if(this.options.bottom==='null'){
                this.options.bottom=null;
            }
            if(this.options.right==='null'){
                this.options.right=null;
            }
            if(this.options.template==='null'){
                this.options.template=null;
            }
            if(this.options.url==='null'){
                this.options.url=null;
            }
            if(this.options.opacityCss==='null'){
                this.options.opacityCss=null;
            }
            if(this.options.cssClass){
                this.element.addClass(this.options.cssClass);
            }
        },

        /**
         * override _onInit
         */
        _onInit: $.noop,

        /**
         *
         * @private
         */
        _load: function(){
            var self = this;
            var ele = this.element;
            var options = {};
            options.template = this.options.template;
            options.model = this.options.model;
            this._render(ele, options, function () {
                var child = ele.find(this._data.windowSelector);
                self._initWindow(child);

            });

        },

        /**
         *
         * @param element {Object}
         * @private
         */
        _initWindow: function (element) {
            //store the reference to the actual window here; if loaded from a template, this.element is the wrapper and not the window
            //thus proceeding calls(except: this._destroy) should always call this.options.window to get the correct reference;
            this._data.element = element;

            element.attr({tabIndex: -1});
            this._focusable(element);
            this._bindClose();

        },

        /**
         *
         * @private
         */
        _setModalInit: function(){
            //if smartphone, modal is true regardless
            if(this._support.device.smartphone){
                this.options.modal=true;
            }
        },

        /**
         *
         * @private
         */
        _setDrag: function () {
            var ele = this._data.element;
            var draggable = this.options.draggable;
            var dragHandle = this.options.dragHandle;
            var dragCursor = this.options.dragCursor;

            if ((draggable) || (draggable === 'true')) {
                //we must explicitly define a handle to preserve the focus event, since draggable() ---> e.preventDefault();
                ele.draggable({ handle: dragHandle, cursor: dragCursor });
            }
        },

        /**
         *
         * @private
         */
        _setPosition: function () {
            var ele = this._data.element;
            var css = {};
            var top = this.options.top;
            var bottom = this.options.bottom;
            var left = this.options.left;
            var right = this.options.right;
            if ((top != null) && (bottom != null)) {
                css.bottom = 'auto';
                css.top = top + 'px';
            } else if (top != null) {
                css.bottom = 'auto';
                css.top = top + 'px';
            } else if (bottom != null) {
                css.top = 'auto';
                css.bottom = bottom + 'px';
            }
            if ((right != null) && (left != null)) {
                css.right = 'auto';
                css.left = left + 'px';
            } else if (right != null) {
                css.left = 'auto';
                css.right = right + 'px';
            } else if (left != null) {
                css.right = 'auto';
                css.left = left + 'px';
            }
            if (!$.isEmptyObject(css)) {
                css.margin = '0px';
                ele.css(css);
            }
        },

        /**
         *
         * @private
         */
        _setDimensions: function () {
            var ele = this._data.element;
            var css = {};
            var height = this.options.height;
            var width = this.options.width;
            if (height != null) {
                css.height = height + 'px';
            }
            if (width != null) {
                css.width = width + 'px';
            }
            if (!$.isEmptyObject(css)) {
                ele.css(css);
            }
        },

        /**
         *
         * @private
         */
        _setZIndex: function () {
            if(this.options.setZIndex){
                var ele = this._data.element;
                var key = 'window_zIndex';
                var zIndex = this._getData(key);
                var option = this.options.zIndex;
                var css = ele.css('z-index');
                if (zIndex != null) {
                    zIndex = parseInt(zIndex);
                    zIndex++;
                } else if (option != null) {
                    zIndex = parseInt(option);
                    zIndex++;
                } else if (css != null) {
                    zIndex = parseInt(css);
                    zIndex++;
                } else {
                    zIndex = 9999;
                }

                ele.css({'z-index': zIndex});
                this._setData(key, zIndex);

            }

        },

        /**
         *
         * @private
         */
        _open: function () {
            if (this._isOpen) {
                return;
            }
            var eventData=this._eventData();
            this._isOpen = true;
            var ele = this._data.element;
            this._onEventTrigger('showing', eventData);

            this._setDrag();
            this._setPosition();
            this._setZIndex();
            this._setPosition();
            this._setDimensions();

            var modal = this.options.modal;

            var duration = this.options.duration;
            var url = this.options.url;
            if ((modal === true) || (modal === 'true')) {
                this._backdrop();
            }
            if(this.options.animationIn==='none'){
                ele.addClass('show');
                this._onEventTrigger('show',{});
            }else{
                this._transitions(ele,{
                    preset:this.options.animationIn,
                    duration:duration
                },function(){
                    //self._onEventTrigger('show',{});
                });
            }


            if (url != null) {
                this._url(url);
            }

        },

        /**
         *
         * @param url {String}
         * @private
         */
        _url: function (url) {
            var ele = this._data.element;
            var body = ele.find('.body');
            body.empty();
            if (this._isRemote(url)) {
                body.css({padding: '0px'});
                //remote load url into iframe; Note: external sites may be configured to block this
                var iFrame = ele.find('section > iframe');
                if (iFrame[0]) {
                    iFrame.attr({src: url});
                } else {
                    iFrame = $('<iframe></iframe>');
                    iFrame.attr({
                        src: url,
                        height: '100%',
                        width: '100%',
                        frameborder: '0'

                    });
                    body.append(iFrame);
                }
            } else {
                //ajax load local url
                body.load(url);
            }

        },

        /**
         *
         * @param url {String}
         * @returns {boolean}
         * @private
         */
        _isRemote: function (url) {
            var index = url.indexOf('http://');
            return (index > -1);


        },

        /**
         *
         * @private
         */
        _backdrop: function () {
            var ele = this._data.element;
            var backdrop = $(this._data.modalElement);
            if (ele.hasClass('light')) {
                backdrop.addClass('light');
            } else if (ele.hasClass('transparent')) {
                backdrop.addClass('light transparent');
            }
            if(this.options.opacityCss){
                backdrop.addClass(this.options.opacityCss);
            }
            var body = $('body');
            body.append(backdrop);
            this._data.backdrop=backdrop;

        },

        /**
         *
         * @private
         */
        _removeBackdrop: function () {
            var backdrop = $(this._data.modalSelector);
            backdrop.remove();
        },

        /**
         *
         * @private
         */
        _close: function () {
            var ele = this._data.element;
            var eventData=this._eventData();
            this._onEventTrigger('hiding', eventData);
            var modal = this.options.modal;
            var hide = this.options.hide;
            if ((modal === true) || (modal === 'true')) {
                this._removeBackdrop();

            }
            ele.removeClass('show');
            this._isOpen = false;
            this.element.remove();
            $(window).trigger('window.hide', eventData);

        },

        /**
         *
         * @private
         */
        _bindClose: function () {
            var self=this;
            /* click special event name */
            var click=this._data.click;

            var ele = this._data.element;
            var close = ele.find('header > .close');
            if (close[0]) {
                this._event(close,click,function(event){
                    self._close();
                });
            }
        },

        /**
         *
         * @returns {{}}
         * @private
         */
        _eventData:function(ele){
            var data={};
            data.target=this._data.element;
            try{
                if(ele !==undefined){
                    $.extend(data,this._getAttrs(ele,true));
                }
            }catch(ex){

            }

            return data;
        },

        /**
         *
         * @private
         */
        _events: function () {

            var self=this;
            /* click special event name */
            var click=this._data.click;

            var ele = this._data.element;
            var eventData;

            var cancel = ele.find('footer > [data-cancel]');

            if (cancel[0]) {
                eventData=this._eventData(cancel[0]);
                this._event(cancel,click,function(event){
                    self._close();
                    self._onEventTrigger('cancel', eventData);
                });
            }

            var action = ele.find('footer > [data-action]');
            if (action[0]) {
                eventData=this._eventData(action[0]);
                this._event(action,click,function(event){
                    self._onEventTrigger('action', eventData);
                });
            }
        },


        /**
         *
         * @private
         */
        _focusin: function () {
            //focused window needs to be on top
            this._setZIndex();
        },

        /**
         *
         * @private
         */
        _setTitle: function () {
            var ele = this._data.element;
            var title = this.options.title;
            var h3 = ele.find('header > h3');
            h3.text(title);

        },

        /**
         *
         * @private
         */
        _setBtnActionText: function () {
            var ele = this._data.element;
            var label = this.options.btnActionText;
            var btn = ele.find('footer > [data-action]');
            btn.text(label);

        },


        /**
         *
         * @private
         */
        _onDestroy:function(){


        },

        /**
         * Respond to any changes the user makes to the option method
         * @param key
         * @param value
         * @private
         */
        _setOption: function (key, value) {
            switch (key) {
                case 'disabled':
                    this._super(key, value);
                    break;
                case 'title':
                    this.options.title = value;
                    this._setTitle();
                    break;
                case 'btnActionText':
                    this.options.btnActionText = value;
                    this._setBtnActionText();
                    break;
                case 'height':
                    this.options.height = value;
                    this._setDimensions();
                    break;
                case 'width':
                    this.options.width = value;
                    this._setDimensions();
                    break;
                case 'top':
                    this.options.top = value;
                    this._setPosition();
                    break;
                case 'bottom':
                    this.options.bottom = value;
                    this._setPosition();
                    break;
                case 'left':
                    this.options.left = value;
                    this._setPosition();
                    break;
                case 'right':
                    this.options.right = value;
                    this._setPosition();
                    break;
                case 'zIndex':
                    this.options.zIndex = value;
                    this._setZIndex();
                    break;
                default:
                    this.options[ key ] = value;
                    break;
            }


        },


        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        /**
         * @public
         */
        show: function () {
            if (!this._isOpen) {
                this._open();
            }
        },

        /**
         * @public
         */
        hide: function () {

            if (this._isOpen) {
                this._close();
            }
        },

        /**
         *
         * @param options {Object}
         * @param callback {Function}
         * @public
         */
        contentTemplate: function (options, callback) {
            var ele = this._data.element;
            var body = ele.find('.body');
            this.hideLoader();
            this._render(body, options, function () {
                if (callback) {
                    callback.call();
                }
            });
        },

        /**
         *
         * @returns {boolean|*}
         * @public
         */
        isOpen: function () {
            return this._isOpen;
        },

        /**
         * @public
         */
        showLoader: function () {
            var ele = this._data.element;
            var body = ele.find('.body');
            this._showLoader(body);
        },

        /**
         * @public
         */
        hideLoader: function () {
            var ele = this._data.element;
            var body = ele.find('.body');
            this._hideLoader(body);
        }
    });

    //window semantic data api invocation
    //==========================================

    $(document).on('click.window.data-ui touchend.window.data-ui', '[data-trigger="window"]', function (event) {
        var __customElements=($('html').hasClass('customelements'));
        var ele = $(this);
        var dataTarget = ele.attr('data-target');
        var target = $(dataTarget);
        var opts1={};
        var opts2={};

        $.each(target[0].attributes, function(i, att){
            if(att.name.indexOf('data-')==0){
                var opt=att.name.replace('data-','');
                if(opt !=='ui' && opt !=='controller'){
                    //exclude data-ui and data-controller
                    opts1[opt.toCamelCase()]= att.value.toCamelCase();
                }
            }
        });

        $.each(ele[0].attributes, function(i, att){
            var opt;
            if(__customElements){
                opts2[att.toCamelCase()]= att.value.toCamelCase();
            }else{
                if(att.name.indexOf('data-')==0){
                    opt=att.name.replace('data-','');
                    if(opt !=='ui' && opt !=='controller'){
                        //exclude data-ui and data-controller
                        opts2[opt.toCamelCase()]= att.value.toCamelCase();
                    }
                }
            }
        });

        var options= $.extend({},opts1,opts2);

        target.window(options);
        event.preventDefault();

    });

    return $;

}));

