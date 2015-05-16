Elliptical(function () {
    $.element("elliptical.baseProduct", "base-product", {

        /* Options to be used as defaults */
        options: {


        },

        _initElement: function () {
            this._baseEvents();
        },



        /*==========================================
         PRIVATE
         *===========================================*/

        /**
         * product base events
         * @private
         */
        _baseEvents: function () {
            var click = this._press();
            var element = this.element;
            this._event(this.element, click, 'alt-image', this.__onAltImageSelected.bind(this));
            this._event(this.element, click, 'button', this._onButtonAction.bind(this));
        },

        __onAltImageSelected: function (event, data) {
            var element = this.element;
            var images = $(event.delegateTarget);
            images.find('.active').removeClass('active');
            var image = $(event.currentTarget);
            image.addClass('active');
            var mainImage = element.find('main-image').find('img');
            var altImage = image;
            var altImageSrc = altImage.attr('data-src');
            if (altImageSrc !== undefined) {
                mainImage.attr('src', altImageSrc);
            }
            this._onAltImageSelected({ target: event.currentTarget, img: this._data.mainImg });
        },


        _onAltImageSelected: $.noop,

        _onButtonAction: $.noop



    });
});