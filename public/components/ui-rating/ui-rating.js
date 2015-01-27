Elliptical(function () {
    $.element("elliptical.rating", "ui-rating", {

        //Options to be used as defaults
        options: {
            rating: null

        },

        /* internal/private object store */
        _data: {
            bound: false,
            element: null

        },

        /*==========================================
         PRIVATE
         *===========================================*/


        /**
         * init
         * @private
         */
        _initElement: function () {
            this._data.ratingItem = 'li';
            this._data.ratingItemElement = '<li></li>';
            var __customElements = this.options.$customElements;
            if (__customElements) {
                this._registerElements('rating-item');
                this._data.ratingItem = 'rating-item';
                this._data.ratingItemElement = '<rating-item></rating-item>';
            }
            if (!this.options.rating) {
                //cursor pointer on star hover
                this.element.addClass('hover');
                if (this._hasChildren()) {
                    //already populated in the dom, simply listen for selection event
                    this._events();
                } else {
                    //populate with empty stars
                    this._populate('empty');
                    //listen for selection event
                    this._events();
                }
                this._data.bound = true;
            } else {
                this.element.empty();
                this._populate(this.options.rating);

            }
        },

        /**
         * override default call to _events()
         */
        _onInit: $.noop,

        /**
         *
         * @param rating {string}
         * @private
         */
        _populate: function (rating) {
            var self = this;
            var element = this.element;
            var arr;
            if (rating === 'empty') {
                arr = this._emptyRatingArray();
            } else {
                arr = this._ratingArray(parseFloat(rating));
            }
            $.each(arr, function () {
                element.append(self._star(this.toString()));
            });
        },

        /**
         *
         * @param type {string}
         * @returns {object}
         * @private
         */
        _star: function (type) {

            var li = $(this._data.ratingItemElement);
            var div = $('<div class="star"></div>');
            if (type === 'empty') {
                div.addClass('empty').addClass('icon-star-3');
            } else if (type === 'half') {
                div.addClass('icon-star-2');
            } else {
                div.addClass('icon-star');
            }
            li.append(div);
            return li;
        },

        /**
         *
         * @param rating {string}
         * @returns {array}
         * @private
         */
        _ratingArray: function (rating) {
            var arr = [];
            switch (rating) {
                case 0:
                    arr = ['empty', 'empty', 'empty', 'empty', 'empty'];
                    break;

                case .5:
                    arr = ['half', 'empty', 'empty', 'empty', 'empty'];
                    break;

                case 1:
                    arr = ['full', 'empty', 'empty', 'empty', 'empty'];
                    break;

                case 1.5:
                    arr = ['full', 'half', 'empty', 'empty', 'empty'];
                    break;

                case 2:
                    arr = ['full', 'full', 'empty', 'empty', 'empty'];
                    break;

                case 2.5:
                    arr = ['full', 'full', 'half', 'empty', 'empty'];
                    break;

                case 3:
                    arr = ['full', 'full', 'full', 'empty', 'empty'];
                    break;

                case 3.5:
                    arr = ['full', 'full', 'full', 'half', 'empty'];
                    break;

                case 4:
                    arr = ['full', 'full', 'full', 'full', 'empty'];
                    break;

                case 4.5:
                    arr = ['full', 'full', 'full', 'full', 'half'];
                    break;

                case 5:
                    arr = ['full', 'full', 'full', 'full', 'full'];
                    break;

                default:
                    arr = ['empty', 'empty', 'empty', 'empty', 'empty'];
                    break;

            }

            return arr;
        },

        /**
         *
         * @returns {array}
         * @private
         */
        _emptyRatingArray: function () {
            return ['empty', 'empty', 'empty', 'empty', 'empty'];
        },

        /**
         *
         * @returns {boolean}
         * @private
         */
        _hasChildren: function () {
            var li = this.element.find(this._data.ratingItem);
            return (li.count > 0);
        },

        /**
         *
         * @param rating {string}
         * @private
         */
        _show: function (rating) {
            if (typeof rating === 'undefined') {
                if (this.options.rating) {
                    rating = this.options.rating;
                } else {
                    rating = 'empty';
                }
            }
            this.element.empty();
            this._populate(rating);
            if (rating === 'empty') {
                if (!this._data.bound) {
                    this._events();
                }
            } else {
                this._unbindEvents();
                this._data.bound = false;
            }

        },

        /**
         *
         * @private
         */
        _hide: function () {
            this._reset();
            this._unbindEvents();
            this._data.bound = false;

        },

        /**
         *
         * @private
         */
        _reset: function () {
            var li = this.element.find('.star');
            li.addClass('empty').alterClass('icon-star-*', 'icon-star-3');
        },

        /**
         *
         * @param event {object}
         * @param div {object}
         * @private
         */
        _onSelection: function (event, div) {
            var item = $(event.target);
            var index = div.index(item);
            var length = 5;
            //increment
            index++;
            //iterate
            for (var i = 0; i < index; i++) {
                $(div[i]).removeClass('empty').alterClass('icon-star-*', 'icon-star');
            }
            for (var j = index; j < length; j++) {
                $(div[j]).addClass('empty').alterClass('icon-star-*', 'icon-star-3');
            }
            //fire event
            var data = {
                rating: index
            };
            this._onEventTrigger('submit', data);
        },


        /**
         * widget events
         * @private
         */
        _events: function () {
            var self = this;
            /* click special event name */
            var click = this._data.click;

            var element = this.element;
            var div = element.find('.star');

            this._event(div, click, true, function (event) {
                self._onSelection(event, div);
            });
        },




        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        /**
         *  @public
         */
        show: function (rating) {
            this._show(rating);
        },

        /**
         *
         * @public
         */
        hide: function () {
            this._hide();
        },

        /**
         * @public
         */
        reset: function () {
            this._reset();
        }

    });
});