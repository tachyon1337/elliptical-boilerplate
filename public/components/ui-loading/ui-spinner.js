Elliptical(function () {
    $.controller("elliptical.spinner", "ui-spinner", {
        options: {
            showOnLoad: true,
            delay:0
        },

        _initController: function () {
            this._data.show = false;
            var attr = this.element.attr('data-upgraded');
            if (this.options.html5Imported === true && attr===undefined) {
                this._import();
            }

        },

        _subscriptions: function () {
            var self = this;
            var channel = this.options.channel || 'loading';
            this._subscribe(channel + '.hide', function () {
                self._data.show = false;
                self._hide();
            });
        },

        _onImport: function () {
            //this._showLabel();
            var self = this;
            if (this.options.showOnLoad) {
                this._data.show = true;
                this._show();
            }

        },

        _show: function () {
            var self = this;
            var delay = this.options.delay;
            setTimeout(function () {
                if (self._data.show) {
                    self.element.removeClass('hide');
                }
            }, delay);
        },

        _hide: function () {
            this.element.addClass('hide');
        },

        _showLabel: function () {
            var label = this.options.label;
            if (label) {
                var labelElement = this.element.find('.loading-label');
                labelElement.show();
            }
        }

    });
});