Elliptical(function () {
    $.element('elliptical.switch', 'ui-switch', {
        _initElement: function () {
            var self = this;
            setTimeout(function () {
                self._switchEvents();
                self._checked();
            }, 300);
        },

        _switchEvents: function () {
            var self = this;
            var element = this.element;
            var ckbox = element.find('input');
            this._event(ckbox ,'change', function (event) {
                self._triggerChangeEvent(event,ckbox);
            });
        },

        _checked: function () {
            var element = this.element;
            if (this.options.checked !== undefined) {
                if (this.options.checked) {
                    var ckbox = element.find('input');
                    ckbox.prop('checked', true);
                }
            }
            setTimeout(function () {
                element.css({ visibility: 'visible' });
            },100);
           
        },

        _triggerChangeEvent: function (event,ckbox) {
            var data = {};
            data.checked = ckbox.is(':checked');
            this.element.trigger('switch.change', data);
        }
    });
});