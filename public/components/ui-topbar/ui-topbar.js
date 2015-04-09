Elliptical(function(){

    var navbar='ui-navbar';
    var topbar='ui-topbar';
    var search='ui-search';

    $.element("ellipsis.topbar","ui-topbar", $.ellipsis.navigation, {

        //Options to be used as defaults
        options: {
            dataClass: null,
            transformDuration: 250,
            transformDelay: 0,
            touchDelay: 250,
            translateX: '260px',
            overlayOpacity: .5,
            overlayOpenDuration: 0,
            overlayCloseDuration: 150,
            overlayBackground: '#000',
            includeHome: true,
            homeUrl: '/',
            homeIcon: 'icon-home-2',
            model: [],
            navigationEvents: true,
            delay:1000,
            events:false,
            touchEvents:true


        },

        /* internal/private object store */
        _data: {
            height: null,
            drawer: null,
            input: null,
            touchInput: null,
            open: false,
            toggle: null,
            element: null

        },

        /*==========================================
         PRIVATE
         *===========================================*/



        /**
         * init
         * @returns {boolean}
         * @private
         */
        _initElement: function(){

            //disable if child of another navigation widget
            var parents = this.element.parents(navbar).add(this.element.parents(topbar));
            if (parents[0]) {
                return false;
            }

            //if touch media query, create the touch navigation
            if (this._support.mq.touch) {
                this._createTouchNavigation(this.element, this.options.dataClass);
                this._touchMenuEvents();
            } else {
                //bind desktop menu events
                this._menuEvents();
            }

            //search handler
            var search_ = this.element.find(search);

            if(search_[0]){
                //save ref
                this._data.input=search_.find('input');

                //desktop search handler
                this._onSearch(this._data.input,'desktop');
            }

            //if not touch device, call desktop events
            if (!this._support.device.touch) {
                this._desktopEvents();
            }

            return true;
        },


        /**
         * private method to show the drawer menu
         * @private
         */
        _show: function () {
            if (this._support.mq.touch && !this._data.open && this._data.drawer) {

                var self = this;
                this._onEventTrigger('showing', {});
                this._data.open = true;
                var element = this.element;
                element.css({
                    position: 'absolute'
                });
                this._data.toggle.addClass('active');
                this._openDrawer(function () {
                    self._onEventTrigger('show', {});
                }, function () {
                    self._hide();
                });
            }

        },

        /**
         * private method to hide drawer menu
         * @private
         */
        _hide: function () {
            if (this._support.mq.touch && this._data.open && this._data.drawer) {
                var self = this;
                this._onEventTrigger('hiding', {});
                this._data.open = false;
                var element = this.element;
                this._data.toggle.removeClass('active');
                this._closeDrawer(function () {
                    element.css({
                        position: '',
                        top:''
                    });
                    self._resetMenu();
                    self._onEventTrigger('hide', {});
                });
            }

        },



        /**
         * private method for handling touch menu item touch/click
         * @param item {Object}
         * @private
         */
        _onTouchMenuItemSelect: function (item) {
            var handleTouchEvents=this.options.touchEvents;
            var nodeName,a;
            nodeName = item[0].nodeName.toLowerCase();
            if (nodeName.toLowerCase() === 'menu-item-dropdown') {
                this._touchToggleDropdown(item);
            }else if(nodeName.toLowerCase() === 'menu-item'){
                a=item.find('a');
                if(a[0]){
                    this._touchMenuItem(a,handleTouchEvents);
                }

            }else if(nodeName.toLowerCase() === 'a'){
                this._touchMenuLink(item,handleTouchEvents);
            }
        },

        /**
         *
         * @param item {object}
         * @private
         */
        _onMenuItemSelect: function (item) {
            var handleEvents=this.options.events;
            var a = item.find('a');
            var href = a.attr('href');
            var id = a.attr('data-id');
            var action = a.attr('data-action');
            if (typeof href != 'undefined' && href != '#' && handleEvents ) {
                this._location(href);
            } else {
                var data = {
                    id: id,
                    action: action,
                    mode: 'desktop'
                };
                this._onEventTrigger('selected', data);
            }
        },

        /**
         *
         * @private
         */
        _onOrientationChange:function(){
            if (this._support.mq.touch) {
                var currHeight = this._support.device.viewport.height;
                var height = this._data.height;
                if (height != currHeight) {

                    if (this._data.open) {
                        this._hide();
                    }
                }
                this._data.height = currHeight;
            }
        },

        /**
         *
         * @private
         */
        _onScrollTop:function(){
            var self=this;
            setTimeout(function () {
                self._show();
            }, self.options.touchDelay)
        },

        /**
         *
         * @param query {String}
         * @param mq {Object}
         * @private
         */
        _onMediaQuery: function(query,mq){
            if(query==='touch'){
                if (mq.matches) {
                    //create navigation
                    this._createTouchNavigation(this.element, this.options.dataClass);
                    //reset open state
                    this._data.open = false;
                    //bind the events
                    this._touchMenuEvents();
                }
            }else{
                if (mq.matches) {

                    //reset open state
                    this._data.open = false;
                    //remove navigation
                    this._removeTouchNavigation(this.element);
                }
            }
        },

        /**
         *
         * @param event {Object}
         * @param tag {String}
         * @private
         */
        _onMenuEvent:function(event,tag){
            event.preventDefault();
            var item = $(event.delegateTarget);
            var nodeName = item[0].nodeName.toLowerCase();
            if (nodeName !== tag) {
                item = item.parent(tag);
            }
            this._onMenuItemSelect(item);
        },

        /**
         *
         * @param event {Object}
         * @param tag {String}
         * @private
         */
        _onTouchMenuEvent:function(event,tag){
            event.preventDefault();
            var item = $(event.target);

            this._onTouchMenuItemSelect(item);
        },

        /**
         * element events
         * @private
         */
        _events: function () {
            var click=this._data.click;
            var navScrollTop = 'navScrollTop' + this.eventNamespace;
            var orientationEvent = this._support.device.orientationEvent + this.eventNamespace;
            var self = this;
            var toggle = this.element.find(this._data.toggleSelector);
            this._data.toggle = toggle;
            var $window=$(window);

            //for fixed top menu, we must fire scrollTo(0) to handle the issue of vertical page scroll
            this._event(toggle,click,function(event){
                self._scrollTop(0, navScrollTop);
            });

            //touch device listener that fires menu show
            //this listener handles the onScrollTo event triggered by the touch library
            this._event($window,navScrollTop,function(event){
                self._onScrollTop();
            });

            this._event($window,orientationEvent,function(event){
                self._onOrientationChange();
            });

        },

        /**
         * element desktop events
         * @private
         */
        _desktopEvents: function () {
            /* events for desktop testing */
            //desktop 'resize'
            var self = this;

            //media queries to fire build,destroy drawer on screen change
            var mq = window.matchMedia(this._support.mq.touchQuery);
            mq.addListener(function () {
                self._onMediaQuery('touch',mq)
            });
            var mql = window.matchMedia(this._support.mq.desktopQuery);
            mql.addListener(function () {
                self._onMediaQuery('desktop',mql);
            });
        },

        /**
         *
         * @private
         */
        _menuEvents: function () {
            if(!this.options.events){
                return;
            }
            var self = this;
            var element=this.element;
            var menuItem='ui-menu>menu-item';
            var tag='menu-item';
            var role='[role="menu"]';

            var menuItem_ = element.find(menuItem)
                .add(element.find(role));

            var press = this.__press();

            /* click special event name */
            this._event(menuItem_,press,function(event){
                self._onMenuEvent(event,tag);
            });

        },


        /**
         * element touch menu events
         * @returns {boolean}
         * @private
         */
        _touchMenuEvents: function () {
            var self = this;

            /* click special event name */
            var click=this._data.click;

            var drawer = this._data.drawer;
            if (!drawer) {
                return false;
            }
            if(!this._support.device.touch){
                this._event(drawer,click,'touch-ui-menu>menu-item',function(event){
                    self._onTouchMenuEvent(event);
                });
                this._event(drawer,click,'menu-item-dropdown',function(event){
                    self._onTouchMenuEvent(event);
                });
            }else{
                var touchMenu = $('touch-ui-menu');
                this._event(touchMenu, 'tap', 'a', function (event) {
                    var a = $(event.currentTarget);
                    self._touchMenuItem(a, true);
                });
                this._event(touchMenu, 'tap', 'menu-item-dropdown', function (event) {
                    var item = $(event.target);
                    if (!item.hasClass('close')) {
                        self._touchToggleDropdown(item);
                    }

                });
                this._event(touchMenu, 'dbltap', 'menu-item-dropdown', function (event) {
                    var item = $(event.target);
                    self._touchToggleDropdown(item);
                });
            }

        },


        /**
         *
         * @private
         */
        _unbindMQListeners:function(){
            var self = this;
            var mq = window.matchMedia(this._support.mq.touchQuery);
            mq.removeListener(function () {
                self._onMediaQuery('touch',mq)
            });
            var mql = window.matchMedia(this._support.mq.desktopQuery);
            mql.removeListener(function () {
                self._onMediaQuery('desktop',mql);
            });
        },


        /**
         *
         * @private
         */
        _onDestroy:function(){
            if (this._data.input) {
                this._unbindSearch(this._data.input);
            }
            if (this._data.touchInput) {
                this._unbindSearch(this._data.touchInput);
            }

            this._unbindMQListeners();
            var menuItem=this._data.menuItem;
            if(menuItem){
                menuItem.off(this._data.click);
            }
        },



        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        /**
         * public method to show drawer menu
         */
        show: function () {
            var navScrollTop = 'navScrollTop' + this.eventNamespace;
            this._scrollTop(0, navScrollTop);
        },

        /**
         * public method to hide drawer menu
         */
        hide: function () {
            var self=this;
            setTimeout(function(){
                self._hide();
            },self.options.touchDelay);
        },

        addMenuModel: function(model){
            this._addMenuModel(model);

        }

    });
});
