
Elliptical(function () {
    //var slidingPanel=$('ui-sliding-panel');

    $.controller('elliptical.screenTab', 'ui-screen-tab', {
        options: {
            delay: 500,
            hideOnClick: true,
            inAnimation: 'fadeInRight',
            outAnimation: 'fadeOut',
            captureEvents:true
        },

        _initController: function () {
            var show = this._show.bind(this);
            var delay = this.options.delay;
            setTimeout(function () {
                show();
            }, delay);
        },

        _events: function () {
            if (this.options.captureEvents) {
                this._event(this.element, 'click', this._onClick.bind(this));
            }
        },

        _onClick: function (event) {
            if (this.options.hideOnClick) {
                this._hide();
            }
            var role = this.element.attr('role');
            this._onEventTrigger('click', {role:role});
            
        },

        _show: function () {
            var preset = this.options.inAnimation;
            this._transitions(this.element, {
                preset: preset
            }, function () {

            })
        },

        _hide: function () {
            var preset = this.options.outAnimation;
            var element = this.element;
            this._transitions(element, {
                preset: preset
            }, function () {
                element.hide();
            })

        },

        show: function () {
            this._show();
        }
    });

});

