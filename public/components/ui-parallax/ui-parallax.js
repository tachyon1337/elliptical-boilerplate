Elliptical(function () {
    $.element("elliptical.parallax", "ui-parallax", {

        /* Options to be used as defaults */
        options: {
            includeFooter: true,
            footerSelector: '[data-role="footer"]'

        },

        /* internal/private object store */
        _data: {
            viewportVelocity: 1,
            mediaViewPortVelocity: .5,
            viewport: null,
            viewportSelector: 'data-viewport',
            scrollY: 0,
            footerObj: null,
            scrollElements: [],
            scrollButtonSelector: '[data-role="scroll-button"]',
            itemSelector: 'li',
            ticking: false,
            footer: null,
            timeoutId: null,
            Y: 0,
            scrollToY: 0,
            scrollButtons: null,
            scrollIncrement: 10,
            touch: false,
            loop: true

        },

        /*==========================================
         PRIVATE
         *===========================================*/



        /**
         * init
         * @private
         */
        _initElement: function () {
            var __customElements = this.options.$customElements;
            if (__customElements) {
                this._registerElements(['parallax-item', 'parallax-scroll-button', 'parallax-scroll-button-container']);
                this._data.scrollButtonSelector = '[role="scroll-button]';
                this._data.itemSelector = 'parallax-item';
                this._data.viewportSelector = 'viewport';
            }
            $(window).scrollTop(0);
            this._setViewport();
            /* if touch, call touch init, otherwise, call desktop init */
            if (this._support.mq.touch) {
                this._initTouch();
            } else {
                this._initDesktop();
            }

            /* setup widget event listeners */
            this._events();

            /* publish init event  */
            this._onEventTrigger('init', this._eventData());
        },


        /**
         * desktop device widget init
         * NOTE: parallax scrolling effect only active for desktop devices
         * @private
         */
        _initDesktop: function () {
            /* set the device type */
            this._data.touch = false;

            /* set the scroll elements */
            this._setScrollElements();

            /* set the footer */
            this._setFooter();

            /* set the body height */
            this._setHeight();

            /* set element scroll css class */
            this._setScroll();

            /* set element visibility */
            this._setVisibility();

            /* start the loop */
            this._loop();
        },


        /* touch device widget init */
        _initTouch: function () {
            /* set the device type */
            this._data.touch = true;

            /* deactivate loop */
            this._stopTheLoop();

            /* set the scroll elements */
            this._setScrollElements();

            /* set element visibility */
            this._setVisibility();
        },


        /**
         * private method that builds the scroll elements array, creates background images for image media elements, and applies
         * the css3 transform to each element
         * @private
         */
        _setScrollElements: function () {
            var self = this;
            var viewport = this._data.viewport;
            var viewportSelector = this._data.viewportSelector;

            /* scrollElements array */
            var arr = [];

            /* all li children  */
            var li = this.element.children(this._data.itemSelector);

            $.each(li, function (index, obj) {
                var $obj = $(obj);
                var cssClass = $obj.attr('class');
                var mediaAttr = obj.hasAttribute('media');
                var contentAttr = obj.hasAttribute('content');

                var top;

                if (index === 0) {
                    top = 0;
                } else {
                    top = arr[index - 1].bottom;
                }

                var coordinates = {
                    x: 0,
                    y: top + 'px',
                    z: 0
                };

                var height = $obj.outerHeight();
                var width = viewport.width;

                /* class="media", we set a background image from the child image */
                if (cssClass === 'media' || mediaAttr) {
                    var img = $obj.find('img');
                    if (img[0]) {
                        /* if the li has attribute, data-viewport, the background covers the entire viewport */
                        if (typeof $obj.attr(viewportSelector) != 'undefined') {
                            height = viewport.height;
                            $obj.css({
                                height: height + 'px'
                            });

                        }
                        /* create the background element from the image */
                        self._setBackground(img, $obj, height);
                    }
                }
                /* apply css3 transform */
                self._setTransform($obj, coordinates);

                var bottom = top + height;

                /* create a scroll object */
                var scrollObj = {
                    element: $obj,
                    top: top,
                    bottom: bottom,
                    height: height,
                    width: width,
                    cssClass: cssClass,
                    contentAttr: contentAttr,
                    mediaAttr: mediaAttr
                };
                /* push the scroll object into the scroll elements array */
                arr.push(scrollObj);

            });

            /* store the scrollElements array */
            this._data.scrollElements = arr;

        },


        /**
         * sets the page body height
         * @private
         */
        _setHeight: function () {
            var arr = this._data.scrollElements;
            var length = arr.length;
            length--;
            var height = arr[length].bottom;
            $('body').height(height + 'px');

        },


        /**
         * add the scroll class to the element
         * @private
         */
        _setScroll: function () {
            /* add the scroll class to the widget element */
            this.element.addClass('scroll');
        },


        /**
         * set element children visibility
         * @private
         */
        _setVisibility: function () {
            this.element.addClass('visible');
        },


        /**
         * set the page footer
         * @private
         */
        _setFooter: function () {
            /* if the footer is to be included, push the footer into the scrollElements array */
            if (this.options.includeFooter) {
                var arr = this._data.scrollElements;
                this._footer();
                arr.push(this._data.footerObj);
                /* update the stored array */
                this._data.scrollElements = arr;
            }
        },


        /**
         * store the current viewport object
         * @private
         */
        _setViewport: function () {
            this._data.viewport = this._support.device.viewport;

        },


        /**
         * call the css3 transform
         * @param obj {object}
         * @param coordinates {object}
         * @private
         */
        _setTransform: function (obj, coordinates) {
            if (!this._data.touch) {
                this._transform(obj, coordinates);
            }
        },


        /**
         * create/set the background image
         * @param img {object}
         * @param li {object}
         * @param height {number}
         * @private
         */
        _setBackground: function (img, li, height) {
            var elementHeight = height + 'px';
            /* get src from the image src attribute */
            var src = img.attr('src');
            /* get background div reference */
            var div = li.find('div.background');
            if (!div[0]) {
                /* if it doesn't exist, create & append */
                div = $('<div class="background"></div>');
                li.append(div);
            }
            /* apply background-image and height */
            div.css({
                'background-image': 'url(' + src + ')',
                height: elementHeight
            });
            /* hide the actual image */
            img.hide();
        },


        /**
         * requestAnimationFrame callback handler
         * @private
         */
        _requestTick: function () {
            var scrollY = window.pageYOffset;
            var lastScrollY = this._data.scrollY;
            if ((!this._data.ticking) && (this._delta(scrollY, lastScrollY) > 0)) {
                this._data.ticking = true;
                this._data.scrollY = scrollY;
                this._update();
            } else {
                this._loop();
            }
        },


        /**
         * returns distance(or absolute value difference) between 2 numbers
         * @param x {number}
         * @param y {number}
         * @returns {number}
         * @private
         */
        _delta: function (x, y) {
            return Math.abs(x - y);
        },


        /**
         * fires the animation and resets ticking flag when completed
         * @private
         */
        _update: function () {
            this._animate();
            this._data.ticking = false;
        },


        /**
         * applies the css3 transform to each element in the scrollElements array
         * @private
         */
        _animate: function () {
            var self = this;
            var viewportVelocity = this._data.viewportVelocity;
            var mediaViewportVelocity = this._data.mediaViewPortVelocity;
            var scrollY = this._data.scrollY;
            var arr = this._data.scrollElements;
            var viewportHeight = this._data.viewport.height;
            $.each(arr, function (index, obj) {

                var y = obj.top - scrollY;
                if (y <= viewportHeight && index > 0) {
                    if (obj.cssClass === 'media' || obj.mediaAttr) {

                        /* desktop: media elements scroll slower to create the parallax effect */
                        y = Math.round(mediaViewportVelocity * y);

                    } else {
                        y = Math.round(viewportVelocity * y);
                    }
                }
                var element = obj.element;
                var coordinates = {
                    x: 0,
                    y: y + 'px',
                    z: 0
                };
                /* set the css3 transform */
                self._setTransform(element, coordinates);
            });

            /* call the loop */
            this._loop();
        },


        /**
         * gets and returns the position object of the page footer(if included in the parallax scroll)
         * @returns {object}
         * @private
         */
        _getFooterObject: function () {
            var footer = $(this.options.footerSelector);
            var arr = this._data.scrollElements;
            var length = arr.length;
            length--;
            var top = arr[length].bottom;
            var height = footer.outerHeight();
            var bottom = top + height;
            var width = this._data.viewport.width;
            var posObj = {
                element: footer,
                top: top,
                bottom: bottom,
                height: height,
                width: width,
                cssClass: ''
            };
            /* store the footer reference */
            this._data.footer = footer;
            return posObj;

        },

        /**
         * applies css and transform to the page footer
         * @private
         */
        _footer: function () {
            var footerObj = this._getFooterObject();
            this._data.footerObj = footerObj;
            var footer = this._data.footer;
            var footerCoordinates = {
                x: 0,
                y: footerObj.top + 'px',
                z: 0
            };

            footer.css({
                position: 'fixed'
            });

            this._setTransform(footer, footerCoordinates);
        },


        /**
         * loop function that replaces the scroll eventListener
         * @private
         */
        _loop: function () {
            if (this._data.loop) {
                var callback = this._requestTick;
                var scroll = this._requestAnimationFrame;
                /* use bind to preserve 'this' widget context in the callback functions */
                scroll(callback.bind(this));
            }
        },


        /**
         * scrollButton click handler
         * @param button {object}
         * @private
         */
        _contentScrollTo: function (button) {
            /* get current y offset */
            var scrollY = window.pageYOffset;
            /* save reference */
            this._data.Y = scrollY;
            /* get the scrollToY y offset */
            this._data.scrollToY = this._scrollToOffset(button);
            this._contentTo();

        },


        /**
         * returns the Y offset of the next content element
         * @param button {object}
         * @returns {number}
         * @private
         */
        _scrollToOffset: function (button) {
            /* get the index of the clicked button */
            var index = this._data.scrollButtons.index(button);

            /* get the position object of the content element */
            var positionObj = this._contentPositionObject(index);
            /*
             offset=element.top - 1/2(viewport height) + 1/2(element height)
             */
            var scrollOffset = positionObj.top - parseInt(this._data.viewport.height / 2) + parseInt((positionObj.bottom - positionObj.top) / 2);
            return scrollOffset;

        },


        /**
         * returns the position object of the next content element,passing the index of the clicked button object
         * @param index {number}
         * @returns {object}
         * @private
         */
        _contentPositionObject: function (index) {
            var arr = this._data.scrollElements;
            var positionObj = {};
            var count = 0;
            $.each(arr, function (i, obj) {
                if (obj.cssClass === 'content' || obj.contentAttr) {
                    if (count === index) {
                        positionObj = obj;
                        return false;
                    } else {
                        count++;
                    }
                }
            });

            return positionObj;
        },

        /**
         * recursive function that increments window.scrollTo --> a scrollToY value
         * @private
         */
        _contentTo: function () {
            var self = this;
            var y = this._data.Y;
            var scrollToY = this._data.scrollToY;
            if (y < scrollToY) {
                y = y + this._data.scrollIncrement;

                if (y > scrollToY) {
                    y = scrollToY;
                }

                this._data.Y = y;
                window.scrollTo(0, y);
                this._data.timeOutId = setTimeout(function () {
                    self._contentTo();

                }, 1);
            } else {
                this._clearTimeout();
            }
        },

        /**
         * clears a recursive setTimeout
         * @private
         */
        _clearTimeout: function () {
            if (this._data.timeOutId) {
                clearTimeout(this._data.timeOutId);
            }
        },

        /**
         * stops the loop from running by setting the internal flag
         * @private
         */
        _stopTheLoop: function () {
            this._data.loop = false;
        },

        /**
         * sets the internal loop flag to true
         * @private
         */
        _startTheLoop: function () {
            this._data.loop = true;
        },


        /**
         * resets the element css to its default state
         * @private
         */
        _reset: function () {
            /* set window scrollTo at the top */
            window.scrollTo(0, 0);

            /* remove style from all li children  */
            var li = this.element.find(this._data.itemSelector);
            li.removeAttr('style');

            /* remove scroll class from element */
            this.element.removeClass('scroll');

            /* remove body css height */
            $('body').css({
                height: ''
            });

            /* remove style from footer, if applicable */
            if (this.options.includeFooter) {
                if (this._data.footer) {
                    this._data.footer.removeAttr('style');
                }
            }
        },

        /**
         * viewport resize event handler, resets scroll elements only on viewport height change
         * @private
         */
        _resize: function () {
            var currentViewport = this._support.device.viewport;
            var storedViewportHeight = this._data.viewport.height;
            var currentViewportHeight = currentViewport.height;
            if (currentViewportHeight != storedViewportHeight) {
                this._data.viewport = currentViewport;
                this._setScrollElements();
            }

            /* publish resize event  */
            this._onEventTrigger('resize', this._eventData());
        },


        /**
         * handles screen resize change to touch dimensions
         * @private
         */
        _onTouchResize: function () {
            this._data.touch = true;
            this._stopTheLoop();
            this._reset();
            this._setScrollElements();

            /* publish resize event  */
            this._onEventTrigger('resize', this._eventData());
        },


        /**
         * handles screen resize change to desktop dimensions
         * @private
         */
        _onDesktopResize: function () {
            this._data.touch = false;
            this._reset();
            this._startTheLoop();
            this._initDesktop();

            /* publish resize event  */
            this._onEventTrigger('resize', this._eventData());
        },


        /**
         * show
         * @private
         */
        _show: function () {
            this.element.show();
        },


        /**
         * hide
         * @private
         */
        _hide: function () {
            this.element.hide();
        },

        _eventData: function () {
            var eventData = {};
            eventData.orientation = this._support.device.orientation;
            eventData.touch = this._data.touch;
            eventData.viewport = this._data.viewport;
            return eventData;
        },


        /**
         * widget events
         * @private
         */
        _events: function () {
            var self = this;
            var orientationEvent = this._support.device.orientationEvent + this.eventNamespace;

            /* orientation change/resize */
            this._event($(window), orientationEvent, function (event) {
                self._resize();
            });


            /* media queries for screen change to touch,phone & desktop
             mostly only applies to handle testing(e.g., manually dragging browser screen width)
             */
            var mq = window.matchMedia(this._support.mq.touchQuery);
            mq.addListener(function () {
                if (mq.matches) {
                    self._onTouchResize();
                }
            });

            var mqs = window.matchMedia(this._support.mq.smartPhoneQuery);
            mqs.addListener(function () {
                if (mqs.matches) {
                    self._onTouchResize();
                }
            });

            var mql = window.matchMedia(this._support.mq.desktopQuery);
            mql.addListener(function () {
                if (mql.matches) {
                    self._onDesktopResize();
                }
            });

            /* scroll button click */
            var scrollButton = this.element.find(this._data.scrollButtonSelector);
            this._data.scrollButtons = scrollButton;
            scrollButton.on('click', function (event) {
                self._contentScrollTo($(this));
            });
        },


        /**
         *
         * @private
         */
        _onDestroy: function () {

            var scrollButton = this._data.scrollButtons;
            scrollButton.off('click');

            /* remove media query event listeners */
            var mq = window.matchMedia(this._support.mq.touchQuery);
            mq.removeListener(function () {
                if (mq.matches) {
                    self._onTouchResize();
                }
            });

            var mqs = window.matchMedia(this._support.mq.smartPhoneQuery);
            mqs.removeListener(function () {
                if (mqs.matches) {
                    self._onTouchResize();
                }
            });

            var mql = window.matchMedia(this._support.mq.desktopQuery);
            mql.removeListener(function () {
                if (mql.matches) {
                    self._onDesktopResize();
                }
            });

            this._stopTheLoop();
            this._reset();
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
});