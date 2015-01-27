﻿Elliptical(function () {

    $.element.registerElement('tabbed-items');
    $.element.registerElement('tab-item');
    $.element.registerElement('tabbed-content');
    $.element.registerElement('tab-content');
   
    $.controller("elliptical.tabs", "ui-tabs", {

        /* Options to be used as defaults */
        options: {
            dynamicLoad: false,
            border: false,
            borderTop: false,
            borderLeft: false,
            minHeight: null,
            preload: false,
            animate: false,
            duration: 500,
            flex: false,
            preventDefault: false,
            autoHide: true,
            stopPropagation: true,


        },

        /* internal/private object store */
        _data: {
            tabs: null,
            sections: null,
            touch: false,
            activeIndex: null,
            activeTab: null,
            relatedIndex: null,
            tabsElement: null,
            contentSection: null,
            borderTopClass: 'border-top',
            borderLeftClass: 'border-left',
            borderClass: 'border',
            flexClass: 'flex',
            preloadClass: 'loading',
            preloadMessage: 'loading...',
            preloadActive: false,
            restoreStacked: false


        },

        /*==========================================
         PRIVATE
         *===========================================*/


        /**
         * init
         * @private
         */
        _initController: function () {
            this._data.tabbedItems = 'tabbed-items';
            this._data.tabItem = 'tab-item';
            this._data.tabbedContent = 'tabbed-content';
            this._data.tabContent = 'tab-content';
            this._data.dataId = 'id';
            this._data.dataPreload = 'preload';
                
            this._getTabs();
            this._initActiveTab();
            this._getContentSections();
            this._minHeight();
            this._setStyles();
            this._removeStackedTabs();
            if (this.options.autoHide === 'false') {
                this.options.autoHide = false;
            }
        },



        /**
         * assign the tabs array to the internal store
         * @private
         */
        _getTabs: function () {
            var tabsElement = this.element.find(this._data.tabbedItems);
            this._data.tabsElement = tabsElement;
            if (tabsElement[0]) {
                var tabs = tabsElement.children(this._data.tabItem);
                this._data.tabs = tabs;
                if (!tabs[0]) {
                    /* warning */
                    console.log('tabs ui widget has no tabs...');
                }
            } else {
                /* warning */
                console.log('tabs ui widget has no tabs element...');
            }

        },

        /**
         * finds the initial active tab and assigns it to the internal store
         * @private
         */
        _initActiveTab: function () {
            var tabs = this._data.tabs;
            var activeTabs = tabs.filter('.active');
            if (activeTabs) {
                var activeTab = $(activeTabs[0]);
                this._data.activeTab = activeTab;
                this._data.activeIndex = tabs.index(activeTab);
                if (activeTabs.length > 1) {
                    activeTabs.not(activeTab).removeClass('active');
                }
            }
        },

        /**
         * set border style for content element, set flex style for tabs
         * @private
         */
        _setStyles: function () {
            var border, borderTop, flex, borderLeft;
            border = this.options.border;
            borderTop = this.options.borderTop;
            borderLeft = this.options.borderLeft;
            flex = this.options.flex;
            var tabsElement = this._data.tabsElement;
            var contentSection = this._data.contentSection;
            /* reset */
            contentSection
                .removeClass(this._data.borderClass)
                .removeClass(this._data.borderTopClass)
                .removeClass(this._data.borderLeftClass);

            tabsElement.removeClass(this._data.flexClass);
            /* apply */
            if (border) {
                contentSection.addClass(this._data.borderClass);
            } else if (borderTop) {
                contentSection.addClass(this._data.borderTopClass);
            } else if (borderLeft) {
                contentSection.addClass(this._data.borderLeftClass);
            }

            if (flex) {
                tabsElement.addClass(this._data.flexClass);
            }


        },


        /**
         * assign the content sections array to the internal store
         * @private
         */
        _getContentSections: function () {
            var contentSection = this.element.find(this._data.tabbedContent);
            this._data.contentSection = contentSection;
            if (contentSection[0]) {
                this._data.sections = contentSection.children(this._data.tabContent);
                if (!this._data.sections[0]) {
                    /* warning */
                    console.log('tabs ui widget has no content sections...');
                }
            } else {
                /* warning */
                console.log('tabs ui widget has no content element...');
            }
        },

        /**
         * show the new active tab and content section
         * @param obj {object|number|string}
         * @param id {undefined|string}
         * @private
         */
        _show: function (obj, id) {
            var tab;
            if (typeof id === 'undefined') {
                /* either a tab,index or dataid has been passed */
                tab = this._getTabByObject(obj);
                if (tab) {
                    this._showTab(tab);
                }

            } else {
                /* both args passed */
                if (typeof obj === 'number') {
                    /* if first arg a number==index */
                    tab = this._getTabByIndex(obj);
                    this._showTab(tab, id);
                } else {
                    /* first arg=tab, second arg=dataId */
                    this._showTab(obj, id);
                }
            }
        },

        /**
         * hide the active tab and the content section
         *
         * @private
         */
        _hide: function () {
            if (this._data.activeTab) {
                this._data.activeTab.removeClass('active');
                this._hideSection();
            }

        },

        /**
         * processes a new active Tab
         * @param tab {object}
         * @private
         */
        _showTab: function (tab, id) {
            if (this._data.preloadActive) {
                this._removePreload();
            }
            var activeTab = this._data.activeTab;
            this._deactivateTab(activeTab);
            this._assignActiveTab(tab);
            var eventData = this._eventData(tab, activeTab);
            if (!this.options.dynamicLoad) {
                this._hideSection();
                if (typeof id === 'undefined') {
                    this._showSection(tab);
                } else {
                    this._showSection(tab, id);
                }
            } else {
                this._emptySection();
                if (this.options.preload) {
                    this._preload();
                }
            }
            this._onEventTrigger('selected', eventData);

        },

        /**
         * assign the new active Tab to the internal store and apply css active class
         * @param tab {object}
         * @private
         */
        _assignActiveTab: function (tab) {
            var index = this._getTabIndex(tab);
            this._data.relatedIndex = this._data.activeIndex;
            this._data.activeIndex = index;
            this._data.activeTab = tab;
            tab.addClass('active');
        },

        /**
         * show the content section based on tab or dataId
         * @param tab {object}
         * @param dataId {undefined|string}
         * @private
         */
        _showSection: function (tab, dataId) {
            var section;
            var preload = this._preloadTabSelection(tab);
            var animate = this.options.animate;

            if (typeof dataId != 'undefined') {
                /* get the section by the passed dataId */
                section = this._getSectionByDataId(dataId);
            } else {
                /* else get the section from the tab */
                var obj = this._parseTabHref(tab);
                if (obj.length > 0) {
                    /* if href has the dataId */
                    section = this._getSectionByDataId(obj.href);
                } else {
                    /* no dataId, use the index */
                    var index = this._getTabIndex(tab);
                    section = this._getSectionByIndex(index);
                }
            }

            if (section) {
                if (preload) {
                    this._preload();
                } else if (animate) {
                    this._animateSection(section);
                } else {
                    section.addClass('active');
                }
            }
        },

        /**
         * animate section content in
         * @param section {object}
         * @private
         */
        _animateSection: function (section) {
            section.css({
                opacity: 0
            });
            section.show();
            this._transitions(section, {
                opacity: 1,
                duration: this.options.duration.toMillisecond()
            }, function () {
                section.css({
                    opacity: 1
                });
            });

        },

        /**
         * empty section html
         * @private
         */
        _emptySection: function () {
            var index = this._getTabIndex(tab);
            var section = this._getSectionByIndex(index);
            section.empty();

        },

        /**
         * remove active class from deactivate tab
         * @param tab {object}
         * @private
         */
        _deactivateTab: function (tab) {
            if (tab[0]) {
                tab.removeClass('active');
            }
        },

        /**
         * hide content section
         *
         * @private
         */
        _hideSection: function () {
            if (!this.options.preventDefault) {
                if (this._data.sections && this.options.autoHide) {
                    var sections = this._data.sections.filter(":visible");
                    sections.removeClass('active');
                }
            }
        },

        /**
         * parses the child a tag href attribute for a tab element
         * @param tab {object}
         * @returns {object}
         * @private
         */
        _parseTabHref: function (tab) {
            var obj = {};
            var a = tab.find('a');
            var href = a.attr('href');
            var length = 0;
            try {
                if (typeof href != 'undefined') {
                    href = href.replace('#', '');
                    length = href.length;
                }
            } catch (ex) {
                length = 0;
            }
            obj.href = href;
            obj.length = length;
            return obj;
        },

        /**
         * return the tab index for a tab
         * @param tab {object}
         * @returns {number}
         * @private
         */
        _getTabIndex: function (tab) {
            var index = this._data.tabs.index(tab);
            return index;
        },

        /**
         * returns the content section for a tab index
         * @param index {number}
         * @returns {object}
         * @private
         */
        _getSectionByIndex: function (index) {
            var sections = this._data.sections;
            var section = sections[index];
            var $section = $(section);
            return ($section[0]) ? $section : null;

        },

        /**
         * get tab object by index
         * @param index {number}
         * @returns {object}
         * @private
         */
        _getTabByIndex: function (index) {
            var tabs = this._data.tabs;
            var tab = tabs[index];
            var $tab = $(tab);
            return ($tab[0]) ? $tab : null;
        },

        /**
         * get tab by object
         * @param obj {object|number|string}
         * @returns {object}
         * @private
         */
        _getTabByObject: function (obj) {
            var tab = null;
            if (typeof obj === 'object') {
                /* tab */
                tab = obj;
            } else if (typeof obj === 'number') {
                /* index */
                tab = this._getTabByIndex(obj);

            } else if (typeof obj === 'string') {
                /* data-id */
                tab = this._getTabByDataId(obj);
            }
            return tab;
        },

        /**
         * get section by object
         * @param obj {object|number|string}
         * @returns {object}
         * @private
         */
        _getSectionByObject: function (obj) {
            var section = null;
            if (typeof obj === 'object') {
                /* tab */
                var hrefObj = this._parseTabHref(obj);
                if (hrefObj.length > 0) {
                    section = this._getSectionByDataId(hrefObj.href);
                } else {
                    var index = this._getTabIndex(tab);
                    section = this._getSectionByIndex(index);
                }
            } else if (typeof obj === 'number') {
                /* index */
                section = this._getSectionByIndex(obj);

            } else if (typeof obj === 'string') {
                /* data-id */
                section = this._getSectionByDataId(obj);
            }
            return section;
        },

        /**
         * disabled tab status; disabled tab=no handling of tab selected, no event fired
         * @param tab {object}
         * @returns {boolean}
         * @private
         */
        _isDisabled: function (tab) {
            return (tab.hasClass('disabled') || typeof tab.attr('disabled') !== 'undefined');
        },

        /**
         * data-disable=widget is disabled from auto handling tab selected, but event is still fired
         * ex: ui-dropdown in tab
         * @param tab {object}
         * @returns {boolean}
         * @private
         */
        _isDataDisabled: function (tab) {
            return (typeof tab.attr('data-disable') !== 'undefined');
        },

        /**
         * returns the event data object for the 'selected' event
         * @param activeTab {object}
         * @param relatedTab {object}
         * @returns {object}
         * @private
         */
        _eventData: function (activeTab, relatedTab) {
            var data = {};
            data.index = this._data.activeIndex;
            data.target = activeTab;
            data.relatedIndex = this._data.relatedIndex;
            data.relatedTarget = relatedTab;
            return data;
        },

        /**
         * get content section by data-id
         * @param id {string}
         * @returns {object}
         * @private
         */
        _getSectionByDataId: function (id) {
            var section = null;
            var sections = this._data.sections;
            if (sections) {
                var dataSection = sections.filter('[' + this._data.dataId + '="' + id + '"]');

                if (dataSection.length > 0) {
                    section = $(dataSection[0]);
                }
            }

            return section;
        },

        /**
         * get tab by data-id
         * @param id {string}
         * @returns {object}
         * @private
         */
        _getTabByDataId: function (id) {
            var tab = null;
            var tabs = this._data.tabs;
            var dataTab = tabs.find('a').filter('[href=#"' + id + '"]');

            if (dataTab.length > 0) {
                tab = $(dataTab[0]).parent('li');
            }
            return tab;
        },

        /**
         * append preload indicator to the widget
         * @private
         */
        _preload: function () {
            var content = this._data.contentSection;
            var div = $('<div class="' + this._data.preloadClass + '">' + this._data.preloadMessage + '</div>');
            content.append(div);
            this._data.preloadActive = true;
        },

        /**
         * remove the preloader
         * @private
         */
        _removePreload: function () {
            var content = this._data.contentSection;
            var preload = content.find('.' + this._data.preloadClass);
            preload.remove();
            this._data.preloadActive = false;
        },

        /**
         *
         * @param tab {object}
         * @returns {boolean}
         * @private
         */
        _preloadTabSelection: function (tab) {
            return (typeof tab.attr(this._data.dataPreload) !== 'undefined');
        },

        /**
         * apply minimum css height to content element
         * @private
         */
        _minHeight: function () {
            if (this.options.minHeight) {
                var content = this._data.contentSection;
                content.css({
                    'min-height': this.options.minHeight.toPixel()
                });
            }
        },

        /**
         * fires selected event for data-disable tab
         * @param tab {object}
         * @private
         */
        _onDataDisabledSelected: function (tab) {
            var data = {};
            data.index = this._getTabIndex(tab);
            data.target = tab;
            data.relatedIndex = this._data.activeIndex;
            data.relatedTarget = this._data.activeTab;

            this._onEventTrigger('selected', data);
        },

        /**
         * selected tab handler
         * @param tab {object}
         * @private
         */
        _onSelected: function (tab) {
            var relatedIndex = this._data.activeIndex;
            var index = this._getTabIndex(tab);
            if (index != relatedIndex && !this._isDisabled(tab)) {
                if (!this._isDataDisabled(tab)) {
                    this._showTab(tab);
                } else {
                    this._onDataDisabledSelected(tab);
                }
            }
        },

        /**
         * enable tab
         * @param obj {object|number|string}
         * @private
         */
        _enableTab: function (obj) {
            var tab = this._getTabByObject(obj);
            if (tab) {
                tab.removeClass('disabled');
                tab.removeAttr('disabled');
            }
        },

        /**
         *
         * @private
         */
        _enableAll: function () {
            var tabs = this._data.tabs;
            tabs.find('a').removeClass('disabled');
        },

        /**
         * disable tab
         * @param obj {object|number|string}
         * @private
         */
        _disableTab: function (obj) {
            var tab = this._getTabByObject(obj);
            if (tab) {
                tab.addClass('disabled');
            }
        },

        /**
         *
         * @private
         */
        _disableAll: function () {
            var tabs = this._data.tabs;
            tabs.find('a').addClass('disabled');
        },

        /**
         * load and render template in content section
         * @param opts {object}
         * @param obj {object|number|string}
         * @param callback {function}
         * @private
         */
        _load: function (opts, obj, callback) {
            var section = this._getSectionByObject(obj);
            this._removePreload();
            this._render(section, opts, function (err, out) {
                if (callback) {
                    callback(err, out);
                }
            });
        },

        /**
         * remove vertical tabs flex class for smartphone
         * @private
         */
        _removeStackedTabs: function () {
            if (this.element.hasClass('stacked') && this._support.mq.smartphone) {
                //this._data.restoreStacked=true;
                //this.element.removeClass('stacked');
            }
        },

        /**
         *
         * @private
         */
        _restoreStackedTabs: function () {
            if (this._data.restoreStacked) {
                this._data.restoreStacked = false;
                this.element.addClass('stacked');
            }
        },

        /**
         * element events
         * @private
         */
        _events: function () {
            /* click special event name */
            var click = this._data.click;

            var self = this;
            var tabs = this._data.tabs;

            this._event(tabs, click, function (event) {
                event.preventDefault();
                if (self.options.stopPropagation) {
                    event.stopPropagation();
                }
                var tab = $(event.delegateTarget);
                self._onSelected(tab);
            });

            var mqs = window.matchMedia(this._support.mq.smartPhoneQuery);
            mqs.addListener(function () {
                if (mqs.matches) {
                    //self._removeStackedTabs();
                }
            });


            var mq = window.matchMedia(this._support.mq.tabletQuery);
            mq.addListener(function () {
                if (mq.matches) {
                    //self._restoreStackedTabs();
                }
            });

        },



        /**
         *
         * @private
         */
        _onDestroy: function () {
            var mqs = window.matchMedia(this._support.mq.smartPhoneQuery);
            mqs.removeListener(function () {
                if (mqs.matches) {
                    self._removeStackedTabs();
                }
            });
            var mq = window.matchMedia(this._support.mq.tabletQuery);
            mq.removeListener(function () {
                if (mq.matches) {
                    self._restoreStackedTabs();
                }
            });
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

                case 'minHeight':
                    this.options.minHeight = value;
                    this._minHeight();
                    break;

                case 'border':
                    this.options.border = value;
                    this._setStyles();
                    break;

                case 'borderTop':
                    this.options.borderTop = value;
                    this._setStyles();
                    break;

                case 'borderLeft':
                    this.options.borderLeft = value;
                    this._setStyles();
                    break;

                case 'flex':
                    this.options.flex = value;
                    this._setStyles();
                    break;

                default:
                    this.options[key] = value;
                    break;
            }
        },


        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        /**
         *  pass tab, pass tab & index, pass tab & data-id
         *  pass index,data-id
         *  obj {object|number|string}
         *  id {number|string}
         *  @public
         */
        show: function (obj, id) {
            this._show(obj, id);
        },

        /**
         *
         * @public
         */
        hide: function () {
            this._hide();
        },

        /**
         *
         * @param obj {object|number|string}
         */
        disable: function (obj) {
            (typeof obj == 'undefined') ? this._disableAll() : this._disableTab(obj);
        },

        /**
         *
         * @param obj {object|number|string}
         */
        enable: function (obj) {
            (typeof obj == 'undefined') ? this._enableAll() : this._enableTab(obj);
        },

        /**
         * load template opts{model,template} obj(tab||index||data-id)
         * @param opts {object}
         * @param obj {object|number|string}
         * @param callback {function}
         */
        load: function (opts, obj, callback) {
            this._load(opts, obj, function (err, out) {
                if (callback) {
                    callback(err, out);
                }
            });

        }

    });
});