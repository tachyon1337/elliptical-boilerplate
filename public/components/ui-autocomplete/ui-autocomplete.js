Elliptical(function () {
    var __proto__ = HTMLInputElement.prototype;
    __proto__._name = 'HTMLInputElement';
    $.element(__proto__, "elliptical.autocomplete", "ui-autocomplete", {

        //Options to be used as defaults
        options: {
            durationIn: 300,
            durationOut: 300,
            transitionIn: 'fadeIn',
            transitionOut: 'fadeOut',
            maxHeight: 310,
            minFilterLength: 1,
            template: 'autocomplete-model',
            dataSource: [],
            filter: null,
            dynamicBinding: false,
            selectFocused: 'focused',
            selectFont: 'autocomplete-select-font',
            selectPadding: 5
        },



        /*==========================================
         PRIVATE
         *===========================================*/


        /**
         *
         * @private
         */
        _initElement: function () {
            var __customElements = this.options.$customElements;
            var containerSelector = '[data-role="autocomplete"]';
            if (__customElements) {
                containerSelector = '[role="autocomplete"]';
            }
            this._data.isActive = false;
            this._data.isAnimating = false;
            this._data.autoCompleteContainer = containerSelector;
            this._data.selectList = false;
            this._data.select = null;
            this._data.selectContainer = null;
            this._data.selectedValue = null;
            this._data.ul = null;
            this._data.activeLi = null;
            this._data.liIndex = 0;
            this._data.ulElement = '<ul class="ui-autocomplete" data-role="auto-complete"></ul>';
            this._data.selectAutoWidth = false;
            this._data.initKeyAction = false;

            this._unorderedList();
            if (this.options.selectList) {
                this._selectElements();
                this._selectEvents();
            }

        },

        /**
         *
         * @private
         */
        _in: function () {
            var self = this;
            var ul = this._data.ul;
            this._data.isAnimating = true;
            var duration = this.options.durationIn;
            var transition = this.options.transitionIn;
            var isActive = this._data.isActive;
            if (isActive) {
                return;
            }
            this._onEventTrigger('showing', {});
            this._transitions(ul, {
                preset: transition,
                duration: duration
            }, function () {
                self._data.isActive = true;
                self._data.isAnimating = false;
                self._onEventTrigger('show', {});
            });
        },

        /**
         *
         * @private
         */
        _out: function () {
            var self = this;
            var ul = this._data.ul;
            this._data.isAnimating = true;
            var duration = this.options.durationOut;
            var transition = this.options.transitionOut;
            var isActive = this._data.isActive;
            if (!isActive) {
                return;
            }
            this._onEventTrigger('hiding', {});
            this._transitions(ul, {
                preset: transition,
                duration: duration
            }, function () {
                self._data.isActive = false;
                self._data.isAnimating = false;
                self._onEventTrigger('hide', {});
            });
        },

        /**
         *
         * @private
         */
        _unorderedList: function () {
            var ele = this.element;
            var ul = $(this._data.ulElement);
            ele.after(ul);
            this._data.ul = ul;
        },

        /**
         *
         * @private
         */
        _selectElements: function () {
            var ele = this.element;
            var autoCompleteContainer = ele.parent(this.options.autoCompleteContainer);
            this._data.select = autoCompleteContainer.find('select');
            if (this._data.select[0]) {
                this._data.selectContainer = this._data.select.parent();
                this._data.selectedValue = this._data.select.val();
            }

            try {
                if ($.browser.mozilla) {
                    this._data.selectAutoWidth = false;
                }
            } catch (ex) {

            }
        },


        /**
         *  keyboard up arrow navigation handler
         * @private
         */
        _keyUp: function () {
            var li, nextLi, index, ul;
            ul = this._data.ul;
            index = this._data.liIndex;
            var initKeyAction = this._data.initKeyAction;
            if (index === 0 || initKeyAction) {
                this._data.initKeyAction = false;
                index = 0;
                li = ul.find('li').first();
                this._data.activeLi = li;
                nextLi = li;

            } else {
                index = index - 1;
                li = this._data.activeLi;
                nextLi = li.prev();
            }
            if (nextLi[0]) {
                if (nextLi.hasClass('divider')) {
                    nextLi = nextLi.prev();
                }
                this._removeHover();

                this._data.liIndex = index;

                //handle vertical up arrow scrolling
                if (!this._isNextLiVisible('up', nextLi)) {
                    var liHeight = nextLi.height();

                    /* need to include divider height, if they are dividers */
                    liHeight = liHeight + 1;

                    var scrollTop = ul.scrollTop();
                    scrollTop = scrollTop - liHeight;
                    ul.scrollTop(scrollTop);
                }

                nextLi.addClass('hover');
                this._data.activeLi = nextLi;
            }
        },


        /**
         *  keyboard down arrow navigation handler
         * @private
         */
        _keyDown: function () {
            var li, nextLi, index, ul;
            ul = this._data.ul;
            var initKeyAction = this._data.initKeyAction;

            if (initKeyAction) {
                this._data.initKeyAction = false;
                index = 0;
                li = ul.find('li').first();
                this._data.activeLi = li;
                nextLi = li;

            } else {
                index = this._data.liIndex;
                index = index + 1;
                li = this._data.activeLi;
                nextLi = li.next();
            }
            if (nextLi[0]) {
                if (nextLi.hasClass('divider')) {
                    nextLi = nextLi.next();
                    if (!nextLi[0]) {
                        return;
                    }
                }

                this._data.liIndex = index;
                this._removeHover();

                //handle vertical down arrow scrolling
                if (!this._isNextLiVisible('down', nextLi)) {
                    var liHeight = nextLi.height();

                    /* need to include divider height, if they are dividers */
                    liHeight = liHeight + 1;

                    var viewportIndex = this._viewPortIndex(nextLi);
                    viewportIndex = viewportIndex - 1;

                    var scrollTop = (index - viewportIndex) * liHeight;
                    ul.scrollTop(scrollTop);
                }

                nextLi.addClass('hover');
                this._data.activeLi = nextLi;
            }
        },


        /**
         * keyboard 'Enter' handler
         * @private
         */
        _keyEnter: function () {
            var ele = this.element;
            var li = this._data.activeLi;
            if (li && li[0]) {
                var a = li.find('a');
                var text = a.html();
                ele.val(text);
                ele.blur();
                this._out();
                //throw event
                var evtData = {
                    target: a
                };
                if (this._data.selectList) {
                    evtData.selectedVal = this._data.selectedValue;
                }
                this._onEventTrigger('selected', evtData);
            }
        },


        /**
         * returns boolean regarding li visibility, given keyboard arrow direction
         * @param direction {String}
         * @param nextLi {Object}
         * @returns {boolean}
         * @private
         */
        _isNextLiVisible: function (direction, nextLi) {
            var index = this._data.liIndex;
            var hiddenScrollIndex = this._hiddenScrollIndex(nextLi);
            var viewportIndex = this._viewPortIndex(nextLi);

            var netIndex = index - hiddenScrollIndex;

            if (direction === 'down') {

                return (netIndex < viewportIndex);

            } else {
                //up

                return (index >= hiddenScrollIndex);
            }
        },


        /**
         * returns the max index of the elements currently in the ul scrollTop
         * @param li {Object}
         * @returns {Number}
         * @private
         */
        _hiddenScrollIndex: function (li) {
            var ul = this._data.ul;
            var scrollTop = ul.scrollTop();
            var height = li.height();

            /* need to include divider height, if they are dividers */
            height = height + 1;

            var hiddenScrollIndex = parseInt(scrollTop / height);
            return hiddenScrollIndex;
        },


        /**
         * returns the max number of elements that can be visible in the ul viewport
         * @param li {Object}
         * @returns {Number}
         * @private
         */
        _viewPortIndex: function (li) {
            var liHeight = li.height();
            var viewport = this.options.maxHeight;
            var viewportIndex = parseInt(viewport / liHeight);

            return viewportIndex;
        },

        /**
         *
         * @private
         */
        _removeHover: function () {
            var ul = this._data.ul;
            ul.find('.hover').removeClass('hover');
        },

        /**
         *
         * @private
         */
        _filterData: function () {
            var ele = this.element;
            var self = this;
            var isActive = this._data.isActive;
            var dataSource = this.options.dataSource;
            var filter = this.options.filter;
            var minFilterLength = this.options.minFilterLength;
            var search = ele.val();
            var length = search.length;

            //if not min length, exit
            if (length < minFilterLength) {
                //if autocomplete is active, we need to close it
                if (isActive) {
                    this._out();
                    return;
                } else {
                    return;
                }

            }

            var arr = [];
            search = search.toLowerCase();

            for (var i = 0; i < dataSource.length; i++) {
                var item;
                try {
                    item = dataSource[i][filter];
                    var itemSearch = item.substring(0, length);
                    itemSearch = itemSearch.toLowerCase();
                    if (itemSearch === search) {
                        arr.push(dataSource[i]);
                    }
                } catch (ex) {

                }
            }

            if (arr.length < 1) {
                if (isActive) {
                    this._out();
                }
            } else {
                this._loadFilteredData(arr, function () {
                    if (!isActive) {
                        self._in();
                    }

                });
            }
        },

        /**
         *
         * @param data {Array}
         * @param callback {Function}
         * @private
         */
        _loadFilteredData: function (data, callback) {
            //validate template has been defined
            var template = this.options.template;
            if (!template || template.length < 1) {
                throw Error('Autocomplete Requires an Assigned String Template');
            }

            //render the template with filtered data
            var ul = this._data.ul;
            var options = {};
            options.template = template;
            var model = {
                model: data
            };
            options.model = model;

            this._render(ul, options, function (err, out) {
                callback();

            });

        },


        /**
         * validate if dataSource and filter have been defined
         * @returns {boolean}
         * @private
         */
        _validateDataSource: function () {
            if (this.options.dynamicBinding) {
                return true;
            }
            var dataSource = this.options.dataSource;
            var filter = this.options.filter;
            var result = (!filter || dataSource.length < 1);
            return !result;
        },

        /**
         *
         * @private
         */
        _bindingRequest: function () {
            var ele = this.element;
            var search = ele.val();
            var length = search.length;
            var isActive = this._data.isActive;
            var minFilterLength = this.options.minFilterLength;
            //if not min length, exit
            if (length < minFilterLength) {
                //if autocomplete is active, we need to close it
                if (isActive) {
                    this._out();
                    return;
                } else {
                    return;
                }

            }
            var ul = this._data.ul;
            ul.empty();

            var evtData = {
                search: search
            };
            if (this.options.selectList) {
                evtData.selectedVal = this.options.selectedValue;
            }
            this._onEventTrigger('binding', evtData);

        },

        /**
         *
         * @private
         */
        _selectFocused: function () {

            var selectContainer = this._data.selectContainer;
            var focused = this._data.selectFocused;
            selectContainer.addClass(focused);

        },

        /**
         *
         * @private
         */
        _selectBlurred: function () {
            var selectContainer = this._data.selectContainer;
            var focused = this._data.selectFocused;
            selectContainer.removeClass(focused);

        },

        /**
         *
         * @private
         */
        _selectChanged: function () {
            var ele = this.element;
            ele.val('');
            var selectContainer = this._data.selectContainer;
            var select = this._data.select;
            var optionText = select.find('option:selected').text();
            this.options.selectedValue = select.val();
            if (this._data.selectAutoWidth) {
                var selectFont = this.options.selectFont;
                var div = $('<div style="visible:hidden;position:absolute;top:0;left:0;" class="' + selectFont + '">' + optionText + '</div>');
                var body = $('body');
                if (selectContainer) {
                    body.append(div);
                    var width = div.width();
                    var padding = parseInt(select.css('padding-right'));
                    width = width + padding - this.options.selectPadding;
                    div.remove();
                    selectContainer.css({
                        width: width + 'px'
                    });
                    this._inputPadding(width);
                }
            }


        },

        /**
         *
         * @param width {Number}
         * @private
         */
        _inputPadding: function (width) {
            var ele = this.element;
            width = width + 20;
            ele.css({
                'padding-left': width + 'px'
            })

        },

        /**
         *
         * @param element {Object}
         * @private
         */
        _onFocus: function (element) {
            if (!this._validateDataSource()) {
                return;
            }
            if (this._data.selectList) {
                this._selectFocused();
            }
            this._data.initKeyAction = true;
            element.val('');
        },

        /**
         *
         * @private
         */
        _onBlur: function () {
            if (!this._validateDataSource()) {
                return;
            }
            if (this._data.selectList) {
                this._selectBlurred();
            }
            this._out();
        },

        /**
         *
         * @param $this {Object}
         * @param element {Object}
         * @private
         */
        _onClick: function ($this, element) {
            var text = $this.html();
            element.val(text);
            element.blur();
            this._out();
            //throw event
            var evtData = {
                target: $this
            };
            this._onEventTrigger('selected', evtData);

        },

        /**
         *
         * @param event {Object}
         * @private
         */
        _onKeyDown: function (event) {
            if (!this._validateDataSource()) {
                return;
            }
            var key = event.which;
            if (key === 38) {
                this._keyUp();
            } else if (key === 40) {
                this._keyDown();
            } else if (key === 13) {
                this._keyEnter();
            }
        },

        /**
         *
         * @param event {Object}
         * @private
         */
        _onKeyUp: function (event) {
            if (!this._validateDataSource()) {
                return;
            }
            var key = event.which;

            //alpha-numeric or backspace
            if ((key >= 48 && key <= 90) || (key === 8)) {
                if (this.options.dynamicBinding) {
                    this._bindingRequest();
                } else {
                    this._filterData();
                }
            }
        },


        /**
         * element events
         * @private
         */
        _events: function () {
            var element = this.element;
            var self = this;
            var ul = this._data.ul;

            this._event(element, 'focus', function (event) {
                self._onFocus(element);
            });

            this._event(element, 'blur', function (event) {
                self._onBlur();
            });

            this._event(ul, 'click', 'a', function (event) {
                self._onClick($(this), element);
            });

            element.keydown(function (event) {
                self._onKeyDown(event);
            });

            element.keyup(function (event) {
                self._onKeyUp(event);
            });

        },

        /**
         *
         * @private
         */
        _selectEvents: function () {
            var self = this;
            var select = this._data.select;

            this._event(select, 'change', function (event) {
                self._selectChanged();
            });

        },


        /**
         * $.element handles this._destroy but throws this._onDestroy for additional clean-up
         * @private
         */
        _onDestroy: function () {
            var ul = this._data.ul;
            ul.remove();
            var element = this.element;
            this.element.off('focus');
            this.element.off('blur');
            element.val('');

        },




        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        /**
         * @public
         */
        show: function () {
            var isActive = this.options.isActive;
            var isAnimating = this.options.isAnimating;
            if (!isActive && !isAnimating) {
                this._in();
            }

        },

        /**
         * @public
         */
        hide: function () {
            var isActive = this.options.isActive;
            var isAnimating = this.options.isAnimating;
            if (isActive && !isAnimating) {
                this._out();
            }
        },

        /**
         * @public
         */
        showBinding: function () {
            var self = this;
            var isActive = this._data.isActive;
            var data = this.options.dataSource;

            this._loadFilteredData(data, function () {
                if (!isActive) {
                    self._in();
                }

            });

        },

        /**
         * @public
         * @returns {String}
         */
        selectedValue: function () {
            var selectedVal = null;
            if (this._data.selectList) {
                selectedVal = this._data.selectedValue;
            }
            return selectedVal;
        }

    });
});