Elliptical(function () {

    $.element("elliptical.slidingPanel", "ui-sliding-panel", {

        //Options to be used as defaults
        options: {
            durationIn: 1000,
            durationOut: 3000,
            transitionIn: 'slideInRight',
            transitionOut: 'slideOutRight',
            template: null,
            isModal: true,
            modalCssClass: null,
            modalZIndex: 99999,
            modalOpacity: .3,
            model: {}

        },

        /* internal/private object store */
        _data: {
            isOpen: false,
            isAnimating: false
        },

        /*==========================================
         PRIVATE
         *===========================================*/


        /**
         * init
         * @private
         */
        _initElement: function () {
            var self = this;

        },


        /**
         * show the panel
         * @private
         */
        _show: function () {
            var self = this;
            var body = $('body');
            this._data.isAnimating = true;
            this._onEventTrigger('showing', {});
            if (this.options.isModal) {
                var opts = {};
                if (this.options.modalCssClass) {
                    opts.cssClass = this.options.modalCssClass;
                }
                opts.opacity = this.options.modalOpacity;
                opts.zIndex = this.options.modalZIndex;
                this._setModal(body, opts, function () {
                    self._open();
                });

            } else {
                this._open();
            }
        },

        /**
         * opens the panel
         * @private
         */
        _open: function () {
            var self = this;
            var duration = this.options.durationIn;
            var transition = this.options.transitionIn;
            var element = this.element;
            this._transitions(element, {
                preset: transition,
                duration: duration
            }, function () {
                self._data.isOpen = true;
                self._data.isAnimating = false;
                self._onEventTrigger('show', {});
            });
        },

        /**
         * closes the panel
         * @private
         */
        _hide: function () {
            var self = this;
            var element = this.element;
            var duration = this.options.durationOut;
            var transition = this.options.transitionOut;
            this._data.isAnimating = true;
            self._onEventTrigger('hiding', {});
            this._killModal();
            this._transitions(element, {
                preset: transition,
                duration: duration
            }, function () {
                self._data.isOpen = false;
                self._data.isAnimating = false;
                self._onEventTrigger('hide', {});
            });
        },

        /**
         * remove modal
         * @private
         */
        _killModal: function () {
            var self = this;
            if (this.options.isModal) {
                setTimeout(function () {
                    self._removeModal();
                }, 500);
            }
        },

        /**
         * load template
         * @param opts {Object}
         * @param callback {Function}
         * @private
         */
        _loadTemplate: function (opts, callback) {
            var self = this;
            this._render(this.element, opts, function (err, out) {
                if (callback) {
                    callback.call(self, err, out);
                }
            });
        },



        /*==========================================
         PUBLIC METHODS
         *===========================================*/

        /**
         * open the panel
         * @public
         */
        show: function () {
            var isOpen = this._data.isOpen;
            var isAnimating = this._data.isAnimating;
            if (!isOpen && !isAnimating) {
                this._show();
            }

        },

        /**
         * hide the panel
         * @public
         */
        hide: function () {
            var isOpen = this._data.isOpen;
            var isAnimating = this._data.isAnimating;
            if (isOpen && !isAnimating) {
                this._hide();
            }
        },

        /**
         * toggle the panel
         * @public
         */
        toggle: function () {
            var isOpen = this._data.isOpen;
            var isAnimating = this._data.isAnimating;
            if (isAnimating) {
                return;
            }
            if (!isOpen) {
                this._show();
            } else {
                this._hide();
            }
        }

    });
});